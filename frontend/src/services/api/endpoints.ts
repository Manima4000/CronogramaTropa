export const ENDPOINTS = {
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
} as const;
