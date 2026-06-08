import { create } from "zustand";
export const useResumeStore = create((set) => ({
  currentStep: 0,
  isDirty: false,
  data: {
    personalInfo: { name:"", headline:"", bio:"", email:"", phone:"", location:"" },
    experience: [],
    education: [],
    skills: [],
    links: { github:"", linkedin:"", portfolio:"", other:"" },
  },
  setStep:    (step) => set({ currentStep: step }),
  setData:    (section, value) => set((s) => ({ data: { ...s.data, [section]: value }, isDirty: true })),
  resetStore: () => set({ currentStep: 0, isDirty: false }),
}));
