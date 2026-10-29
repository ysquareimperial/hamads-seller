import { create } from 'zustand';

/** In-memory draft for sign-up. Cleared on completion or when sign-up restarts. */
export const useRegistrationStore = create((set) => ({
    kind: null, // 'store' | 'food' — which business they're opening first
    phone: null, // verified, +234 format
    email: null, // verified, lowercase
    personal: null, // { firstName, lastName, dob, password } from step 3
    // Food shop details kept if creating the shop fails after the account was made,
    // so /setup/food can prefill them.
    foodDraft: null,
    setKind: (kind) => set({ kind }),
    setPhone: (phone) => set({ phone }),
    setEmail: (email) => set({ email }),
    setPersonal: (personal) => set({ personal }),
    setFoodDraft: (foodDraft) => set({ foodDraft }),
    reset: () => set({ kind: null, phone: null, email: null, personal: null, foodDraft: null }),
}));
