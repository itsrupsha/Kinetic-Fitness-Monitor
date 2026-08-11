import { Activity, Flame, Home, Settings } from "lucide-react"
import { NavLink } from "react-router-dom"

const BottomNav = () => {
    const navItems = [
        { path: '/', label: 'Overview', icon: Home },
        { path: 'food', label: 'Nutrition', icon: Flame },
        { path: 'activity', label: 'Training', icon: Activity },
        { path: 'profile', label: 'Settings', icon: Settings },
    ]

    return (
        <nav className="fixed bottom-4 left-4 right-4 lg:hidden z-50">
            <div className="max-w-md mx-auto bg-white/80 dark:bg-[#151B2E]/80 backdrop-blur-2xl border 
            border-slate-200/50 dark:border-slate-700/30 rounded-2xl px-2 py-2 shadow-2xl shadow-black/10">
                <div className="flex justify-around items-center">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className="block"
                        >
                            {({ isActive }) => (
                                <div className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${isActive
                                    ? 'text-rose-500 dark:text-rose-400'
                                    : 'text-slate-400 dark:text-slate-500'
                                    }`}>
                                    <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/20' : ''}`}>
                                        <item.icon className="size-[18px]" />
                                    </div>
                                    <span className="text-[9px] font-semibold tracking-wider uppercase">
                                        {item.label}
                                    </span>
                                </div>
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    )
}

export default BottomNav