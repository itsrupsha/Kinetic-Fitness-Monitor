import { Routes, Route } from "react-router-dom"
import Layout from "./pages/Layout"
import Dashboard from "./pages/Dashboard"
import FoodLog from "./pages/FoodLog"
import ActivityLog from "./pages/ActivityLog"
import Profile from "./pages/Profile"
import { useAppContext } from "./context/AppContext"
import Login from "./pages/Login"
import Loading from "./components/ui/Loading"
import Onboarding from "./pages/Onboarding"
import { Toaster } from "react-hot-toast"
import { useState } from "react"
import ProfileSetupModal from "./components/ProfileSetupModal"

const App = () => {
  const { user, isUserFetched, onboardingCompleted } = useAppContext()
  const [showProfileSetup, setShowProfileSetup] = useState(true)

  if (!user) {
    return isUserFetched ? <Login /> : <Loading />
  }

  // Show profile setup popup if user hasn't completed it yet
  // (You can also check if profile fields are empty instead)
  const isProfileIncomplete = !user.age || !user.weight

  return (
    <>
      <Toaster />

      {/* Profile Setup Popup - appears after login */}
      {showProfileSetup && isProfileIncomplete && (
        <ProfileSetupModal onComplete={() => setShowProfileSetup(false)} />
      )}

      {/* Original Onboarding flow (kept as fallback) */}
      {!onboardingCompleted ? (
        <Onboarding />
      ) : (
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="food" element={<FoodLog />} />
            <Route path="activity" element={<ActivityLog />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      )}
    </>
  )
}

export default App