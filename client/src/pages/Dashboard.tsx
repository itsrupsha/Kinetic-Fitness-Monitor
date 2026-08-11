import { useEffect, useState } from "react"
import { getMotivationalMessage } from "../assets/assets"
import { useAppContext } from "../context/AppContext"
import type { ActivityEntry, FoodEntry } from "../types"
import Card from "../components/ui/Card"
import ProgressBar from "../components/ui/ProgressBar"
import { Activity, Flame, Footprints, Heart, Ruler, Scale, Timer, TrendingUp, Zap } from "lucide-react"
import CaloriesChart from "../components/CaloriesChart"

const Dashboard = () => {
    const { user, allActivityLogs, allFoodLogs } = useAppContext()
    const [todayFood, setTodayFood] = useState<FoodEntry[]>([])
    const [todayActivities, setTodayActivities] = useState<ActivityEntry[]>([])

    const DAILY_CALORIE_LIMIT: number = user?.dailyCalorieIntake || 2000;

    const loadUserData = () => {
        const today = new Date().toISOString().split('T')[0];
        const foodData = allFoodLogs.filter((f: FoodEntry) => f.createdAt?.split('T')[0] === today)
        setTodayFood(foodData)
        const activityData = allActivityLogs.filter((a: ActivityEntry) => a.createdAt?.split('T')[0] === today)
        setTodayActivities(activityData)
    }

    useEffect(() => { loadUserData() }, [allActivityLogs, allFoodLogs])

    const totalCalories = todayFood.reduce((sum, item) => sum + item.calories, 0)
    const remainingCalories = DAILY_CALORIE_LIMIT - totalCalories;
    const totalActiveMinutes = todayActivities.reduce((sum, item) => sum + item.duration, 0)
    const totalBurned = todayActivities.reduce((sum, item) => sum + (item.calories || 0), 0)
    const motivation = getMotivationalMessage(totalCalories, totalActiveMinutes, DAILY_CALORIE_LIMIT)

    const streakDays = 12
    const weeklyGoal = 85

    return (
        <div className="page-container">
            {/* HERO SECTION */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1600&auto=format&fit=crop&q=80"
                        alt="Fitness"
                        className="w-full h-full object-cover opacity-15 dark:opacity-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f8fafc]/90 to-[#f8fafc] dark:via-[#0B0F1C]/90 dark:to-[#0B0F1C]" />
                </div>

                <div className="relative z-10 p-6 pt-12 pb-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className='text-rose-500 dark:text-rose-400 text-xs font-bold tracking-widest uppercase mb-1'>
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                Hey, <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">{user?.username || 'Athlete'}</span> 👋
                            </h1>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 rounded-full shadow-lg shadow-orange-500/20">
                            <Flame className="size-4 fill-white" />
                            <span className="text-sm font-bold">{streakDays} Day Streak</span>
                        </div>
                    </div>

                    <div className="bg-white/90 dark:bg-[#151B2E]/90 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/60 dark:border-slate-700/40 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-gradient-to-br from-rose-100 to-orange-100 dark:from-rose-900/30 dark:to-orange-900/30 flex items-center justify-center text-2xl shrink-0">
                                {motivation.emoji}
                            </div>
                            <div className="min-w-0">
                                <p className="text-slate-900 dark:text-white font-semibold text-sm lg:text-base">{motivation.text}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Keep pushing — you're {weeklyGoal}% to your weekly goal!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* DASHBOARD GRID */}
            <div className="px-4 lg:px-6 pb-6 space-y-4 lg:grid lg:grid-cols-12 lg:gap-5 lg:space-y-0 max-w-7xl mx-auto">

                {/* ENERGY IN - Large Card */}
                <div className="lg:col-span-7">
                    <Card className="h-full border border-slate-200/60 dark:border-slate-700/40 shadow-lg shadow-rose-500/5 p-5 lg:p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
                                    <Heart className='w-5 h-5 text-white fill-white' />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Energy In</p>
                                    <p className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white truncate">
                                        {totalCalories} <span className="text-sm font-normal text-slate-400">kcal</span>
                                    </p>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Daily Target</p>
                                <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{DAILY_CALORIE_LIMIT}</p>
                            </div>
                        </div>

                        <ProgressBar value={totalCalories} max={DAILY_CALORIE_LIMIT} />

                        <div className="mt-4 flex justify-between items-center">
                            <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${remainingCalories >= 0
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                }`}>
                                {remainingCalories >= 0 ? `${remainingCalories} kcal left` : `${Math.abs(remainingCalories)} kcal over`}
                            </div>
                            <span className="text-xs font-bold text-slate-400">{Math.round((totalCalories / DAILY_CALORIE_LIMIT) * 100)}%</span>
                        </div>

                        {/* Macros */}
                        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-3 uppercase tracking-widest">Today's Macros</p>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Protein</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">124g</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full" style={{ width: '75%' }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Carbs</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">210g</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full" style={{ width: '60%' }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Fats</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">58g</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full" style={{ width: '45%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* RIGHT COLUMN - Energy Out + Stats */}
                <div className="lg:col-span-5 space-y-4">
                    {/* Energy Out */}
                    <Card className="border border-slate-200/60 dark:border-slate-700/40 shadow-lg shadow-orange-500/5 p-5">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
                                    <Flame className='w-5 h-5 text-white' />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Energy Out</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white truncate">
                                        {totalBurned} <span className="text-sm font-normal text-slate-400">kcal</span>
                                    </p>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Burn Goal</p>
                                <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{user?.dailyCalorieBurn || 400}</p>
                            </div>
                        </div>
                        <ProgressBar value={totalBurned} max={user?.dailyCalorieBurn || 400} />
                    </Card>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <Card className="border border-slate-200/60 dark:border-slate-700/40 p-4 text-center">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-cyan-500/20">
                                <Timer className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalActiveMinutes}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Active Minutes</p>
                        </Card>
                        <Card className="border border-slate-200/60 dark:border-slate-700/40 p-4 text-center">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-violet-500/20">
                                <Footprints className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{todayActivities.length}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sessions</p>
                        </Card>
                    </div>
                </div>

                {/* GOAL CARD with image */}
                {user && (
                    <div className="lg:col-span-4">
                        <div className="relative h-48 lg:h-full rounded-3xl overflow-hidden min-h-[180px]">
                            <img
                                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80"
                                alt="Workout"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
                            <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
                                    <TrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-white/70 text-sm mb-1">Current Focus</p>
                                <p className="text-white font-bold text-lg capitalize">
                                    {user.goal === 'lose' && '🔥 Fat Loss Protocol'}
                                    {user.goal === 'maintain' && '⚖️ Maintenance Phase'}
                                    {user.goal === 'gain' && '💪 Hypertrophy Training'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* BODY METRICS */}
                {user && user.weight && (
                    <div className="lg:col-span-4">
                        <Card className="h-full border border-slate-200/60 dark:border-slate-700/40 p-5">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                                    <Scale className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Body Composition</h3>
                                    <p className="text-slate-500 text-xs">Track your changes</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <Scale className="w-4 h-4 text-indigo-500" />
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Weight</span>
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-white">{user.weight} kg</span>
                                </div>

                                {user.height && (
                                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <Ruler className="w-4 h-4 text-violet-500" />
                                            <span className="text-sm text-slate-600 dark:text-slate-400">Height</span>
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-white">{user.height} cm</span>
                                    </div>
                                )}

                                {user.height && (
                                    <div className="pt-1">
                                        {(() => {
                                            const bmi = (user.weight / Math.pow(user.height / 100, 2)).toFixed(1)
                                            const getStatus = (b: number) => {
                                                if (b < 18.5) return { color: 'text-blue-500', label: 'Underweight' }
                                                if (b < 25) return { color: 'text-emerald-500', label: 'Healthy' }
                                                if (b < 30) return { color: 'text-orange-500', label: 'Overweight' }
                                                return { color: 'text-red-500', label: 'Obese' }
                                            }
                                            const status = getStatus(Number(bmi))
                                            return (
                                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">BMI Score</span>
                                                        <div className="text-right">
                                                            <span className={`text-xl font-bold ${status.color}`}>{bmi}</span>
                                                            <p className={`text-[10px] ${status.color} font-semibold`}>{status.label}</p>
                                                        </div>
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                                                        <div className="flex-1 bg-blue-400/50" />
                                                        <div className="flex-1 bg-emerald-400/50" />
                                                        <div className="flex-1 bg-orange-400/50" />
                                                        <div className="flex-1 bg-red-400/50" />
                                                    </div>
                                                    <div className="flex justify-between mt-1.5 text-[10px] text-slate-400 font-bold">
                                                        <span>18.5</span>
                                                        <span>25</span>
                                                        <span>30</span>
                                                    </div>
                                                </div>
                                            )
                                        })()}
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                )}

                {/* WEEKLY CHART */}
                <div className="lg:col-span-4">
                    <Card className="h-full border border-slate-200/60 dark:border-slate-700/40 p-5">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
                            <Zap className="w-4 h-4 text-amber-500" />
                            Weekly Progress
                        </h3>
                        <div className="h-48">
                            <CaloriesChart />
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    )
}

export default Dashboard