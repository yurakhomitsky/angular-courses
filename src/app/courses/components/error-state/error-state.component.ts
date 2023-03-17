import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-state',
  template: `
    <p>
     {{ errorMessage }}
    </p>
    <ng-content></ng-content>
  `,
  styles: [
    `
      :host {
        display: block;
        text-align: center;
        
        p {
          font-size: 1.2rem;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorStateComponent {
  @Input() public errorMessage = '';
}
