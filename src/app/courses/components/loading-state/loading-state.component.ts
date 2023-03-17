import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  template: `
    <mat-spinner class="mat-spinner"></mat-spinner>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      
      .mat-spinner {
        margin: 0 auto;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingStateComponent {}
