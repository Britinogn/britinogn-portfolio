import { useState, useEffect } from 'react';
import { Blog } from '../types';
import blogService from '../services/blogService';

function useBlogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBlogs() {
        try {
            setLoading(true);
            const data = await blogService.getAllBlogs();
            setBlogs(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch blogs');
            console.error(err);
        } finally {
            setLoading(false);
        }
        }

        fetchBlogs();
    }, []);

    return { blogs, loading, error };
}

export default useBlogs;