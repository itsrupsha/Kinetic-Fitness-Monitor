import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext"
import { useTheme } from "../context/ThemeContext";
import type { ProfileFormData, UserData } from "../types";
import Card from "../components/ui/Card";
import { Calendar, Camera, LogOut, Moon, Sun, Target, Trophy, User, Zap, TrendingUp, Award, ChevronRight, Pencil } from "lucide-react";
import Button from "../components/ui/Button";
import { goalLabels, goalOptions } from "../assets/assets";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import mockApi from "../assets/mockApi";
import toast from "react-hot-toast";

const Profile = () => {
    const { user, logout, fetchUser, allFoodLogs, allActivityLogs } = useAppContext();
    const { theme, toggleTheme } = useTheme()
    const [isEditing, setIsEditing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Load profile pic from localStorage or use default
    const [profilePic, setProfilePic] = useState<string>(() => {
        return localStorage.getItem('kinetic_profile_pic') || '/profile.jpg'
    })

    const [formData, setFormData] = useState<ProfileFormData>({
        age: 0, weight: 0, height: 0, goal: 'maintain',
        dailyCalorieIntake: 2000, dailyCalorieBurn: 400
    })

    useEffect(() => {
        if (user) {
            setFormData({
                age: user?.age || 0, weight: user?.weight || 0,
                height: user?.height || 0, goal: user?.goal || 'maintain',
                dailyCalorieIntake: user?.dailyCalorieIntake || 2000,
                dailyCalorieBurn: user?.dailyCalorieBurn || 400,
            })
        }
    }, [user])

    const handleSave = async () => {
        try {
            const updates: Partial<UserData> = {
                ...formData, goal: formData.goal as 'lose' | 'maintain' | 'gain'
            };
            await mockApi.user.update(user?.id || '', updates);
            await fetchUser(user?.token || '');
            toast.success('Profile updated!');
            setIsEditing(false)
        } catch (error: any) {
            toast.error(error?.message || "Failed to update");
        }
    }

    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be under 2MB")
            return
        }
        const reader = new FileReader()
        reader.onloadend = () => {
            const base64 = reader.result as string
            setProfilePic(base64)
            localStorage.setItem('kinetic_profile_pic', base64)
            toast.success("Profile picture updated!")
        }
        reader.readAsDataURL(file)
    }

    const getStats = () => {
        const today = new Date().toISOString().split('T')[0];
        const totalFoodEntries = allFoodLogs?.filter((f: any) => f.createdAt?.split('T')[0] === today).length || 0;
        const totalActivities = allActivityLogs?.filter((a: any) => a.createdAt?.split('T')[0] === today).length || 0;
        return { totalFoodEntries, totalActivities };
    };

    const stats = getStats();

    const achievements = [
        { icon: Trophy, label: "7-Day Streak", color: "from-amber-400 to-orange-400", unlocked: true },
        { icon: Zap, label: "Early Bird", color: "from-cyan-400 to-blue-400", unlocked: true },
        { icon: Award, label: "Goal Crusher", color: "from-rose-400 to-pink-400", unlocked: false },
    ]

    if (!user || !formData) return null

    return (
        <div className='page-container'>
            {/* COVER IMAGE - Clean banner, no overlap */}
            <div className="relative h-40 lg:h-48 overflow-hidden shrink-0">
                <img
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&auto=format&fit=crop&q=80"
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1C]/80 via-[#0B0F1C]/30 to-transparent" />
            </div>

            {/* PROFILE HEADER - Clean row, no overlap */}
            <div className="px-4 lg:px-6 pt-4 pb-2 max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                    {/* CIRCULAR AVATAR with photo */}
                    <div className="relative group shrink-0 -mt-12">
                        <div className="size-24 lg:size-28 rounded-full p-1 bg-gradient-to-br from-rose-500 via-orange-400 to-amber-400 shadow-2xl shadow-rose-500/20">
                            <div className="w-full h-full rounded-full overflow-hidden bg-[#151B2E] relative">
                                <img
                                    src={profilePic}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="size-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Edit button on avatar */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/30 transition-all cursor-pointer border-2 border-[#0B0F1C] group-hover:scale-110"
                        >
                            <Pencil className="size-3.5 text-white" />
                        </button>

                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={fileInputRef}
                            onChange={handleProfilePicChange}
                        />
                    </div>

                    {/* NAME & INFO - Beside avatar, no overlap */}
                    <div className="min-w-0 pt-2">
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white truncate">{user.username || 'Athlete'}</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Member since {new Date(user?.createdAt || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-800">
                                {goalLabels[user?.goal || 'gain']}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                                <Trophy className="size-3" /> 12 Day Streak
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="px-4 lg:px-6 pb-6 pt-4 max-w-7xl mx-auto">
                <div className="lg:grid lg:grid-cols-12 lg:gap-5 space-y-4 lg:space-y-0">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-4">

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-3">
                            <Card className="text-center py-4 border border-slate-200/60 dark:border-slate-700/40 hover:border-rose-200 dark:hover:border-rose-800 transition-colors">
                                <p className="text-2xl font-bold text-rose-500 dark:text-rose-400">{stats.totalFoodEntries}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Meals Today</p>
                            </Card>
                            <Card className="text-center py-4 border border-slate-200/60 dark:border-slate-700/40 hover:border-cyan-200 dark:hover:border-cyan-800 transition-colors">
                                <p className="text-2xl font-bold text-cyan-500 dark:text-cyan-400">{stats.totalActivities}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Workouts</p>
                            </Card>
                            <Card className="text-center py-4 border border-slate-200/60 dark:border-slate-700/40 hover:border-amber-200 dark:hover:border-amber-800 transition-colors">
                                <p className="text-2xl font-bold text-amber-500 dark:text-amber-400">85%</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Weekly Goal</p>
                            </Card>
                        </div>

                        {/* Profile Info Card */}
                        <Card className="border border-slate-200/60 dark:border-slate-700/40 p-5">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <User className="size-5 text-rose-500" />
                                    Your Details
                                </h3>
                                {!isEditing && (
                                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                                        <Pencil className="size-3.5" /> Edit
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Age" type='number' value={formData.age} onChange={(v) => setFormData({ ...formData, age: Number(v) })} min={13} max={120} />
                                        <Input label="Weight (kg)" type='number' value={formData.weight} onChange={(v) => setFormData({ ...formData, weight: Number(v) })} min={20} max={300} />
                                    </div>
                                    <Input label="Height (cm)" type='number' value={formData.height} onChange={(v) => setFormData({ ...formData, height: Number(v) })} min={100} max={250} />
                                    <Select label="Fitness Goal" value={formData.goal as string} onChange={(v) => setFormData({ ...formData, goal: v as 'lose' | 'maintain' | 'gain' })} options={goalOptions} />
                                    <div className="flex gap-3 pt-2">
                                        <Button variant="secondary" className="flex-1" onClick={() => { setIsEditing(false); setFormData({ age: Number(user.age), weight: Number(user.weight), height: Number(user.height), goal: user.goal || '', dailyCalorieIntake: user.dailyCalorieIntake || 2000, dailyCalorieBurn: user.dailyCalorieBurn || 400 }) }}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600">
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="profile-info-row">
                                        <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                            <Calendar className="size-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Age</p>
                                            <p className="font-bold text-slate-900 dark:text-white">{user.age} years</p>
                                        </div>
                                    </div>
                                    <div className="profile-info-row">
                                        <div className="size-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
                                            <User className="size-5 text-violet-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Height</p>
                                            <p className="font-bold text-slate-900 dark:text-white">{user.height || '--'} cm</p>
                                        </div>
                                    </div>
                                    <div className="profile-info-row">
                                        <div className="size-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
                                            <Target className="size-5 text-rose-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Goal</p>
                                            <p className="font-bold text-slate-900 dark:text-white">{goalLabels[user?.goal || 'gain']}</p>
                                        </div>
                                    </div>
                                    <div className="profile-info-row">
                                        <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                                            <TrendingUp className="size-5 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">BMI</p>
                                            {user.height ? (
                                                <p className="font-bold text-slate-900 dark:text-white">{(user.weight / Math.pow(user.height / 100, 2)).toFixed(1)}</p>
                                            ) : (
                                                <p className="font-bold text-slate-400">--</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Daily Targets */}
                        <Card className="border border-slate-200/60 dark:border-slate-700/40 p-5">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                                <Zap className="size-5 text-amber-500" />
                                Daily Targets
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/10 dark:to-orange-900/10 rounded-2xl border border-rose-100 dark:border-rose-800/30">
                                    <p className="text-xs text-rose-500 font-bold uppercase tracking-wider mb-1">Calorie Intake</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{user.dailyCalorieIntake || 2000}</p>
                                    <p className="text-xs text-slate-500">kcal / day</p>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/10 rounded-2xl border border-cyan-100 dark:border-cyan-800/30">
                                    <p className="text-xs text-cyan-500 font-bold uppercase tracking-wider mb-1">Calorie Burn</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{user.dailyCalorieBurn || 400}</p>
                                    <p className="text-xs text-slate-500">kcal / day</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-4 space-y-4">
                        {/* Achievements */}
                        <Card className="border border-slate-200/60 dark:border-slate-700/40 p-5">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Trophy className="size-5 text-amber-500" />
                                Achievements
                            </h3>
                            <div className="space-y-3">
                                {achievements.map((ach, i) => (
                                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${ach.unlocked ? 'bg-slate-50 dark:bg-slate-800/50' : 'opacity-50 bg-slate-50/50 dark:bg-slate-800/30'}`}>
                                        <div className={`size-10 rounded-xl bg-gradient-to-br ${ach.color} flex items-center justify-center shadow-lg ${ach.unlocked ? '' : 'grayscale'}`}>
                                            <ach.icon className="size-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-800 dark:text-white text-sm">{ach.label}</p>
                                            <p className="text-xs text-slate-500">{ach.unlocked ? 'Unlocked!' : 'Locked'}</p>
                                        </div>
                                        {ach.unlocked && <Award className="size-4 text-amber-500" />}
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Theme Toggle */}
                        <Card className="border border-slate-200/60 dark:border-slate-700/40 p-4">
                            <button onClick={toggleTheme} className="flex items-center justify-between w-full text-left group">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                        {theme === 'light' ? <Moon className="size-5 text-indigo-500" /> : <Sun className="size-5 text-amber-500" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-white text-sm">Appearance</p>
                                        <p className="text-xs text-slate-500">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</p>
                                    </div>
                                </div>
                                <ChevronRight className="size-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            </button>
                        </Card>

                        {/* Logout */}
                        <Button variant="danger" onClick={logout} className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-lg shadow-red-500/20 py-3.5">
                            <LogOut className='size-4' />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile