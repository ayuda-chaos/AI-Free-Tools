// components/DeveloperAPIs.tsx
import React, { useEffect, useRef, useState } from 'react';
import { 
  Code, ExternalLink, Book, Globe, Shield, Zap, 
  ArrowRight, Copy, Check, Cpu, MessageSquare, 
  Server, Database, Terminal, Wallet, Network, Smartphone,
  Bitcoin, Ethereum
} from 'lucide-react';

interface APIEndpoint {
  name: string;
  description: string;
  url: string;
  freeTier: string;
  category: string;
  icon: React.ElementType;
  logo?: string;
}

interface ENSResource {
  name: string;
  description: string;
  url: string;
  type: string;
  icon: React.ElementType;
}

export function DeveloperAPIs() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'apis' | 'ens' | 'web3'>('web3');

  useEffect(() => {
    const element = sectionRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    const fallbackId = setTimeout(() => setIsVisible(true), 1200);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackId);
    };
  }, []);

  const apiEndpoints: APIEndpoint[] = [
    {
      name: "Google AI Studio",
      description: "Free access to Gemini 2.5 Pro with built-in app building features",
      url: "https://aistudio.google.com/app/apikey",
      freeTier: "Completely free for developers",
      category: "AI APIs",
      icon: Terminal
    },
    {
      name: "DeepSeek API",
      description: "Open-source reasoning models with generous free tier",
      url: "https://platform.deepseek.com/api-keys",
      freeTier: "Free tier available",
      category: "AI APIs",
      icon: Cpu
    },
    {
      name: "Hugging Face API",
      description: "Access thousands of open-source AI models",
      url: "https://huggingface.co/settings/tokens",
      freeTier: "Free tier with rate limits",
      category: "AI APIs",
      icon: Database
    },
    {
      name: "OpenRouter",
      description: "Access Claude, Llama, and Mistral in one API",
      url: "https://openrouter.ai",
      freeTier: "Free credits for developers",
      category: "AI APIs",
      icon: MessageSquare
    },
    {
      name: "Together AI",
      description: "Fast inference for open-source models",
      url: "https://together.ai",
      freeTier: "Free credits on signup",
      category: "AI APIs",
      icon: Server
    },
    {
      name: "Groq API",
      description: "Lightning-fast inference for open-source models",
      url: "https://console.groq.com/keys",
      freeTier: "Generous free tier",
      category: "AI APIs",
      icon: Zap
    },
    {
      name: "Mistral AI API",
      description: "Open-source models with free API tier",
      url: "https://console.mistral.ai/api-keys/",
      freeTier: "Free tier available",
      category: "AI APIs",
      icon: Code
    }
  ];

  const ensResources: ENSResource[] = [
    {
      name: "ENS Documentation",
      description: "Complete developer documentation for Ethereum Name Service integration",
      url: "https://docs.ens.domains",
      type: "Documentation",
      icon: Book
    },
    {
      name: "ENS App",
      description: "Main application for registering and managing ENS domains",
      url: "https://app.ens.domains",
      type: "Application",
      icon: Globe
    },
    {
      name: "ENS Developer Portal",
      description: "Developer resources, quickstart guides, and contract documentation",
      url: "https://ens.domains/developers",
      type: "Developer Hub",
      icon: Code
    },
    {
      name: "ENS JavaScript SDK",
      description: "Official JavaScript library for ENS name resolution and management",
      url: "https://github.com/ensdomains/ensjs",
      type: "SDK",
      icon: Terminal
    },
    {
      name: "ENS Smart Contracts",
      description: "Source code and documentation for ENS smart contracts on Ethereum",
      url: "https://github.com/ensdomains/ens-contracts",
      type: "Smart Contracts",
      icon: Server
    },
    {
      name: "ENS Subgraph",
      description: "GraphQL API for querying ENS data from The Graph protocol",
      url: "https://thegraph.com/explorer/subgraphs/ensdomains/ens",
      type: "API",
      icon: Database
    },
    {
      name: "ENS Grants Program",
      description: "Apply for funding to build projects in the ENS ecosystem. 124+ ETH funded",
      url: "https://ens.domains/developers#grants",
      type: "Grants",
      icon: Wallet
    },
    {
      name: "ENS Bug Bounty",
      description: "Earn up to $250,000 by reporting security vulnerabilities in ENS",
      url: "https://immunefi.com/bug-bounty/ens",
      type: "Bug Bounty",
      icon: Shield
    }
  ];

  const web3APIs = [
    {
      name: "Infura (Ethereum)",
      description: "Ethereum API with free tier for development",
      url: "https://infura.io",
      freeTier: "100,000 requests/day free",
      icon: Ethereum,
      logo: "https://logo.clearbit.com/infura.io"
    },
    {
      name: "Alchemy (Ethereum)",
      description: "Ethereum development platform with free tier",
      url: "https://www.alchemy.com",
      freeTier: "300M compute units/month free",
      icon: Server,
      logo: "https://logo.clearbit.com/alchemy.com"
    },
    {
      name: "QuickNode (Multi-chain)",
      description: "Blockchain infrastructure for multiple chains",
      url: "https://www.quicknode.com",
      freeTier: "Free trial available",
      icon: Network,
      logo: "https://logo.clearbit.com/quicknode.com"
    },
    {
      name: "Moralis (Web3 APIs)",
      description: "Unified Web3 API for multiple blockchains",
      url: "https://moralis.io",
      freeTier: "Free tier available",
      icon: Smartphone,
      logo: "https://logo.clearbit.com/moralis.io"
    },
    {
      name: "ThirdWeb",
      description: "Web3 development framework with free tools",
      url: "https://thirdweb.com",
      freeTier: "Free for most features",
      icon: Code,
      logo: "https://logo.clearbit.com/thirdweb.com"
    },
    {
      name: "Covalent (Blockchain Data)",
      description: "Unified API for blockchain data across 100+ chains",
      url: "https://www.covalenthq.com",
      freeTier: "Free tier available",
      icon: Database,
      logo: "https://logo.clearbit.com/covalenthq.com"
    }
  ];

  const copyToClipboard = async (url: string) => {
    if (typeof document === 'undefined') {
      return;
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch {
      return;
    }
  };

  return (
    <section ref={sectionRef} id="apis" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/10 via-black to-purple-950/10" />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23639' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div data-section-start className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-6">
            <Code className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Developer Resources
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Free APIs & Web3 Integration
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Build the Decentralized Future
            </span>
          </h2>

          <p className="max-w-2xl mx-auto text-lg text-gray-300 mb-8">
            Everything you need to build AI applications with Web3 integration. Free APIs, ENS documentation,
            and blockchain development tools.
          </p>

          {/* Category Tabs */}
          <div className="inline-flex rounded-xl bg-white/5 border border-white/10 p-1 mb-8">
            <button
              onClick={() => setActiveCategory('web3')}
              className={`px-4 py-2 rounded-lg transition-all ${activeCategory === 'web3' 
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white' 
                : 'text-gray-400 hover:text-white'}`}
            >
              Web3 APIs
            </button>
            <button
              onClick={() => setActiveCategory('apis')}
              className={`px-4 py-2 rounded-lg transition-all ${activeCategory === 'apis' 
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white' 
                : 'text-gray-400 hover:text-white'}`}
            >
              AI APIs
            </button>
            <button
              onClick={() => setActiveCategory('ens')}
              className={`px-4 py-2 rounded-lg transition-all ${activeCategory === 'ens' 
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white' 
                : 'text-gray-400 hover:text-white'}`}
            >
              ENS Integration
            </button>
          </div>
        </div>

        {/* AI APIs Section */}
        {activeCategory === 'apis' && (
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Zap className="w-6 h-6 text-cyan-300" />
              Free AI APIs for Developers
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {apiEndpoints.map((api, index) => (
                <div
                  key={api.name}
                  className="group p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600/20 to-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <api.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {api.name}
                      </h4>
                      <div className="mt-1 px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs inline-block">
                        {api.freeTier}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{api.description}</p>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.open(api.url, '_blank')}
                      className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Get API Key
                    </button>
                    <button
                      onClick={() => copyToClipboard(api.url)}
                      className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
                    >
                      {copiedUrl === api.url ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ENS Integration Section */}
        {activeCategory === 'ens' && (
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Globe className="w-6 h-6 text-purple-400" />
              ENS Domain Integration
            </h3>
            
            <p className="text-gray-400 mb-8 max-w-2xl">
              Ethereum Name Service (ENS) turns cryptocurrency addresses into human-readable names.
              Build Web3 applications that work with names like "yourname.eth" instead of complex addresses.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
              {ensResources.map((resource, index) => (
                <a
                  key={resource.name}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 text-sm">
                      {resource.type}
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <resource.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {resource.name}
                    </h4>
                  </div>
                  
                  <p className="text-gray-400 text-sm">{resource.description}</p>
                </a>
              ))}
            </div>

            {/* ENS Code Example */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
              <h4 className="text-lg font-semibold text-white mb-4">ENS Resolution Example</h4>
              <pre className="text-sm text-gray-300 bg-black/30 p-4 rounded-lg overflow-x-auto">
{`// Resolve ENS name to Ethereum address
const address = await provider.resolveName('vitalik.eth');
console.log(address); // 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045

// Reverse resolution: address to ENS name
const name = await provider.lookupAddress(address);
console.log(name); // vitalik.eth

// Get all records for a domain
const resolver = await provider.getResolver('vitalik.eth');
const email = await resolver.getText('email');
const url = await resolver.getText('url');`}
              </pre>
            </div>
          </div>
        )}

        {/* Web3 APIs Section */}
        {activeCategory === 'web3' && (
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Network className="w-6 h-6 text-cyan-300" />
              Web3 Development APIs
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {web3APIs.map((api, index) => (
                <div
                  key={api.name}
                  className="group p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-cyan-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <div className="relative w-12 h-12 rounded-xl flex items-center justify-center">
                        <api.icon className="w-6 h-6 text-cyan-300" />
                        {api.logo && (
                          <img
                            src={api.logo}
                            alt={`${api.name} logo`}
                            loading="lazy"
                            className="absolute inset-1 rounded-lg bg-white/90 object-contain p-1"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {api.name}
                      </h4>
                      <div className="mt-1 px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs inline-block">
                        {api.freeTier}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{api.description}</p>
                  
                  <div className="flex items-center gap-2">
                    <a
                      href={api.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Website
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Web3 + AI Integration */}
            <div className="mt-8 p-8 rounded-2xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
              <h4 className="text-2xl font-bold text-white mb-4 text-center">
                AI + Web3 = The Future
              </h4>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h5 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Bitcoin className="w-5 h-5 text-orange-400" />
                    Why Decentralized AI Matters
                  </h5>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>No single point of failure or control</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Transparent, auditable AI models</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Monetization for AI creators</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Community governance of AI systems</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Ethereum className="w-5 h-5 text-cyan-400" />
                    Building Blocks for Developers
                  </h5>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Smart contracts for AI governance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Token incentives for AI training</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Decentralized compute marketplaces</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>On-chain AI model verification</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Final Call to Action */}
        <div className={`mt-12 text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
            <div>
              <h4 className="text-lg font-semibold text-white mb-1">Ready to Build the Future?</h4>
              <p className="text-gray-400 text-sm">Start building decentralized AI applications today with free tools and APIs.</p>
            </div>
            <a
              href="https://ens.domains/developers"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Book className="w-5 h-5" />
              Read ENS Documentation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
