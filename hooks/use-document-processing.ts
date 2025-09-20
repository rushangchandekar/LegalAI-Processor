"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { apiClient, type ProcessingStatus, type ProcessedDocument } from "@/lib/api-client"

export interface UploadedFile {
  id: string
  name: string
  size: number
  status: "uploading" | "uploaded" | "processing" | "completed" | "error"
  progress: number
  documentId?: string
  processId?: string
  error?: string
}

export function useDocumentProcessing() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null)
  const [finalResults, setFinalResults] = useState<ProcessedDocument | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  // Upload document to backend
  const uploadDocument = useCallback(async (file: File): Promise<string> => {
    const fileId = Math.random().toString(36).substr(2, 9)

    // Add file to state with uploading status
    setFiles((prev) => [
      ...prev,
      {
        id: fileId,
        name: file.name,
        size: file.size,
        status: "uploading",
        progress: 0,
      },
    ])

    try {
      // Upload to backend (Google Cloud Storage)
      const { documentId } = await apiClient.uploadDocument(file)

      // Update file status to uploaded
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, status: "uploaded", progress: 100, documentId } : f)),
      )

      return documentId
    } catch (error) {
      // Update file status to error
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: "error", error: error instanceof Error ? error.message : "Upload failed" }
            : f,
        ),
      )
      throw error
    }
  }, [])

  // Start processing workflow
  const startProcessing = useCallback(async (documentId: string) => {
    try {
      // Start backend processing
      const { processId } = await apiClient.startProcessing(documentId)

      // Update file status to processing
      setFiles((prev) => prev.map((f) => (f.documentId === documentId ? { ...f, status: "processing", processId } : f)))

      // Establish WebSocket connection for real-time updates
      const ws = apiClient.createWebSocketConnection(processId)
      wsRef.current = ws

      ws.onopen = () => {
        setIsConnected(true)
        console.log("[v0] WebSocket connected for process:", processId)
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        console.log("[v0] WebSocket message received:", data)

        if (data.type === "processing_status") {
          setProcessingStatus(data.status)
        } else if (data.type === "processing_complete") {
          setFinalResults(data.results)
          setFiles((prev) =>
            prev.map((f) => (f.processId === processId ? { ...f, status: "completed", progress: 100 } : f)),
          )
        } else if (data.type === "processing_error") {
          setFiles((prev) =>
            prev.map((f) => (f.processId === processId ? { ...f, status: "error", error: data.error } : f)),
          )
        }
      }

      ws.onclose = () => {
        setIsConnected(false)
        console.log("[v0] WebSocket disconnected")
      }

      ws.onerror = (error) => {
        console.error("[v0] WebSocket error:", error)
        setIsConnected(false)
      }
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.documentId === documentId
            ? { ...f, status: "error", error: error instanceof Error ? error.message : "Processing failed" }
            : f,
        ),
      )
      throw error
    }
  }, [])

  // Remove file
  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }, [])

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const uploadedFiles = files.filter((f) => f.status === "uploaded")
  const processingFiles = files.filter((f) => f.status === "processing")
  const completedFiles = files.filter((f) => f.status === "completed")
  const isProcessing = processingFiles.length > 0

  return {
    files,
    uploadedFiles,
    processingFiles,
    completedFiles,
    isProcessing,
    processingStatus,
    finalResults,
    isConnected,
    uploadDocument,
    startProcessing,
    removeFile,
  }
}
