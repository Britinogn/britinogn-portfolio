import { useEffect, useState } from 'react';
import { 
  RocketLaunchIcon, 
  DocumentTextIcon, 
  EnvelopeIcon, 
  BoltIcon,
  CodeBracketIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import dashboardService from '../../services/dashboardService';
import { DashboardData,  Contact, GithubStats } from '../../types';
//import useAuth from '../../hooks/useAuth';

function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [githubStats, setGithubStats] = useState<GithubStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  //const { user } = useAuth();

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        
        // Fetch dashboard data
        const dashboardData = await dashboardService.getDashboardData();
        setData(dashboardData);
        
        // Fetch GitHub stats separately
        try {
          const stats = await dashboardService.getGithubStats();
          console.log('GitHub stats raw response:', stats);
          if (stats) {
            setGithubStats(stats);
            console.log('GitHub stats set successfully:', stats);
          } else {
            console.warn('GitHub stats returned undefined/null');
          }
        } catch (githubError) {
          console.error('Failed to fetch GitHub stats:', githubError);
          // Continue without GitHub stats - dashboard still works
        }
        
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white border-l-4 border-red-500 p-6 rounded-xl shadow-2xl max-w-md">
          <div className="flex items-start">
            <ExclamationCircleIcon className="h-6 w-6 text-red-500 mr-3 shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Something went wrong</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header with linear */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-800 to-gray-900 text-white rounded-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl  font-bold mb-2 drop-shadow-lg">Welcome Back {} !</h1>
              <p className="text-xl  text-blue-100">Here's what's happening with your portfolio today</p>
            </div>
            <div className=" lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-center">
                  <p className="text-3xl font-bold mb-1">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  <p className="text-sm text-blue-100">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-12">
        {/* Stats Cards with Modern Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={RocketLaunchIcon}
            title="Projects"
            value={stats?.totalProjects || 0}
            subtitle={`${stats?.publishedProjects || 0} published`}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={DocumentTextIcon}
            title="Blog Posts"
            value={stats?.totalBlogs || 0}
            subtitle={`${stats?.publishedBlogs || 0} published`}
            gradient="from-purple-500 to-pink-500"
          />
          <StatCard
            icon={EnvelopeIcon}
            title="Messages"
            value={stats?.totalContacts || 0}
            subtitle={`${stats?.unreadContacts || 0} unread`}
            gradient="from-orange-500 to-red-500"
          />
          <StatCard
            icon={BoltIcon}
            title="Skills"
            value={stats?.totalSkills || 0}
            subtitle="Total expertise"
            gradient="from-green-500 to-emerald-500"
          />
        </div>

        {/* GitHub Stats - Premium Card */}
        {githubStats && (
          <div className="relative group mb-8">
            <div className="absolute -inset-1 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8 rounded-2xl shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-64 h-64 bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-64 h-64 bg-linear-to-tr from-pink-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl mr-3">
                      <CodeBracketIcon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">GitHub Activity</h3>
                      <p className="text-sm text-gray-300">@{githubStats.username}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <GitHubStat label="Repositories" value={githubStats.totalRepos || 0} icon="📦" />
                  <GitHubStat label="Stars" value={githubStats.totalStars || 0} icon="⭐" />
                  <GitHubStat label="Forks" value={githubStats.totalForks || 0} icon="🔱" />
                  <GitHubStat label="Followers" value={githubStats.followers || 0} icon="👥" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ActivityList
            title="Recent Projects"
            items={data?.projects || []}
            icon={RocketLaunchIcon}
            emptyMessage="No projects yet"
            color="blue"
          />
          <ActivityList
            title="Recent Blogs"
            items={data?.blogs || []}
            icon={DocumentTextIcon}
            emptyMessage="No blogs yet"
            color="purple"
          />
        </div>

        {/* Contact Messages - Premium Design */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Contact Messages</h3>
                  <p className="text-sm text-gray-600">Recent inquiries and feedback</p>
                </div>
              </div>
              {stats?.unreadContacts > 0 && (
                <span className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-semibold animate-pulse">
                  {stats?.unreadContacts} New
                </span>
              )}
            </div>
          </div>
          {data?.contacts && data.contacts.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {data.contacts.map((contact: Contact) => (
                <ContactItem key={contact.id} contact={contact} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <EnvelopeIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-1">No messages yet</p>
              <p className="text-sm text-gray-500">Check back later for new inquiries</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
}

// Enhanced Stat Card Component
interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: number;
  subtitle: string;
  gradient: string;
}

function StatCard({ icon: Icon, title, value, subtitle, gradient }: StatCardProps) {
  return (
    <div className="group relative">
      <div className={`absolute -inset-0.5 bg-linear-to-r ${gradient} opacity-0 group-hover:opacity-100 rounded-2xl blur transition duration-300`}></div>
      <div className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-linear-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-4xl font-bold text-gray-900 mb-2">{value.toLocaleString()}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

// GitHub Stat Component
interface GitHubStatProps {
  label: string;
  value: number;
  icon: string;
}

function GitHubStat({ label, value, icon }: GitHubStatProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all duration-300 border border-white/10">
      <div className="text-center">
        <p className="text-4xl mb-1">{icon}</p>
        <p className="text-3xl font-bold mb-1">{value.toLocaleString()}</p>
        <p className="text-sm text-gray-300">{label}</p>
      </div>
    </div>
  );
}

// Activity List Component
interface ActivityItem {
  id: string;
  title: string;
  createdAt: string;
}

interface ActivityListProps {
  title: string;
  items: ActivityItem[];
  icon: React.ComponentType<{ className?: string }>;
  emptyMessage: string;
  color: string;
}

function ActivityList({ title, items, icon: Icon, emptyMessage, color }: ActivityListProps) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500'
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className={`bg-linear-to-r ${colorClasses[color]} p-6`}>
        <div className="flex items-center text-white">
          <Icon className="h-6 w-6 mr-3" />
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
      </div>
      {items.length > 0 ? (
        <div className="p-4 space-y-2">
          {items.map((item) => (
            <div key={item.id} className="group p-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200 border border-transparent hover:border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{item.title}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                  New
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Icon className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}

// Contact Item Component
interface ContactItemProps {
  contact: Contact;
}

function ContactItem({ contact }: ContactItemProps) {
  const isUnread = !contact.isRead;

  return (
    <div 
      className={`p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200 ${
        isUnread ? 'bg-blue-50/50' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
          isUnread ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gray-400'
        }`}>
          {contact.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-base font-semibold text-gray-900">{contact.name}</p>
              <p className="text-sm text-gray-500">{contact.email}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {new Date(contact.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              {isUnread && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-500 text-white animate-pulse">
                  NEW
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">{contact.message}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;