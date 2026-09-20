import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UploadCloud,
  PieChart,
  Compass,
  Layers,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Server
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
}) => {
  const { isMock, backendStatus } = useApp();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isSidebarCollapsed = onToggleCollapse ? collapsed : internalCollapsed;
  const toggle = onToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/customers', label: 'Customer Data', icon: Users },
    { to: '/upload', label: 'Upload Dataset', icon: UploadCloud },
    { to: '/segmentation', label: 'Segmentation', icon: PieChart },
    { to: '/explorer', label: 'Customer Explorer', icon: Compass },
    { to: '/clusters', label: 'Cluster Details', icon: Layers },
    { to: '/reports', label: 'Reports / Analytics', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-[#E5E7EB] transition-all duration-300 ease-in-out select-none relative z-20 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-base leading-tight tracking-tight">
                Segment<span className="text-blue-600">Pulse</span>
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">
                Analytics Engine
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mode / Backend Banner */}
      {!isSidebarCollapsed && (
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center justify-between px-2.5 py-1.5 bg-gray-50 border border-gray-200/80 rounded-lg text-xs">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Server className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-[11px] font-medium">Mode:</span>
            </div>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                isMock
                  ? 'bg-amber-100 text-amber-800'
                  : backendStatus === 'connected'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {isMock ? 'Mock API' : backendStatus === 'connected' ? 'Live REST' : 'Offline'}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group relative ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`
              }
              title={isSidebarCollapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-600 rounded-r-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile Section at bottom */}
      <div className="p-3 border-t border-[#E5E7EB] bg-gray-50/60">
        <div className={`flex items-center gap-3 p-2 rounded-lg ${isSidebarCollapsed ? 'justify-center' : ''}`}>
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=96&h=96"
            alt="Sarah Jenkins"
            className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
          />
          {!isSidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">Sarah Jenkins</p>
              <p className="text-[11px] text-gray-500 truncate">Lead Analytics Director</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={toggle}
        className="absolute -right-3.5 top-20 bg-white border border-gray-200 text-gray-500 hover:text-gray-800 rounded-full p-1 shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </aside>
  );
};
