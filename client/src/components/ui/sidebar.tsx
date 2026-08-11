import { Activity, Flame, Home, Settings, Zap } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"
import { NavLink } from "react-router-dom"

const Sidebar = () => {
    const navItems = [
        { path: '/', label: 'Overview', icon: Home },
        { path: 'food', label: 'Nutrition', icon: Flame },
        { path: 'activity', label: 'Training', icon: Activity },
        { path: 'profile', label: 'Settings', icon: Settings },
    ]

    const { theme, toggleTheme } = useTheme()

    return (
        <nav className="hidden lg:flex flex-col w-20 bg-white/70 dark:bg-[#151B2E]/70 backdrop-blur-2xl border-r
        border-slate-200/50 dark:border-slate-700/30 py-6 px-3 transition-all duration-300 items-center gap-2 z-50">

            {/* Logo - Just an icon with glow */}
            <div className="mb-10">
                <div className="size-11 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center
                justify-center shadow-lg shadow-rose-500/20 animate-pulse-glow">
                    <Zap className='size-6 text-white' />
                </div>
            </div>

            {/* Nav Items - Icon only with tooltip */}
            <div className="flex flex-col gap-3 flex-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className="block group relative"
                    >
                        {({ isActive }) => (
                            <div className={`flex items-center justify-center size-12 rounded-2xl transition-all duration-300 ${isActive
                                ? 'bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/20'
                                : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}>
                                <item.icon className="size-5" />

                                {/* Tooltip */}
                                <div className="absolute left-14 bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50 shadow-xl">
                                    {item.label}
                                </div>

                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-rose-500" />
                                )}
                            </div>
                        )}
                    </NavLink>
                ))}
            </div>

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="flex items-center justify-center size-12 rounded-2xl text-slate-400 
                dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 cursor-pointer text-lg"
            >
                {theme === 'light' ? '🌙' : '☀️'}
            </button>
        </nav>
    )
}

export default Sidebar