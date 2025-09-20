"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDocumentProcessing } from "@/hooks/use-document-processing"

export function DocumentUpload() {
  const { files, uploadedFiles, isProcessing, isConnected, uploadDocument, startProcessing, removeFile } =
    useDocumentProcessing()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Upload each file to backend
      for (const file of acceptedFiles) {
        try {
          await uploadDocument(file)
        } catch (error) {
          console.error("[v0] Upload failed for file:", file.name, error)
        }
      }
    },
    [uploadDocument],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    multiple: true,
  })

  const handleStartProcessing = async () => {
    if (uploadedFiles.length > 0 && uploadedFiles[0].documentId) {
      try {
        await startProcessing(uploadedFiles[0].documentId)
      } catch (error) {
        console.error("[v0] Processing failed:", error)
      }
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
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "processing":
        return <div className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <div className="h-4 w-4 border-2 border-muted border-t-accent rounded-full animate-spin" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "uploaded":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Ready
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="default" className="bg-accent/10 text-accent">
            Processing
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">Uploading</Badge>
    }
  }

  const canProcess = uploadedFiles.length > 0 && !isProcessing

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Document Upload</span>
        </CardTitle>
        <CardDescription>Upload legal documents for AI-powered analysis and simplification</CardDescription>
        {!isConnected && files.some((f) => f.status === "processing") && (
          <div className="flex items-center space-x-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
            <AlertCircle className="h-4 w-4" />
            <span>Connecting to processing system...</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Zone */}
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive ? "border-accent bg-accent/5" : "border-border hover:border-accent/50 hover:bg-accent/5",
          )}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <Upload className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-lg font-medium">{isDragActive ? "Drop files here" : "Drag & drop files here"}</p>
              <p className="text-sm text-muted-foreground">or click to browse • PDF, DOC, DOCX, TXT</p>
            </div>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Uploaded Files</h4>
            <div className="space-y-2">
              {files.map((file) => (
                <div key={file.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(file.status)}
                        {getStatusBadge(file.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="h-6 w-6 p-0"
                          disabled={file.status === "processing"}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      {file.status === "uploading" && <Progress value={file.progress} className="w-20 h-1" />}
                    </div>
                    {file.error && <p className="text-xs text-destructive mt-1">{file.error}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Process Button */}
        {uploadedFiles.length > 0 && (
          <Button onClick={handleStartProcessing} disabled={!canProcess} className="w-full" size="lg">
            {isProcessing ? (
              <>
                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                Processing Documents...
              </>
            ) : (
              <>
                Start AI Analysis
                <span className="ml-2 text-xs bg-primary-foreground/20 px-2 py-1 rounded">
                  {uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""}
                </span>
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
