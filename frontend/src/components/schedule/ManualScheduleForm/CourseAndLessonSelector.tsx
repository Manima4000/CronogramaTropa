import React, { useState } from 'react';
import { useManualSchedule } from '../../../contexts/ManualScheduleContext';
import { useCourseList } from '../../../hooks/course/useCourseList';
import { useSectionsByCourse } from '../../../hooks/section/useSectionsByCourse';
import { useLessonsWithVideosBySection } from '../../../hooks/lesson/useLessonsWithVideos';
import { Card } from '../../../shared/ui/Card/Card';
import { Badge } from '../../../shared/ui/Badge/Badge';
import { Icon } from '../../../shared/ui/Icon/Icon';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorMessage } from '../../../shared/feedback/ErrorMessage';

export const CourseAndLessonSelector: React.FC = () => {
  const { courses, loading, error } = useCourseList();

  if (loading) return <LoadingState message="Carregando cursos..." />;
  if (error) return <ErrorMessage error={error.message} />;
  if (!courses || courses.length === 0) return <ErrorMessage error="Nenhum curso encontrado" />;

  return (
    <Card padding="lg">
      <h2 className="text-2xl font-bold text-military-dark mb-6">
        Seleção de Aulas
      </h2>

      <div className="space-y-4">
        {courses.map(course => (
          <CourseItem key={course.id} course={course} />
        ))}
      </div>
    </Card>
  );
};

interface CourseItemProps {
  course: { id: number; name: string };
}

const CourseItem: React.FC<CourseItemProps> = ({ course }) => {
  const { toggleCourse, isCourseSelected } = useManualSchedule();
  const [expanded, setExpanded] = useState(false);
  const isSelected = isCourseSelected(course.id);

  const handleToggle = () => {
    toggleCourse(course.id);
    if (!isSelected) setExpanded(true);
  };

  return (
    <div className="border border-military-gray rounded-lg p-4">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleToggle}
          className="w-5 h-5 text-military-green focus:ring-military-green"
        />
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 flex items-center justify-between text-left"
        >
          <span className="font-semibold text-military-dark">{course.name}</span>
          <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size="md" />
        </button>
      </div>

      {expanded && isSelected && (
        <div className="mt-4 ml-8 space-y-3">
          <SectionsList courseId={course.id} />
        </div>
      )}
    </div>
  );
};

interface SectionsListProps {
  courseId: number;
}

const SectionsList: React.FC<SectionsListProps> = ({ courseId }) => {
  const { sections, loading, error } = useSectionsByCourse(courseId);

  if (loading) return <LoadingState message="Carregando seções..." />;
  if (error) return <ErrorMessage error={error.message} />;
  if (!sections || sections.length === 0) return <p className="text-sm text-military-gray">Nenhuma seção encontrada</p>;

  return (
    <>
      {sections.map(section => (
        <SectionItem key={section.id} section={section} />
      ))}
    </>
  );
};

interface SectionItemProps {
  section: { id: number; name: string };
}

const SectionItem: React.FC<SectionItemProps> = ({ section }) => {
  const { toggleSection, isSectionExpanded, toggleAllLessonsInSection } = useManualSchedule();
  const isExpanded = isSectionExpanded(section.id);
  const { lessons, loading } = useLessonsWithVideosBySection(section.id);

  const handleSelectAll = () => {
    if (lessons) {
      toggleAllLessonsInSection(section.id, lessons);
    }
  };

  return (
    <div className="border-l-2 border-military-green pl-4">
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => toggleSection(section.id)}
          className="flex items-center gap-2 text-left flex-1"
        >
          <Icon name={isExpanded ? 'folder-open' : 'folder'} size="sm" />
          <span className="font-medium text-military-dark">{section.name}</span>
        </button>
        <button
          onClick={handleSelectAll}
          className="text-sm text-military-green hover:underline"
          disabled={loading}
        >
          Selecionar todas
        </button>
      </div>

      {isExpanded && (
        <div className="mt-2 space-y-2">
          <LessonsList sectionId={section.id} />
        </div>
      )}
    </div>
  );
};

interface LessonsListProps {
  sectionId: number;
}

const LessonsList: React.FC<LessonsListProps> = ({ sectionId }) => {
  const { lessons, loading, error } = useLessonsWithVideosBySection(sectionId);
  const { toggleLesson, isLessonSelected } = useManualSchedule();

  if (loading) return <LoadingState message="Carregando aulas..." />;
  if (error) return <ErrorMessage error={error.message} />;
  if (!lessons || lessons.length === 0) return <p className="text-sm text-military-gray ml-6">Nenhuma aula encontrada</p>;

  return (
    <div className="ml-6 space-y-2">
      {lessons.map(lesson => {
        const isSelected = isLessonSelected(lesson.id);
        const duration = lesson.video?.duration;

        return (
          <div key={lesson.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleLesson(lesson)}
              className="w-4 h-4 text-military-green focus:ring-military-green"
            />
            <label className="flex-1 flex items-center gap-2 cursor-pointer">
              <Icon name="play-circle" size="sm" className="text-military-green" />
              <span className="text-sm">{lesson.title}</span>
              {duration ? (
                <Badge variant="success">{duration} min</Badge>
              ) : (
                <Badge variant="default">Sem vídeo</Badge>
              )}
            </label>
          </div>
        );
      })}
    </div>
  );
};
