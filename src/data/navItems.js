import {
  LayoutDashboard,
  Network,
  Library,
  FolderOpen,
  Compass,
  ChartColumn,
  Settings,
} from 'lucide-react'

// One list drives both the sidebar links and the routes (no duplication).
export const navItems = [
  { path: '/', label: 'Overview', icon: LayoutDashboard, description: 'Your knowledge at a glance.' },
  { path: '/graph', label: 'Knowledge Graph', icon: Network, description: 'Explore how ideas connect.' },
  { path: '/library', label: 'Library', icon: Library, description: 'Browse and edit your concepts.' },
  { path: '/collections', label: 'Collections', icon: FolderOpen, description: 'Group concepts by theme.' },
  { path: '/explore', label: 'Explore', icon: Compass, description: 'Search and discover.' },
  { path: '/statistics', label: 'Statistics', icon: ChartColumn, description: 'Track your learning.' },
  { path: '/settings', label: 'Settings', icon: Settings, description: 'Export, import and preferences.' },
]