import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import {
  Bars3Icon,
  GlobeAltIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface TopbarProps {
  onMenuClick: () => void;
}

function Topbar({ onMenuClick }: TopbarProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex justify-between items-center gap-2 md:gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
            {/* Mobile menu button */}
            <button 
              onClick={onMenuClick}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer flex-shrink-0"
              aria-label="Toggle menu"
            >
              <Bars3Icon className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Welcome Section */}
            <div className="flex-1 min-w-0">
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold bg-linear-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent truncate">
                Welcome back, {user?.name?.split(' ')[0] || 'Admin'}! 👋
              </h1>
              <p className="text-xs md:text-sm text-gray-600 hidden sm:block mt-0.5 truncate">
                Manage your portfolio content and analytics
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
            {/* Search Button - Hidden on mobile */}
            <button 
              className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              <span>Search...</span>
              <kbd className="px-2 py-0.5 text-xs bg-white rounded border border-gray-300">⌘K</kbd>
            </button>

            {/* Notifications */}
            <button 
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Notifications"
            >
              <BellIcon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Settings - Hidden on mobile */}
            <button 
              className="hidden md:block p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Settings"
            >
              <Cog6ToothIcon className="w-5 h-5" />
            </button>

            {/* View Site */}
            <Link 
              to="/" 
              className="flex items-center gap-1.5 px-2 sm:px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            >
              <GlobeAltIcon className="w-4 h-4" />
              <span className="hidden sm:inline">View Site</span>
            </Link>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-gray-200"></div>
            
            {/* User Profile */}
            <div className="flex items-center gap-2 md:gap-3 cursor-pointer">
              {/* User Info - Desktop */}
              <div className="text-right hidden lg:block">
                <p className="text-sm font-semibold text-gray-800 truncate max-w-[120px] xl:max-w-[150px]">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-[120px] xl:max-w-[150px]">
                  {user?.email || 'admin@example.com'}
                </p>
              </div>
              
              {/* Avatar */}
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.name} 
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover ring-2 ring-blue-500/20"
                />
              ) : (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-lg">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="flex items-center cursor-pointer gap-1.5 px-2 sm:px-3 md:px-4 py-2 text-xs md:text-sm font-medium bg-linear-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-sm hover:shadow-md"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;