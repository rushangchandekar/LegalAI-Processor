import { Scale, Brain } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-blue-400" /> 
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">LegalAI Processor</h1>
              <p className="text-sm text-slate-400">Intelligent Document Analysis</p>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">Hackathon Demo</p>
              <p className="text-xs text-slate-400">Multi-Agent System</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
