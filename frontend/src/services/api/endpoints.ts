export const ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
  },
  schedules: {
    base: '/api/schedules',
    byId: (id: number) => `/api/schedules/${id}`,
    exportPDF: (id: number) => `/api/schedules/${id}/export/pdf`,
  },
  sync: {
    courses: '/api/sync/courses',
    sections: '/api/sync/sections',
    videos: '/api/sync/videos',
    classrooms: '/api/sync/classrooms',
  },
  courses: {
    base: '/api/courses',
    byId: (id: number) => `/api/courses/${id}`,
  },
  sections: {
    byCourse: (courseId: number) => `/api/sections/course/${courseId}`,
  },
  lessons: {
    bySection: (sectionId: number) => `/api/lessons/section/${sectionId}`,
    byCourse: (courseId: number) => `/api/lessons/course/${courseId}`,
  },
} as const;
