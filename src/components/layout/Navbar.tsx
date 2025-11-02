import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function Navbar() {
    const { isAuthenticated, logout, user } = useAuth();

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">
                    Portfolio
                </Link>

                <div className="flex gap-6">
                <Link to="/" className="hover:text-gray-300">
                    Home
                </Link>
                <Link to="/projects" className="hover:text-gray-300">
                    Projects
                </Link>
                <Link to="/blogs" className="hover:text-gray-300">
                    Blogs
                </Link>
                <Link to="/github" className="hover:text-gray-300">
                    Github
                </Link>
                <Link to="/contact" className="hover:text-gray-300">
                    Contact
                </Link>
                
                {isAuthenticated ? (
                    <>
                    <Link to="/admin/dashboard" className="hover:text-gray-300">
                        Dashboard
                    </Link>
                    <button onClick={logout} className="hover:text-gray-300">
                        Logout
                    </button>
                    <span className="text-gray-400">Hello, {user?.name}</span>
                    </>
                ) : (
                    <Link to="/login" className="hover:text-gray-300">
                    Login
                    </Link>
                )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;