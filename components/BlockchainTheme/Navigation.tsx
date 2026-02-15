import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { aiTools } from '../../data/aiToolsWithWeb3'
import { rankToolsBySearch } from './searchUtils'

type NavItem = {
  label: string
  section: string
  highlight?: boolean
  filters?: {
    category?: string
    freeOnly?: boolean
    openSourceOnly?: boolean
    web3Only?: boolean
    searchQuery?: string
  }
}

export function Navigation({ currentSection, scrollToSection }: { currentSection: string; scrollToSection: (id: string) => void }) {
  const [navSearch, setNavSearch] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navSuggestions = useMemo(() => {
    const query = navSearch.trim()
    if (!query) return []
    const alphabetical = [...aiTools].sort((a, b) => a.name.localeCompare(b.name))
    return rankToolsBySearch(alphabetical, query).slice(0, 8)
  }, [navSearch])

  const navItems: NavItem[] = [
    { label: 'AI Revolution', section: 'hero', highlight: true },
    { label: 'AI Tools', section: 'tools', highlight: true, filters: { category: 'All', freeOnly: false, openSourceOnly: false } },
    { label: 'Manifesto', section: 'manifesto', highlight: true },
    { label: 'AI Learning Guide', section: 'guide', highlight: true },
    { label: 'Developer APIs', section: 'apis', highlight: true },
    { label: 'Open Source Models', section: 'opensource', highlight: true },
    { label: 'Resources & Community', section: 'community', highlight: true }
  ]

  const handleClick = (item: NavItem) => {
    if (item.filters && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ai-tools:filters', { detail: item.filters }))
    }
    scrollToSection(item.section)
    setMobileMenuOpen(false)
  }

  const handleSearchChange = (value: string) => {
    setNavSearch(value)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && navSuggestions.length > 0) {
      handleSuggestionClick(navSuggestions[0])
    }
  }

  const openToolSite = (toolId: number) => {
    const tool = aiTools.find(item => item.id === toolId)
    if (tool?.website) window.open(tool.website, '_blank', 'noopener,noreferrer')
  }

  const handleSuggestionClick = (tool: (typeof aiTools)[number]) => {
    handleSearchChange(tool.name)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ai-tools:jump', { detail: { toolId: tool.id, source: 'nav' } }))
    }
  }

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const badges = [
    { label: 'Privacy', icon: '\u{1F512}' },
    { label: 'Blockchain', icon: '\u26D3' },
    { label: 'No data stored', icon: '\u{1F5C4}' }
  ]
  const mobileTrustBadges = [
    { label: 'Privacy', icon: '\u{1F512}' },
    { label: 'No Data Store', icon: '\u{1F5C4}' },
    { label: 'No Ads', icon: '\u{1F6AB}' }
  ]

  const mobileMenu = mobileMenuOpen && typeof document !== 'undefined'
    ? createPortal(
        <div className="fixed inset-0 z-[100] md:hidden bg-black/98">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black" />
          <div className="relative h-dvh w-full px-5 pt-4 pb-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-lg shadow-purple-500/30">
                  <img src="/logo.jpg" alt="AI Shortcut Tools logo" className="w-full h-full object-cover" />
                </div>
                <div className="text-lg font-semibold text-white">AI Shortcut Tools</div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Close menu"
              >
                X
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 content-start">
              {navItems.map(item => (
                <button
                  key={`mobile-full-${item.section}-${item.label}`}
                  onClick={() => handleClick(item)}
                  className="w-full text-left text-base sm:text-lg font-semibold text-white px-3 py-3 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/20 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )
    : null

  return (
    <nav data-app-nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95vw] max-w-6xl">
      <div className="flex items-center gap-2 sm:gap-3 bg-black/70 backdrop-blur rounded-2xl px-3 sm:px-4 py-3 border border-white/10 shadow-lg shadow-purple-500/10">
        <div className="min-w-0 flex-1 flex items-center gap-2 sm:gap-3 pr-2 sm:pr-4 border-r border-white/10 md:flex-none">
          <div className="w-10 h-10 rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-lg shadow-purple-500/30">
            <img src="/logo.jpg" alt="AI Shortcut Tools logo" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="text-sm font-semibold text-white truncate">AI Shortcut Tools</div>
            <div className="sm:hidden mt-1 flex flex-wrap items-center gap-1 pr-1">
              {mobileTrustBadges.map(badge => (
                <span
                  key={`mobile-badge-${badge.label}`}
                  className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-1.5 py-0.5 text-[10px] text-cyan-100"
                >
                  <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/70 to-cyan-500/70 text-[8px] text-white">
                    {badge.icon}
                  </span>
                  <span>{badge.label}</span>
                </span>
              ))}
            </div>
            <div className="hidden sm:flex gap-1 text-[11px] text-gray-300">
              {badges.map(badge => (
                <span
                  key={badge.label}
                  className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-1 animate-pulse"
                >
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="hidden md:flex flex-wrap gap-2 px-1 flex-1">
          {navItems.map(item => {
            const isActive = item.highlight && currentSection === item.section
            return (
              <button
                key={`${item.section}-${item.label}`}
                onClick={() => handleClick(item)}
                className={`px-2.5 py-1.5 text-xs md:text-sm rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/30 text-white border border-purple-400/40 shadow-md shadow-cyan-500/20 scale-105'
                    : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
        <button
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="md:hidden ml-auto shrink-0 h-10 rounded-full bg-gradient-to-r from-white/15 to-white/5 border border-white/20 text-white flex items-center gap-2 pl-2.5 pr-3 shadow-md shadow-cyan-500/10 hover:from-white/20 hover:to-white/10 transition-all"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          <span className="-translate-x-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-100">Menu</span>
          <span className="flex h-4 w-5 flex-col justify-between" aria-hidden>
            <span className={`h-[2px] w-full rounded-full bg-cyan-50 transition-all duration-200 ${mobileMenuOpen ? 'translate-y-[6px] rotate-45' : ''}`} />
            <span className={`h-[2px] w-full rounded-full bg-cyan-50 transition-all duration-200 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`h-[2px] w-full rounded-full bg-cyan-50 transition-all duration-200 ${mobileMenuOpen ? '-translate-y-[6px] -rotate-45' : ''}`} />
          </span>
        </button>
        <div className="hidden md:flex items-center gap-2 min-w-[260px] max-w-[320px] pl-2">
          <span className="text-lg">🔍</span>
          <div className="relative flex-1">
            <input
              value={navSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search tools fast"
              className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.15)]"
            />
            {navSearch && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/15 hover:bg-white/20 transition-colors"
              >
                Clear
              </button>
            )}

            {navSearch && (
              <div className="absolute left-0 right-0 mt-3 rounded-2xl bg-gradient-to-br from-slate-950/95 via-black/95 to-slate-900/95 border border-white/15 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl max-h-80 overflow-y-auto z-50 animate-fade-in">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-[11px] font-bold text-white shadow-md shadow-purple-500/30">
                    AI
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">AI Shortcut Tools</div>
                    <div className="text-xs text-gray-400">Search results</div>
                  </div>
                </div>
                {navSuggestions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-400">No tools found.</div>
                ) : (
                  navSuggestions.map(tool => (
                    <div
                      key={`nav-suggest-${tool.id}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSuggestionClick(tool)}
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate">{tool.name}</div>
                        <div className="text-xs text-gray-400 truncate">{tool.category}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {tool.website && (
                          <button
                            onClick={(e) => { e.stopPropagation(); openToolSite(tool.id) }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/15 text-cyan-200 border border-cyan-500/30 hover:bg-cyan-500/25 transition-colors"
                          >
                            Open
                          </button>
                        )}
                        <button className="text-xs text-gray-300 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                          View
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile quick nav options (visible before opening hamburger menu) */}
      <div className="mt-2 md:hidden bg-black/70 backdrop-blur rounded-2xl px-3 py-2 border border-white/10 shadow-lg shadow-purple-500/10">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map(item => {
            const isActive = item.highlight && currentSection === item.section
            return (
              <button
                key={`mobile-quick-${item.section}-${item.label}`}
                onClick={() => handleClick(item)}
                className={`flex-shrink-0 whitespace-nowrap px-3 py-2 text-xs rounded-full border transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/35 to-cyan-600/35 text-white border-cyan-400/45'
                    : 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Mobile quick search bar */}
      <div className="mt-2 md:hidden bg-black/70 backdrop-blur rounded-2xl px-3 py-2 border border-white/10 shadow-lg shadow-purple-500/10 relative">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base leading-none">{'\u{1F50D}'}</span>
          <div className="relative">
            <input
              value={navSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search AI tools instantly"
              className="w-full pl-9 pr-16 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.15)]"
            />
            {navSearch && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/15 hover:bg-white/20 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {navSearch && (
          <div className="absolute left-0 right-0 mt-3 rounded-2xl bg-gradient-to-br from-slate-950/95 via-black/95 to-slate-900/95 border border-white/15 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl max-h-72 overflow-y-auto z-50 animate-fade-in">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-[11px] font-bold text-white shadow-md shadow-purple-500/30">
                AI
              </div>
              <div>
                <div className="text-sm font-semibold text-white">AI Shortcut Tools</div>
                <div className="text-xs text-gray-400">Search results</div>
              </div>
            </div>
            {navSuggestions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-400">No tools found.</div>
            ) : (
              navSuggestions.map(tool => (
                <div
                  key={`nav-mobile-${tool.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSuggestionClick(tool)}
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{tool.name}</div>
                    <div className="text-xs text-gray-400 truncate">{tool.category}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {tool.website && (
                      <button
                        onClick={(e) => { e.stopPropagation(); openToolSite(tool.id) }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/15 text-cyan-200 border border-cyan-500/30 hover:bg-cyan-500/25 transition-colors"
                      >
                        Open
                      </button>
                    )}
                    <button className="text-xs text-gray-300 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {mobileMenu}
    </nav>
  )
}


