import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Users, Plus } from 'lucide-react';

interface AuthProps {
    initialMode?: 'signup' | 'login';
    onBack?: () => void;
}

const AVATARS = ['🧙‍♂️', '🧝‍♀️', '🧛‍♂️', '🧟‍♀️', '⚔️', '🐉', '🦄', '🧚‍♀️', '🧞‍♂️'];

const Auth: React.FC<AuthProps> = ({ initialMode = 'signup', onBack }) => {
    const { signIn, signInWithAvatar } = useUser();
    const [mode, setMode] = useState<'signup' | 'login'>(initialMode);
    const [chosenAvatar, setChosenAvatar] = useState<string | null>(AVATARS[0]);

    const handleSubmit = async () => {
        if (mode === 'signup') {
            if (chosenAvatar) await signInWithAvatar(chosenAvatar);
            else await signIn();
        } else {
            await signIn();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                <div className="p-10 bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex flex-col justify-center">
                    <h2 className="text-4xl font-bold mb-4">Welcome to HABITŌRA</h2>
                    <p className="opacity-90">Create an account, choose an avatar, and start turning your days into adventures.</p>

                    <div className="mt-8">
                        <button onClick={() => setMode('signup')} className={`mr-2 px-4 py-2 rounded-lg font-semibold ${mode === 'signup' ? 'bg-white text-purple-600' : 'bg-white/20 text-white'}`}>
                            Sign up
                        </button>
                        <button onClick={() => setMode('login')} className={`px-4 py-2 rounded-lg font-semibold ${mode === 'login' ? 'bg-white text-purple-600' : 'bg-white/20 text-white'}`}>
                            Log in
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold">{mode === 'signup' ? 'Create your hero' : 'Welcome back'}</h3>
                        <div className="flex items-center gap-2 text-gray-500">
                            <Users className="w-5 h-5" />
                            <span className="text-sm">Easy sign-in with Google</span>
                        </div>
                    </div>

                    {mode === 'signup' && (
                        <div>
                            <p className="text-sm text-gray-600 mb-4">Pick an avatar — this will represent you in the world.</p>
                            <div className="grid grid-cols-6 gap-3 mb-6">
                                {AVATARS.map((a) => (
                                    <button
                                        key={a}
                                        onClick={() => setChosenAvatar(a)}
                                        className={`p-3 rounded-lg text-2xl border ${chosenAvatar === a ? 'border-purple-600 bg-purple-50' : 'border-gray-200'}`}
                                        aria-label={`Choose avatar ${a}`}
                                    >
                                        {a}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={handleSubmit} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow">
                            <Plus className="w-4 h-4" />
                            {mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
                        </button>
                        <button onClick={onBack} className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700">Back</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
