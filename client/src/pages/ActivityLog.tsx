import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext"
import type { ActivityEntry } from "../types";
import Card from "../components/ui/Card";
import { quickActivities } from "../assets/assets";
import { Activity, Dumbbell, Plus, Timer, Trash2, TrendingUp, Zap, MapPin, HeartPulse } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import toast from "react-hot-toast/headless";
import mockApi from "../assets/mockApi";

// Workout type images
const workoutImages: Record<string, string> = {
    running: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&auto=format&fit=crop&q=80",
    cycling: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400&auto=format&fit=crop&q=80",
    swimming: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&auto=format&fit=crop&q=80",
    yoga: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=80",
    weights: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80",
    default: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&auto=format&fit=crop&q=80",
}

const getWorkoutImage = (name: string) => {
    const lower = name.toLowerCase()
    if (lower.includes('run')) return workoutImages.running
    if (lower.includes('cycle') || lower.includes('bike')) return workoutImages.cycling
    if (lower.includes('swim')) return workoutImages.swimming
    if (lower.includes('yoga')) return workoutImages.yoga
    if (lower.includes('weight') || lower.includes('gym') || lower.includes('lift')) return workoutImages.weights
    return workoutImages.default
}

const ActivityLog = () => {
    const { allActivityLogs, setAllActivityLogs } = useAppContext();
    const [activities, setActivities] = useState<ActivityEntry[]>([])
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({ name: '', duration: 0, calories: 0 })
    const [error, setError] = useState('')

    const today = new Date().toISOString().split('T')[0];

    const loadActivities = () => {
        const todaysActivities = allActivityLogs.filter((a: ActivityEntry) => a.createdAt?.split('T')[0] === today);
        setActivities(todaysActivities);
    };

    useEffect(() => { loadActivities() }, [allActivityLogs])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name.trim() || formData.duration <= 0) {
            return toast('Please enter valid data')
        }
        try {
            const { data } = await mockApi.activityLogs.create({ data: formData });
            setAllActivityLogs(prev => [...prev, data])
            setFormData({ name: '', duration: 0, calories: 0 })
            setShowForm(false)
        } catch (error: any) {
            toast.error(error?.message || "Failed to add activity");
        }
    }

    const handleQuickAdd = (activity: { name: string, rate: number }) => {
        setFormData({ name: activity.name, duration: 30, calories: 30 * activity.rate })
        setShowForm(true)
    }

    const handleDurationChange = (val: string | number) => {
        const duration = Number(val);
        const activity = quickActivities.find(a => a.name === formData.name)
        let calories = formData.calories
        if (activity) { calories = duration * activity.rate }
        setFormData({ ...formData, duration, calories })
    }

    const handleDelete = async (documentId: string) => {
        try {
            await mockApi.activityLogs.delete(documentId);
            setAllActivityLogs(prev => prev.filter(a => a.documentId !== documentId));
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete activity");
        }
    };

    const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0)
    const totalBurned = activities.reduce((sum, a) => sum + (a.calories || 0), 0)

    return (
        <div className="page-container">
            {/* Hero Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1534438327276-14e5300c2e1e?w=1600&auto=format&fit=crop&q=80" alt="Training" className="w-full h-full object-cover opacity-15 dark:opacity-10" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f8fafc]/90 to-[#f8fafc] dark:via-[#0B0F1C]/90 dark:to-[#0B0F1C]" />
                </div>

                <div className="relative z-10 p-6 pt-12 pb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-cyan-500 dark:text-cyan-400 text-xs font-bold tracking-widest uppercase mb-1">Training Log</p>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Sweat it out!</h1>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Active Today</p>
                            <p className="text-2xl font-bold text-cyan-500 dark:text-cyan-400">{totalMinutes} <span className="text-sm text-slate-400">min</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 lg:px-6 pb-6 space-y-4 max-w-7xl mx-auto">

                {/* Quick Workouts */}
                {!showForm && (
                    <div className="space-y-4">
                        <Card className="border border-slate-200/60 dark:border-slate-700/40 p-5">
                            <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                <Zap className="size-4 text-amber-500" />
                                Quick Start
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                {quickActivities.map((activity) => (
                                    <button onClick={() => handleQuickAdd(activity)} key={activity.name}
                                        className="p-4 bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-2xl text-center transition-all duration-200 border border-transparent hover:border-cyan-200 dark:hover:border-cyan-800 group">
                                        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{activity.emoji}</div>
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{activity.name}</p>
                                        <p className="text-xs text-slate-400 mt-1">{activity.rate} kcal/min</p>
                                    </button>
                                ))}
                            </div>
                        </Card>

                        <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/20 py-3.5" onClick={() => setShowForm(true)}>
                            <Plus className='size-5' />
                            Log Custom Workout
                        </Button>
                    </div>
                )}

                {/* Add Form */}
                {showForm && (
                    <Card className="border-2 border-cyan-200 dark:border-cyan-800 shadow-xl shadow-cyan-500/5 p-5">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                            <Dumbbell className="size-5 text-cyan-500" />
                            New Session
                        </h3>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <Input label='Workout Name' placeholder='e.g., Morning Run' required value={formData.name} onChange={(v) => setFormData({ ...formData, name: v.toString() })} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label='Duration (min)' type="number" placeholder='30' min={1} max={300} required value={formData.duration} onChange={handleDurationChange} />
                                <Input label='Calories Burned' type="number" placeholder='200' min={1} max={2000} required value={formData.calories} onChange={(v) => setFormData({ ...formData, calories: Number(v) })} />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <div className="flex gap-3 pt-2">
                                <Button type='button' variant='secondary' className='flex-1' onClick={() => { setShowForm(false); setError(''); setFormData({ name: '', duration: 0, calories: 0 }); }}>
                                    Cancel
                                </Button>
                                <Button type='submit' className='flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'>
                                    Log Workout
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* Today's Summary Stats */}
                {activities.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                        <Card className="text-center py-4 border border-slate-200/60 dark:border-slate-700/40">
                            <Timer className="size-5 text-cyan-500 mx-auto mb-1" />
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{totalMinutes}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Minutes</p>
                        </Card>
                        <Card className="text-center py-4 border border-slate-200/60 dark:border-slate-700/40">
                            <HeartPulse className="size-5 text-rose-500 mx-auto mb-1" />
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{totalBurned}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Burned</p>
                        </Card>
                        <Card className="text-center py-4 border border-slate-200/60 dark:border-slate-700/40">
                            <TrendingUp className="size-5 text-emerald-500 mx-auto mb-1" />
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{activities.length}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Sessions</p>
                        </Card>
                    </div>
                )}

                {/* Activities List with Images */}
                {activities.length === 0 ? (
                    <Card className="text-center py-16 border border-slate-200/60 dark:border-slate-700/40">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20 flex items-center justify-center mx-auto mb-5">
                            <Dumbbell className="size-10 text-cyan-400 dark:text-cyan-500" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">No workouts today</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">Pick a quick workout above or log a custom session to get started.</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wider">Today's Sessions</h3>
                        {activities.map((activity) => (
                            <Card key={activity.id} className="overflow-hidden border border-slate-200/60 dark:border-slate-700/40 p-0">
                                <div className="flex">
                                    {/* Workout Image */}
                                    <div className="w-24 lg:w-32 shrink-0 relative">
                                        <img src={getWorkoutImage(activity.name)} alt={activity.name} className="w-full h-full object-cover absolute inset-0" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/50" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                                <Activity className="size-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-white">{activity.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                    <span className="flex items-center gap-1"><Timer className="size-3" /> {activity.duration} min</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1"><MapPin className="size-3" /> {new Date(activity?.createdAt || '').toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-bold text-cyan-600 dark:text-cyan-400">{activity.calories}</p>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold">kcal</p>
                                            </div>
                                            <button onClick={() => handleDelete(activity.documentId)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                <Trash2 className='w-4 h-4' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ActivityLog