import { TestBed } from '@angular/core/testing';

import { CoursesProgressService } from './courses-progress.service';

describe('CoursesProgressService', () => {
  let service: CoursesProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoursesProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
