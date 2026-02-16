// components/BlockchainTheme/AIToolsSection.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Search, ExternalLink, Filter, Check, ChevronDown,
  Sparkles, Star, Zap, Shield, BookOpen, MessageSquare,
  Code, Eye, TrendingUp, Video, FileSearch, PenTool,
  Lock, Bot, Network, Play, FileText, Globe as GlobeIcon
} from 'lucide-react';

interface AITool {
  id: number;
  name: string;
  handle: string;
  website: string;
  description: string;
  category: string;
  free: boolean;
  openSource: boolean;
  blockchain?: boolean;
  privacy?: boolean;
  web3?: boolean;
  verified?: boolean;
}

interface Props {
  aiTools: AITool[];
  categories: string[];
}

export function AIToolsSection({ aiTools, categories }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const toolsSearchInputRef = useRef<HTMLInputElement | null>(null);
  const toolRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'name'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showOnlyFree, setShowOnlyFree] = useState(true);
  const [showOnlyOpenSource, setShowOnlyOpenSource] = useState(false);
  const [showWeb3Tools, setShowWeb3Tools] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showDirectory, setShowDirectory] = useState(false);
  const [showMobileMoreCategories, setShowMobileMoreCategories] = useState(false);
  const [pendingJumpCategory, setPendingJumpCategory] = useState(false);
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const [pendingJumpId, setPendingJumpId] = useState<number | null>(null);
  const [categoryAnim, setCategoryAnim] = useState(false);
  const prevCategoryRef = useRef(selectedCategory);

  const openToolSite = (tool: AITool) => {
    if (tool.website) window.open(tool.website, '_blank', 'noopener,noreferrer');
  };

  const focusToolCard = (tool: AITool) => {
    setSearchQuery(tool.name);
    setSelectedCategory('All');
    setPendingJumpId(tool.id);
  };

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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail || {};
      if (typeof detail.searchQuery === 'string') setSearchQuery(detail.searchQuery);
      if (typeof detail.category === 'string') setSelectedCategory(detail.category);
      if (typeof detail.freeOnly === 'boolean') setShowOnlyFree(detail.freeOnly);
      if (typeof detail.openSourceOnly === 'boolean') setShowOnlyOpenSource(detail.openSourceOnly);
      if (typeof detail.web3Only === 'boolean') setShowWeb3Tools(detail.web3Only);
      if (detail.jumpToCategory) setPendingJumpCategory(true);
    };

    window.addEventListener('ai-tools:filters', handler as EventListener);
    return () => window.removeEventListener('ai-tools:filters', handler as EventListener);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail || {};
      if (detail.source !== 'nav' && typeof detail.searchQuery === 'string') {
        setSearchQuery(detail.searchQuery);
      }
      if (detail.source !== 'nav') {
        setSelectedCategory('All');
      }
      if (typeof detail.toolId === 'number') {
        setPendingJumpId(detail.toolId);
      }
    };

    window.addEventListener('ai-tools:jump', handler as EventListener);
    return () => window.removeEventListener('ai-tools:jump', handler as EventListener);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail || {};
      if (typeof detail.toolId !== 'number') return;
      const tool = aiTools.find(item => item.id === detail.toolId);
      if (tool) {
        setSelectedTool(tool);
      }
    };

    window.addEventListener('ai-tools:view', handler as EventListener);
    return () => window.removeEventListener('ai-tools:view', handler as EventListener);
  }, [aiTools]);

  const categoryIcons: Record<string, React.ElementType> = {
    "All": Sparkles,
    "AI for Everyday Tasks": MessageSquare,
    "AI for Trading": TrendingUp,
    "AI for YouTube/Video": Video,
    "AI for Research": FileSearch,
    "AI Agents & Automation": Bot,
    "AI Website Builders": GlobeIcon,
    "AI Journaling & Notes": BookOpen,
    "AI Writing & Editing": PenTool,
    "AI for Search & News": Search,
    "AI for Audio & Voice": Play,
    "AI for Career": FileText,
    "Private AI": Lock,
    "Image Generation": Eye,
    "Web3 & Blockchain": Network,
    "Developer APIs": Code
  };

  const featuredCategories = [
    { category: "AI for Everyday Tasks", tools: ["LM Arena", "Jan", "Open WebUI", "LibreChat"] },
    { category: "AI for Research", tools: ["Qwen (Alibaba)", "ChatGLM", "InternLM", "Yi (01.AI)"] },
    { category: "AI Agents & Automation", tools: ["n8n", "Flowise", "Langflow", "OpenAssistantGPT"] },
    { category: "Image Generation", tools: ["Stable Diffusion", "Scribble Diffusion AI", "Craion AI"] },
    { category: "Private AI", tools: ["Cocoon (TON Blockchain)", "Jan", "Open WebUI"] },
    { category: "Developer APIs", tools: ["Kilo AI", "ModelSlab", "Qdrant"] },
    { category: "Web3 & Blockchain", tools: ["Cocoon (TON Blockchain)"] }
  ];

  const featureHighlights = [
    "200 open-source and free tools curated from a huge public list",
    "Everyday Tasks category focused on open-source chat assistants",
    "Stronger focus on Chinese open-source models and labs",
    "Enhanced search across names, handles, and descriptions",
    "Category icons and color coding for faster scanning",
    "Quick filters for Open Source and Free"
  ];

  const realWorldFocus = [
    "Help with real tasks people do daily",
    "Open-source or self-hosted whenever possible",
    "Free for community use and experimentation",
    "Built to highlight underrated tools"
  ];

  const sortTools = (tools: AITool[]) => {
    const sorted = [...tools];
    if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => b.id - a.id);
    } else if (sortBy === 'popular') {
      sorted.sort((a, b) => {
        const scoreA = (a.openSource ? 3 : 0) + (a.free ? 2 : 0) + (a.web3 ? 4 : 0);
        const scoreB = (b.openSource ? 3 : 0) + (b.free ? 2 : 0) + (b.web3 ? 4 : 0);
        return scoreB - scoreA;
      });
    }
    return sorted;
  };

  const normalizeSearch = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

  const containsAllChars = (text: string, query: string) => {
    if (!query) return true;
    const needed: Record<string, number> = {};
    let remaining = 0;
    for (const ch of query) {
      needed[ch] = (needed[ch] || 0) + 1;
      remaining += 1;
    }
    for (const ch of text) {
      const count = needed[ch];
      if (!count) continue;
      needed[ch] = count - 1;
      remaining -= 1;
      if (remaining === 0) return true;
    }
    return remaining === 0;
  };

  const getSearchScore = (tool: AITool, normalizedQuery: string) => {
    if (!normalizedQuery) return 0;
    const name = normalizeSearch(tool.name);
    const handle = normalizeSearch(tool.handle);
    const category = normalizeSearch(tool.category);
    const description = normalizeSearch(tool.description);

    if (name.startsWith(normalizedQuery)) return 0;
    if (handle.startsWith(normalizedQuery)) return 1;
    if (name.includes(normalizedQuery)) return 2;
    if (handle.includes(normalizedQuery)) return 3;
    if (containsAllChars(name, normalizedQuery)) return 4;
    if (containsAllChars(handle, normalizedQuery)) return 5;
    if (category.includes(normalizedQuery)) return 6;
    if (description.includes(normalizedQuery)) return 7;
    return 8;
  };

  const filteredTools = useMemo(() => {
    const normalizedQuery = normalizeSearch(searchQuery);
    let filtered = aiTools.filter(tool => {
      const name = normalizeSearch(tool.name);
      const handle = normalizeSearch(tool.handle);
      const category = normalizeSearch(tool.category);
      const description = normalizeSearch(tool.description);
      const matchesSearch = !normalizedQuery ||
        name.includes(normalizedQuery) ||
        handle.includes(normalizedQuery) ||
        description.includes(normalizedQuery) ||
        category.includes(normalizedQuery) ||
        containsAllChars(name, normalizedQuery) ||
        containsAllChars(handle, normalizedQuery);

      const matchesCategory = 
        selectedCategory === 'All' || tool.category === selectedCategory;

      const matchesFree = !showOnlyFree || tool.free;
      const matchesOpenSource = !showOnlyOpenSource || tool.openSource;
      const matchesWeb3 = !showWeb3Tools || tool.web3;

      return matchesSearch && matchesCategory && matchesFree && matchesOpenSource && matchesWeb3;
    });

    const baseSorted = sortTools(filtered);
    if (!normalizedQuery) return baseSorted;
    return baseSorted.slice().sort((a, b) => {
      const scoreA = getSearchScore(a, normalizedQuery);
      const scoreB = getSearchScore(b, normalizedQuery);
      if (scoreA !== scoreB) return scoreA - scoreB;
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, selectedCategory, sortBy, showOnlyFree, showOnlyOpenSource, showWeb3Tools, aiTools]);

  const suggestions = filteredTools.slice(0, 8);

  const groupedTools = useMemo(() => {
    if (selectedCategory !== 'All') return [];
    const grouped: Record<string, AITool[]> = {};
    filteredTools.forEach(tool => {
      if (!grouped[tool.category]) grouped[tool.category] = [];
      grouped[tool.category].push(tool);
    });

    return categories
      .filter(category => category !== 'All' && grouped[category]?.length)
      .map(category => ({
        category,
        tools: sortTools(grouped[category])
      }));
  }, [filteredTools, categories, selectedCategory, sortBy]);

  const pageSize = viewMode === 'grid' ? 6 : 8;
  const categoryPageSize = viewMode === 'grid' ? 4 : 6;
  const visibleTools = filteredTools.slice(0, visibleCount);
  const showGrouped = selectedCategory === 'All' && groupedTools.length > 0;

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [pageSize, searchQuery, selectedCategory, showOnlyFree, showOnlyOpenSource, showWeb3Tools, sortBy]);

  useEffect(() => {
    setExpandedCategories(new Set());
  }, [searchQuery, selectedCategory, showOnlyFree, showOnlyOpenSource, showWeb3Tools, sortBy, viewMode]);

  useEffect(() => {
    if (pendingJumpCategory) {
      const normalizedQuery = normalizeSearch(searchQuery);
      const match = normalizedQuery ? aiTools.find(tool => {
        const name = normalizeSearch(tool.name);
        const handle = normalizeSearch(tool.handle);
        const category = normalizeSearch(tool.category);
        return name.includes(normalizedQuery) ||
          handle.includes(normalizedQuery) ||
          category.includes(normalizedQuery) ||
          containsAllChars(name, normalizedQuery) ||
          containsAllChars(handle, normalizedQuery);
      }) : null;
      if (match && selectedCategory !== match.category) {
        setSelectedCategory(match.category);
      }
      setPendingJumpCategory(false);
    }
  }, [pendingJumpCategory, searchQuery, aiTools, selectedCategory]);

  useEffect(() => {
    if (pendingJumpId === null) return;
    const target = toolRefs.current[pendingJumpId];
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightId(pendingJumpId);
        setPendingJumpId(null);
      });
    }
  }, [pendingJumpId, filteredTools, viewMode]);

  useEffect(() => {
    if (highlightId === null) return;
    const id = setTimeout(() => setHighlightId(null), 1200);
    return () => clearTimeout(id);
  }, [highlightId]);

  useEffect(() => {
    if (prevCategoryRef.current === selectedCategory) return;
    prevCategoryRef.current = selectedCategory;
    setCategoryAnim(true);
    const timeoutId = setTimeout(() => setCategoryAnim(false), 520);
    return () => clearTimeout(timeoutId);
  }, [selectedCategory]);

  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = { All: aiTools.length };
    aiTools.forEach(tool => {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
    });
    return counts;
  }, [aiTools]);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || Sparkles;
  };

  const categoryEmoji: Record<string, string> = {
    "All": "\u2728",
    "AI for Everyday Tasks": "\u{1F4AC}",
    "AI for Trading": "\u{1F4C8}",
    "AI for YouTube/Video": "\u{1F3AC}",
    "AI for Research": "\u{1F52C}",
    "AI Agents & Automation": "\u{1F916}",
    "AI Website Builders": "\u{1F9E9}",
    "AI Journaling & Notes": "\u{1F4D3}",
    "AI Writing & Editing": "\u270D",
    "AI for Search & News": "\u{1F4F0}",
    "AI for Audio & Voice": "\u{1F3A7}",
    "AI for Career": "\u{1F4BC}",
    "Private AI": "\u{1F512}",
    "Image Generation": "\u{1F3A8}",
    "Web3 & Blockchain": "\u26D3",
    "Developer APIs": "\u{1F6E0}"
  };

  const mobilePrimaryCategories = [
    'All',
    'AI for Everyday Tasks',
    'AI for Research',
    'AI Agents & Automation',
    'AI for Search & News',
    'AI Writing & Editing',
    'AI for YouTube/Video',
    'AI for Audio & Voice',
    'Image Generation'
  ];

  const mobileExtraCategories = categories.filter(category =>
    category !== 'All' && !mobilePrimaryCategories.includes(category)
  );

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "AI for Everyday Tasks": "from-emerald-500 to-cyan-500",
      "AI for Trading": "from-cyan-500 to-blue-500",
      "AI for YouTube/Video": "from-purple-500 to-indigo-500",
      "AI for Research": "from-sky-500 to-cyan-500",
      "AI Agents & Automation": "from-blue-500 to-cyan-500",
      "AI Website Builders": "from-indigo-500 to-cyan-500",
      "AI Journaling & Notes": "from-fuchsia-500 to-purple-500",
      "AI Writing & Editing": "from-fuchsia-500 to-indigo-500",
      "AI for Search & News": "from-teal-500 to-cyan-500",
      "AI for Audio & Voice": "from-purple-500 to-fuchsia-500",
      "AI for Career": "from-emerald-500 to-teal-500",
      "Private AI": "from-indigo-500 to-cyan-500",
      "Image Generation": "from-purple-500 to-pink-500",
      "Web3 & Blockchain": "from-cyan-500 to-purple-500",
      "Developer APIs": "from-cyan-500 to-violet-500"
    };
    return colors[category] || "from-purple-500 to-cyan-500";
  };

  const getLogoHost = (website: string) => {
    try {
      const url = new URL(website);
      return url.hostname.replace(/^www\./, '');
    } catch (_err) {
      return '';
    }
  };

  const getLogoUrl = (website: string) => {
    const host = getLogoHost(website);
    return host ? `https://logo.clearbit.com/${host}` : '';
  };

  const getFaviconUrl = (website: string) => {
    const host = getLogoHost(website);
    return host ? `https://www.google.com/s2/favicons?domain=${host}&sz=128` : '';
  };

  const handleLogoError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    const fallback = img.dataset.fallback;
    if (fallback && img.src !== fallback) {
      img.src = fallback;
      return;
    }
    img.style.display = 'none';
  };

  const getBadgeColor = (tool: AITool) => {
    if (tool.web3 && tool.blockchain) return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
    if (tool.openSource) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    if (tool.free) return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    return "bg-white/10 text-gray-300 border-white/10";
  };

  const getBadgeLabel = (tool: AITool) => {
    if (tool.web3) return "WEB3";
    if (tool.openSource) return "Open Source";
    if (tool.free) return "Free Tier";
    return "Paid";
  };

  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setShowOnlyFree(true);
    setShowOnlyOpenSource(false);
    setShowWeb3Tools(false);
    setSortBy('popular');
    setViewMode('grid');
  };

  const renderToolCard = (tool: AITool, index: number) => {
    const Icon = getCategoryIcon(tool.category);
    const colorClass = getCategoryColor(tool.category);
    const badgeColor = getBadgeColor(tool);
    const logoUrl = getLogoUrl(tool.website);
    const fallbackLogoUrl = getFaviconUrl(tool.website);

    return (
      <div
        key={tool.id}
        onClick={() => setSelectedTool(tool)}
        ref={el => {
          toolRefs.current[tool.id] = el;
        }}
        className={`group relative cursor-pointer transition-all duration-300 hover:scale-[1.02] ${viewMode === 'grid'
          ? 'p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10'
          : 'flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 hover:border-purple-500/30'
        } ${highlightId === tool.id ? 'ring-2 ring-cyan-400/60 ring-offset-2 ring-offset-black/40' : ''}`}
        style={{ animationDelay: `${400 + index * 50}ms` }}
      >
        {/* Blockchain/WEB3 Badge */}
        {tool.web3 && (
          <div className="absolute top-4 right-4 px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-200 border border-cyan-500/30">
            <span className="flex items-center gap-1">
              <Network className="w-3 h-3" />
              WEB3
            </span>
          </div>
        )}

        {viewMode === 'grid' ? (
          <>
            <div className="flex items-start gap-4 mb-4">
            <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
              <Icon className="w-7 h-7 text-white/80" />
              {logoUrl && (
                <img
                  src={logoUrl}
                  data-fallback={fallbackLogoUrl}
                  onError={handleLogoError}
                  alt={`${tool.name} logo`}
                  loading="lazy"
                  className="absolute inset-1 rounded-lg bg-white/90 object-contain p-1"
                />
              )}
            </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors mb-1 line-clamp-1">
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-500">{tool.category}</p>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-4 line-clamp-3">{tool.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${badgeColor}`}>
                  {getBadgeLabel(tool)}
                </div>
                {tool.privacy && (
                  <div className="px-2 py-1 rounded-lg text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    <Shield className="w-3 h-3 inline mr-1" />
                    Privacy
                  </div>
                )}
              </div>
              <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-cyan-300 transition-colors opacity-0 group-hover:opacity-100" />
            </div>
          </>
        ) : (
          <>
            <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
              <Icon className="w-6 h-6 text-white/80" />
              {logoUrl && (
                <img
                  src={logoUrl}
                  data-fallback={fallbackLogoUrl}
                  onError={handleLogoError}
                  alt={`${tool.name} logo`}
                  loading="lazy"
                  className="absolute inset-1 rounded-lg bg-white/90 object-contain p-1"
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors mb-1">
                {tool.name}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-1">{tool.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${badgeColor}`}>
                {getBadgeLabel(tool)}
              </div>

              {tool.privacy && (
                <div className="px-2 py-1 rounded-lg text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  <Shield className="w-3 h-3" />
                </div>
              )}

              <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-cyan-300 transition-colors" />
            </div>
          </>
        )}

        {/* Hover Glow Effect */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-5 transition-opacity blur-xl`} />
      </div>
    );
  };

  return (
    <section ref={sectionRef} id="tools" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Blockchain Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/10 via-black to-cyan-950/10" />
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Web3 Theme */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Your AI Arsenal
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {aiTools.length}+ Free AI Tools
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              For Real People
            </span>
          </h2>
          
          <p className="max-w-3xl mx-auto text-lg text-gray-300 mb-10">
            No more endless searching. Every tool here is free to start or open-source and actually useful.
            From trading to YouTube, research to automation we have you covered.
          </p>

          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowDirectory(!showDirectory)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-purple-500/30 text-white bg-white/5 hover:bg-white/10 transition-colors"
              aria-expanded={showDirectory}
            >
              {showDirectory ? 'Hide Enhanced Directory' : 'Show Enhanced Directory'}
              <ChevronDown className={`w-4 h-4 transition-transform ${showDirectory ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showDirectory && (
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 text-left">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-3">Enhanced AI Tools Directory</h3>
                <p className="text-gray-300 mb-4">
                  Enhanced AI Tools Directory now features 200 open-source & free tools across community-focused categories.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead>
                      <tr className="text-xs uppercase tracking-wide text-gray-500">
                        <th className="py-2 pr-4">Category</th>
                        <th className="py-2">Tools Included</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {featuredCategories.map(row => (
                        <tr key={row.category}>
                          <td className="py-2 pr-4 font-semibold text-white/90">{row.category}</td>
                          <td className="py-2 text-gray-400">{row.tools.join(", ")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">New Features Added</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    {featureHighlights.map(item => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-300 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">Real-World Focus</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    Every tool is selected for practical daily use, not hype.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-300">
                    {realWorldFocus.map(item => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-purple-300 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Advanced Search and Filters */}
        <div className={`mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-4 lg:p-5 shadow-lg shadow-purple-500/10">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col lg:flex-row gap-4 lg:items-start">
                {/* Enhanced Search Bar */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-300" />
                    <input
                      type="text"
                      placeholder="Search AI tools by name or what they do..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSelectedCategory('All');
                      }}
                      ref={toolsSearchInputRef}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all backdrop-blur-sm"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 hover:border-cyan-400/40 transition-all shadow-md shadow-cyan-500/15 backdrop-blur-sm text-lg font-semibold"
                        aria-label="Clear search"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {searchQuery && (
                    <div className="mt-3 rounded-2xl bg-gradient-to-br from-slate-950/95 via-black/95 to-slate-900/95 border border-white/15 ring-1 ring-cyan-500/20 shadow-[0_20px_60px_rgba(14,165,233,0.35)] backdrop-blur-xl max-h-80 overflow-y-auto animate-fade-in">
                      {suggestions.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-400">No tools found.</div>
                      ) : (
                        suggestions.map((tool) => (
                          <div
                            key={`suggest-${tool.id}`}
                            className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => focusToolCard(tool)}
                          >
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-white truncate">{tool.name}</div>
                              <div className="text-xs text-gray-400 truncate">{tool.category}</div>
                              <div className="flex gap-2 mt-1">
                                {tool.openSource && <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Open Source</span>}
                                {tool.free && <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-200 border border-purple-500/30">Free</span>}
                                {tool.web3 && <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-200 border border-cyan-500/30">Web3</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {tool.website && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); openToolSite(tool); }}
                                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/15 text-cyan-200 border border-cyan-500/30 hover:bg-cyan-500/25 transition-colors"
                                >
                                  Open
                                </button>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); focusToolCard(tool); }}
                                className="text-xs text-gray-300 px-2 py-1 rounded-lg bg-white/5 border border-white/10"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 self-start">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-xl transition-all border ${viewMode === 'grid' ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/30 text-white border-purple-400/40 shadow-md shadow-cyan-500/20' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border-white/10'}`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-xl transition-all border ${viewMode === 'list' ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/30 text-white border-purple-400/40 shadow-md shadow-cyan-500/20' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border-white/10'}`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Advanced Filters Row */}
            <div className="flex flex-col xl:flex-row gap-6 xl:items-start">
              {/* Quick Filters stacked */}
                <div className="flex flex-col gap-3 min-w-[180px]">
                  <button
                    onClick={() => setShowOnlyFree(!showOnlyFree)}
                    className={`w-full sm:w-auto text-left sm:text-center px-4 py-2 rounded-full text-sm font-medium transition-all border hover:-translate-y-0.5 ${showOnlyFree ? 'bg-gradient-to-r from-emerald-500/40 via-cyan-500/40 to-teal-500/40 text-white border-emerald-400/50 shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border-white/10'}`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="text-lg">🔌</span>
                      Free Only
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setShowOnlyOpenSource(!showOnlyOpenSource)}
                    className={`w-full sm:w-auto text-left sm:text-center px-4 py-2 rounded-full text-sm font-medium transition-all border hover:-translate-y-0.5 ${showOnlyOpenSource ? 'bg-gradient-to-r from-purple-500/40 via-indigo-500/40 to-blue-500/40 text-white border-purple-400/50 shadow-lg shadow-purple-500/20' : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border-white/10'}`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="text-lg">🧑‍💻</span>
                      Open Source
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setShowWeb3Tools(!showWeb3Tools)}
                    className={`w-full sm:w-auto text-left sm:text-center px-4 py-2 rounded-full text-sm font-medium transition-all border hover:-translate-y-0.5 ${showWeb3Tools ? 'bg-gradient-to-r from-cyan-500/40 via-sky-500/40 to-purple-500/40 text-white border-cyan-400/50 shadow-lg shadow-cyan-500/20' : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border-white/10'}`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="text-lg">⛓️</span>
                      Web3 & Blockchain
                    </span>
                  </button>
                </div>

                {/* Category Filter */}
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-2 sm:hidden">
                    {mobilePrimaryCategories.map(category => {
                      const isActive = selectedCategory === category;
                      return (
                        <button
                          key={`mobile-primary-${category}`}
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all border ${isActive
                            ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/30 text-white border-cyan-400/40 shadow-md shadow-cyan-500/20'
                            : 'bg-white/5 text-gray-200 hover:text-white hover:bg-white/10 border-white/10'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span>{categoryEmoji[category] || '\u2728'}</span>
                            {category}
                          </span>
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setShowMobileMoreCategories((open) => !open)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all border ${showMobileMoreCategories || mobileExtraCategories.includes(selectedCategory)
                        ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/30 text-white border-cyan-400/40 shadow-md shadow-cyan-500/20'
                        : 'bg-white/5 text-gray-200 hover:text-white hover:bg-white/10 border-white/10'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{'\u2795'}</span>
                        More
                      </span>
                    </button>
                  </div>

                  {showMobileMoreCategories && mobileExtraCategories.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:hidden">
                      {mobileExtraCategories.map(category => (
                        <button
                          key={`mobile-extra-${category}`}
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowMobileMoreCategories(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all border ${selectedCategory === category
                            ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/30 text-white border-cyan-400/40 shadow-md shadow-cyan-500/20'
                            : 'bg-white/5 text-gray-200 hover:text-white hover:bg-white/10 border-white/10'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span>{categoryEmoji[category] || '\u2728'}</span>
                            {category}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="hidden sm:flex sm:flex-wrap sm:gap-3 sm:flex-1">
                    {categories.slice(0, 9).map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full sm:w-auto text-left sm:text-center px-4 py-2 rounded-full text-sm font-medium transition-all border hover:-translate-y-0.5 ${selectedCategory === category ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/30 text-white border-cyan-400/40 shadow-md shadow-cyan-500/20' : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border-white/10 hover:border-cyan-500/30 hover:shadow-md hover:shadow-cyan-500/10'} focus:outline-none focus:ring-2 focus:ring-cyan-500/30`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{categoryEmoji[category] || '\u2728'}</span>
                          {category}
                        </span>
                      </button>
                    ))}

                    {/* More Categories Dropdown */}
                    {categories.length > 9 && (
                      <div className="relative">
                        <button
                          onClick={() => setIsFilterOpen(!isFilterOpen)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 border hover:-translate-y-0.5 ${isFilterOpen ? 'bg-purple-500/20 text-purple-200 border-purple-500/30' : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border-white/10'}`}
                        >
                          <span>➕</span>
                          More
                          <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFilterOpen && (
                          <div className="absolute bottom-full left-0 mb-2 w-64 p-3 rounded-xl bg-gradient-to-br from-black/90 via-slate-900/90 to-black/90 border border-white/15 backdrop-blur-xl z-50 shadow-2xl shadow-cyan-500/10 animate-fade-in max-h-48 overflow-y-auto origin-bottom">
                            <div className="space-y-1">
                              {categories.slice(9).map(category => (
                                <button
                                  key={category}
                                  onClick={() => {
                                    setSelectedCategory(category);
                                    setIsFilterOpen(false);
                                  }}
                                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all ${selectedCategory === category ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30' : 'text-gray-200 hover:bg-white/10 hover:text-white border border-transparent'} hover:-translate-y-0.5`}
                                >
                                  {React.createElement(getCategoryIcon(category), { className: "w-4 h-4" })}
                                  {category}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sort & Stats */}
                <div className="flex items-center gap-4 self-start">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 rounded-lg bg-gradient-to-r from-slate-900 via-black to-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 backdrop-blur-sm transition-all duration-200 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/15"
                    style={{ backgroundColor: '#0b0b10', color: '#e5e7eb' }}
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest First</option>
                    <option value="name">Name A-Z</option>
                  </select>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-sm text-gray-200">
                      {filteredTools.length} tools found
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Grid/List */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${categoryAnim ? 'category-swap' : ''}`}>
          {filteredTools.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/10 to-cyan-500/10 flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                <Search className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No tools match your filters</h3>
              <p className="text-gray-400">Try clearing filters or picking a different category.</p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 rounded-lg border border-purple-500/30 text-purple-200 hover:bg-purple-500/10 transition-colors"
              >
                Reset filters
              </button>
            </div>
          ) : showGrouped ? (
            <div className="space-y-10">
              {groupedTools.map(group => {
                const Icon = getCategoryIcon(group.category);
                const colorClass = getCategoryColor(group.category);
                const isExpanded = expandedCategories.has(group.category);
                const visibleGroupTools = isExpanded
                  ? group.tools
                  : group.tools.slice(0, categoryPageSize);

                return (
                  <div key={group.category}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{group.category}</h3>
                          <p className="text-sm text-gray-400">{group.tools.length} tools</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCategory(group.category)}
                        className="px-3 py-2 rounded-lg border border-purple-500/30 text-purple-200 hover:bg-purple-500/10 transition-colors"
                      >
                        View all
                      </button>
                    </div>

                    <div className={viewMode === 'grid'
                      ? 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
                      : 'space-y-4'
                    }>
                      {visibleGroupTools.map((tool, index) => renderToolCard(tool, index))}
                    </div>

                    {group.tools.length > categoryPageSize && (
                      <div className="mt-4 flex justify-center">
                        <button
                          onClick={() => toggleCategoryExpansion(group.category)}
                          className="px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {isExpanded ? 'Show less' : `Show more ${group.category}`}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
                : 'space-y-4'
              }>
                {visibleTools.map((tool, index) => renderToolCard(tool, index))}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                {filteredTools.length > visibleCount && (
                  <button
                    onClick={() => setVisibleCount(Math.min(visibleCount + pageSize, filteredTools.length))}
                    className="px-4 py-2 rounded-lg bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    Show more tools
                  </button>
                )}
                {visibleCount > pageSize && (
                  <button
                    onClick={() => setVisibleCount(pageSize)}
                    className="px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Show less
                  </button>
                )}
              </div>

              <div className="mt-3 text-center text-sm text-gray-400">
                Showing {Math.min(visibleCount, filteredTools.length)} of {filteredTools.length} tools
              </div>
            </>
          )}
        </div>

        {/* Web3 Revolution Stats */}
        <div className={`mt-12 p-8 rounded-2xl bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-indigo-500/10 border border-purple-500/20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-1">{aiTools.length}+</div>
              <div className="text-sm text-gray-300">Total Tools</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400 mb-1">
                {aiTools.filter(t => t.openSource).length}
              </div>
              <div className="text-sm text-gray-300">Open Source</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-300 mb-1">
                {aiTools.filter(t => t.web3).length}
              </div>
              <div className="text-sm text-gray-300">Web3 & Blockchain</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400 mb-1">
                {aiTools.filter(t => t.privacy).length}
              </div>
              <div className="text-sm text-gray-300">Privacy Focused</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {aiTools.filter(t => t.free).length}
              </div>
              <div className="text-sm text-gray-300">Free Tools</div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-300">
              <span className="text-purple-300 font-semibold">Join the movement:</span>{" "}
              No subscriptions, no tracking, just pure innovation powered by open technology.
            </p>
          </div>
        </div>
      </div>

      {/* Tool Detail Dialog with Blockchain Theme */}
      {selectedTool && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-black to-gray-900 border border-purple-500/30 mx-auto my-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${getCategoryColor(selectedTool.category)} flex items-center justify-center`}>
                    {React.createElement(getCategoryIcon(selectedTool.category), { className: "w-7 h-7 text-white/80" })}
                    {selectedTool.website && (
                      <img
                        src={getLogoUrl(selectedTool.website)}
                        data-fallback={getFaviconUrl(selectedTool.website)}
                        onError={handleLogoError}
                        alt={`${selectedTool.name} logo`}
                        loading="lazy"
                        className="absolute inset-1 rounded-lg bg-white/90 object-contain p-1"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedTool.name}</h3>
                    <p className="text-sm text-gray-400">{selectedTool.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTool(null)}
                  className="relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-600/60 via-cyan-500/50 to-amber-400/40 border border-white/15 text-white shadow-[0_0_25px_rgba(124,58,237,0.35)] hover:shadow-[0_0_35px_rgba(34,211,238,0.45)] hover:scale-105 transition-all duration-200 backdrop-blur"
                  aria-label="Close tool details"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/40 via-cyan-400/30 to-amber-300/25 blur-xl opacity-70 animate-pulse"
                  />
                  <span className="relative z-10 text-xl font-bold drop-shadow-lg">✕</span>
                </button>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-6">{selectedTool.description}</p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedTool.web3 && (
                  <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-200 border border-cyan-500/30 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Network className="w-4 h-4" />
                      Web3 & Blockchain
                    </span>
                  </div>
                )}
                {selectedTool.openSource && (
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Code className="w-4 h-4" />
                      Open Source
                    </span>
                  </div>
                )}
                {selectedTool.free && (
                  <div className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      Free Forever
                    </span>
                  </div>
                )}
                {selectedTool.privacy && (
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4" />
                      Privacy First
                    </span>
                  </div>
                )}
              </div>

              {/* Why This Tool? */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 mb-6">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-purple-300" />
                  Why This Tool Matters for Web3?
                </h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Decentralized & censorship-resistant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>No corporate control or data harvesting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Built for the open web revolution</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <a
                  href={selectedTool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Website
                </a>
                <button
                  onClick={() => copyToClipboard(selectedTool.website)}
                  className="px-4 py-3 rounded-xl border border-purple-500/30 text-purple-200 hover:bg-purple-500/10 transition-colors"
                >
                  {copiedUrl === selectedTool.website ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    'Copy URL'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
