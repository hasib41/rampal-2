import { useState, type FormEvent } from 'react';
import { Zap, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts';

export function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Small delay for UX
        setTimeout(() => {
            const success = login(password);
            if (!success) {
                setError('Invalid password');
                setPassword('');
            }
            setIsLoading(false);
        }, 300);
    };

    return (
        <div className="min-h-screen bg-secondary-dark flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
                        <Zap className="text-white" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">BIFPCL Admin</h1>
                    <p className="text-gray-400 mt-2">Enter password to continue</p>
                </div>

                {/* Login Form */}
                <div className="bg-secondary rounded-xl p-6 border border-gray-700">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label 
                                htmlFor="password" 
                                className="block text-sm font-medium text-gray-300 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="text-gray-500" size={18} />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter admin password"
                                    className="w-full pl-10 pr-4 py-3 bg-secondary-dark border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                    autoFocus
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-primary hover:bg-primary-light text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Verifying...' : 'Access Admin Panel'}
                        </button>
                    </form>
                </div>

                {/* Back Link */}
                <div className="text-center mt-6">
                    <a 
                        href="/" 
                        className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                        ← Back to Website
                    </a>
                </div>
            </div>
        </div>
    );
}
