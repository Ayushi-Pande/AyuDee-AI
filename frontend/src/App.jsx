import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AppSettingsProvider } from "./context/AppSettingsContext";
import { AuthProvider } from "./context/AuthContext";
import Landing from "./pages/Landing";
import ChooseRole from "./pages/ChooseRole";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Patient Pages
import PatientDashboard from "./pages/patient/Dashboard";
import PatientMemories from "./pages/patient/Memories";
import PatientGames from "./pages/patient/Games";
import PatientReminders from "./pages/patient/Reminders";
import PatientCompanion from "./pages/patient/Companion";
import PatientHelp from "./pages/patient/Help";
import PatientToday from "./pages/patient/Today";

// Caregiver Pages
import CaregiverDashboard from "./pages/caregiver/Dashboard";
import CaregiverMemories from "./pages/caregiver/Memories";
import CaregiverReminders from "./pages/caregiver/Reminders";
import CaregiverInsights from "./pages/caregiver/Insights";
import CaregiverGames from "./pages/caregiver/Games";
import CaregiverConnect from "./pages/caregiver/Connect";

function App() {
  return (
    <AuthProvider>
      <AppSettingsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/choose-role" element={<ChooseRole />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Patient Routes */}
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/patient/memories" element={<PatientMemories />} />
            <Route path="/patient/games" element={<PatientGames />} />
            <Route path="/patient/reminders" element={<PatientReminders />} />
            <Route path="/patient/companion" element={<PatientCompanion />} />
            <Route path="/patient/help" element={<PatientHelp />} />
            <Route path="/patient/today" element={<PatientToday />} />
            <Route path="/patient/profile" element={<Profile role="PATIENT" />} />
            <Route path="/patient/progress" element={<PatientGames />} />

            {/* Caregiver Routes */}
            <Route path="/caregiver" element={<CaregiverDashboard />} />
            <Route path="/caregiver/patient" element={<CaregiverDashboard />} />
            <Route path="/caregiver/memories" element={<CaregiverMemories />} />
            <Route path="/caregiver/reminders" element={<CaregiverReminders />} />
            <Route path="/caregiver/insights" element={<CaregiverInsights />} />
            <Route path="/caregiver/games" element={<CaregiverGames />} />
            <Route path="/caregiver/connect" element={<CaregiverConnect />} />
            <Route path="/caregiver/profile" element={<Profile role="CAREGIVER" />} />
            <Route path="/caregiver/settings" element={<Profile role="CAREGIVER" />} />
            <Route path="/caregiver/activity" element={<CaregiverGames />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppSettingsProvider>
    </AuthProvider>
  );
}

export default App;