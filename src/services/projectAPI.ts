// src/services/projectService.ts
import api from './api';
import { Project } from '../types';  // Your Project interface

// Response types (like your dashboard ones)
interface ProjectResponse {
    message: string;
    data: Project;
}

interface ProjectsResponse {
    message: string;
    data: Project[];  // For lists
}

interface DeleteResponse {
    message: string;
    data?: Project;  // Optional: Some backends return deleted item
}

// GET: All projects
async function getAllProjects(): Promise<Project[]> {
    const response: ProjectsResponse = await api.get('/projects');
    return response.data;
}

// GET: Single project by ID
async function getProjectById(id: string): Promise<Project> {
    const response: ProjectResponse = await api.get(`/projects/${id}`);
    return response.data;
}

// POST: Create project (with image upload via FormData)
async function createProject(formData: FormData): Promise<Project> {
    const response: ProjectResponse = await api.post('/projects', formData, {
        headers: {
        'Content-Type': 'multipart/form-data',  // For file upload
        },
    });
    return response.data;
}

// PUT: Update project (with optional image re-upload via FormData)
async function updateProject(id: string, formData: FormData): Promise<Project> {
    const response: ProjectResponse = await api.put(`/projects/${id}`, formData, {
        headers: {
        'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

// DELETE: Delete project
async function deleteProject(id: string): Promise<Project | undefined> {
    const response: DeleteResponse = await api.delete(`/projects/${id}`);
    return response.data;  // Optional return of deleted project
}

const projectAPI = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
};

export default projectAPI;