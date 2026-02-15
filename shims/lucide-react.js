import React from 'react'

const makeIcon = (name) => (props) =>
  React.createElement(
    'svg',
    { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', ...props },
    React.createElement('rect', { width: 24, height: 24, fill: 'none' }),
    React.createElement('text', { x: 2, y: 16, fill: 'currentColor', style: { fontSize: 8 } }, name)
  )

export const Search = makeIcon('Search')
export const ExternalLink = makeIcon('ExternalLink')
export const Filter = makeIcon('Filter')
export const Cpu = makeIcon('Cpu')
export const Check = makeIcon('Check')
export const X = makeIcon('X')
export const ChevronDown = makeIcon('ChevronDown')
export const Sparkles = makeIcon('Sparkles')
export const Star = makeIcon('Star')
export const ArrowUpRight = makeIcon('ArrowUpRight')
export const BookOpen = makeIcon('BookOpen')
export const Zap = makeIcon('Zap')
export const Shield = makeIcon('Shield')
export const Globe = makeIcon('Globe')
export const MessageSquare = makeIcon('MessageSquare')
export const Code = makeIcon('Code')
export const Eye = makeIcon('Eye')
export const TrendingUp = makeIcon('TrendingUp')
export const Video = makeIcon('Video')
export const FileSearch = makeIcon('FileSearch')
export const PenTool = makeIcon('PenTool')
export const Mail = makeIcon('Mail')
export const Lock = makeIcon('Lock')
export const Bot = makeIcon('Bot')
export const Bitcoin = makeIcon('Bitcoin')
export const Ethereum = makeIcon('Ethereum')
export const Coins = makeIcon('Coins')
export const Network = makeIcon('Network')
export const Key = makeIcon('Key')
export const Database = makeIcon('Database')
export const Cloud = makeIcon('Cloud')
export const Terminal = makeIcon('Terminal')
export const Server = makeIcon('Server')
export const ShieldCheck = makeIcon('ShieldCheck')
export const Wallet = makeIcon('Wallet')
export const Smartphone = makeIcon('Smartphone')
export const ArrowRight = makeIcon('ArrowRight')
export const Copy = makeIcon('Copy')
export const Book = makeIcon('Book')
export const Target = makeIcon('Target')
export const Users = makeIcon('Users')
export const CheckCircle = makeIcon('CheckCircle')
export const Clock = makeIcon('Clock')
export const Lightbulb = makeIcon('Lightbulb')
export const Rocket = makeIcon('Rocket')
export const ChevronRight = makeIcon('ChevronRight')
export const Play = makeIcon('Play')
export const FileText = makeIcon('FileText')
export const GraduationCap = makeIcon('GraduationCap')

const _default = {
  Search, ExternalLink, Filter, Cpu, Check, X, ChevronDown, Sparkles, Star, ArrowUpRight, BookOpen, Zap, Shield, Globe, MessageSquare, Code, Eye, TrendingUp, Video, FileSearch, PenTool, Mail, Lock, Bot, Bitcoin, Ethereum, Coins, Network, Key, Database, Cloud, Terminal, Server, ShieldCheck, Wallet, Smartphone, ArrowRight, Copy, Book, Target, Users, CheckCircle, Clock, Lightbulb, Rocket, ChevronRight, Play, FileText, GraduationCap
}

export default _default
