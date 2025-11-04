import { useState, useEffect } from 'react';
import { Blog } from '../types';
import BlogAPI from '../services/blogAPI';

function useBlogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    async function fetchBlogs() {
        try {
            setLoading(true);
            const data = await BlogAPI.getAllBlogs();
            setBlogs(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch blogs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchBlogs();
    }, []);

    async function refetch() {
        await fetchBlogs();
    }

    return { blogs, loading, error,  refetch};
}

export default useBlogs;