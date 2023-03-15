import { TestBed } from '@angular/core/testing';

import { CoursesService } from './courses.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CourseModel } from '../models/course.model';
import { BASE_PATH } from '../../core/tokens/base-url.token';
import { SingleCourseModel } from '../models/single-course.model';

describe('CoursesService', () => {
  let service: CoursesService;
  let httpMock: HttpTestingController;
  const myBasePath = 'myBasePath'

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService, { provide: BASE_PATH, useValue: myBasePath }]
    });
    service = TestBed.inject(CoursesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get courses', () => {
    const dummyCourses: CourseModel[] = [
      { id: '1', title: 'Course 1' },
      { id: '2', title: 'Course 2' }
    ] as CourseModel[]

    service.getCourses().subscribe(courses => {
      expect(courses.length).toBe(2);
      expect(courses).toEqual(dummyCourses);
    });

    const req = httpMock.expectOne(`${myBasePath}/core/preview-courses`);
    expect(req.request.method).toBe('GET');
    req.flush({ courses: dummyCourses });
  });

  it('should get a single course', () => {
    const dummyCourse: SingleCourseModel = { id: '1', title: 'Course 1' } as SingleCourseModel;

    service.getCourse('1').subscribe(course => {
      expect(course).toEqual(dummyCourse);
    });

    const req = httpMock.expectOne(`${myBasePath}/core/preview-courses/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCourse);
  });
});
