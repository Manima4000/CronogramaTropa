import { Select } from '../../../shared/ui/Select/Select';
import { useCourseList } from '../../../hooks/course/useCourseList';
import { Spinner } from '../../../shared/ui/Spinner/Spinner';
import { Icon } from '../../../shared/ui/Icon/Icon';
import { forwardRef } from 'react';

interface CourseSelectorProps {
  value?: number | string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  name?: string;
}

export const CourseSelector = forwardRef<HTMLSelectElement, CourseSelectorProps>(
  ({ value, onChange, error, onBlur, name }, ref) => {
    const { courses, loading, error: fetchError } = useCourseList();

    if (loading) {
      return (
        <div className="w-full">
          <label className="block text-sm font-medium text-military-dark mb-1">
            Curso
          </label>
          <div className="flex items-center justify-center p-4 border border-military-light-gray rounded bg-white">
            <Spinner size="sm" className="mr-2" />
            <span className="text-military-gray text-sm">Carregando cursos...</span>
          </div>
        </div>
      );
    }

    if (fetchError) {
      return (
        <div className="w-full">
          <label className="block text-sm font-medium text-military-dark mb-1">
            Curso
          </label>
          <div className="flex items-center p-4 border border-red-200 rounded bg-red-50">
            <Icon name="exclamation-triangle" className="text-red-600 mr-2" />
            <span className="text-red-700 text-sm">Erro ao carregar cursos</span>
          </div>
        </div>
      );
    }

    const options = courses?.map((course) => ({
      value: course.id,
      label: course.name,
    })) || [];

    return (
      <Select
        ref={ref}
        name={name}
        label="Curso *"
        placeholder="Selecione um curso"
        options={options}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        fullWidth
      />
    );
  }
);

CourseSelector.displayName = 'CourseSelector';
