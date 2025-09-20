"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, FileSearch, Brain, Shield, CheckCircle, Clock, AlertTriangle, Zap, Database, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDocumentProcessing } from "@/hooks/use-document-processing"

const agentIcons: Record<string, React.ReactNode> = {
  ingestion: <FileSearch className="h-4 w-4" />,
  parsing: <Search className="h-4 w-4" />,
  interpretation: <Brain className="h-4 w-4" />,
  verification: <Shield className="h-4 w-4" />,
  guidance: <Zap className="h-4 w-4" />,
  compliance: <Database className="h-4 w-4" />,
}

export function AgentDashboard() {
  const { processingStatus, isProcessing } = useDocumentProcessing()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "running":
        return <div className="h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      default:
        return <Clock className="h-4 w-4 text-slate-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Completed</Badge>
      case "running":
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Running</Badge>
      case "error":
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Error</Badge>
      default:
        return (
          <Badge variant="outline" className="border-slate-600 text-slate-400">
            Pending
          </Badge>
        )
    }
  }

  // Show placeholder when no processing is active
  if (!isProcessing || !processingStatus) {
    return (
      <Card className="h-fit bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Bot className="h-5 w-5 text-blue-400" />
            <span>Agent Workflow</span>
          </CardTitle>
          <CardDescription className="text-slate-400">
            Multi-agent system will process your legal documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-400">
            <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Upload a document to start the AI analysis workflow</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { agents, progress } = processingStatus
  const completedCount = agents.filter((a) => a.status === "completed").length

  return (
    <Card className="h-fit bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Bot className="h-5 w-5 text-blue-400" />
          <span>Agent Workflow</span>
        </CardTitle>
        <CardDescription className="text-slate-400">Multi-agent system processing your legal documents</CardDescription>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-300">
            <span>Overall Progress</span>
            <span>
              {completedCount}/{agents.length} agents
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          {processingStatus.estimatedTimeRemaining && (
            <p className="text-xs text-slate-400">
              Estimated time remaining: {processingStatus.estimatedTimeRemaining}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {agents.map((agent, index) => (
              <div key={agent.id} className="space-y-3">
                <div
                  className={cn(
                    "p-4 rounded-lg border transition-colors",
                    agent.status === "running" && "border-blue-500/50 bg-blue-500/5",
                    agent.status === "completed" && "border-green-500/50 bg-green-500/5",
                    agent.status === "error" && "border-red-500/50 bg-red-500/5",
                    agent.status === "pending" && "border-slate-600/50 bg-slate-700/30",
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div
                        className={cn(
                          "p-2 rounded-full",
                          agent.status === "running" && "bg-blue-500/20 text-blue-400",
                          agent.status === "completed" && "bg-green-500/20 text-green-400",
                          agent.status === "error" && "bg-red-500/20 text-red-400",
                          agent.status === "pending" && "bg-slate-600/20 text-slate-400",
                        )}
                      >
                        {agentIcons[agent.id] || <Bot className="h-4 w-4" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{agent.name}</h4>
                        {agent.startTime && (
                          <p className="text-xs text-slate-400">
                            Started: {new Date(agent.startTime).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(agent.status)}
                      {getStatusBadge(agent.status)}
                    </div>
                  </div>

                  {agent.status === "running" && (
                    <div className="space-y-2">
                      <Progress value={agent.progress} className="h-1" />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>{Math.round(agent.progress)}% complete</span>
                      </div>
                    </div>
                  )}

                  {agent.error && (
                    <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400">
                      Error: {agent.error}
                    </div>
                  )}

                  {agent.logs.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {agent.logs.map((log, logIndex) => (
                        <p key={logIndex} className="text-xs text-slate-400 font-mono bg-slate-900/50 p-2 rounded">
                          {log}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {index < agents.length - 1 && (
                  <div className="flex justify-center">
                    <div
                      className={cn(
                        "w-px h-4 transition-colors",
                        agent.status === "completed" ? "bg-green-400" : "bg-slate-600",
                      )}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
