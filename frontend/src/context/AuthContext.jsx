import { createContext, useContext, useEffect, useMemo, useState } from "react";

const USERS_KEY = "ayudee-demo-users";
const CURRENT_USER_KEY = "ayudee-current-user";

const hashValue = async (value) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const demoUsers = [
  {
    id: "patient-demo",
    name: "Alice Sharma",
    email: "patient@example.com",
    passwordHash: "",
    role: "PATIENT",
    ageRange: "65-74",
    reminderTime: "09:00",
    interests: ["Family", "Gardening", "Stories"],
    connectionCode: "A1B2C3",
    linkedCaregiverId: "caregiver-demo",
  },
  {
    id: "caregiver-demo",
    name: "Sarah Sharma",
    email: "caregiver@example.com",
    passwordHash: "",
    role: "CAREGIVER",
    relationship: "Daughter",
    connectionCode: "",
    linkedPatientId: "patient-demo",
  },
];

const seedUsers = async () => {
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) {
    const existing = JSON.parse(stored);
    const normalized = await Promise.all(existing.map(async (user) => {
      if (user.passwordHash) return user;
      const demoPassword = user.email === "patient@example.com" ? "patient123" : user.email === "caregiver@example.com" ? "caregiver123" : "";
      return demoPassword ? { ...user, passwordHash: await hashValue(demoPassword) } : user;
    }));
    localStorage.setItem(USERS_KEY, JSON.stringify(normalized));
    return normalized;
  }

  const seeded = await Promise.all(
    demoUsers.map(async (user) => ({
      ...user,
      passwordHash: user.email.includes("patient") ? await hashValue("patient123") : await hashValue("caregiver123"),
    })),
  );

  localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
  return seeded;
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      const savedUser = localStorage.getItem(CURRENT_USER_KEY);
      const users = await seedUsers();
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const seeded = users.find((item) => item.id === parsed.id);
        setUser(seeded || parsed);
      }
      setReady(true);
    };

    bootstrap();
  }, []);

  useEffect(() => {
    if (ready && user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  }, [ready, user]);

  const registerUser = async ({ name, email, password, role, ageRange, reminderTime, interests, relationship }) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const exists = users.some((item) => item.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error("An account already exists with that email.");
    }

    const safeName = name.trim();
    const nextUser = {
      id: `${role.toLowerCase()}-${Date.now()}`,
      name: safeName,
      email: email.trim(),
      passwordHash: await hashValue(password),
      role,
      ageRange: ageRange || "",
      reminderTime: reminderTime || "09:00",
      interests: interests || [],
      relationship: relationship || "",
      connectionCode: role === "PATIENT" ? Math.random().toString(36).slice(2, 8).toUpperCase() : "",
      linkedCaregiverId: "",
      linkedPatientId: "",
    };

    const nextUsers = [...users, nextUser];
    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
    setUser(nextUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(nextUser));
    return nextUser;
  };

  const loginUser = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const demoPassword = normalizedEmail === "patient@example.com" ? "patient123" : normalizedEmail === "caregiver@example.com" ? "caregiver123" : null;
    if (demoPassword && password === demoPassword) {
      const demoUser = demoUsers.find((item) => item.email === normalizedEmail);
      const authenticatedDemo = { ...demoUser, role: demoUser.role.toUpperCase() };
      setUser(authenticatedDemo);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authenticatedDemo));
      return authenticatedDemo;
    }

    const users = await seedUsers();
    const found = users.find((item) => item.email.toLowerCase() === normalizedEmail);
    if (!found) {
      throw new Error("No account was found for this email.");
    }

    const hashed = await hashValue(password);
    if (found.passwordHash !== hashed && !(demoPassword && password === demoPassword)) {
      throw new Error("The password is incorrect.");
    }

    const authenticatedUser = { ...found, role: found.role.toUpperCase() };
    setUser(authenticatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authenticatedUser));
    return authenticatedUser;
  };

  const updateUser = (updated) => {
    setUser(updated);
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const nextUsers = users.map((item) => (item.id === updated.id ? updated : item));
    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const connectCaregiverToPatient = (caregiverId, patientCode) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const patient = users.find((item) => item.connectionCode === patientCode && item.role === "PATIENT");
    if (!patient) {
      throw new Error("That connection code could not be found.");
    }

    const caregiver = users.find((item) => item.id === caregiverId);
    if (!caregiver) {
      throw new Error("Caregiver profile is unavailable.");
    }

    const patientUpdated = { ...patient, linkedCaregiverId: caregiver.id };
    const caregiverUpdated = { ...caregiver, linkedPatientId: patient.id };

    const nextUsers = users.map((item) => {
      if (item.id === patient.id) return patientUpdated;
      if (item.id === caregiver.id) return caregiverUpdated;
      return item;
    });

    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
    setUser(caregiverUpdated);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(caregiverUpdated));
    return { patient: patientUpdated, caregiver: caregiverUpdated };
  };

  const value = useMemo(
    () => ({
      user,
      ready,
      registerUser,
      loginUser,
      logout,
      updateUser,
      connectCaregiverToPatient,
    }),
    [user, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
