"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { ArrowRight, Zap, Shield, Brain } from "lucide-react"
import { DocumentUploadLanding } from "@/components/document-upload-landing"

export default function LandingPage() {
  const router = useRouter()
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    setIsAnimated(true)
  }, [])

  const features = [
    {
      icon: Brain,
      title: "Multi-Agent AI Processing",
      description: "Advanced AI agents work together to analyze and simplify complex legal documents",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with Google Cloud infrastructure and compliance monitoring",
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Watch as each AI agent processes your document with live updates and transparency",
    },
  ]

  const processSteps = [
    "Document Ingestion & OCR",
    "Natural Language Processing",
    "Legal Interpretation Analysis",
    "Compliance Verification",
    "User Guidance Generation",
    "Decision Simulation",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 animate-spin-slow" 
             style={{ animation: 'float 20s ease-in-out infinite' }}></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-600/10 via-transparent to-cyan-600/10 animate-spin-slow"
             style={{ animation: 'float 25s ease-in-out infinite reverse' }}></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
             style={{ animationDelay: '2s' }}></div>
      </div>

      <Header />

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900"></div>
        </div>
        <div className="relative container mx-auto px-4 py-16">
          <div
            className={`text-center space-y-10 transition-all duration-1500 ease-out ${
              isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <div className="relative inline-block">
              <Badge
                variant="secondary"
                className="relative overflow-hidden rounded-full 
                          bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                          text-blue-300 border border-blue-500/30 
                          px-6 py-3 text-sm font-medium 
                          backdrop-blur-sm hover:scale-105 
                          transition-transform duration-300"
              >
                {/* Glow layer */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>

                {/* Content */}
                <span className="relative z-10">✨ AI-Powered Legal Technology</span>
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-balance leading-[1.1] tracking-tight max-w-5xl mx-auto">
              Transform Complex
              <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x bg-300%">
                  Legal Documents
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/15 via-cyan-400/15 to-purple-400/15 blur-lg -z-10"></div>
              </span>
              <br />
              into Clear
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent"> Guidance</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 text-pretty max-w-3xl mx-auto leading-relaxed">
              Our advanced multi-agent AI system processes legal documents through specialized agents, providing
              <span className="text-blue-300 font-semibold"> real-time transparency</span> and 
              <span className="text-purple-300 font-semibold"> simplified explanations</span> for informed decision-making.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-8">
              {processSteps.map((step, index) => (
                <div
                  key={step}
                  className={`flex items-center space-x-3 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-full px-5 py-3 transition-all duration-700 hover:bg-slate-700/50 hover:border-blue-500/50 hover:scale-105 ${
                    isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ 
                    animationDelay: `${index * 150}ms`,
                    transitionDelay: `${index * 150}ms`
                  }}
                >
                  <div className="relative">
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <span className="text-sm font-medium text-slate-200">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24 relative">
        <div
          className={`transition-all duration-1500 delay-500 ease-out ${
            isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Why Choose Our 
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> AI Legal Assistant?</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-6">
              Experience the power of advanced AI technology designed specifically for legal document processing
            </p>
            <div className="w-20 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className={`group bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 ${
                  isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 200 + 600}ms` }}
              >
                <CardHeader className="pb-4">
                  <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <feature.icon className="h-7 w-7 text-blue-400 group-hover:text-blue-300 transition-colors duration-300 relative z-10" />
                  </div>
                  <CardTitle className="text-white text-lg font-bold group-hover:text-blue-300 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400 leading-relaxed text-base group-hover:text-slate-300 transition-colors duration-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Process Flow Visualization */}
      <div className="container mx-auto px-4 py-24 relative">
        <div
          className={`transition-all duration-1500 delay-1000 ease-out ${
            isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">AI Agent</span> Processing Pipeline
            </h2>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto mb-6">
              Watch as our specialized AI agents collaborate to transform your legal documents through a sophisticated multi-stage process
            </p>
            <div className="w-20 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Ingestion Agent", desc: "Document parsing & OCR", color: "blue", gradient: "from-blue-500 to-cyan-500" },
                { name: "Parsing Agent", desc: "Natural language processing", color: "green", gradient: "from-green-500 to-emerald-500" },
                { name: "Interpretation Agent", desc: "Legal analysis & context", color: "purple", gradient: "from-purple-500 to-pink-500" },
                { name: "Verification Agent", desc: "Accuracy & compliance check", color: "orange", gradient: "from-orange-500 to-red-500" },
                { name: "Guidance Agent", desc: "User-friendly explanations", color: "pink", gradient: "from-pink-500 to-rose-500" },
                { name: "Decision Agent", desc: "Actionable recommendations", color: "cyan", gradient: "from-cyan-500 to-blue-500" },
              ].map((agent, index) => (
                <div key={agent.name} className="relative group">
                  <div
                    className={`relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-${agent.color}-500/50 rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-${agent.color}-500/10 ${
                      isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${index * 150 + 1200}ms` }}
                  >
                    <div className="relative">
                      <div className={`w-4 h-4 bg-gradient-to-r ${agent.gradient} rounded-full mb-4 animate-pulse shadow-lg shadow-${agent.color}-500/50`} />
                      <div className={`absolute top-0 left-0 w-4 h-4 bg-gradient-to-r ${agent.gradient} rounded-full animate-ping opacity-75`} />
                    </div>
                    <h3 className={`text-white font-semibold mb-2 group-hover:text-${agent.color}-300 transition-colors duration-300`}>
                      {agent.name}
                    </h3>
                    <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300 text-sm leading-relaxed">
                      {agent.desc}
                    </p>
                    <div className={`absolute inset-0 bg-gradient-to-r ${agent.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                  </div>
                  {index < 5 && index % 3 !== 2 && (
                    <ArrowRight className="hidden lg:block absolute -right-10 top-1/2 transform -translate-y-1/2 text-slate-600 h-6 w-6 animate-pulse" />
                  )}
                  {index === 2 && (
                    <ArrowRight className="hidden lg:block absolute left-1/2 -bottom-10 transform -translate-x-1/2 rotate-90 text-slate-600 h-6 w-6 animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="container mx-auto px-4 py-24 relative">
        <div
          className={`max-w-5xl mx-auto transition-all duration-1500 delay-1500 ease-out ${
            isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Upload Your 
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Legal Document</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed mb-6">
              Support for <span className="text-emerald-400 font-semibold">PDF, DOC, DOCX, and TXT</span> formats. 
              Your document will be processed securely in the cloud with enterprise-grade encryption.
            </p>
            <div className="w-20 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto rounded-full"></div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl blur-3xl"></div>
            <div className="relative bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
              <DocumentUploadLanding />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">
                Legal<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI</span>
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Transform complex legal documents into clear guidance with our advanced multi-agent AI system.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-slate-700/50 hover:bg-blue-500/20 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-300">
                  <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                </div>
                <div className="w-8 h-8 bg-slate-700/50 hover:bg-purple-500/20 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-300">
                  <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
                </div>
                <div className="w-8 h-8 bg-slate-700/50 hover:bg-cyan-500/20 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-300">
                  <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Product Section */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-400 hover:text-blue-300 transition-colors duration-300">Features</a></li>
                <li><a href="#" className="text-slate-400 hover:text-blue-300 transition-colors duration-300">AI Agents</a></li>
                <li><a href="#" className="text-slate-400 hover:text-blue-300 transition-colors duration-300">Security</a></li>
                <li><a href="#" className="text-slate-400 hover:text-blue-300 transition-colors duration-300">Pricing</a></li>
              </ul>
            </div>

            {/* Resources Section */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-400 hover:text-purple-300 transition-colors duration-300">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-purple-300 transition-colors duration-300">API Reference</a></li>
                <li><a href="#" className="text-slate-400 hover:text-purple-300 transition-colors duration-300">Support</a></li>
                <li><a href="#" className="text-slate-400 hover:text-purple-300 transition-colors duration-300">Blog</a></li>
              </ul>
            </div>

            {/* Company Section */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-400 hover:text-cyan-300 transition-colors duration-300">About Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-300 transition-colors duration-300">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-300 transition-colors duration-300">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-300 transition-colors duration-300">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-slate-700/30 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-500 text-sm">
              © 2024 LegalAI. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-300">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-300">Terms</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-300">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        
        .bg-300\% {
          background-size: 300%;
        }
        
        .animate-spin-slow {
          animation: spin 30s linear infinite;
        }
      `}</style>
    </div>
  )
}