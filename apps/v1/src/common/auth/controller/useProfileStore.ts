import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {UserProfile} from "@plug/common-services";

interface AuthStore {
    user: UserProfile | null;
    setUser: (user: UserProfile) => void;
    clearUser: () => void;
}

export const useProfileStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null })
        }),
        {
            name: 'user-profile'
        }
    )
);
