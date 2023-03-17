import { ChangeDetectionStrategy, Component, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { CoursesService } from '../services/courses.service';
import { SingleCourseModel } from '../models/single-course.model';
import { LessonModel } from '../models/lesson.model';
import { Location } from '@angular/common';
import { CoursesProgressService } from '../services/courses-progress.service';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar.component';
import { ViewStateModel } from '../models/view-state.model';

@Component({
	selector: 'app-course',
	templateUrl: './course.component.html',
	styleUrls: ['./course.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnDestroy {
	private courseId = '';

	private selectedLessonSubject = new BehaviorSubject<LessonModel | null>(null);

	public selectedLesson$ = this.selectedLessonSubject.asObservable();

	public selectedLessonProgressTime = 0;
	public updatedSelectedLessonProgressTime = 0;
	private selectedLessonIndex = 0;

	private courseId$: Observable<string> = this.router.params.pipe(
		map((params: Params) => params['id']),
		tap((courseId: string) => this.courseId = courseId)
	);

	public viewState$: Observable<ViewStateModel<SingleCourseModel>> = this.courseId$.pipe(
		switchMap((courseId: string) => this.coursesService.getCourse(courseId).pipe(
			tap((course: SingleCourseModel) => {
				this.sortLessons(course);
				const [lesson, index] = this.findNotLockedLessonAndIndex(course.lessons);
				this.updateSelectedLesson(lesson, index);
			}),
			map((course: SingleCourseModel) => {
				return { isLoading: false, data: course };
			}),
			catchError(() => of({ isLoading: false, data: null, error: 'Could not load the course' })),
			startWith({ isLoading: true, data: null })
		))
	);

	@ViewChildren(ProgressBarComponent)
	public progressBars!: QueryList<ProgressBarComponent>;

	constructor(
		private router: ActivatedRoute,
		private location: Location,
		private coursesService: CoursesService,
		private coursesProgressService: CoursesProgressService
	) {
	}

	public ngOnDestroy(): void {
		this.savePreviousLessonProgress();
	}

	public back(): void {
		this.location.back();
	}

	public updateSelectedLesson(lesson: LessonModel, index: number): void {
		this.selectedLessonIndex = index;
		this.selectedLessonSubject.next(lesson);
		this.selectedLessonProgressTime = this.coursesProgressService.getLessonProgress(this.courseId, lesson.id)?.progressTime ?? 0;
	}

	public selectLesson(lesson: LessonModel, index: number): void {
		if (lesson.status !== 'locked') {
			this.savePreviousLessonProgress();
			this.recalculateProgressBarForPreviousLesson();
			this.updateSelectedLesson(lesson, index);
		}
	}

	public onTimeWatchChanged(time: number): void {
		this.updatedSelectedLessonProgressTime = time;
	}

	private savePreviousLessonProgress(): void {
		this.coursesProgressService.saveLessonProgress(this.courseId, {
			id: this.selectedLessonSubject.getValue()?.id ?? '',
			progressTime: this.updatedSelectedLessonProgressTime
		});
	}

	private recalculateProgressBarForPreviousLesson(): void {
		this.progressBars.get(this.selectedLessonIndex)?.recalculate();
	}

	private findNotLockedLessonAndIndex(lessons: LessonModel[]): [LessonModel, number] {
		const index = lessons.findIndex((lesson: LessonModel) => lesson.status !== 'locked');

		return [lessons[index], index];
	}

	private sortLessons(course: SingleCourseModel): void {
		course.lessons.sort((a: LessonModel, b: LessonModel) => a.order - b.order);
	}
}
