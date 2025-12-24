import { useState, useEffect, useCallback } from 'react';
import type { CourseDTO } from '../../dtos/course/CourseDTO';
import { courseService } from '../../services';
import type { ApiErrorDTO } from '../../dtos/common/ApiErrorDTO';

interface UseCourseListReturn {
  courses: CourseDTO[] | null;
  loading: boolean;
  error: ApiErrorDTO | null;
  refetch: () => Promise<void>;
}

export const useCourseList = (): UseCourseListReturn => {
  const [courses, setCourses] = useState<CourseDTO[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiErrorDTO | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseService.list();
      setCourses(data);
    } catch (err) {
      setError(err as ApiErrorDTO);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses,
  };
};
