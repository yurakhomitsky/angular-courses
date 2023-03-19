import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseComponent } from './course.component';
import { CoursesService } from '../services/courses.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { VideoPlayerComponent } from '../components/video-player/video-player.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CoursesProgressService } from '../services/courses-progress.service';

describe('CourseComponent', () => {
	let component: CourseComponent;
	let fixture: ComponentFixture<CourseComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
				declarations: [CourseComponent, VideoPlayerComponent],
				imports: [
					MatProgressSpinnerModule,
					MatCardModule,
					MatButtonModule,
					CommonModule,
					RouterTestingModule
				],
				providers: [
					{
						provide: CoursesService,
						useValue: jasmine.createSpyObj('CoursesService', ['getCourses', 'getCourse'])
					},
					{
						provide: CoursesProgressService,
						useValue:  {
							saveLessonProgress: jasmine.createSpy('saveLessonProgress'),
							getCourseLessonsProgress: jasmine.createSpy('getCourseLessonsProgress').and.returnValue([])
						}
					}
				]
			})
			.compileComponents();

		fixture = TestBed.createComponent(CourseComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
