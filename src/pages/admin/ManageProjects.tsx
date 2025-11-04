import { useState, useEffect } from "react"; // Added useEffect for logging
import { Project } from "../../types";
import useProjects from "../../hooks/useProjects";
import ProjectModal from "../../components/sections/ProjectForm";
import ProjectAPI from "../../services/projectAPI";
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  EyeIcon,
  CodeBracketIcon, // Added for GitHub distinction
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

function ManageProjects() {
  const { projects = [], loading, error, refetch } = useProjects();

  // Added logging to debug data fetching
  useEffect(() => {
    console.log('Current projects state:', { projects, loading, error });
    if (projects && projects.length > 0) {
      console.log('Projects data:', projects);
    }
  }, [projects, loading, error]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // ✅ Handle Add
  const handleAdd = () => {
    setSelectedProject({
      _id: "",
      title: "",
      description: "",
      techStack: '',
      githubUrl: "",
      liveURL: "",
      imageURL: { url: "", public_id: "" },
      category: "",
      yearBuilt: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsEdit(false);
    setShowModal(true);
  };

  // ✅ Handle Edit
  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsEdit(true);
    setShowModal(true);
  };

  // ✅ Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await ProjectAPI.deleteProject(id);
      await refetch();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete project");
    }
  };

  // ✅ When save or update succeeds
  const handleSuccess = async () => {
    setShowModal(false);
    setSelectedProject(null);
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

  return (
    <div className="p-6 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Projects</h1>
          <p className="text-gray-600 mt-1">Create, edit, and manage your portfolio projects</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 rotate-180" />
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      {!projects || projects.length === 0 ? (
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
          {projects.map((project: Project) => (
            <div 
              key={project._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Project Image */}
              {project.imageURL?.url ? 
              (
                <img 
                  src={project.imageURL.url} 
                  alt={project.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => console.error('Image load error for project:', project.title, e)} // Added error logging for images
                />
              ) : 
              (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}

              {/* Project Info */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                  {project.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {project.description}
                </p>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {project.category}
                </p>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {project.yearBuilt}
                </p>

                {/* Tech Stack */}
                {/* <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.slice(0, 3).map((tech, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{project.techStack.length - 3}
                    </span>
                  )}
                </div> */}

                <div className="flex flex-wrap gap-2 mb-4 ">
                  <p className="text-sm text-gray-500 mb-1">Tech Stack:</p>
                  <p className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {project.techStack.join(' • ')}
                  </p>
                </div>

                {/* Action Buttons (Fixed labels and icons for distinction) */}
                <div className="flex gap-2 flex-wrap"> {/* Added flex-wrap for better mobile handling */}
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm min-w-[80px]"
                    >
                      <CodeBracketIcon className="w-4 h-4" />
                      GitHub
                    </a>
                  )}

                  {project.liveURL && (
                    <a 
                      href={project.liveURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm min-w-[80px]"
                    >
                      <EyeIcon className="w-4 h-4" />
                      Live
                    </a>
                  )}
                  <button 
                    onClick={() => handleEdit(project)}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm min-w-[60px]"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(project._id)}
                    className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm min-w-[70px]"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create/Edit */}
      {showModal && selectedProject && (
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
              <ProjectModal
                project={selectedProject}
                isEdit={isEdit}
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageProjects;