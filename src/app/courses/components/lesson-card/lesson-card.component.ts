import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewChild } from '@angular/core';
import { LessonModel } from '../../models/lesson.model';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

@Component({
  selector: 'app-lesson-card',
  templateUrl: './lesson-card.component.html',
  styleUrls: ['./lesson-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonCardComponent {
  @Input() public lesson!: LessonModel;
  @Input() public courseId!: string;

  @ViewChild(ProgressBarComponent, { static: true })
  private progressBar!: ProgressBarComponent

  @HostBinding('class.locked')
  public get isLocked(): boolean {
    return this.lesson.status === 'locked';
  }

  public recalculate(): void {
    this.progressBar.recalculate();
  }
}
