import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonCardComponent } from './lesson-card.component';
import { MatCardModule } from '@angular/material/card';
import { DurationPipe } from '../../pipes/duration.pipe';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

describe('LessonCardComponent', () => {
  let component: LessonCardComponent;
  let fixture: ComponentFixture<LessonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule,],
      declarations: [ LessonCardComponent,  DurationPipe, ProgressBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonCardComponent);
    component = fixture.componentInstance;
    component.lesson = {
      id: '1',
      status: 'locked',
      previewImageLink: '',
      meta: {},
      link: '',
      duration: 1,
      order: 1,
      title: '1',
      type: ''
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
