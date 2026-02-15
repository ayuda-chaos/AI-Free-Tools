import React from 'react'
import { BookOpen, Database, Cpu, Terminal, Code, MessageSquare, Globe, Users } from 'lucide-react'

const resources = [
  {
    name: 'ENS Documentation',
    description: 'Guides and docs for Ethereum Name Service.',
    url: 'https://docs.ens.domains',
    icon: BookOpen
  },
  {
    name: 'Hugging Face Models',
    description: 'Explore thousands of open-source AI models.',
    url: 'https://huggingface.co/models',
    icon: Database
  },
  {
    name: 'Ollama',
    description: 'Run open models locally with privacy-first workflows.',
    url: 'https://ollama.com',
    icon: Cpu
  },
  {
    name: 'Google AI Studio',
    description: 'Free developer access to Gemini models and tooling.',
    url: 'https://aistudio.google.com',
    icon: Terminal
  }
]

const communityLinks = [
  {
    name: 'GitHub',
    description: 'Open-source repos, issues, and community builds.',
    url: 'https://github.com',
    icon: Code
  },
  {
    name: 'Discord',
    description: 'Real-time help and collaboration.',
    url: 'https://discord.com',
    icon: MessageSquare
  },
  {
    name: 'Twitter/X',
    description: 'Follow the latest AI and Web3 updates.',
    url: 'https://x.com',
    icon: Globe
  },
  {
    name: 'ENS Forums',
    description: 'Deep discussions on decentralized identity.',
    url: 'https://discuss.ens.domains',
    icon: Users
  }
]

const quickLinks = [
]

export function JoinCommunity() {
  return (
    <section id="resources" className="relative py-14 lg:py-20 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/10 via-black to-cyan-950/10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 mb-6">
            <Users className="w-4 h-4 text-emerald-300" />
            <span className="text-sm font-medium bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Resources and Community
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Build, Learn, Connect
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-300">
            Everything you need to start building with open AI and connect with the people shaping the future.
          </p>
        </div>

        {/* Resources / Community columns removed */}
      </div>
    </section>
  )
}
