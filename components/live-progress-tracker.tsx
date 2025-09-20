"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDocumentProcessing } from "@/hooks/use-document-processing"

export function LiveProgressTracker() {
  const { processingStatus, isProcessing, isConnected } = useDocumentProcessing()

  // Show placeholder when no processing is active
  if (!isProcessing || !processingStatus) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Live Processing Status</span>
            </CardTitle>
            <CardDescription>Real-time tracking of document processing pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Upload a document to start real-time processing tracking</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { agents, progress, estimatedTimeRemaining } = processingStatus
  const completedAgents = agents.filter((a) => a.status === "completed").length
  const activeAgent = agents.find((a) => a.status === "running")

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    }
    return `${seconds}s`
  }

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Live Processing Status</span>
            {!isConnected && (
              <Badge variant="outline" className="text-xs">
                Connecting...
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Real-time tracking of document processing pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Agent {completedAgents + (activeAgent ? 1 : 0)} of {agents.length}
              </span>
              <span>{completedAgents} completed</span>
            </div>
            {estimatedTimeRemaining && (
              <div className="text-xs text-muted-foreground text-center">
                Estimated time remaining: {estimatedTimeRemaining}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Processing Stages */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Processing Pipeline</CardTitle>
          <CardDescription>Detailed agent-by-agent progress</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-4">
              {agents.map((agent, index) => (
                <div
                  key={agent.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    agent.status === "running" && "border-accent bg-accent/5 shadow-sm",
                    agent.status === "completed" && "border-green-200 bg-green-50",
                    agent.status === "error" && "border-red-200 bg-red-50",
                    agent.status === "pending" && "border-border opacity-60",
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                          agent.status === "running" && "bg-accent text-accent-foreground",
                          agent.status === "completed" && "bg-green-500 text-white",
                          agent.status === "error" && "bg-red-500 text-white",
                          agent.status === "pending" && "bg-muted text-muted-foreground",
                        )}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{agent.name}</h4>
                        {agent.startTime && (
                          <p className="text-xs text-muted-foreground flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {agent.endTime
                                ? `Completed in ${formatDuration(new Date(agent.endTime).getTime() - new Date(agent.startTime).getTime())}`
                                : `Started ${formatDuration(Date.now() - new Date(agent.startTime).getTime())} ago`}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={
                        agent.status === "completed"
                          ? "secondary"
                          : agent.status === "running"
                            ? "default"
                            : agent.status === "error"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {agent.status}
                    </Badge>
                  </div>

                  {agent.status === "running" && (
                    <div className="space-y-2">
                      <Progress value={agent.progress} className="h-1" />
                      <div className="text-xs text-muted-foreground">{Math.round(agent.progress)}% complete</div>
                    </div>
                  )}

                  {agent.error && (
                    <div className="mt-3 p-2 bg-red-100 rounded text-xs text-red-700">Error: {agent.error}</div>
                  )}

                  {agent.logs.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <h5 className="text-xs font-medium text-muted-foreground">Recent Activity:</h5>
                      {agent.logs.slice(-3).map((log, logIndex) => (
                        <p key={logIndex} className="text-xs text-muted-foreground font-mono bg-muted/50 p-1 rounded">
                          {log}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
