import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCardComponent } from './course-card.component';
import { MatCardModule } from '@angular/material/card';
import { DurationPipe } from '../../pipes/duration.pipe';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('CourseCardComponent', () => {
  let component: CourseCardComponent;
  let fixture: ComponentFixture<CourseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseCardComponent, DurationPipe, ProgressBarComponent ],
      imports: [MatCardModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseCardComponent);
    component = fixture.componentInstance;
    component.course = {
      id: '1',
      status: '',
      duration: 2,
      title: '',
      tags: [],
      rating: 1,
      meta: {
        skills: [],
        slug: '',
        courseVideoPreview: {
          link: '',
          duration: 2,
          previewImageLink: ''
        }
      },
      launchDate: '',
      lessonsCount: 1,
      description: '',
      previewImageLink: '',
      containsLockedLessons: false
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
