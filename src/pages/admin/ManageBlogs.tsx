import { useEffect, useState } from "react";
import { Blog } from "../../types";
import useBlogs from "../../hooks/useBlogs";
import BlogModal from "../../components/sections/BlogForm";
import BlogAPI from "../../services/blogAPI";

import { 
    PencilIcon, 
    //TrashIcon, 
    PlusIcon,
    //EyeIcon,
    CodeBracketIcon, // Added for GitHub distinction
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';

function ManageBlogs() {
    const {blogs = [], loading, error , refetch} = useBlogs();

    useEffect(() => {
        console.log('Current blog state:', {blogs , loading , error});
        if (blogs && blogs.length > 0) {
            console.log('Projects data:', blogs);
        }
    }, [blogs, loading, error]);

    // useEffect(() => {
    //     ManageBlogs()
    // }, [blogs, loading, error]);

    const [selectedBlog , setSelectedBlog] = useState<Blog | null> (null);
    const [showModal , setShowModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false);

    const handleAdd = () =>{
        setSelectedBlog({
            _id: '',
            title: '',
            description: '',
            url: '',
            platform: '',
            imageURL: {
                url: '',
                public_id: '',
            },
            published:   true,
            publishedAt: new Date(),
            createdAt:  new Date().toISOString(),
            updatedAt:  new Date().toISOString(),
        });

        setIsEdit(false);
        setShowModal(true)
    }

    const handleEdit = (blog: Blog) => {
        setSelectedBlog(blog);
        setIsEdit(true);
        setShowModal(true);
    }


    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this blog?")) return;
        try {
            await BlogAPI.deleteBlog(id);
            await refetch();
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete blog");
        }
    };


     // ✅ When save or update succeeds
    const handleSuccess = async () => {
        setShowModal(false);
        setSelectedBlog(null);
        await refetch();
    };

  // Loading State (Fixed invalid Tailwind class: bg-linear-to-br → bg-gradient-to-br)
    if (loading) {
        return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
            {/* Added retry button for convenience */}
            <button 
                onClick={refetch}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Retry
            </button>
            </div>
        </div>
        );
    }

    return(
        <div className="p-8">

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Projects</h1>
                    <p className="text-gray-600 mt-1">Create, edit, and manage your portfolio projects</p>
                </div>
                <button 
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                    <PlusIcon className="w-5 h-5 rotate-180" />
                    Add Blog
                </button>
            </div>
        
            {/* blog grids */}

            {!blogs || blogs.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg mb-4">No projects yet</p>
                    <button 
                        onClick={handleAdd}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Create Your First Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog: Blog) => (
                    
                        <div
                            key={blog._id}
                            className="bg-black/35 rounded-2xl shadow-md overflow-hidden hover:shadow-3xl transition-shadow"
                        >
                            {blog.imageURL?.url ? (
                                <img 
                                    src={blog.imageURL.url}
                                    alt={blog.title}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => console.error('Image load error for blog:', blog.title, e)} // Added error logging for im
                                />
                            ) : (
                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400">No Image</span>
                                </div>
                            )}

                            {/* blog info */}

                            <div>
                                <h3>
                                    {blog.title}
                                </h3>
                            
                                <p>
                                    {blog.description}
                                </p>

                                <p>
                                    {blog.platform}
                                </p>
                            
                                {/* <p>
                                    {blog.url}
                                </p> */}

                                <div>
                                    {blog.url && (
                                        <a 
                                        href={blog.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm min-w-[80px]"
                                        >
                                        <CodeBracketIcon className="w-4 h-4" />
                                        Platform
                                        </a>
                                    )}


                                    <button

                                        onClick={() => handleEdit(blog)}
                                        className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm min-w-[60px]"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                        Edit

                                    </button>


                                    <button

                                        onClick={() => handleDelete(blog._id)}
                                        className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-red-700 rounded-lg hover:bg-blue-100 transition-colors text-sm min-w-[60px]"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                        Edit

                                    </button>
                                </div>
                            
                            </div>
                        
                        </div>
                    ))}
                </div>
            )}

        
            {/* Modal for Create/Edit */}
        
            {showModal && selectedBlog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">
                        {isEdit ? "Edit Project" : "Add New Project"}
                    </h2>
                    <button 
                        onClick={() => setShowModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                    </div>
                    <div className="p-6">
                    <BlogModal
                        blog={selectedBlog}
                        isEdit={isEdit}
                        onSuccess={handleSuccess}
                    />
                    </div>
                </div>
                </div>
            )}     
        </div>
    )
}

export default ManageBlogs;