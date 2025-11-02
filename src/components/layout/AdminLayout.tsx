import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../adminPanel/Sidebar';
import Topbar from '../adminPanel/Topbar';

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <Topbar onMenuClick={toggleSidebar} />
        
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;