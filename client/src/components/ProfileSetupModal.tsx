import { useState } from "react"
import { useAppContext } from "../context/AppContext"
import { X, User, Calendar, Scale, Ruler, Target, ChevronRight, Check } from "lucide-react"
import mockApi from "../assets/mockApi"
import toast from "react-hot-toast"

interface ProfileSetupModalProps {
    onComplete: () => void
}

const ProfileSetupModal = ({ onComplete }: ProfileSetupModalProps) => {
    const { user, fetchUser } = useAppContext()
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        username: user?.username || '',
        age: '',
        weight: '',
        height: '',
        goal: 'maintain' as 'lose' | 'maintain' | 'gain',
    })

    const totalSteps = 3

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleNext = () => {
        if (step === 1) {
            if (!formData.username.trim() || !formData.age || Number(formData.age) < 13) {
                toast.error("Please enter a valid username and age")
                return
            }
        }
        if (step === 2) {
            if (!formData.weight || Number(formData.weight) < 20) {
                toast.error("Please enter a valid weight")
                return
            }
        }
        if (step < totalSteps) {
            setStep(step + 1)
        } else {
            handleSubmit()
        }
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const age = Number(formData.age)
            const weight = Number(formData.weight)
            const height = formData.height ? Number(formData.height) : null

            // Auto-calculate calorie targets based on goal
            let intake = 2000
            let burn = 400

            if (age <= 30) { intake = 2200; burn = 450 }
            else if (age <= 50) { intake = 2000; burn = 400 }
            else { intake = 1800; burn = 350 }

            if (formData.goal === 'lose') { intake -= 400; burn += 100 }
            else if (formData.goal === 'gain') { intake += 500; burn -= 100 }

            const updates = {
                username: formData.username,
                age,
                weight,
                height,
                goal: formData.goal,
                dailyCalorieIntake: intake,
                dailyCalorieBurn: burn,
            }

            await mockApi.user.update(user?.id || "", updates)
            await fetchUser(user?.token || "")
            toast.success("Profile created successfully!")
            onComplete()
        } catch (error: any) {
            toast.error(error?.message || "Failed to save profile")
        } finally {
            setIsSubmitting(false)
        }
    }

    const goals = [
        { value: 'lose' as const, label: 'Lose Weight', desc: 'Calorie deficit & cardio focus', icon: '🔥', color: 'from-orange-400 to-red-400' },
        { value: 'maintain' as const, label: 'Maintain', desc: 'Balanced nutrition & activity', icon: '⚖️', color: 'from-blue-400 to-cyan-400' },
        { value: 'gain' as const, label: 'Gain Muscle', desc: 'Calorie surplus & strength training', icon: '💪', color: 'from-violet-400 to-purple-400' },
    ]

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal Card */}
            <div className="relative w-full max-w-lg bg-white dark:bg-[#151B2E] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-rose-500 to-orange-500 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold">Create your profile</h2>
                            <p className="text-white/80 text-sm mt-1">This helps us personalize your experience</p>
                        </div>
                        <button
                            onClick={onComplete}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    {/* Progress bar */}
                    <div className="flex gap-2 mt-5">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? "bg-white" : "bg-white/30"}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">

                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
                                    <User className="size-5 text-rose-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Who are you?</h3>
                                    <p className="text-xs text-slate-500">Let's start with the basics</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Display Name</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => updateField('username', e.target.value)}
                                    placeholder="e.g., John Doe"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Age</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                                    <input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => updateField('age', e.target.value)}
                                        placeholder="25"
                                        min={13}
                                        max={120}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Body Metrics */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                    <Scale className="size-5 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Body Metrics</h3>
                                    <p className="text-xs text-slate-500">Used to calculate your BMI & targets</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Weight (kg)</label>
                                <div className="relative">
                                    <Scale className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                                    <input
                                        type="number"
                                        value={formData.weight}
                                        onChange={(e) => updateField('weight', e.target.value)}
                                        placeholder="70"
                                        min={20}
                                        max={300}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Height (cm) — Optional</label>
                                <div className="relative">
                                    <Ruler className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                                    <input
                                        type="number"
                                        value={formData.height}
                                        onChange={(e) => updateField('height', e.target.value)}
                                        placeholder="175"
                                        min={100}
                                        max={250}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Goal */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
                                    <Target className="size-5 text-violet-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">What's your goal?</h3>
                                    <p className="text-xs text-slate-500">We'll auto-calculate your daily targets</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {goals.map((g) => (
                                    <button
                                        key={g.value}
                                        onClick={() => updateField('goal', g.value)}
                                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${formData.goal === g.value
                                            ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 shadow-lg shadow-rose-500/10'
                                            : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center text-lg shadow-lg`}>
                                                {g.icon}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-900 dark:text-white">{g.label}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{g.desc}</p>
                                            </div>
                                            {formData.goal === g.value && (
                                                <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center">
                                                    <Check className="size-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="p-6 pt-0 flex gap-3">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold hover:from-rose-600 hover:to-orange-600 transition-all shadow-lg shadow-rose-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            "Saving..."
                        ) : step === totalSteps ? (
                            <>
                                <Check className="size-4" />
                                Complete Setup
                            </>
                        ) : (
                            <>
                                Continue
                                <ChevronRight className="size-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileSetupModal