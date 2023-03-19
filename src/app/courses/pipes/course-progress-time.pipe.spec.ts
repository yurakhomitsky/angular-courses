
import { CourseProgressTimePipe } from './course-progress-time.pipe';
import { CoursesProgressService } from '../services/courses-progress.service';

describe('CourseProgressTimePipe', () => {
  let pipe: CourseProgressTimePipe;
  let coursesProgressServiceSpy: jasmine.SpyObj<CoursesProgressService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CoursesProgressService', ['calculateCourseProgressTime']);
    pipe = new CourseProgressTimePipe(spy);
    coursesProgressServiceSpy = spy;
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should call calculateCourseProgressTime method of CoursesProgressService', () => {
    const courseId = 'course-1';
    pipe.transform(courseId);
    expect(coursesProgressServiceSpy.calculateCourseProgressTime).toHaveBeenCalledWith(courseId);
  });

  it('should return the value returned by calculateCourseProgressTime method of CoursesProgressService', () => {
    const courseId = 'course-1';
    const expectedProgress = 50;
    coursesProgressServiceSpy.calculateCourseProgressTime.and.returnValue(expectedProgress);
    const progress = pipe.transform(courseId);
    expect(progress).toEqual(expectedProgress);
  });
});

