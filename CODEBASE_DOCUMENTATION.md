# LegalAI-Processor: Complete Codebase Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Core Components](#core-components)
6. [Data Flow](#data-flow)
7. [Multi-Agent System](#multi-agent-system)
8. [API Architecture](#api-architecture)
9. [State Management](#state-management)
10. [UI/UX Design](#uiux-design)
11. [Setup and Development](#setup-and-development)
12. [Deployment](#deployment)

---

## Project Overview

LegalAI-Processor is a Next.js-based frontend application for an AI-powered legal document processing system. It provides a user-friendly interface for uploading legal documents and watching them being processed by a multi-agent AI system that simplifies complex legal language into accessible guidance.

### Key Features
- **Document Upload**: Drag-and-drop interface for legal document uploads
- **Real-time Processing**: Live dashboard showing multi-agent AI processing
- **Legal Analysis**: Automated extraction of key legal concepts and terms
- **Risk Assessment**: AI-powered risk analysis of legal documents
- **Simplified Explanations**: Translation of complex legal language into plain English
- **Recommendations**: Actionable guidance based on document analysis

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                      │
├─────────────────────────────────────────────────────────────────┤
│  Landing Page → Document Upload → Processing Dashboard → Results │
│      ↓              ↓                    ↓              ↓      │
│  Components     File Handling      WebSocket        Display     │
│   & Layout      & Validation       Real-time        Results    │
│                                    Updates                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     API Layer (Simulated)                      │
├─────────────────────────────────────────────────────────────────┤
│  Document Upload → Processing Orchestration → Results Storage   │
│       ↓                        ↓                       ↓       │
│  Google Cloud            Multi-Agent System         Database    │
│   Storage               (6 Specialized Agents)                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Framework
- **Next.js 15**: React framework with App Router
- **React 18**: UI library with hooks and components
- **TypeScript**: Type-safe development

### Styling & UI
- **Tailwind CSS v4**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Custom animations**: CSS animations for enhanced UX

### State Management & Data
- **React Hooks**: Custom hooks for state management
- **WebSocket**: Real-time communication
- **React Dropzone**: File upload handling

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Geist Fonts**: Typography (Google Fonts)

---

## Project Structure

```
LegalAI-Processor/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles and theme
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Landing page with upload
│   └── processing/              # Processing dashboard
│       ├── page.tsx            # Processing page component
│       └── loading.tsx         # Loading UI
│
├── components/                   # React components
│   ├── ui/                      # Reusable UI primitives
│   │   ├── card.tsx            # Card component
│   │   ├── button.tsx          # Button variants
│   │   ├── progress.tsx        # Progress bars
│   │   └── [other-ui-components]
│   │
│   ├── agent-dashboard.tsx      # Multi-agent status display
│   ├── document-upload-landing.tsx  # File upload interface
│   ├── header.tsx               # Application header
│   ├── live-progress-tracker.tsx   # Real-time progress
│   ├── results-display.tsx      # Analysis results
│   └── websocket-status.tsx     # Connection status
│
├── hooks/                        # Custom React hooks
│   ├── use-document-processing.ts  # Document processing state
│   ├── use-websocket.ts         # WebSocket management
│   ├── use-mobile.ts            # Mobile detection
│   └── use-toast.ts             # Toast notifications
│
├── lib/                          # Utility libraries
│   ├── api-client.ts            # API communication layer
│   ├── websocket.ts             # WebSocket management
│   └── utils.ts                 # Utility functions
│
├── public/                       # Static assets
├── styles/                       # Additional CSS files
├── package.json                  # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── next.config.mjs              # Next.js configuration
└── tailwind.config.js           # Tailwind CSS configuration
```

---

## Core Components

### 1. Landing Page (`app/page.tsx`)
**Purpose**: Main entry point with hero section and document upload

**Key Features**:
- Animated hero section with gradient backgrounds
- Feature showcase (Multi-Agent AI, Enterprise Security, Real-time Processing)
- Process steps visualization
- Integration with document upload component

**Code Highlights**:
```tsx
export default function LandingPage() {
  const [isAnimated, setIsAnimated] = useState(false)
  
  useEffect(() => {
    setIsAnimated(true) // Trigger entrance animations
  }, [])

  const features = [
    {
      icon: Brain,
      title: "Multi-Agent AI Processing",
      description: "Advanced AI agents work together to analyze and simplify complex legal documents"
    },
    // ... other features
  ]
}
```

### 2. Document Upload (`components/document-upload-landing.tsx`)
**Purpose**: Handles file upload with drag-and-drop interface

**Key Features**:
- Drag-and-drop file upload
- File validation and progress tracking
- Upload status management
- Navigation to processing page

**Code Highlights**:
```tsx
export function DocumentUploadLanding() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Handle file upload with progress tracking
    setIsUploading(true)
    // ... upload logic
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  })
}
```

### 3. Processing Dashboard (`app/processing/page.tsx`)
**Purpose**: Real-time processing monitoring and results display

**Key Features**:
- Document processing status
- Multi-agent workflow visualization
- WebSocket connection status
- Results display integration

**Layout Structure**:
```tsx
export default function ProcessingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <AgentDashboard />        {/* Left column */}
            <WebSocketStatus />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <LiveProgressTracker />   {/* Right column */}
            <ResultsDisplay />
          </div>
        </div>
      </main>
    </div>
  )
}
```

### 4. Agent Dashboard (`components/agent-dashboard.tsx`)
**Purpose**: Displays the multi-agent workflow with real-time status

**Agent Types**:
- **Ingestion**: Document upload and OCR processing
- **Parsing**: Text extraction and structuring
- **Interpretation**: Legal concept identification
- **Verification**: Compliance checking
- **Guidance**: User-friendly explanations
- **Compliance**: Risk assessment

**Code Structure**:
```tsx
export function AgentDashboard() {
  const { processingStatus, isProcessing } = useDocumentProcessing()
  
  const agentIcons: Record<string, React.ReactNode> = {
    ingestion: <FileSearch className="h-4 w-4" />,
    parsing: <Search className="h-4 w-4" />,
    interpretation: <Brain className="h-4 w-4" />,
    verification: <Shield className="h-4 w-4" />,
    guidance: <Zap className="h-4 w-4" />,
    compliance: <Database className="h-4 w-4" />
  }

  // Renders agent status with progress bars and logs
}
```

### 5. Results Display (`components/results-display.tsx`)
**Purpose**: Shows comprehensive analysis results

**Features**:
- Document summary and overview
- Key insights and legal concepts
- Simplified explanations
- Risk assessment visualization
- Actionable recommendations

**Tab Structure**:
```tsx
<Tabs defaultValue="summary">
  <TabsList>
    <TabsTrigger value="summary">Summary</TabsTrigger>
    <TabsTrigger value="insights">Key Insights</TabsTrigger>
    <TabsTrigger value="simplified">Simplified</TabsTrigger>
    <TabsTrigger value="recommendations">Actions</TabsTrigger>
  </TabsList>
  {/* Tab content for each section */}
</Tabs>
```

---

## Data Flow

### 1. Document Upload Flow
```
User selects file → File validation → Upload progress → File stored → 
Document ID generated → Redirect to processing page
```

### 2. Processing Flow
```
Processing starts → WebSocket connection established → 
Agent 1 (Ingestion) → Agent 2 (Parsing) → Agent 3 (Interpretation) → 
Agent 4 (Verification) → Agent 5 (Guidance) → Agent 6 (Compliance) → 
Results generated → Display final analysis
```

### 3. Real-time Updates Flow
```
WebSocket connection → Agent status updates → 
Progress tracking → UI state updates → Live dashboard refresh
```

---

## Multi-Agent System

The application simulates a sophisticated multi-agent AI system for legal document processing:

### Agent Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Ingestion     │ →  │     Parsing     │ →  │ Interpretation  │
│   Agent         │    │     Agent       │    │     Agent       │
│                 │    │                 │    │                 │
│ • OCR           │    │ • Text Extract  │    │ • Legal Terms   │
│ • File Proc     │    │ • Structure     │    │ • Concepts      │
│ • Validation    │    │ • Metadata      │    │ • Context       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ↓                       ↓                       ↓
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Verification   │ ←  │    Guidance     │ ←  │   Compliance    │
│     Agent       │    │     Agent       │    │     Agent       │
│                 │    │                 │    │                 │
│ • Fact Check    │    │ • Simplify      │    │ • Risk Assess   │
│ • Compliance    │    │ • Explain       │    │ • Scoring       │
│ • Validation    │    │ • Recommend     │    │ • Mitigation    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Agent Status Types
```typescript
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
```

---

## API Architecture

### API Client (`lib/api-client.ts`)
Handles all backend communication:

```typescript
export class LegalDocumentAPI {
  private baseUrl: string
  private wsUrl: string

  // Core methods
  async uploadDocument(file: File): Promise<{ documentId: string }>
  async startProcessing(documentId: string): Promise<{ processId: string }>
  async getProcessingStatus(processId: string): Promise<ProcessingStatus>
  async getFinalResults(processId: string): Promise<ProcessedDocument>
  createWebSocketConnection(processId: string): WebSocket
}
```

### Data Types
```typescript
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

export interface RiskAssessment {
  overallRisk: "low" | "medium" | "high"
  riskFactors: Array<{
    factor: string
    level: "low" | "medium" | "high"
    description: string
  }>
}
```

---

## State Management

### Custom Hooks Architecture

#### 1. Document Processing Hook (`hooks/use-document-processing.ts`)
Manages the entire document processing lifecycle:

```typescript
export function useDocumentProcessing() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null)
  const [finalResults, setFinalResults] = useState<ProcessedDocument | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  // Key methods
  const uploadDocument = useCallback(async (file: File): Promise<string> => {
    // Upload file and return document ID
  }, [])

  const startProcessing = useCallback(async () => {
    // Initialize processing and WebSocket connection
  }, [])

  return {
    files,
    uploadedFiles,
    processingFiles,
    completedFiles,
    isProcessing,
    processingStatus,
    finalResults,
    isConnected,
    uploadDocument,
    startProcessing,
    removeFile
  }
}
```

#### 2. WebSocket Hook (`hooks/use-websocket.ts`)
Manages real-time communication:

```typescript
export function useWebSocket(): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [agentStatuses, setAgentStatuses] = useState<Map<string, AgentStatusUpdate>>(new Map())
  const [logs, setLogs] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Event handlers for different message types
  const handleAgentStatus = useCallback((data: AgentStatusUpdate) => {
    setAgentStatuses(prev => {
      const newMap = new Map(prev)
      newMap.set(data.agentId, data)
      return newMap
    })
  }, [])
}
```

---

## UI/UX Design

### Design System
- **Color Scheme**: Dark theme with slate/blue/purple gradients
- **Typography**: Geist Sans and Geist Mono fonts
- **Components**: Radix UI primitives with custom styling
- **Animations**: Smooth transitions and entrance effects

### Theme Configuration (`app/globals.css`)
```css
.dark {
  --background: oklch(0.08 0 0);     /* Slate-950 */
  --foreground: oklch(0.98 0 0);     /* White text */
  --primary: oklch(0.6 0.2 250);     /* Blue primary */
  --accent: oklch(0.65 0.2 280);     /* Purple accent */
  /* ... other color variables */
}
```

### Responsive Design
- **Mobile-first**: Responsive grid layouts
- **Breakpoints**: Tailwind CSS responsive utilities
- **Touch-friendly**: Appropriate sizing for mobile interactions

### Accessibility Features
- **Radix UI**: ARIA-compliant components
- **Keyboard navigation**: Full keyboard accessibility
- **Screen readers**: Proper semantic markup
- **Color contrast**: WCAG AA compliant colors

---

## Setup and Development

### Prerequisites
- Node.js 18+ 
- npm or pnpm package manager

### Installation
```bash
# Clone the repository
git clone https://github.com/rushangchandekar/LegalAI-Processor.git
cd LegalAI-Processor

# Install dependencies
npm install

# Run development server
npm run dev
```

### Available Scripts
```json
{
  "scripts": {
    "dev": "next dev",           // Development server
    "build": "next build",       // Production build
    "start": "next start",       // Production server
    "lint": "next lint"          // Code linting
  }
}
```

### Environment Variables
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws

# Optional: Google Cloud Storage
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_STORAGE_BUCKET=your-bucket-name
```

---

## Deployment

### Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Static Export
```bash
# For static hosting
npm run build
npm run export
```

---

## Current Implementation Status

### ✅ Completed Features
- Full frontend UI with responsive design
- Document upload with drag-and-drop
- Real-time processing dashboard
- Multi-agent workflow visualization
- Results display with legal analysis
- WebSocket simulation for demo purposes

### 🚧 Simulated Components
- **Backend API**: Currently simulated responses
- **AI Processing**: Mock multi-agent system
- **WebSocket**: Simulated real-time updates
- **File Storage**: Local file handling only

### 🔄 Ready for Integration
- **API Client**: Ready for backend integration
- **WebSocket Manager**: Ready for real server connection
- **Document Processing**: Ready for actual AI agents
- **Data Models**: Complete TypeScript interfaces

---

## Next Steps for Production

1. **Backend Integration**
   - Connect to actual AI processing backend
   - Implement real document upload to cloud storage
   - Set up WebSocket server for real-time updates

2. **AI Agent Implementation**
   - Deploy actual legal document processing AI
   - Implement the 6-agent workflow
   - Add real legal analysis capabilities

3. **Security & Authentication**
   - Add user authentication
   - Implement document security measures
   - Add rate limiting and abuse prevention

4. **Performance Optimization**
   - Implement caching strategies
   - Optimize bundle size
   - Add monitoring and analytics

5. **Testing**
   - Add unit tests for components
   - Implement integration tests
   - Add end-to-end testing

---

This documentation provides a comprehensive overview of the LegalAI-Processor codebase, its architecture, and implementation details. The application is well-structured for scaling and production deployment once integrated with actual backend services.