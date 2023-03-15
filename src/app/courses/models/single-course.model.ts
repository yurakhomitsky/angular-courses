import { CourseModel } from './course.model';
import { LessonModel } from './lesson.model';

export interface SingleCourseModel extends CourseModel {
	lessons: LessonModel[];
}
