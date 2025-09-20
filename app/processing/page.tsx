"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AgentDashboard } from "@/components/agent-dashboard"
import { LiveProgressTracker } from "@/components/live-progress-tracker"
import { ResultsDisplay } from "@/components/results-display"
import { WebSocketStatus } from "@/components/websocket-status"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProcessingPage() {
  const searchParams = useSearchParams()
  const [documentIds, setDocumentIds] = useState<string[]>([])
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    const docs = searchParams.get("documents")

    if (docs) {
      const docArray = docs.split(",")
      setDocumentIds(docArray)
    }
    setIsAnimated(true)
  }, [searchParams.get("documents")])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div
            className={`transition-all duration-1000 ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="flex items-center justify-between mb-6">
              <Link href="/">
                <Button variant="ghost" className="text-slate-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Upload
                </Button>
              </Link>
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                Processing {documentIds.length} document{documentIds.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            <div className="text-center space-y-4 mb-8">
              <h1 className="text-4xl font-bold text-white text-balance">AI Processing Dashboard</h1>
              <p className="text-xl text-slate-300 text-pretty max-w-3xl mx-auto">
                Watch as our multi-agent AI system processes your legal documents with real-time transparency
              </p>
            </div>

            {/* Document Info */}
            {documentIds.length > 0 && (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <FileText className="h-5 w-5" />
                    <span>Processing Documents</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {documentIds.map((docId, index) => (
                      <Badge key={docId} variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600">
                        Document {index + 1}: {docId}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Processing Dashboard */}
          {documentIds.length > 0 ? (
            <div
              className={`grid lg:grid-cols-3 gap-8 transition-all duration-1000 delay-300 ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <div className="lg:col-span-1 space-y-6">
                <AgentDashboard />
                <WebSocketStatus />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <LiveProgressTracker />
                <ResultsDisplay />
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No documents found. Please upload documents first.</p>
              <Link href="/">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Go to Upload</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
