import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { LessonProgress } from '../models/lesson.progress';

@Injectable({
	providedIn: 'root'
})
export class CoursesProgressService {

	private setOfLessonsIds = new Set<string>([]);

	private readonly COURSE_PREFIX = 'course-';

	constructor(private localStorageService: LocalStorageService) {
	}

	public getCourseLessons(courseId: string): LessonProgress[] {
		const lessons: LessonProgress[]  = this.localStorageService.getItem(this.getCourseKey(courseId)) ?? [];

		this.setOfLessonsIds.clear();
		lessons.forEach((lesson: LessonProgress) => this.setOfLessonsIds.add(lesson.id))

		return lessons;
	}

	public calculateCourseProgressPercentage(courseId: string, courseDuration: number): number {
		const sum = this.getCourseLessons(courseId)
			.reduce((acc: number, lesson: LessonProgress) => acc + lesson.progressTime, 0);

		const percentage = sum / courseDuration * 100;
		return isNaN(percentage) ? 0 : percentage;
	}

	public getLessonProgress(courseId: string, lessonId: string): LessonProgress | null {
		return this.getCourseLessons(courseId).find((lesson: LessonProgress) => lesson.id === lessonId) ?? null;
	}

	public calculateLessonProgressPercentage(courseId: string, lessonId: string, lessonDuration: number): number {
		const progressTime = this.getLessonProgress(courseId, lessonId)?.progressTime ?? 0;

		const percentage = progressTime / lessonDuration * 100;

		return isNaN(percentage) ? 0 : percentage;
	}

	public saveLessonProgress(courseId: string, lessonProgress: LessonProgress): void {
		const courseKey = this.getCourseKey(courseId);
		const { id, progressTime } = lessonProgress;

		this.localStorageService.updateArray(courseKey, (lessons: LessonProgress[]) => {
			const lessonProgressToSave = { id, progressTime: Math.floor(progressTime) }

			if (this.setOfLessonsIds.has(id)) {
				return lessons.map((lesson: LessonProgress) => {
					return lesson.id === id ? lessonProgressToSave : lesson;
				});
			}

			return [...lessons, lessonProgressToSave]

		});
	}

	private getCourseKey(courseId: string): string {
		return `${this.COURSE_PREFIX}${courseId}`;
	}
}
