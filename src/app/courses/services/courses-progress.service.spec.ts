import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { CoursesProgressService } from './courses-progress.service';


describe('CoursesProgressService', () => {
	let service: CoursesProgressService;
	let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;

	beforeEach(() => {
		const spy = jasmine.createSpyObj('LocalStorageService', ['getItem', 'updateArray']);

		TestBed.configureTestingModule({
			providers: [
				CoursesProgressService,
				{ provide: LocalStorageService, useValue: spy }
			]
		});

		service = TestBed.inject(CoursesProgressService);
		localStorageServiceSpy = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('getCourseKey', () => {
		it('should return course key with prefix', () => {
			expect(service.getCourseKey('2')).toEqual('course-2');
		});
	});

	describe('getCourseLessons', () => {
		it('should return an array of lessons', () => {
			const courseId = 'test-course';
			const expectedLessons = [
				{ id: 'lesson-1', progressTime: 10 },
				{ id: 'lesson-2', progressTime: 20 }
			];

			localStorageServiceSpy.getItem.and.returnValue(expectedLessons);

			const actualLessons = service.getCourseLessons(courseId);

			expect(localStorageServiceSpy.getItem).toHaveBeenCalledWith('course-test-course');
			expect(actualLessons).toEqual(expectedLessons);
		});

		it('should return an empty array if no lessons are found', () => {
			const courseId = 'test-course';

			localStorageServiceSpy.getItem.and.returnValue(null);

			const actualLessons = service.getCourseLessons(courseId);

			expect(localStorageServiceSpy.getItem).toHaveBeenCalledWith('course-test-course');
			expect(actualLessons).toEqual([]);
		});
	});

	describe('calculateCourseProgressPercentage', () => {
		it('should return the correct percentage', () => {
			const courseId = 'test-course';
			const courseDuration = 100;
			const expectedPercentage = 30;

			spyOn(service, 'getCourseLessons').and.returnValue([
				{ id: 'lesson-1', progressTime: 10 },
				{ id: 'lesson-2', progressTime: 20 }
			]);

			const actualPercentage = service.calculateCourseProgressPercentage(courseId, courseDuration);

			expect(actualPercentage).toEqual(expectedPercentage);
		});

		it('should return 0 if the percentage is NaN', () => {
			const courseId = 'test-course';
			const courseDuration = 100;

			spyOn(service, 'getCourseLessons').and.returnValue([
				{ id: 'lesson-1', progressTime: 0 },
				{ id: 'lesson-2', progressTime: 0 }
			]);

			const actualPercentage = service.calculateCourseProgressPercentage(courseId, courseDuration);

			expect(actualPercentage).toEqual(0);
		});
	});

	describe('getLessonProgress', () => {
		it('should return the lesson progress', () => {
			const courseId = 'test-course';
			const lessonId = 'test-lesson';
			const expectedLessonProgress = { id: lessonId, progressTime: 10 };

			spyOn(service, 'getCourseLessons').and.returnValue([
				{ id: 'lesson-1', progressTime: 5 },
				expectedLessonProgress,
				{ id: 'lesson-3', progressTime: 15 }
			]);

			const actualLessonProgress = service.getLessonProgress(courseId, lessonId);

			expect(actualLessonProgress).toEqual(expectedLessonProgress);
		});

		it('should return null if lesson is not found', () => {
			const courseId = 'test-course';
			const lessonId = 'test-lesson';

			spyOn(service, 'getCourseLessons').and.returnValue([
				{ id: 'lesson-1', progressTime: 5 },
				{ id: 'lesson-3', progressTime: 15 }
			]);

			const actualLessonProgress = service.getLessonProgress(courseId, lessonId);

			expect(actualLessonProgress).toEqual(null);
		});
	});

	describe('calculateLessonProgressPercentage', () => {
		it('should return correct percentage', () => {
			const courseId = 'test-course';
			const lessonId = 'lesson-1';
			const lessonDuration = 100;
			const expectedPercentage = 50;

			spyOn(service, 'getLessonProgress').and.returnValue({ id: 'lesson-1', progressTime: 50 });

			const actualLessonProgress = service.calculateLessonProgressPercentage(courseId, lessonId, lessonDuration);

			expect(actualLessonProgress).toEqual(expectedPercentage);
		});

		it('should return 0 if the percentage is NaN', () => {
			const courseId = 'test-course';
			const lessonId = 'lesson-1';
			const lessonDuration = 100;

			spyOn(service, 'getLessonProgress').and.returnValue({ id: 'lesson-1', progressTime: 0 });

			const actualPercentage = service.calculateLessonProgressPercentage(courseId, lessonId, lessonDuration);

			expect(actualPercentage).toEqual(0);
		});
	});

	describe('saveLessonProgress', () => {
		it('should add a new lesson progress if the lesson has not been saved yet', () => {
			const courseId = '1';
			const lessonProgress = { id: 'lesson-1', progressTime: 100 };

			localStorageServiceSpy.updateArray.and.callFake((key: string, updater: (value: any) => any[]) => {
				const initialValue: any[] = [];

				const updatedValue = updater(initialValue);

				expect(updatedValue).toEqual([lessonProgress]);

				return updatedValue;
			});

			service.saveLessonProgress(courseId, lessonProgress);

			expect(localStorageServiceSpy.updateArray)
				.toHaveBeenCalledOnceWith(service.getCourseKey(courseId), jasmine.any(Function));
		});

		it('should update a lesson progress if the lesson has been saved previously', () => {
			const courseId = '1';
			const lessonProgressToUpdate = { id: 'lesson-1', progressTime: 100 };

			const savedLessons = [
				{ id: 'lesson-1', progressTime: 10 },
				{ id: 'lesson-2', progressTime: 20 }
			];

			localStorageServiceSpy.getItem.and.returnValue(savedLessons);

			service.getCourseLessons(courseId);

			localStorageServiceSpy.updateArray.and.callFake((key: string, updater: (value: any) => any[]) => {

				const updatedValue = updater(savedLessons);

				expect(updatedValue).toEqual([
					{ id: 'lesson-1', progressTime: 100 },
					{ id: 'lesson-2', progressTime: 20 }
				]);

				return updatedValue;
			});

			service.saveLessonProgress(courseId, lessonProgressToUpdate);

			expect(localStorageServiceSpy.updateArray)
				.toHaveBeenCalledOnceWith(service.getCourseKey(courseId), jasmine.any(Function));
		});
	});
});

