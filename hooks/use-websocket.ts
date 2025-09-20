"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { type WebSocketManager, getWebSocketManager, type AgentStatusUpdate } from "@/lib/websocket"

export interface UseWebSocketReturn {
  isConnected: boolean
  agentStatuses: Map<string, AgentStatusUpdate>
  logs: string[]
  isProcessing: boolean
  startProcessing: (documentId: string) => void
  sessionId: string
}

export function useWebSocket(): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [agentStatuses, setAgentStatuses] = useState<Map<string, AgentStatusUpdate>>(new Map())
  const [logs, setLogs] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const wsManager = useRef<WebSocketManager | null>(null)

  const handleAgentStatus = useCallback((data: AgentStatusUpdate) => {
    console.log("[v0] WebSocket agent status update:", data)

    setAgentStatuses((prev) => {
      const newMap = new Map(prev)
      newMap.set(data.agentId, data)
      return newMap
    })

    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${data.message}`])

    setIsProcessing((prevIsProcessing) => {
      if (data.status === "running" && !prevIsProcessing) {
        console.log("[v0] Setting processing to true")
        return true
      }
      return prevIsProcessing
    })
  }, [])

  const handleProcessingComplete = useCallback((data: any) => {
    console.log("[v0] WebSocket processing complete:", data)
    setIsProcessing(false)
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Processing completed successfully`])
  }, [])

  const handleError = useCallback((data: any) => {
    console.error("[v0] WebSocket error:", data)
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Error: ${data.message}`])
  }, [])

  useEffect(() => {
    console.log("[v0] WebSocket useEffect running")

    // Initialize WebSocket manager
    wsManager.current = getWebSocketManager()

    // Register event listeners
    wsManager.current.on("agent_status", handleAgentStatus)
    wsManager.current.on("processing_complete", handleProcessingComplete)
    wsManager.current.on("error", handleError)

    // Connect to WebSocket
    wsManager.current
      .connect()
      .then(() => {
        console.log("[v0] WebSocket connected successfully")
        setIsConnected(true)
      })
      .catch((error) => {
        console.error("[v0] WebSocket connection failed:", error)
        setIsConnected(false)
      })

    // Cleanup on unmount
    return () => {
      console.log("[v0] WebSocket cleanup running")
      if (wsManager.current) {
        wsManager.current.off("agent_status", handleAgentStatus)
        wsManager.current.off("processing_complete", handleProcessingComplete)
        wsManager.current.off("error", handleError)
        wsManager.current.disconnect()
      }
    }
  }, [handleAgentStatus, handleProcessingComplete, handleError]) // Added memoized handlers to dependencies

  const startProcessing = useCallback(
    (documentId: string) => {
      console.log("[v0] Starting processing for document:", documentId)
      if (wsManager.current && isConnected) {
        setIsProcessing(true)
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Starting document processing...`])
        wsManager.current.startProcessing(documentId)
      } else {
        console.warn("[v0] Cannot start processing - not connected")
      }
    },
    [isConnected],
  ) // Added isConnected to dependencies

  return {
    isConnected,
    agentStatuses,
    logs,
    isProcessing,
    startProcessing,
    sessionId: wsManager.current?.getSessionId() || "",
  }
}
