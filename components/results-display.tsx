"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { FileText, AlertTriangle, CheckCircle, Info, Download, Share, BookOpen, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDocumentProcessing } from "@/hooks/use-document-processing"

export function ResultsDisplay() {
  const { finalResults, completedFiles, isProcessing } = useDocumentProcessing()

  // Show loading state while processing
  if (isProcessing && !finalResults) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <div>
            <h3 className="font-medium">Processing Document</h3>
            <p className="text-sm text-muted-foreground">AI agents are analyzing your legal document...</p>
          </div>
        </div>
      </Card>
    )
  }

  // Show placeholder when no results available
  if (!finalResults || completedFiles.length === 0) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <div className="text-center space-y-4 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto opacity-50" />
          <div>
            <h3 className="font-medium">No Results Yet</h3>
            <p className="text-sm">Upload and process a document to see AI analysis results</p>
          </div>
        </div>
      </Card>
    )
  }

  const { results, metadata, originalDocument } = finalResults

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "risk":
        return <AlertTriangle className="h-4 w-4" />
      case "opportunity":
        return <CheckCircle className="h-4 w-4" />
      case "requirement":
        return <Info className="h-4 w-4" />
      case "deadline":
        return <Clock className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "risk":
        return "text-red-500 bg-red-50 border-red-200"
      case "opportunity":
        return "text-green-500 bg-green-50 border-green-200"
      case "requirement":
        return "text-blue-500 bg-blue-50 border-blue-200"
      case "deadline":
        return "text-orange-500 bg-orange-50 border-orange-200"
      default:
        return "text-gray-500 bg-gray-50 border-gray-200"
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Low
          </Badge>
        )
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "action":
        return <CheckCircle className="h-4 w-4" />
      case "caution":
        return <AlertTriangle className="h-4 w-4" />
      case "information":
        return <Info className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const handleExport = async () => {
    try {
      // Call backend API to generate export
      const response = await fetch(`/api/documents/${finalResults.documentId}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: "pdf" }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${originalDocument.name}_analysis.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("[v0] Export failed:", error)
    }
  }

  const handleShare = async () => {
    try {
      // Call backend API to generate shareable link
      const response = await fetch(`/api/documents/${finalResults.documentId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        const { shareUrl } = await response.json()
        await navigator.clipboard.writeText(shareUrl)
        // You could add a toast notification here
        console.log("[v0] Share link copied to clipboard")
      }
    } catch (error) {
      console.error("[v0] Share failed:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Analysis Results</span>
            </CardTitle>
            <CardDescription>AI-powered legal document analysis and simplified guidance</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="insights">Key Insights</TabsTrigger>
            <TabsTrigger value="simplified">Simplified</TabsTrigger>
            <TabsTrigger value="recommendations">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Document Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Document Name</span>
                      <span className="text-sm font-medium truncate max-w-32">{originalDocument.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">File Type</span>
                      <Badge variant="outline">{originalDocument.type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">File Size</span>
                      <span className="text-sm font-medium">{(originalDocument.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Processing Time</span>
                      <span className="text-sm font-medium">{Math.round(metadata.processingTime / 1000)}s</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Analysis Confidence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent">{Math.round(metadata.confidence)}%</div>
                      <p className="text-sm text-muted-foreground">Overall Confidence</p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        Processed by {metadata.agentsUsed.length} AI agents
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Completed: {new Date(metadata.completedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Document Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Document Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{results.summary}</p>
              </CardContent>
            </Card>

            {/* Risk Assessment Overview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Overall Risk Level</span>
                  {getSeverityBadge(results.riskAssessment.overallRisk)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.riskAssessment.riskFactors.map((factor, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{factor.factor}</span>
                        {getSeverityBadge(factor.level)}
                      </div>
                      <p className="text-xs text-muted-foreground">{factor.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {results.keyPoints.map((point, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Info className="h-4 w-4" />
                          <h4 className="font-medium">Key Point {index + 1}</h4>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{point}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="simplified" className="space-y-4">
            <ScrollArea className="h-96">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Simplified Explanation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm leading-relaxed">{results.simplifiedExplanation}</p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-3">Legal Concepts Explained:</h4>
                    <div className="space-y-3">
                      {results.legalConcepts.map((concept, index) => (
                        <div key={index} className="bg-muted/50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{concept.term}</span>
                            {getSeverityBadge(concept.importance)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{concept.definition}</p>
                          {concept.relatedSections.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Related sections: {concept.relatedSections.join(", ")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {results.recommendations.map((rec, index) => (
                  <Card
                    key={index}
                    className={cn(
                      "border-l-4",
                      rec.priority === "high" && "border-l-red-500",
                      rec.priority === "medium" && "border-l-yellow-500",
                      rec.priority === "low" && "border-l-green-500",
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getRecommendationIcon(rec.type)}
                          <h4 className="font-medium">{rec.title}</h4>
                        </div>
                        <div className="flex items-center space-x-2">{getSeverityBadge(rec.priority)}</div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                      <Button size="sm" variant="outline">
                        Mark as Done
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
