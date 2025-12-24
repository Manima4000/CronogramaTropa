import { useState, useEffect, useCallback } from 'react';
import type { LessonWithVideoDTO } from '../../dtos/course/LessonDTO';
import { lessonService } from '../../services';
import type { ApiErrorDTO } from '../../dtos/common/ApiErrorDTO';

interface UseLessonsWithVideosReturn {
  lessons: LessonWithVideoDTO[] | null;
  loading: boolean;
  error: ApiErrorDTO | null;
  refetch: () => Promise<void>;
}

export const useLessonsWithVideosBySection = (sectionId: number): UseLessonsWithVideosReturn => {
  const [lessons, setLessons] = useState<LessonWithVideoDTO[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiErrorDTO | null>(null);

  const fetchLessons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await lessonService.listBySectionWithVideos(sectionId);
      setLessons(data);
    } catch (err) {
      setError(err as ApiErrorDTO);
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  return {
    lessons,
    loading,
    error,
    refetch: fetchLessons,
  };
};

export const useLessonsWithVideosByCourse = (courseId: number): UseLessonsWithVideosReturn => {
  const [lessons, setLessons] = useState<LessonWithVideoDTO[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiErrorDTO | null>(null);

  const fetchLessons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await lessonService.listByCourseWithVideos(courseId);
      setLessons(data);
    } catch (err) {
      setError(err as ApiErrorDTO);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  return {
    lessons,
    loading,
    error,
    refetch: fetchLessons,
  };
};
