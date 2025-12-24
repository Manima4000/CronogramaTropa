import { useState, useEffect, useCallback } from 'react';
import type { SectionDTO } from '../../dtos/course/SectionDTO';
import { sectionService } from '../../services';
import type { ApiErrorDTO } from '../../dtos/common/ApiErrorDTO';

interface UseSectionsByCourseReturn {
  sections: SectionDTO[] | null;
  loading: boolean;
  error: ApiErrorDTO | null;
  refetch: () => Promise<void>;
}

export const useSectionsByCourse = (courseId: number): UseSectionsByCourseReturn => {
  const [sections, setSections] = useState<SectionDTO[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiErrorDTO | null>(null);

  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sectionService.listByCourse(courseId);
      setSections(data);
    } catch (err) {
      setError(err as ApiErrorDTO);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  return {
    sections,
    loading,
    error,
    refetch: fetchSections,
  };
};
