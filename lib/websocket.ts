"use client"

export interface WebSocketMessage {
  type: "agent_status" | "progress_update" | "log_entry" | "processing_complete" | "error"
  payload: any
  timestamp: string
  sessionId: string
}

export interface AgentStatusUpdate {
  agentId: string
  status: "pending" | "running" | "completed" | "error"
  progress: number
  message: string
  estimatedTimeRemaining?: number
}

export interface ProcessingSession {
  sessionId: string
  documentId: string
  status: "initializing" | "processing" | "completed" | "error"
  startTime: string
  agents: AgentStatusUpdate[]
}

export class WebSocketManager {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private sessionId: string
  private listeners: Map<string, Set<(data: any) => void>> = new Map()

  constructor(sessionId?: string) {
    this.sessionId = sessionId || this.generateSessionId()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // In a real implementation, this would connect to your backend WebSocket server
        // For demo purposes, we'll simulate the connection
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws"

        console.log(`[WebSocket] Connecting to ${wsUrl} with session ${this.sessionId}`)

        // Simulate WebSocket connection for demo
        this.simulateConnection()
        resolve()
      } catch (error) {
        console.error("[WebSocket] Connection failed:", error)
        reject(error)
      }
    })
  }

  private simulateConnection() {
    // Simulate WebSocket connection and message handling
    console.log("[WebSocket] Connected successfully")

    // Simulate receiving messages from the backend
    this.simulateBackendMessages()
  }

  private simulateBackendMessages() {
    // Simulate agent status updates
    const agents = ["ingestion", "parsing", "interpretation", "verification", "guidance", "compliance"]

    let currentAgentIndex = 0
    let progress = 0

    const sendUpdate = () => {
      if (currentAgentIndex >= agents.length) return

      const agentId = agents[currentAgentIndex]
      progress += Math.random() * 20

      if (progress >= 100) {
        // Complete current agent
        this.emit("agent_status", {
          agentId,
          status: "completed",
          progress: 100,
          message: `${agentId} agent completed successfully`,
          timestamp: new Date().toISOString(),
        })

        // Move to next agent
        currentAgentIndex++
        progress = 0

        if (currentAgentIndex < agents.length) {
          setTimeout(() => {
            this.emit("agent_status", {
              agentId: agents[currentAgentIndex],
              status: "running",
              progress: 0,
              message: `Starting ${agents[currentAgentIndex]} agent`,
              timestamp: new Date().toISOString(),
            })
          }, 1000)
        } else {
          // All agents completed
          setTimeout(() => {
            this.emit("processing_complete", {
              sessionId: this.sessionId,
              completedAt: new Date().toISOString(),
              results: {
                summary: "Document analysis completed successfully",
                insights: 4,
                recommendations: 3,
              },
            })
          }, 2000)
        }
      } else {
        // Update current agent progress
        this.emit("agent_status", {
          agentId,
          status: "running",
          progress: Math.min(progress, 100),
          message: `Processing with ${agentId} agent...`,
          estimatedTimeRemaining: Math.max(30 - (progress / 100) * 30, 5),
          timestamp: new Date().toISOString(),
        })
      }
    }

    // Start first agent after a delay
    setTimeout(() => {
      this.emit("agent_status", {
        agentId: agents[0],
        status: "running",
        progress: 0,
        message: "Starting document ingestion",
        timestamp: new Date().toISOString(),
      })

      // Continue sending updates
      const interval = setInterval(() => {
        if (currentAgentIndex >= agents.length) {
          clearInterval(interval)
          return
        }
        sendUpdate()
      }, 2000)
    }, 3000)
  }

  on(eventType: string, callback: (data: any) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }
    this.listeners.get(eventType)!.add(callback)
  }

  off(eventType: string, callback: (data: any) => void) {
    const listeners = this.listeners.get(eventType)
    if (listeners) {
      listeners.delete(callback)
    }
  }

  private emit(eventType: string, data: any) {
    const listeners = this.listeners.get(eventType)
    if (listeners) {
      listeners.forEach((callback) => callback(data))
    }
  }

  send(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn("[WebSocket] Cannot send message - connection not open")
    }
  }

  startProcessing(documentId: string) {
    console.log(`[WebSocket] Starting processing for document ${documentId}`)

    // In a real implementation, this would send a message to start processing
    this.send({
      type: "agent_status",
      payload: {
        action: "start_processing",
        documentId,
        sessionId: this.sessionId,
      },
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
    })
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.listeners.clear()
    console.log("[WebSocket] Disconnected")
  }

  getSessionId(): string {
    return this.sessionId
  }
}

// Singleton instance for the app
let wsManager: WebSocketManager | null = null

export function getWebSocketManager(): WebSocketManager {
  if (!wsManager) {
    wsManager = new WebSocketManager()
  }
  return wsManager
}
