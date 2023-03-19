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

			const actualLessons = service.getCourseLessonsProgress(courseId);

			expect(localStorageServiceSpy.getItem).toHaveBeenCalledWith('course-test-course');
			expect(actualLessons).toEqual(expectedLessons);
		});

		it('should return an empty array if no lessons are found', () => {
			const courseId = 'test-course';

			localStorageServiceSpy.getItem.and.returnValue(null);

			const actualLessons = service.getCourseLessonsProgress(courseId);

			expect(localStorageServiceSpy.getItem).toHaveBeenCalledWith('course-test-course');
			expect(actualLessons).toEqual([]);
		});
	});

	describe('calculateCourseProgressTime', () => {
		it('should return the correct progress time', () => {
			const courseId = 'test-course';
			const expectedProgressTime = 30;

			spyOn(service, 'getCourseLessonsProgress').and.returnValue([
				{ id: 'lesson-1', progressTime: 10 },
				{ id: 'lesson-2', progressTime: 20 }
			]);

			const actualPercentage = service.calculateCourseProgressTime(courseId);

			expect(actualPercentage).toEqual(expectedProgressTime);
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

			service.getCourseLessonsProgress(courseId);

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

