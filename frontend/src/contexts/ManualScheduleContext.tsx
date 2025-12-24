import React, { createContext, useContext, useState, useCallback } from 'react';
import type { LessonWithVideoDTO } from '../dtos/course/LessonDTO';

export interface ScheduleItemAllocation {
  lessonId: number;
  scheduledDate: Date;
  startTime: string; // HH:mm
  duration: number; // minutos
}

export interface ManualScheduleState {
  // Informações básicas
  title: string;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
  studyDaysPerWeek: number;
  hoursPerDay: number;

  // Seleção de aulas
  selectedCourses: Set<number>;
  expandedSections: Set<number>;
  selectedLessons: Map<number, LessonWithVideoDTO>;

  // Alocações no calendário
  allocations: Map<number, ScheduleItemAllocation>;
}

interface ManualScheduleContextValue {
  state: ManualScheduleState;

  // Basic info
  setBasicInfo: (info: Partial<Omit<ManualScheduleState, 'selectedCourses' | 'expandedSections' | 'selectedLessons' | 'allocations'>>) => void;

  // Course/Section/Lesson selection
  toggleCourse: (courseId: number) => void;
  toggleSection: (sectionId: number) => void;
  toggleLesson: (lesson: LessonWithVideoDTO) => void;
  toggleAllLessonsInSection: (sectionId: number, lessons: LessonWithVideoDTO[]) => void;
  clearSelectedLessons: () => void;

  // Calendar allocations
  allocateLesson: (lessonId: number, allocation: ScheduleItemAllocation) => void;
  removeAllocation: (lessonId: number) => void;
  updateAllocation: (lessonId: number, updates: Partial<ScheduleItemAllocation>) => void;

  // Helpers
  getUnallocatedLessons: () => LessonWithVideoDTO[];
  isLessonAllocated: (lessonId: number) => boolean;
  isCourseSelected: (courseId: number) => boolean;
  isSectionExpanded: (sectionId: number) => boolean;
  isLessonSelected: (lessonId: number) => boolean;
}

const ManualScheduleContext = createContext<ManualScheduleContextValue | undefined>(undefined);

export const ManualScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ManualScheduleState>({
    title: '',
    description: null,
    startDate: null,
    endDate: null,
    studyDaysPerWeek: 5,
    hoursPerDay: 2,
    selectedCourses: new Set(),
    expandedSections: new Set(),
    selectedLessons: new Map(),
    allocations: new Map(),
  });

  const setBasicInfo = useCallback((info: Partial<Omit<ManualScheduleState, 'selectedCourses' | 'expandedSections' | 'selectedLessons' | 'allocations'>>) => {
    setState(prev => ({ ...prev, ...info }));
  }, []);

  const toggleCourse = useCallback((courseId: number) => {
    setState(prev => {
      const newSelectedCourses = new Set(prev.selectedCourses);
      if (newSelectedCourses.has(courseId)) {
        newSelectedCourses.delete(courseId);
      } else {
        newSelectedCourses.add(courseId);
      }
      return { ...prev, selectedCourses: newSelectedCourses };
    });
  }, []);

  const toggleSection = useCallback((sectionId: number) => {
    setState(prev => {
      const newExpandedSections = new Set(prev.expandedSections);
      if (newExpandedSections.has(sectionId)) {
        newExpandedSections.delete(sectionId);
      } else {
        newExpandedSections.add(sectionId);
      }
      return { ...prev, expandedSections: newExpandedSections };
    });
  }, []);

  const toggleLesson = useCallback((lesson: LessonWithVideoDTO) => {
    setState(prev => {
      const newSelectedLessons = new Map(prev.selectedLessons);
      if (newSelectedLessons.has(lesson.id)) {
        newSelectedLessons.delete(lesson.id);
      } else {
        newSelectedLessons.set(lesson.id, lesson);
      }
      return { ...prev, selectedLessons: newSelectedLessons };
    });
  }, []);

  const toggleAllLessonsInSection = useCallback((sectionId: number, lessons: LessonWithVideoDTO[]) => {
    setState(prev => {
      const newSelectedLessons = new Map(prev.selectedLessons);
      const newExpandedSections = new Set(prev.expandedSections);
      const allLessonsInSectionSelected = lessons.every(lesson => newSelectedLessons.has(lesson.id));

      if (allLessonsInSectionSelected) {
        // Desmarcar todas as aulas da seção
        lessons.forEach(lesson => newSelectedLessons.delete(lesson.id));
      } else {
        // Marcar todas as aulas da seção e expandir a seção
        lessons.forEach(lesson => newSelectedLessons.set(lesson.id, lesson));
        newExpandedSections.add(sectionId);
      }

      return { ...prev, selectedLessons: newSelectedLessons, expandedSections: newExpandedSections };
    });
  }, []);

  const clearSelectedLessons = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedLessons: new Map(),
      allocations: new Map(),
    }));
  }, []);

  const allocateLesson = useCallback((lessonId: number, allocation: ScheduleItemAllocation) => {
    setState(prev => {
      const newAllocations = new Map(prev.allocations);
      newAllocations.set(lessonId, allocation);
      return { ...prev, allocations: newAllocations };
    });
  }, []);

  const removeAllocation = useCallback((lessonId: number) => {
    setState(prev => {
      const newAllocations = new Map(prev.allocations);
      newAllocations.delete(lessonId);
      return { ...prev, allocations: newAllocations };
    });
  }, []);

  const updateAllocation = useCallback((lessonId: number, updates: Partial<ScheduleItemAllocation>) => {
    setState(prev => {
      const newAllocations = new Map(prev.allocations);
      const currentAllocation = newAllocations.get(lessonId);
      if (currentAllocation) {
        newAllocations.set(lessonId, { ...currentAllocation, ...updates });
      }
      return { ...prev, allocations: newAllocations };
    });
  }, []);

  const getUnallocatedLessons = useCallback((): LessonWithVideoDTO[] => {
    return Array.from(state.selectedLessons.values()).filter(
      lesson => !state.allocations.has(lesson.id)
    );
  }, [state.selectedLessons, state.allocations]);

  const isLessonAllocated = useCallback((lessonId: number): boolean => {
    return state.allocations.has(lessonId);
  }, [state.allocations]);

  const isCourseSelected = useCallback((courseId: number): boolean => {
    return state.selectedCourses.has(courseId);
  }, [state.selectedCourses]);

  const isSectionExpanded = useCallback((sectionId: number): boolean => {
    return state.expandedSections.has(sectionId);
  }, [state.expandedSections]);

  const isLessonSelected = useCallback((lessonId: number): boolean => {
    return state.selectedLessons.has(lessonId);
  }, [state.selectedLessons]);

  const contextValue: ManualScheduleContextValue = {
    state,
    setBasicInfo,
    toggleCourse,
    toggleSection,
    toggleLesson,
    toggleAllLessonsInSection,
    clearSelectedLessons,
    allocateLesson,
    removeAllocation,
    updateAllocation,
    getUnallocatedLessons,
    isLessonAllocated,
    isCourseSelected,
    isSectionExpanded,
    isLessonSelected,
  };

  return (
    <ManualScheduleContext.Provider value={contextValue}>
      {children}
    </ManualScheduleContext.Provider>
  );
};

export const useManualSchedule = () => {
  const context = useContext(ManualScheduleContext);
  if (!context) {
    throw new Error('useManualSchedule must be used within ManualScheduleProvider');
  }
  return context;
};
