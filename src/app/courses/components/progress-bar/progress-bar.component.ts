import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input
} from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent {
  @Input() public progress = 0;

  @HostBinding('class.progress-completed')
  public get isProgressCompleted(): boolean {
    return this.progress >= 100;
  }

}
