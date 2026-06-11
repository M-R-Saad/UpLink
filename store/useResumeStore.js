import { create } from "zustand";

const initialData = {
  personalInfo: { name: "", headline: "", bio: "", email: "", phone: "", location: "" },
  experience: [],
  education: [],
  skills: [],
  links: { github: "", linkedin: "", portfolio: "", other: "" },
};

export const useResumeStore = create((set, get) => ({
  currentStep: 0,
  isDirty: false,
  data: { ...initialData },

  setStep: (step) => set({ currentStep: step }),

  setData: (section, value) =>
    set((s) => ({
      data: { ...s.data, [section]: value },
      isDirty: true,
    })),

  setFullData: (newData) =>
    set({ data: { ...initialData, ...newData }, isDirty: true }),

  // Hydrate store from API response without marking dirty
  loadData: (resumeData) => {
    if (!resumeData) return;
    set({
      data: {
        personalInfo: { ...initialData.personalInfo, ...resumeData.personalInfo },
        experience: resumeData.experience || [],
        education: resumeData.education || [],
        skills: resumeData.skills || [],
        links: { ...initialData.links, ...resumeData.links },
      },
      isDirty: false,
    });
  },

  markClean: () => set({ isDirty: false }),

  resetStore: () =>
    set({
      currentStep: 0,
      isDirty: false,
      data: { ...initialData },
    }),
}));
