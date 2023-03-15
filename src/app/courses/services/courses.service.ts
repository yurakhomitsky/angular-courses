import { Inject, Injectable } from '@angular/core';
import { BASE_PATH } from '../../core/tokens/base-url.token';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, share, timer } from 'rxjs';
import { CourseModel } from '../models/course.model';
import { SingleCourseModel } from '../models/single-course.model';

@Injectable({
	providedIn: 'root'
})
export class CoursesService {
	private coursesPath = `${this.basePath}/core/preview-courses`;

	private cachedCourses$ = this.httpClient.get<{ courses: CourseModel[] }>(this.coursesPath).pipe(
		map(({ courses }) => courses),
		share({
			connector: () => new ReplaySubject(1),
			resetOnRefCountZero: false,
			resetOnError: true,
			// Invalidate cache on timeout
			resetOnComplete: () => timer(10_000)
		})
	);

	constructor(@Inject(BASE_PATH) private basePath: string, private httpClient: HttpClient) {
	}

	public getCourses(): Observable<CourseModel[]> {
		return this.cachedCourses$;
	}

	public getCourse(id: string): Observable<SingleCourseModel> {
		return this.httpClient.get<SingleCourseModel>(`${this.basePath}/core/preview-courses/${id}`)
	}
}
