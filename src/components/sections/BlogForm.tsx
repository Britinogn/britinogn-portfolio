import { useState , useEffect } from "react";
import { Blog } from "../../types";
import blogAPI from "../../services/blogAPI";

interface FormBlog extends Omit<Blog, 'imageURL'>{
    imageURL: File | { url: string | null; public_id: string | null; } | null;
}

interface BlogModalProps{
    blog: Blog;
    onSuccess?: () => void;
    isEdit:boolean;
}

function BlogModal({blog, onSuccess , isEdit}: BlogModalProps){
    const [formData, setFormData] = useState<FormBlog>({
        ...blog,
        imageURL: null
    })

    const [loading , setLoading] = useState(false);

    useEffect(() => {
        setFormData({
            ...blog, 
            imageURL: null
        })
    }, [blog])

    const handleInput = (field: keyof FormBlog, value: string | number | undefined ) => {
        setFormData(prev =>  ({
            ...prev ,
            [field]: value,
        }))
    }

    const handleImage = (file: File | null) => {
        setFormData(prev => ({
            ...prev,
            imageURL: file
        }))
    }

    const validateForm = (): string | null => {
        if (!formData.title.trim()) return 'Title is required';
        return null;
    };

    const buildFormData = (): FormData => {
        const fd = new FormData();
        fd.append('title', formData.title);
        fd.append('description', formData.description);
        fd.append('platform', formData.platform);
        fd.append('url', formData.url);

        if (formData.imageURL instanceof File) {
            fd.append('imageURL', formData.imageURL);
        } // Else: No append—keeps existing image on update

        return fd;
    }



    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const error = validateForm();

        if (error) {
            alert(error)
            return
        }

        const fd  = buildFormData();
        setLoading(true);

        try {
            if(isEdit && blog._id){
                await blogAPI.updateBlog(blog._id, fd)
            } else {
                await blogAPI.createBlog(fd)
            }

            onSuccess?.()

        } catch (err) {
            console.error('Save failed:', err);
            alert('Something went wrong—check console.');
        } finally {
            setLoading(false);
        }

    }

    const isImageObject = (imageURL: File | { url: string | null; public_id: string | null; } | null): imageURL is { url: string | null; public_id: string | null; } => {
        return imageURL !== null && typeof imageURL === 'object' && 'public_id' in imageURL;
    };


    return (
        <div className="p-4 border rounded-xl">
            <h2 className="text-lg font-bold mb-3">
                {isEdit? "Edit Blog" : "Add Blog"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 bg-black/70">
                
                <div>
                    <label htmlFor="title" className="p-4 text-lg block font-medium ">Title</label>
                    
                    <input 
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={(e) => handleInput( 'title', e.target.value)}
                        className="w-full border rounded-2xl px-2 py-1"
                    />
                
                </div>

                <div>
                    <label htmlFor="description" className="p-4 text-lg block font-medium ">Description</label>
                    
                    <textarea 
                        name="description"
                        value={formData.description}
                        onChange={(e) => handleInput( 'description', e.target.value)}
                        className="w-full border rounded-2xl px-2 py-1"
                    />
                
                </div>


                <div>
                    <label htmlFor="platform" className="p-4 text-lg block font-medium ">Platform</label>
                    
                    <input 
                        type="text"
                        name="platform"
                        value={formData.platform}
                        onChange={(e) => handleInput( 'platform', e.target.value)}
                        className="w-full border rounded-2xl px-2 py-1"
                    />
                
                </div>

                <div>
                    <label htmlFor="url" className="p-4 text-lg block font-medium ">url</label>
                    
                    <input 
                        type="text"
                        name="url"
                        value={formData.url}
                        onChange={(e) => handleInput( 'url', e.target.value)}
                        className="w-full border rounded-2xl px-2 py-1"
                    />
                
                </div>

                <div>
                    <label htmlFor="imageURL" className="block text-sm font-medium mb-1">Project Image</label>
                    {isEdit && isImageObject(formData.imageURL) && formData.imageURL.url && (
                        <p className="text-sm text-gray-500 mb-1">Current: 
                            <a href={formData.imageURL.url} 
                                target="_blank" rel="noopener noreferrer" 
                                className="text-blue-500 underline">{formData.imageURL.url}
                            </a>
                        </p>
                    )}
                    <input
                        id="imageURL"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImage(e.target.files?.[0] || null)}
                        className="w-full border-dashed border-2 rounded px-2 py-1"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? ' Saving Blog...' : (isEdit ? "Update" : "Create")}
                </button>

            </form>


        </div>
    )

}


export default BlogModal;

