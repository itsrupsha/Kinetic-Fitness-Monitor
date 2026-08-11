import { createContext, useContext, useEffect, useState } from "react";
import { initialState, type ActivityEntry, type Credentials, type FoodEntry, type User } from "../types";
import { useNavigate } from "react-router-dom";
import mockApi from "../assets/mockApi";
import api from "../configs/api";
import toast from "react-hot-toast";

// Create Context
const AppContext = createContext(initialState);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {

    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [isUserFetched, setIsUserFetched] = useState(false);
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);
    const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
    const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

    // SIGNUP
    const signup = async (credentials: Credentials) => {
        try {
            const { data } = await api.post('/api/auth/local/register',
                credentials)

            setUser({ ...data.user, token: data.jwt });

            if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
                setOnboardingCompleted(true);
            }

            localStorage.setItem('token', data.jwt);
            api.defaults.headers.common['Authorization'] = 'Bearer ${data.jwt}'
        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data?.error?.message ||
                error?.message
            )
        }
    };

    // LOGIN
    const login = async (credentials: Credentials) => {
        try {
            const { data } = await mockApi.auth.login(credentials);
            setUser({ ...data.user, token: data.jwt });

            if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
                setOnboardingCompleted(true);
            }

            localStorage.setItem('token', data.jwt);
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    // FETCH USER
    const fetchUser = async (token: string) => {
        try {
            const { data } = await mockApi.user.me();
            setUser({ ...data, token });

            if (data?.age && data?.weight && data?.goal) {
                setOnboardingCompleted(true);
            }
        } catch (error) {
            console.error("Fetch user error:", error);
        } finally {
            setIsUserFetched(true);
        }
    };

    // FETCH FOOD LOGS
    const fetchFoodLogs = async () => {
        try {
            const { data } = await mockApi.foodLogs.list();
            setAllFoodLogs(data);
        } catch (error) {
            console.error("Food logs error:", error);
        }
    };

    // FETCH ACTIVITY LOGS
    const fetchActivityLogs = async () => {
        try {
            const { data } = await mockApi.activityLogs.list();
            setAllActivityLogs(data);
        } catch (error) {
            console.error("Activity logs error:", error);
        }
    };

    // LOGOUT
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setOnboardingCompleted(false);
        navigate('/');
    };

    // INITIAL LOAD
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            (async () => {
                await fetchUser(token);
                await fetchFoodLogs();
                await fetchActivityLogs();
            })();
        } else {
            setIsUserFetched(true);
        }
    }, []);

    // CONTEXT VALUE
    const value = {
        user,
        setUser,
        isUserFetched,
        fetchUser,
        signup,
        login,
        logout,
        onboardingCompleted,
        setOnboardingCompleted,
        allFoodLogs,
        allActivityLogs,
        setAllFoodLogs,
        setAllActivityLogs
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// CUSTOM HOOK
export const useAppContext = () => useContext(AppContext);