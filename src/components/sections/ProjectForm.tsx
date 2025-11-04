import { useState, useEffect } from "react";
import { Project } from '../../types';
import ProjectAPI from "../../services/projectAPI";

// New type for form (extends Project, flexible imageURL for upload/display)
interface FormProject extends Omit<Project, 'imageURL'> {
    imageURL: File | { url: string | null; public_id: string | null; } | null;
}

interface ProjectModalProps {
    project: Project;
    onSuccess?: () => void;
    isEdit?: boolean;
}

function ProjectModal({ project, onSuccess, isEdit }: ProjectModalProps) {
    const [formData, setFormData] = useState<FormProject>({
        ...project,
        imageURL: null,  // Reset to allow new file or keep existing
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFormData({
        ...project,
        imageURL: null,  // Reset—user can re-select
        });
    }, [project]);

    const handleInputChange = (field: keyof FormProject, value: string | number | undefined) => {
        setFormData(prev => ({
        ...prev,
        [field]: value,
        }));
    };

    const handleTechChange = (selected: string) => {
        setFormData(prev => ({
        ...prev,
        techStack: selected,
        }));
    };

    const handleImageChange = (file: File | null) => {
        setFormData(prev => ({
        ...prev,
        imageURL: file,
        }));
    };

    const validateForm = (): string | null => {
        if (!formData.title.trim()) return 'Title is required';
        return null;
    };

    const buildFormData = (): FormData => {
        const fd = new FormData();
        fd.append('title', formData.title);
        fd.append('description', formData.description);
        fd.append('techStack', formData.techStack);
        fd.append('githubUrl', formData.githubUrl);
        fd.append('liveURL', formData.liveURL);
        if (formData.category) fd.append('category', formData.category);
        if (formData.yearBuilt !== undefined) fd.append('yearBuilt', formData.yearBuilt.toString());
        
        // Handle image: Append File if new, skip if existing object (backend retains old)
        if (formData.imageURL instanceof File) {
            fd.append('imageURL', formData.imageURL);
        } // Else: No append—keeps existing image on update
        
        return fd;
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const error = validateForm();
        if (error) {
            alert(error);
            return;
        }

        const fd = buildFormData();
        setLoading(true);
        try {
            if (isEdit && project?._id) {
                await ProjectAPI.updateProject(project._id, fd);  // Pass FormData, not formData
            } else {
                await ProjectAPI.createProject(fd);  // Pass FormData, not formData
            }

            onSuccess?.();
            console.log('Project saved!');

        } catch (err) {
            console.error('Save failed:', err);
            alert('Something went wrong—check console.');
        } finally {
            setLoading(false);
        }
    }
    // Type guard: Narrow to backend image object
    const isImageObject = (imageURL: File | { url: string | null; public_id: string | null; } | null): imageURL is { url: string | null; public_id: string | null; } => {
        return imageURL !== null && typeof imageURL === 'object' && 'public_id' in imageURL;
    };

    return (
        <div className="p-4 border rounded">
            <h2 className="text-lg font-bold mb-3">
                {isEdit ? "Edit Project" : "Add Project"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full border rounded px-2 py-1"
                />
                </div>

                <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full border rounded px-2 py-1"
                />
                </div>

                <div>
                    <label htmlFor="techStack" className="block text-sm font-medium mb-1">Tech Stack</label>
                    <input
                        id="techStack"
                        type="text"
                        value={formData.techStack.join(', ')} // Assumes formData.techStack is string[]; join for display
                        onChange={(e) => {
                        const newTechs = e.target.value.split(',').map(tech => tech.trim()).filter(Boolean);
                        handleTechChange(newTechs); // Pass array to your handler
                        }}
                        placeholder="e.g., React, Node.js, TypeScript"
                        className="w-full border rounded px-2 py-1 h-20 resize-none" // Added resize-none to prevent vertical resize
                    />
                </div>

                <div>
                <label htmlFor="githubUrl" className="block text-sm font-medium mb-1">GitHub URL</label>
                <input
                    id="githubUrl"
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                    className="w-full border rounded px-2 py-1"
                />
                </div>

                <div>
                <label htmlFor="liveURL" className="block text-sm font-medium mb-1">Live URL</label>
                <input
                    id="liveURL"
                    type="url"
                    name="liveURL"
                    value={formData.liveURL}
                    onChange={(e) => handleInputChange('liveURL', e.target.value)}
                    className="w-full border rounded px-2 py-1"
                />
                </div>

                <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                <input
                    id="category"
                    type="text"
                    name="category"
                    value={formData.category || ''}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full border rounded px-2 py-1"
                />
                </div>

                <div>
                <label htmlFor="yearBuilt" className="block text-sm font-medium mb-1">Year Built</label>
                <input
                    id="yearBuilt"
                    type="number"
                    name="yearBuilt"
                    value={formData.yearBuilt ?? ''}  // ?? for undefined → ''
                    onChange={(e) => handleInputChange('yearBuilt', Number(e.target.value) || undefined)}
                    className="w-full border rounded px-2 py-1"
                />
                </div>

                <div>
                    <label htmlFor="imageURL" className="block text-sm font-medium mb-1">Project Image</label>
                    {isEdit && isImageObject(formData.imageURL) && formData.imageURL.url && (
                        <p className="text-sm text-gray-500 mb-1">Current: <a href={formData.imageURL.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{formData.imageURL.url}</a></p>
                    )}
                    <input
                        id="imageURL"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                        className="w-full border-dashed border-2 rounded px-2 py-1"
                    />
                </div>

                <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                {loading ? 'Saving...' : (isEdit ? "Update" : "Create")}
                </button>
            </form>
        </div>
    );
}

export default ProjectModal;