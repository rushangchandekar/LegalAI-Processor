"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Wifi, WifiOff, Activity, Clock } from "lucide-react"
import { useWebSocket } from "@/hooks/use-websocket"

export function WebSocketStatus() {
  const { isConnected, logs, sessionId, agentStatuses } = useWebSocket()

  const activeAgents = Array.from(agentStatuses.values()).filter((agent) => agent.status === "running")
  const completedAgents = Array.from(agentStatuses.values()).filter((agent) => agent.status === "completed")

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-purple-400" />
            <span>Real-time Status</span>
          </div>
          <Badge
            className={
              isConnected
                ? "bg-green-500/10 text-green-400 border-green-500/20 flex items-center space-x-1"
                : "bg-red-500/10 text-red-400 border-red-500/20 flex items-center space-x-1"
            }
          >
            {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            <span>{isConnected ? "Connected" : "Disconnected"}</span>
          </Badge>
        </CardTitle>
        <CardDescription className="text-slate-400">
          Live updates from the multi-agent processing system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Info */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Session ID:</span>
          <code className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded">{sessionId.slice(-8)}</code>
        </div>

        {/* Agent Summary */}
        {agentStatuses.size > 0 && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-slate-700/30 rounded">
              <div className="text-lg font-bold text-blue-400">{activeAgents.length}</div>
              <div className="text-xs text-slate-400">Active</div>
            </div>
            <div className="p-2 bg-slate-700/30 rounded">
              <div className="text-lg font-bold text-green-400">{completedAgents.length}</div>
              <div className="text-xs text-slate-400">Completed</div>
            </div>
            <div className="p-2 bg-slate-700/30 rounded">
              <div className="text-lg font-bold text-white">{agentStatuses.size}</div>
              <div className="text-xs text-slate-400">Total</div>
            </div>
          </div>
        )}

        {/* Live Logs */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-white">Live Activity Log</span>
          </div>
          <ScrollArea className="h-32 w-full border border-slate-600/50 rounded-md p-2 bg-slate-900/50">
            <div className="space-y-1">
              {logs.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Waiting for activity...</p>
              ) : (
                logs.slice(-10).map((log, index) => (
                  <div key={index} className="text-xs font-mono text-slate-300">
                    {log}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Active Agents Detail */}
        {activeAgents.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 text-white">Currently Processing</h4>
            <div className="space-y-2">
              {activeAgents.map((agent) => (
                <div
                  key={agent.agentId}
                  className="flex items-center justify-between p-2 bg-blue-500/5 rounded border-l-2 border-blue-400"
                >
                  <div>
                    <div className="text-sm font-medium capitalize text-white">{agent.agentId} Agent</div>
                    <div className="text-xs text-slate-400">{agent.message}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-blue-400">{Math.round(agent.progress)}%</div>
                    {agent.estimatedTimeRemaining && (
                      <div className="text-xs text-slate-400">~{agent.estimatedTimeRemaining}s</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
