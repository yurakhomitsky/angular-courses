import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { CoursesService } from '../services/courses.service';
import { SingleCourseModel } from '../models/single-course.model';
import { LessonModel } from '../models/lesson.model';
import { Location } from '@angular/common';

@Component({
	selector: 'app-course',
	templateUrl: './course.component.html',
	styleUrls: ['./course.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent {

	private selectedLessonSubject = new BehaviorSubject<LessonModel | null>(null);

	public selectedLesson$ = this.selectedLessonSubject.asObservable();

	private courseId$: Observable<string> = this.router.params.pipe(
		map((params: Params) => params['id'])
	);

	public course$: Observable<SingleCourseModel> = this.courseId$.pipe(
		switchMap((courseId: string) => this.coursesService.getCourse(courseId)),
		tap((course: SingleCourseModel) => {
			this.selectedLessonSubject.next(course.lessons[0])
		})
	);

	constructor(private router: ActivatedRoute, private location: Location, private coursesService: CoursesService) {}

	public selectLesson(lesson: LessonModel): void {
		if (lesson.status !== 'locked') {
			this.selectedLessonSubject.next(lesson)
		}
	}

	public back(): void {
		this.location.back();
	}
}
