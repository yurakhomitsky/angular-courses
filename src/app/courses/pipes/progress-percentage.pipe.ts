import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'progressPercentage'
})
export class ProgressPercentagePipe implements PipeTransform {

  public transform(progressTime: number, duration: number): number {
    if (!duration || !progressTime) {
      return 0;
    }
    const percentage = progressTime / duration * 100;

    return isNaN(percentage) ? 0 : percentage;
  }

}
