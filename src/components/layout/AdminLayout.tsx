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
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onMenuClick={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;