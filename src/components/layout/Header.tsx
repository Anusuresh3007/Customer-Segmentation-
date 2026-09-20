import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  Database,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { datasets, selectedDataset, setSelectedDataset, activities } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDatasetMenu, setShowDatasetMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Derive page title and breadcrumb from location path
  const getPageInfo = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return { title: 'Dashboard', breadcrumbs: ['Analytics', 'Overview'] };
      case '/customers':
        return { title: 'Customer Data', breadcrumbs: ['Management', 'Customers'] };
      case '/upload':
        return { title: 'Upload Dataset', breadcrumbs: ['Ingestion', 'Upload CSV'] };
      case '/segmentation':
        return { title: 'Segmentation', breadcrumbs: ['Algorithms', 'Run Segmentation'] };
      case '/explorer':
        return { title: 'Customer Explorer', breadcrumbs: ['Exploration', 'Cohort Search'] };
      case '/clusters':
        return { title: 'Cluster Details', breadcrumbs: ['Analysis', 'Clusters'] };
      case '/reports':
        return { title: 'Reports / Analytics', breadcrumbs: ['Intelligence', 'Reports'] };
      case '/settings':
        return { title: 'Settings', breadcrumbs: ['Configuration', 'General'] };
      default:
        return { title: 'Analytics', breadcrumbs: ['Dashboard'] };
    }
  };

  const { title, breadcrumbs } = getPageInfo();

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explorer?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger + Breadcrumb & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileNav}
          className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 mb-0.5">
            <span>SegmentPulse</span>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <span>/</span>
                <span className={idx === breadcrumbs.length - 1 ? 'text-gray-600 font-medium' : ''}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Middle: Global Search */}
      <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
        <form onSubmit={handleGlobalSearch} className="w-full relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers or cohorts..."
            className="w-full text-xs rounded-lg border border-gray-200 bg-gray-50/70 pl-9 pr-3 py-2 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </form>
      </div>

      {/* Right: Actions, Active Dataset pill, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Active Dataset Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDatasetMenu(!showDatasetMenu)}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-medium text-gray-700 transition-colors shadow-xs"
            title="Active Dataset"
          >
            <Database className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate max-w-[130px]">
              {selectedDataset ? selectedDataset.name : 'Select Dataset'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          </button>

          {showDatasetMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDatasetMenu(false)}
              />
              <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-dropdown border border-gray-200 py-1 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">Switch Dataset</span>
                  <button
                    onClick={() => {
                      setShowDatasetMenu(false);
                      navigate('/upload');
                    }}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    + New <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <div className="max-h-56 overflow-y-auto py-1">
                  {datasets.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        setSelectedDataset(d);
                        setShowDatasetMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors ${
                        selectedDataset?.id === d.id ? 'bg-blue-50/60 font-semibold text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <div className="truncate">
                        <p className="truncate">{d.name}</p>
                        <p className="text-[10px] text-gray-400 font-normal">
                          {d.rowCount.toLocaleString()} rows • {(d.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                      {selectedDataset?.id === d.id && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative transition-colors"
            aria-label="View activity alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-dropdown border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-gray-900">Recent Activity</span>
                  </div>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-1.5 py-0.5 rounded-full">
                    {activities.length} new
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  {activities.slice(0, 5).map((act) => (
                    <div key={act.id} className="p-3 hover:bg-gray-50/70 transition-colors">
                      <p className="text-xs font-medium text-gray-900">{act.action}</p>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">{act.detail}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{act.timeAgo}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Avatar Menu */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=96&h=96"
            alt="Sarah Jenkins"
            className="w-8 h-8 rounded-full object-cover border border-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            onClick={() => navigate('/settings')}
            title="User Profile & Settings"
          />
        </div>
      </div>
    </header>
  );
};
