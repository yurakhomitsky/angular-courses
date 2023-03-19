import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { LessonProgress } from '../models/lesson.progress';

@Injectable({
	providedIn: 'root'
})
export class CoursesProgressService {
	private readonly COURSE_PREFIX = 'course-';

	constructor(private localStorageService: LocalStorageService) {}

	public getCourseKey(courseId: string): string {
		return `${this.COURSE_PREFIX}${courseId}`;
	}

	public getCourseLessonsProgress(courseId: string): LessonProgress[] {
		return this.localStorageService.getItem(this.getCourseKey(courseId)) ?? [];
	}

	public calculateCourseProgressTime(courseId: string): number {
		return this.getCourseLessonsProgress(courseId).reduce((acc: number, lesson: LessonProgress) => acc + lesson.progressTime, 0);
	}

	public saveLessonProgress(courseId: string, lessonProgress: LessonProgress): void {
		const courseKey = this.getCourseKey(courseId);
		const { id, progressTime } = lessonProgress;

		this.localStorageService.updateArray(courseKey, (lessons: LessonProgress[]) => {
			const lessonProgressToSave: LessonProgress = { id, progressTime };

		  const setOfSavedLessonsIds = new Set<string>(lessons.map((lesson: LessonProgress) => lesson.id));

			if (setOfSavedLessonsIds.has(id)) {
				return lessons.map((lesson: LessonProgress) => {
					return lesson.id === id ? lessonProgressToSave : lesson;
				});
			}
			return [...lessons, lessonProgressToSave];
		});
	}
}
