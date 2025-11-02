import { useState, useEffect } from 'react';
import { Project } from '../types';
import projectService from '../services/projectService';

function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProjects() {
        try {
            setLoading(true);
            const data = await projectService.getAllProjects();
            setProjects(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch projects');
            console.error(err);
        } finally {
            setLoading(false);
        }
        }

        fetchProjects();
    }, []);

    return { projects, loading, error };
}

export default useProjects;