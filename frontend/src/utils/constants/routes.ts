export const ROUTES = {
  home: '/',
  schedules: {
    list: '/schedules',
    create: '/schedules/new',
    detail: (id: number | string) => `/schedules/${id}`,
    detailPattern: '/schedules/:id',
  },
  courses: {
    list: '/courses',
  },
  sync: '/sync',
  notFound: '*',
} as const;
