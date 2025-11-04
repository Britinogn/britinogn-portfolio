
import { useState, useEffect } from 'react';
import { Project } from '../types';
import projectAPI from '../services/projectAPI';

function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchProjects() {
        setLoading(true);
        try {
            const data = await projectAPI.getAllProjects();
            setProjects(data);
            setError(null);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to load projects');
            }
            console.error('Error fetching projects:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    async function refetch() {
        await fetchProjects();
    }

    return { projects, loading, error, refetch };
}

export default useProjects;