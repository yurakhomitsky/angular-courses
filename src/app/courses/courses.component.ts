import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CoursesService } from './services/courses.service';
import {
	BehaviorSubject,
	combineLatest,
	debounceTime,
	distinctUntilChanged,
	map,
	Observable,
	skip,
	startWith
} from 'rxjs';
import { CourseModel } from './models/course.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
	selector: 'app-courses',
	templateUrl: './courses.component.html',
	styleUrls: ['./courses.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesComponent {
	private initialPageEvent: PageEvent = {
		pageSize: 10,
		length: 0,
		pageIndex: 0
	};

	public searchTerm = '';

	private searchSubject = new BehaviorSubject<string>(this.searchTerm);
	private searchTermDebounced$ = this.searchSubject.asObservable().pipe(
		skip(1),
		debounceTime(300),
		distinctUntilChanged(),
		startWith('')
	);

	private pageEventSubject = new BehaviorSubject<PageEvent>(this.initialPageEvent);

	public viewModel$: Observable<{ paginator: PageEvent, courses: CourseModel[] }> = this.getViewModel();

	constructor(private coursesService: CoursesService) {
	}

	public trackById(id: number, item: CourseModel): string {
		return item.id;
	}

	public onPageChange(pageEvent: PageEvent): void {
		this.pageEventSubject.next(pageEvent);
	}

	private getViewModel(): Observable<{ paginator: PageEvent, courses: CourseModel[] }> {
		return combineLatest([
			this.searchTermDebounced$,
			this.pageEventSubject,
			this.coursesService.getCourses()
		])
			.pipe(
				map(([searchTerm, pageEvent, courses]) => {
					return {
						paginator: {
							...pageEvent,
							length: courses.length
						},
						courses: this.getPagedCourses(pageEvent, this.searchCourse(searchTerm, courses))
					};
				})
			);
	}

	private getPagedCourses(page: PageEvent, courses: CourseModel[]): CourseModel[] {
		const startIndex = page.pageIndex * page.pageSize;
		const endIndex = startIndex + page.pageSize;

		return courses.slice(startIndex, endIndex);
	}

	private searchCourse(searchTerm: string, courses: CourseModel[]): CourseModel[] {
		if (!searchTerm || !courses) {
			return courses;
		}

		return courses.filter((course: CourseModel) => {
			const { title, description } = course;
			const normalizedTitle = title.trim().toLowerCase();
			const normalizedDescription = description.trim().toLowerCase();
			const normalizedSearchTerm = searchTerm.trim().toLowerCase();

			return normalizedTitle.includes(normalizedSearchTerm) || normalizedDescription.includes(normalizedSearchTerm);
		});
	}

	public onSearchTermChange(searchTerm: string): void {
		this.searchSubject.next(searchTerm ?? '');
	}
}
