import { Pipe, PipeTransform } from '@angular/core';
import { CoursesProgressService } from '../services/courses-progress.service';

@Pipe({
  name: 'courseProgressTime'
})
export class CourseProgressTimePipe implements PipeTransform {

  constructor(private courseProgressService: CoursesProgressService) {}

  public transform(courseId: string): number {
    return this.courseProgressService.calculateCourseProgressTime(courseId);
  }

}
