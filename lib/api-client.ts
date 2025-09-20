export class LegalDocumentAPI {
  private baseUrl: string
  private wsUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    this.wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws"
  }

  // Document upload to Google Cloud Storage
  async uploadDocument(file: File): Promise<{ documentId: string; uploadUrl: string }> {
    const formData = new FormData()
    formData.append("document", file)

    const response = await fetch(`${this.baseUrl}/api/documents/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    return response.json()
  }

  // Start the multi-agent processing workflow
  async startProcessing(documentId: string): Promise<{ processId: string }> {
    const response = await fetch(`${this.baseUrl}/api/documents/${documentId}/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Processing failed: ${response.statusText}`)
    }

    return response.json()
  }

  // Get processing status
  async getProcessingStatus(processId: string): Promise<ProcessingStatus> {
    const response = await fetch(`${this.baseUrl}/api/process/${processId}/status`)

    if (!response.ok) {
      throw new Error(`Status check failed: ${response.statusText}`)
    }

    return response.json()
  }

  // Get agent-specific results
  async getAgentResults(processId: string, agentId: string): Promise<AgentResult> {
    const response = await fetch(`${this.baseUrl}/api/process/${processId}/agents/${agentId}/results`)

    if (!response.ok) {
      throw new Error(`Agent results failed: ${response.statusText}`)
    }

    return response.json()
  }

  // Get final processed results
  async getFinalResults(processId: string): Promise<ProcessedDocument> {
    const response = await fetch(`${this.baseUrl}/api/process/${processId}/results`)

    if (!response.ok) {
      throw new Error(`Final results failed: ${response.statusText}`)
    }

    return response.json()
  }

  // WebSocket connection for real-time updates
  createWebSocketConnection(processId: string): WebSocket {
    return new WebSocket(`${this.wsUrl}/${processId}`)
  }
}

export interface ProcessingStatus {
  processId: string
  status: "pending" | "running" | "completed" | "error"
  currentAgent?: string
  agents: AgentStatus[]
  progress: number
  estimatedTimeRemaining?: string
}

export interface AgentStatus {
  id: string
  name: string
  status: "pending" | "running" | "completed" | "error"
  progress: number
  logs: string[]
  startTime?: string
  endTime?: string
  error?: string
}

export interface AgentResult {
  agentId: string
  status: "completed" | "error"
  data: any
  metadata: {
    processingTime: number
    confidence?: number
    warnings?: string[]
  }
}

export interface ProcessedDocument {
  documentId: string
  processId: string
  originalDocument: {
    name: string
    size: number
    type: string
  }
  results: {
    summary: string
    keyPoints: string[]
    legalConcepts: LegalConcept[]
    recommendations: Recommendation[]
    riskAssessment: RiskAssessment
    simplifiedExplanation: string
  }
  metadata: {
    processingTime: number
    agentsUsed: string[]
    confidence: number
    completedAt: string
  }
}

export interface LegalConcept {
  term: string
  definition: string
  importance: "high" | "medium" | "low"
  relatedSections: string[]
}

export interface Recommendation {
  type: "action" | "caution" | "information"
  title: string
  description: string
  priority: "high" | "medium" | "low"
}

export interface RiskAssessment {
  overallRisk: "low" | "medium" | "high"
  riskFactors: Array<{
    factor: string
    level: "low" | "medium" | "high"
    description: string
  }>
}

export const apiClient = new LegalDocumentAPI()
