import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import type { FoodEntry, FormData } from "../types";
import Card from "../components/ui/Card";
import { mealColors, mealIcons, mealTypeOptions, quickActivitiesFoodLog } from "../assets/assets";
import Button from "../components/ui/Button";
import { Loader2, Plus, Sparkles, Trash2, UtensilsCrossed, ChevronRight, Clock, Flame } from "lucide-react";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import mockApi from "../assets/mockApi";
import toast from "react-hot-toast";

// Meal category images from Unsplash
const mealImages: Record<string, string> = {
    breakfast: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&auto=format&fit=crop&q=80",
    lunch: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80",
    dinner: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=80",
    snack: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&auto=format&fit=crop&q=80",
}

const FoodLog = () => {
    const { allFoodLogs, setAllFoodLogs } = useAppContext();
    const [entries, setEntries] = useState<FoodEntry[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<FormData>({ name: '', calories: 0, mealType: '' });
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null)
    const today = new Date().toISOString().split('T')[0];

    const loadEntries = () => {
        const todaysEntries = allFoodLogs.filter((e: FoodEntry) => e.createdAt?.split('T')[0] === today);
        setEntries(todaysEntries);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const { data } = await mockApi.foodLogs.create({
            data: { ...formData, createdAt: new Date().toISOString() }
        })
        setAllFoodLogs(prev => [...prev, data])
        setFormData({ name: '', calories: 0, mealType: '' })
        setShowForm(false)
    }

    const handleDelete = async (documentId: string) => {
        try {
            const isConfirmed = window.confirm("Delete this entry?");
            if (!isConfirmed) return;
            await mockApi.foodLogs.delete(documentId);
            setAllFoodLogs(prev => prev.filter((e) => e.documentId !== documentId));
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete");
        }
    };

    const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0);
    const groupedEntries: Record<'breakfast' | 'lunch' | 'dinner' | 'snack', FoodEntry[]> =
        entries.reduce((acc, entry) => {
            if (!acc[entry.mealType]) acc[entry.mealType] = [];
            acc[entry.mealType].push(entry);
            return acc;
        }, {} as Record<'breakfast' | 'lunch' | 'dinner' | 'snack', FoodEntry[]>)

    const handleQuickAdd = (activityName: string) => {
        setFormData({ ...formData, mealType: activityName })
        setShowForm(true)
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
    }

    useEffect(() => { loadEntries(); }, [allFoodLogs]);

    return (
        <div className="page-container">
            {/* Hero Header with Image */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1600&auto=format&fit=crop&q=80" alt="Food" className="w-full h-full object-cover opacity-15 dark:opacity-10" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f8fafc]/90 to-[#f8fafc] dark:via-[#0B0F1C]/90 dark:to-[#0B0F1C]" />
                </div>

                <div className="relative z-10 p-6 pt-12 pb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-rose-500 dark:text-rose-400 text-xs font-bold tracking-widest uppercase mb-1">Nutrition Tracker</p>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">What did you eat?</h1>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Today's Intake</p>
                            <p className="text-2xl font-bold text-rose-500 dark:text-rose-400">{totalCalories} <span className="text-sm text-slate-400">kcal</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 lg:px-6 pb-6 space-y-4 max-w-7xl mx-auto">

                {/* Quick Add Chips */}
                {!showForm && (
                    <div className="space-y-4">
                        <Card className="border border-slate-200/60 dark:border-slate-700/40 p-5">
                            <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                <Sparkles className="size-4 text-amber-500" />
                                Quick Add
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {quickActivitiesFoodLog.map((activity) => (
                                    <button onClick={() => handleQuickAdd(activity.name)} key={activity.name}
                                        className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-200 border border-transparent hover:border-rose-200 dark:hover:border-rose-800">
                                        {activity.emoji} {activity.name}
                                    </button>
                                ))}
                            </div>
                        </Card>

                        <div className="grid grid-cols-2 gap-3">
                            <Button className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 shadow-lg shadow-rose-500/20 py-3.5" onClick={() => setShowForm(true)}>
                                <Plus className='size-5' />
                                Add Meal
                            </Button>
                            <Button className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 shadow-lg shadow-violet-500/20 py-3.5" onClick={() => inputRef.current?.click()}>
                                <Sparkles className='size-5' />
                                AI Scan
                            </Button>
                        </div>
                        <input onChange={handleImageChange} type="file" accept="image/*" hidden ref={inputRef} />

                        {loading && (
                            <div className='fixed inset-0 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur flex items-center justify-center z-50'>
                                <Loader2 className='size-8 text-rose-500 animate-spin' />
                            </div>
                        )}
                    </div>
                )}

                {/* Add Form */}
                {showForm && (
                    <Card className="border-2 border-rose-200 dark:border-rose-800 shadow-xl shadow-rose-500/5 p-5">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                            <UtensilsCrossed className="size-5 text-rose-500" />
                            Log Your Meal
                        </h3>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <Input label="Food Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v.toString() })} placeholder="e.g., Grilled Chicken Salad" required />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Calories" type="number" value={formData.calories} onChange={(v) => setFormData({ ...formData, calories: Number(v) })} placeholder="350" required min={1} />
                                <Select label="Meal Type" value={formData.mealType} onChange={(v) => setFormData({ ...formData, mealType: v.toString() })} options={mealTypeOptions} placeholder="Select" required />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button className='flex-1' type="button" variant="secondary" onClick={() => { setShowForm(false); setFormData({ name: '', calories: 0, mealType: '' }) }}>
                                    Cancel
                                </Button>
                                <Button type="submit" className='flex-1 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600'>
                                    Add Entry
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* Empty State */}
                {entries.length === 0 ? (
                    <Card className="text-center py-16 border border-slate-200/60 dark:border-slate-700/40">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-100 to-orange-100 dark:from-rose-900/20 dark:to-orange-900/20 flex items-center justify-center mx-auto mb-5">
                            <UtensilsCrossed className="size-10 text-rose-400 dark:text-rose-500" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">No meals logged today</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">Start tracking your nutrition to see your daily progress and hit your goals.</p>
                    </Card>
                ) : (
                    <div className="space-y-5">
                        {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
                            const mealTypeKey = mealType as keyof typeof groupedEntries;
                            if (!groupedEntries[mealTypeKey]) return null;
                            const MealIcon = mealIcons[mealTypeKey];
                            const mealCalories = groupedEntries[mealTypeKey].reduce((sum, e) => sum + e.calories, 0);

                            return (
                                <Card key={mealType} className="overflow-hidden border border-slate-200/60 dark:border-slate-700/40 p-0">
                                    {/* Meal Header with Image */}
                                    <div className="relative h-32 overflow-hidden">
                                        <img src={mealImages[mealTypeKey]} alt={mealType} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl ${mealColors[mealTypeKey]} flex items-center justify-center backdrop-blur`}>
                                                    <MealIcon className='size-5 text-white' />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white capitalize text-lg">{mealType}</h3>
                                                    <p className="text-white/70 text-xs">{groupedEntries[mealTypeKey].length} items</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-white">{mealCalories}</p>
                                                <p className="text-white/60 text-xs">kcal</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Food Items */}
                                    <div className="p-4 space-y-2">
                                        {groupedEntries[mealTypeKey].map((entry) => (
                                            <div key={entry.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl group hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center">
                                                        <Flame className="size-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{entry.name}</p>
                                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                                            <Clock className="size-3" />
                                                            {new Date(entry.createdAt || '').toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-bold text-rose-500 dark:text-rose-400">{entry.calories} kcal</span>
                                                    <button onClick={() => handleDelete(entry?.documentId || '')} className='p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100'>
                                                        <Trash2 className='w-4 h-4' />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodLog;