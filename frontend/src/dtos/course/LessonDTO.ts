export interface LessonDTO {
  id: number;
  title: string;
  slug: string;
  position: number;
  sectionId: number;
}

export interface VideoDTO {
  id: number;
  source: string | null;
  uid: string | null;
  duration: number | null;
  image: string | null;
  lessonId: number;
}

export interface LessonWithVideoDTO extends LessonDTO {
  video: VideoDTO | null;
}
