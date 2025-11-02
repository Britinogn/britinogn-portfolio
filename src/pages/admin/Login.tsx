import { useState } from "react";
import { useNavigate } from "react-router-dom";
import  useAuth  from "../../hooks/useAuth";
import api from "../../services/api";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
        // Call your backend API
        const res = await api.post("/auth/login", { email, password });

        // Expecting backend response { token, user }
        const { token, user } = res;

        // Save to context + localStorage
        login(token, user);

        navigate("/dashboard");
        } catch (err: any) {
        setError(err.message || "Login failed. Please try again.");
        } finally {
        setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-2xl">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Admin Login
            </h2>

            {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
                </label>
                <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
                </label>
                <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
                {loading ? "Signing in..." : "Login"}
            </button>
            </form>
        </div>
        </div>
    );
}



export default  Login;