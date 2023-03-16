import { ChangeDetectionStrategy, Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { CoursesService } from '../services/courses.service';
import { SingleCourseModel } from '../models/single-course.model';
import { LessonModel } from '../models/lesson.model';
import { Location } from '@angular/common';
import { CoursesProgressService } from '../services/courses-progress.service';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar.component';

@Component({
	selector: 'app-course',
	templateUrl: './course.component.html',
	styleUrls: ['./course.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent {
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

	public course$: Observable<SingleCourseModel> = this.courseId$.pipe(
		switchMap((courseId: string) => this.coursesService.getCourse(courseId)),
		tap((course: SingleCourseModel) => {
			this.sortLessons(course);
			const [lesson, index] = this.findNotLockedLessonAndIndex(course.lessons);
			this.updateSelectedLesson(lesson, index);
		})
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
			id: this.selectedLessonSubject.getValue()!.id,
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
