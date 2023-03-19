import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
	catchError,
	map,
	Observable,
	of,
	startWith,
	switchMap,
	tap
} from 'rxjs';
import { CoursesService } from '../services/courses.service';
import { SingleCourseModel } from '../models/single-course.model';
import { LessonModel } from '../models/lesson.model';
import { CoursesProgressService } from '../services/courses-progress.service';
import { ViewStateModel } from '../models/view-state.model';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { LessonProgress } from '../models/lesson.progress';

@Component({
	selector: 'app-course',
	templateUrl: './course.component.html',
	styleUrls: ['./course.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit, OnDestroy {
	private courseId = this.activatedRoute.snapshot.params['id'];

	public selectedLesson: LessonModel | null = null;

	public updatedSelectedLessonProgressTime = 0;
	private selectedLessonIndex = 0;

	private lessonsProgressTimeMap = new Map<string, number>()

	private courseId$: Observable<string> = this.activatedRoute.params.pipe(
		map((params: Params) => params['id']),
		tap((courseId: string) => this.courseId = courseId)
	);

	public viewState$: Observable<ViewStateModel<SingleCourseModel>> = this.courseId$.pipe(
		switchMap((courseId: string) => this.coursesService.getCourse(courseId).pipe(
			tap((course: SingleCourseModel) => {
				this.sortLessons(course);
				const [lesson, index] = this.getInitialSelectedLessonAndIndex(course.lessons);
				this.updateSelectedLesson(lesson, index);
				this.addLessonToQueryParams(index);
			}),
			map((course: SingleCourseModel) => {
				return { isLoading: false, data: course };
			}),
			catchError(() => of({ isLoading: false, data: null, error: 'Could not load the course' })),
			startWith({ isLoading: true, data: null }),
		))
	);

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private coursesService: CoursesService,
		private coursesProgressService: CoursesProgressService
	) {}

	public ngOnInit(): void {
		this.populateLessonsProgressMap();
	}

	public getLessonProgressTime(lessonId: string): number {
		return this.lessonsProgressTimeMap.get(lessonId) ?? 0;
	}

	public ngOnDestroy(): void {
		this.savePreviousLessonProgress();
	}

	public isLessonSelected(lessonOrder: number): boolean {
		return lessonOrder === coerceNumberProperty(this.activatedRoute.snapshot.queryParams['lesson'], null);
	}

	public updateSelectedLesson(lesson: LessonModel, index: number): void {
		this.selectedLessonIndex = index;
		this.selectedLesson = lesson;
	}

	public selectLesson(lesson: LessonModel, index: number): void {
		if (lesson.status !== 'locked' && lesson.id !== this.selectedLesson?.id) {
			this.savePreviousLessonProgress();
			this.recalculateProgressForPreviousLesson();
			this.updateSelectedLesson(lesson, index);
		}
	}

	public onTimeWatchChanged(time: number): void {
		this.updatedSelectedLessonProgressTime = time;
	}

	private savePreviousLessonProgress(): void {
		this.coursesProgressService.saveLessonProgress(this.courseId, {
			id: this.selectedLesson?.id ?? '',
			progressTime: this.updatedSelectedLessonProgressTime
		});
	}

	private recalculateProgressForPreviousLesson(): void {
		this.lessonsProgressTimeMap.set(this.selectedLesson!.id, this.updatedSelectedLessonProgressTime)
	}

	private getInitialSelectedLessonAndIndex(lessons: LessonModel[]): [LessonModel, number] {
		const lessonOrder = coerceNumberProperty(this.activatedRoute.snapshot.queryParams['lesson'], null)
		const index = lessonOrder == null ? 0 : lessonOrder - 1;

		return [lessons[index], index];
	}

	private addLessonToQueryParams(lessonIndex: number): void {
		this.router.navigate([], { queryParams: { lesson: lessonIndex + 1 } })
	}

	private sortLessons(course: SingleCourseModel): void {
		course.lessons.sort((a: LessonModel, b: LessonModel) => a.order - b.order);
	}

	private populateLessonsProgressMap(): void {
		this.coursesProgressService.getCourseLessonsProgress(this.courseId).forEach((lessonProgress: LessonProgress) => {
			this.lessonsProgressTimeMap.set(lessonProgress.id, lessonProgress.progressTime)
		})
	}

}
