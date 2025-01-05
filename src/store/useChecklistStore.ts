"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Checklist, ChecklistItem, LocationOption } from "@/types/checklist";

interface ChecklistState {
  checklists: Checklist[];

  // Admin actions
  createChecklist: (
    title: string,
    location: LocationOption,
    dueDate: string,
    dueTime: string
  ) => void;
  updateChecklist: (
    checklistId: string,
    title: string,
    location: LocationOption,
    dueDate: string,
    dueTime: string
  ) => void;
  deleteChecklist: (checklistId: string) => void;
  assignUser: (checklistId: string, userId: string) => void;
  addItem: (checklistId: string, label: string) => void;

  // Worker actions
  toggleItem: (checklistId: string, itemId: string) => void;
  addComment: (checklistId: string, itemId: string, comment: string) => void;
  addPhoto: (checklistId: string, itemId: string, photoBase64: string) => void;
  removePhoto: (
    checklistId: string,
    itemId: string,
    photoIndex: number
  ) => void;
  finishChecklist: (checklistId: string) => void;
}

export const useChecklistStore = create(
  persist<ChecklistState>(
    (set, get) => ({
      checklists: [],

      // Create a new checklist (Görev)
      createChecklist: (title, location, dueDate, dueTime) => {
        const newChecklist: Checklist = {
          id: crypto.randomUUID(),
          title,
          location,
          dueDate,
          dueTime,
          // Record creation time as an ISO string or human-readable.
          createdAt: new Date().toISOString(),
          // Hardcode creator for now; replace with real user info if needed
          creatorName: "Admin",

          assignedUserId: undefined,
          items: [],
          completed: false,
        };
        set((state) => ({
          checklists: [...state.checklists, newChecklist],
        }));
      },

      // Update an existing checklist
      updateChecklist: (checklistId, title, location, dueDate, dueTime) => {
        set((state) => ({
          checklists: state.checklists.map((cl) =>
            cl.id === checklistId
              ? {
                  ...cl,
                  title,
                  location,
                  dueDate,
                  dueTime,
                  // we do NOT overwrite createdAt or creatorName here
                }
              : cl
          ),
        }));
      },

      deleteChecklist: (checklistId) => {
        set((state) => ({
          checklists: state.checklists.filter((cl) => cl.id !== checklistId),
        }));
      },

      assignUser: (checklistId, userId) => {
        set((state) => ({
          checklists: state.checklists.map((cl) =>
            cl.id === checklistId ? { ...cl, assignedUserId: userId } : cl
          ),
        }));
      },

      addItem: (checklistId, label) => {
        set((state) => ({
          checklists: state.checklists.map((cl) => {
            if (cl.id === checklistId) {
              const newItem: ChecklistItem = {
                id: crypto.randomUUID(),
                label,
                checked: false,
              };
              return { ...cl, items: [...cl.items, newItem] };
            }
            return cl;
          }),
        }));
      },

      toggleItem: (checklistId, itemId) => {
        set((state) => ({
          checklists: state.checklists.map((cl) => {
            if (cl.id === checklistId) {
              return {
                ...cl,
                items: cl.items.map((item) =>
                  item.id === itemId
                    ? { ...item, checked: !item.checked }
                    : item
                ),
              };
            }
            return cl;
          }),
        }));
      },

      addComment: (checklistId, itemId, comment) => {
        set((state) => ({
          checklists: state.checklists.map((cl) => {
            if (cl.id === checklistId) {
              return {
                ...cl,
                items: cl.items.map((item) =>
                  item.id === itemId ? { ...item, comment } : item
                ),
              };
            }
            return cl;
          }),
        }));
      },

      addPhoto: (checklistId, itemId, photoBase64) => {
        set((state) => ({
          checklists: state.checklists.map((cl) => {
            if (cl.id !== checklistId) return cl;
            return {
              ...cl,
              items: cl.items.map((item) => {
                if (item.id !== itemId) return item;
                const newPhotos = item.photos ? [...item.photos] : [];
                newPhotos.push(photoBase64);
                return { ...item, photos: newPhotos };
              }),
            };
          }),
        }));
      },

      removePhoto: (checklistId, itemId, photoIndex) => {
        set((state) => ({
          checklists: state.checklists.map((cl) => {
            if (cl.id !== checklistId) return cl;
            return {
              ...cl,
              items: cl.items.map((item) => {
                if (item.id !== itemId || !item.photos) return item;
                const updatedPhotos = [...item.photos];
                updatedPhotos.splice(photoIndex, 1);
                return { ...item, photos: updatedPhotos };
              }),
            };
          }),
        }));
      },

      finishChecklist: (checklistId) => {
        set((state) => {
          const updated = state.checklists.map((cl) => {
            if (cl.id === checklistId) {
              const totalItems = cl.items.length;
              const checkedItems = cl.items.filter((i) => i.checked).length;
              const score = checkedItems; // Example scoring
              return { ...cl, completed: true, score };
            }
            return cl;
          });
          return { checklists: updated };
        });
      },
    }),
    {
      name: "checklist-storage",
    }
  )
);
