import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { CoursesProgressService } from '../../services/courses-progress.service';

@Component({
  selector: 'app-progress-bar',
  template: `
    <mat-progress-bar *ngIf="progress" color="accent" mode="determinate" [value]="progress"></mat-progress-bar>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  exportAs: 'progressBar',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent {
  @Input() public duration = 0;

  @Input() public courseId = ''

  @Input() public lessonId?: string;

  get progress(): number {
    if (!this.duration) {
      return 0;
    }

    if (!this.courseId && !this.lessonId) {
      return 0;
    }

    if (this.lessonId) {
      return this.courseProgressService.calculateLessonProgressPercentage(this.courseId, this.lessonId, this.duration);
    }

    return this.courseProgressService.calculateCourseProgressPercentage(this.courseId, this.duration)
  }

  constructor(private courseProgressService: CoursesProgressService, private cd: ChangeDetectorRef) {}

  public recalculate(): void {
    this.cd.detectChanges();
  }
}
