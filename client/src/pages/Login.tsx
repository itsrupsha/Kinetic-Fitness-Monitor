import { AtSign, Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import { Toaster } from "react-hot-toast"

const Login = () => {
    const [state, setState] = useState('login')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const navigate = useNavigate()
    const { login, signup, user } = useAppContext()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true);
        if (state === "login") {
            await login({ email, password })
        } else {
            await signup({ username, email, password })
        }
        setIsSubmitting(false)
    }

    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [user, navigate])

    return (
        <>
            <Toaster />
            <main className="flex w-full h-screen">
                {/* LEFT SIDE - Fitness Image (hidden on mobile) */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80"
                        alt="Fitness"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Dark overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F1C]/90 via-[#0B0F1C]/70 to-rose-900/40" />

                    {/* Content on image */}
                    <div className="relative z-10 flex flex-col justify-between p-12 h-full">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                                <span className="text-white text-xl">⚡</span>
                            </div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">Kinetic</h1>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-4xl font-bold text-white leading-tight">
                                Transform Your<br />
                                <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">Body & Mind</span>
                            </h2>
                            <p className="text-slate-300 text-lg max-w-md leading-relaxed">
                                Join thousands of athletes tracking their nutrition, workouts, and progress. Your journey starts here.
                            </p>

                            {/* Stats row */}
                            <div className="flex gap-8 pt-4">
                                <div>
                                    <p className="text-3xl font-bold text-white">50K+</p>
                                    <p className="text-sm text-slate-400">Active Users</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-white">2M+</p>
                                    <p className="text-sm text-slate-400">Workouts Logged</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-white">98%</p>
                                    <p className="text-sm text-slate-400">Success Rate</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-slate-500">Photo by Unsplash</p>
                    </div>
                </div>

                {/* RIGHT SIDE - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center px-6 bg-[#f8fafc] dark:bg-[#0B0F1C]">
                    <div className="w-full max-w-md space-y-8">
                        {/* Mobile logo */}
                        <div className="lg:hidden flex items-center gap-3 mb-8">
                            <div className="size-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
                                <span className="text-white text-xl">⚡</span>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Kinetic</h1>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                                {state === 'login' ? "Welcome Back" : "Get Started"}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400">
                                {state === 'login'
                                    ? 'Enter your details to continue your fitness journey.'
                                    : 'Create your account and start tracking today.'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {state !== 'login' && (
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                                        <input
                                            onChange={(e) => setUsername(e.target.value)}
                                            value={username}
                                            type="text"
                                            placeholder="johndoe"
                                            className="login-input pl-12"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                                    <input
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        type="email"
                                        placeholder="john@example.com"
                                        className="login-input pl-12"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                                    <input
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        placeholder="••••••••"
                                        className="login-input pl-12 pr-12"
                                        required
                                        type={showPassword ? 'text' : 'password'}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                        onClick={() => setShowPassword((p) => !p)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="login-button"
                            >
                                {isSubmitting ? "Please wait..." : state === "login" ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-[#f8fafc] dark:bg-[#0B0F1C] text-slate-500">or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#151B2E] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">
                                <svg className="size-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#151B2E] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">
                                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-.93 3.81-.93 1.62 0 2.65.93 3.24 1.4-2.87 1.65-2.39 5.98.22 7.13-.57 1.5-1.31 2.99-2.35 4.63zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
                                Apple
                            </button>
                        </div>

                        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                            {state === 'login' ? "New to Kinetic?" : "Already a member?"}
                            <button
                                onClick={() => setState(state === 'login' ? 'sign-up' : 'login')}
                                className="ml-1.5 text-rose-600 dark:text-rose-400 font-semibold hover:underline cursor-pointer"
                            >
                                {state === 'login' ? 'Create account' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Login