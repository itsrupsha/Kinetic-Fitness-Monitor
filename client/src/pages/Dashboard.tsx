import { useEffect, useState } from "react"
import { getMotivationalMessage } from "../assets/assets"
import { useAppContext } from "../context/AppContext"
import type { ActivityEntry, FoodEntry } from "../types"
import Card from "../components/ui/Card"
import ProgressBar from "../components/ui/ProgressBar"
import { Flame, Footprints, Heart, Ruler, Scale, Timer, TrendingUp, Zap } from "lucide-react"
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
