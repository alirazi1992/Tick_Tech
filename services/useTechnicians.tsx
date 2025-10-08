"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type {
  Technician,
  TechnicianCategoryAssignments,
} from "@/services/technician-types"

const TECHNICIANS_STORAGE_KEY = "ticketing.technicians.v1"
const TECHNICIAN_ASSIGNMENTS_STORAGE_KEY = "ticketing.technician-assignments.v1"

type TechnicianContextValue = {
  technicians: Technician[]
  assignments: TechnicianCategoryAssignments
  setTechnicians: (next: Technician[]) => void
  setCategoryTechnicians: (categoryId: string, technicianIds: string[]) => void
  setSubcategoryTechnicians: (categoryId: string, subcategoryId: string, technicianIds: string[]) => void
  resetAssignments: () => void
}

const TechnicianContext = createContext<TechnicianContextValue | null>(null)

interface TechnicianProviderProps {
  children: ReactNode
  initialTechnicians: Technician[]
  initialAssignments: TechnicianCategoryAssignments
}

export function TechnicianProvider({
  children,
  initialTechnicians,
  initialAssignments,
}: TechnicianProviderProps) {
  const [technicians, setTechniciansState] = useState<Technician[]>(initialTechnicians)
  const [assignments, setAssignments] = useState<TechnicianCategoryAssignments>(initialAssignments)

  useEffect(() => {
    if (typeof window === "undefined") return

    const storedTechnicians = localStorage.getItem(TECHNICIANS_STORAGE_KEY)
    if (storedTechnicians) {
      try {
        const parsed = JSON.parse(storedTechnicians)
        if (Array.isArray(parsed)) {
          setTechniciansState(parsed)
        }
      } catch {
        // ignore invalid data
      }
    } else {
      localStorage.setItem(TECHNICIANS_STORAGE_KEY, JSON.stringify(initialTechnicians))
    }
  }, [initialTechnicians])

  useEffect(() => {
    if (typeof window === "undefined") return

    const storedAssignments = localStorage.getItem(TECHNICIAN_ASSIGNMENTS_STORAGE_KEY)
    if (storedAssignments) {
      try {
        const parsed = JSON.parse(storedAssignments)
        if (parsed && typeof parsed === "object") {
          setAssignments(parsed)
        }
      } catch {
        // ignore invalid data
      }
    } else {
      localStorage.setItem(
        TECHNICIAN_ASSIGNMENTS_STORAGE_KEY,
        JSON.stringify(initialAssignments),
      )
    }
  }, [initialAssignments])

  const persistTechnicians = useCallback((next: Technician[]) => {
    setTechniciansState(next)
    if (typeof window !== "undefined") {
      localStorage.setItem(TECHNICIANS_STORAGE_KEY, JSON.stringify(next))
    }
  }, [])

  const persistAssignments = useCallback(
    (
      next:
        | TechnicianCategoryAssignments
        | ((prev: TechnicianCategoryAssignments) => TechnicianCategoryAssignments),
    ) => {
      setAssignments((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next
        if (typeof window !== "undefined") {
          localStorage.setItem(
            TECHNICIAN_ASSIGNMENTS_STORAGE_KEY,
            JSON.stringify(resolved),
          )
        }
        return resolved
      })
    },
    [],
  )

  const setCategoryTechnicians = useCallback(
    (categoryId: string, technicianIds: string[]) => {
      const normalized = Array.from(new Set(technicianIds))
      persistAssignments((prev) => {
        const current = prev[categoryId] || { technicians: [], subcategories: {} }
        return {
          ...prev,
          [categoryId]: {
            technicians: normalized,
            subcategories: current.subcategories,
          },
        }
      })
    },
    [persistAssignments],
  )

  const setSubcategoryTechnicians = useCallback(
    (categoryId: string, subcategoryId: string, technicianIds: string[]) => {
      const normalized = Array.from(new Set(technicianIds))
      persistAssignments((prev) => {
        const current = prev[categoryId] || { technicians: [], subcategories: {} }
        return {
          ...prev,
          [categoryId]: {
            technicians: current.technicians,
            subcategories: {
              ...current.subcategories,
              [subcategoryId]: normalized,
            },
          },
        }
      })
    },
    [persistAssignments],
  )

  const resetAssignments = useCallback(() => {
    persistAssignments(initialAssignments)
  }, [initialAssignments, persistAssignments])

  const value = useMemo(
    () => ({
      technicians,
      assignments,
      setTechnicians: persistTechnicians,
      setCategoryTechnicians,
      setSubcategoryTechnicians,
      resetAssignments,
    }),
    [assignments, persistTechnicians, resetAssignments, setCategoryTechnicians, setSubcategoryTechnicians, technicians],
  )

  return <TechnicianContext.Provider value={value}>{children}</TechnicianContext.Provider>
}

export function useTechnicians() {
  const ctx = useContext(TechnicianContext)
  if (!ctx) {
    throw new Error("useTechnicians must be used within TechnicianProvider")
  }
  return ctx
}
