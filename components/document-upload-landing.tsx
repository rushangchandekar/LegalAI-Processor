"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, CheckCircle, AlertCircle, X, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  name: string
  size: number
  status: "uploading" | "uploaded" | "error"
  progress: number
  error?: string
  documentId?: string
}

export function DocumentUploadLanding() {
  const router = useRouter()
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true)

    for (const file of acceptedFiles) {
      const fileId = Math.random().toString(36).substring(7)
      const uploadFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        status: "uploading",
        progress: 0,
      }

      setFiles((prev) => [...prev, uploadFile])

      try {
        const formData = new FormData()
        formData.append("document", file)

        // Simulate progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100))
          setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))
        }

        // TODO: Replace with actual API call
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        //   method: 'POST',
        //   body: formData
        // })
        // const result = await response.json()

        // Mock successful upload
        const mockDocumentId = `doc_${fileId}`
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  status: "uploaded",
                  progress: 100,
                  documentId: mockDocumentId,
                }
              : f,
          ),
        )
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  status: "error",
                  error: "Upload failed. Please try again.",
                }
              : f,
          ),
        )
      }
    }

    setIsUploading(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
      "text/rtf": [".rtf"],
      "application/vnd.oasis.opendocument.text": [".odt"],
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const handleStartProcessing = () => {
    const uploadedFiles = files.filter((f) => f.status === "uploaded")
    if (uploadedFiles.length > 0) {
      const documentIds = uploadedFiles.map((f) => f.documentId).join(",")
      router.push(`/processing?documents=${documentIds}`)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploaded":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return <div className="h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "uploaded":
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Ready</Badge>
      case "error":
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Error</Badge>
      default:
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Uploading</Badge>
    }
  }

  const uploadedFiles = files.filter((f) => f.status === "uploaded")
  const canProcess = uploadedFiles.length > 0 && !isUploading

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-2xl">
      <CardContent className="p-8 space-y-6">
        {/* Upload Zone */}
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300",
            isDragActive
              ? "border-blue-400 bg-blue-500/10 scale-105"
              : "border-slate-600 hover:border-blue-500/50 hover:bg-blue-500/5",
          )}
        >
          <input {...getInputProps()} />
          <div className="space-y-6">
            <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Upload
                className={cn("h-8 w-8 text-blue-400 transition-transform duration-300", isDragActive && "scale-110")}
              />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white mb-2">
                {isDragActive ? "Drop your documents here" : "Upload Legal Documents"}
              </p>
              <p className="text-slate-400">Drag & drop files here or click to browse</p>
              <p className="text-sm text-slate-500 mt-2">Supports PDF, DOC, DOCX, TXT, RTF, ODT • Max 50MB per file</p>
            </div>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">Uploaded Documents</h4>
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50"
                >
                  <FileText className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-medium truncate">{file.name}</p>
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(file.status)}
                        {getStatusBadge(file.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-600"
                          disabled={file.status === "uploading"}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-400">{formatFileSize(file.size)}</p>
                      {file.status === "uploading" && <Progress value={file.progress} className="w-32 h-2" />}
                    </div>
                    {file.error && <p className="text-sm text-red-400 mt-1">{file.error}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Process Button */}
        {files.length > 0 && (
          <div className="pt-4">
            <Button
              onClick={handleStartProcessing}
              disabled={!canProcess}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              size="lg"
            >
              {isUploading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                  Uploading Documents...
                </>
              ) : (
                <>
                  Start AI Processing
                  <ArrowRight className="ml-3 h-5 w-5" />
                  <span className="ml-3 text-sm bg-white/20 px-3 py-1 rounded-full">
                    {uploadedFiles.length} document{uploadedFiles.length !== 1 ? "s" : ""}
                  </span>
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
