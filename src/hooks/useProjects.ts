import { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';
import projectService from '../services/projectAPI';

function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Extract fetchProjects to make it reusable
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

    useEffect(() => {
        fetchProjects();
    }, []);

    const refetch = useCallback(() => fetchProjects(), []);

    return { projects, loading, error, refetch };
}

export default useProjects;