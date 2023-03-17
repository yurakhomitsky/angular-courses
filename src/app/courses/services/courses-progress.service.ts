import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { LessonProgress } from '../models/lesson.progress';

@Injectable({
	providedIn: 'root'
})
export class CoursesProgressService {
	private readonly COURSE_PREFIX = 'course-';

	private setOfSavedLessonsIds = new Set<string>([]);
	private courseLessonsMap = new Map<string, LessonProgress[]>();

	constructor(private localStorageService: LocalStorageService) {}

	public getCourseKey(courseId: string): string {
		return `${this.COURSE_PREFIX}${courseId}`;
	}

	public getCourseLessons(courseId: string): LessonProgress[] {
		if (this.courseLessonsMap.has(this.getCourseKey(courseId))) {
			return this.courseLessonsMap.get(this.getCourseKey(courseId)) ?? [];
		}

		const lessons: LessonProgress[] = this.localStorageService.getItem(this.getCourseKey(courseId)) ?? [];

		this.courseLessonsMap.set(this.getCourseKey(courseId), lessons);

		lessons.forEach((lesson: LessonProgress) => this.setOfSavedLessonsIds.add(lesson.id));

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
			const lessonProgressToSave = { id, progressTime: Math.floor(progressTime) };

			if (this.setOfSavedLessonsIds.has(id)) {
				return lessons.map((lesson: LessonProgress) => {
					return lesson.id === id ? lessonProgressToSave : lesson;
				});
			}
			return [...lessons, lessonProgressToSave];
		});

		// To sync with LocalStorage data next time we ask for course lessons
		this.clearCourseLessonsMap(courseId);
	}

	private clearCourseLessonsMap(courseId: string): void {
		this.courseLessonsMap.delete(this.getCourseKey(courseId));
	}
}
