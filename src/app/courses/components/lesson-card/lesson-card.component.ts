import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { LessonModel } from '../../models/lesson.model';

@Component({
  selector: 'app-lesson-card',
  templateUrl: './lesson-card.component.html',
  styleUrls: ['./lesson-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonCardComponent {
  @Input() public lesson!: LessonModel;
  @Input() public progress = 0;
  @Input() public courseId!: string;

  @HostBinding('class.locked')
  public get isLocked(): boolean {
    return this.lesson.status === 'locked';
  }

}
