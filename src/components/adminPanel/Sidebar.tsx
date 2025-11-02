import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import {
  //HomeIcon,
  RocketLaunchIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  XMarkIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: ChartBarIcon },
  { name: 'Projects', path: '/dashboard/projects', icon: RocketLaunchIcon },
  { name: 'Blogs', path: '/dashboard/blogs', icon: DocumentTextIcon },
  { name: 'Messages', path: '/dashboard/contact', icon: EnvelopeIcon },
];

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white 
          min-h-screen shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Cog6ToothIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                <p className="text-xs text-gray-400">Portfolio Manager</p>
              </div>
            </div>
            
            {/* Close button for mobile */}
            <button 
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <UserCircleIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white">{user?.name} </p>
              <p className="text-xs text-gray-400"> {user?.email}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 px-4 py-3 rounded-xl
                  font-medium transition-all duration-200
                  ${active 
                    ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50' 
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }
                `}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-gray-400'}`} />
                <span>{item.name}</span>
                
                {active && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700/50">
          <div className="bg-gray-700/50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-2">Need help?</p>
            <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
              View Documentation →
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;