import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesComponent } from './courses.component';
import { CoursesService } from './services/courses.service';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

describe('CoursesComponent', () => {
	let component: CoursesComponent;
	let fixture: ComponentFixture<CoursesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
				declarations: [CoursesComponent],
				imports: [BrowserTestingModule,
					MatProgressSpinnerModule,
					FormsModule,
					MatCardModule,
					MatFormFieldModule,
					MatInputModule,
					MatButtonModule,
					MatPaginatorModule,
					CommonModule
				],
				providers: [{
					provide: CoursesService,
					useValue: jasmine.createSpyObj('CoursesService', ['getCourses', 'getCourse'])
				}]
			})
			.compileComponents();

		fixture = TestBed.createComponent(CoursesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
