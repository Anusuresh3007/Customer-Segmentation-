import React from 'react';
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
  X,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { isMock, backendStatus } = useApp();

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 w-72 max-w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-base">
              Segment<span className="text-blue-600">Pulse</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode pill */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs">
          <span className="text-gray-500">Service Mode:</span>
          <span
            className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
              isMock ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
            }`}
          >
            {isMock ? 'Mock API' : backendStatus === 'connected' ? 'Live REST' : 'Offline'}
          </span>
        </div>

        {/* Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Profile */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=96&h=96"
              alt="Sarah Jenkins"
              className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Sarah Jenkins</p>
              <p className="text-xs text-gray-500 truncate">Lead Analytics Director</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
