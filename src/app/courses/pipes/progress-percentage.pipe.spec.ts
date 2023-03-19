import { ProgressPercentagePipe } from './progress-percentage.pipe';

describe('ProgressPercentagePipe', () => {
  let pipe: ProgressPercentagePipe;

  beforeEach(() => {
    pipe = new ProgressPercentagePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return 0 if either progressTime or duration is falsy', () => {
    let progressTime = 0;
    let duration = 100;
    expect(pipe.transform(progressTime, duration)).toBe(0);

    progressTime = 100;
    duration = 0;
    expect(pipe.transform(progressTime, duration)).toBe(0);

    progressTime = 0;
    duration = 0;
    expect(pipe.transform(progressTime, duration)).toBe(0);
  });

  it('should return the correct percentage when progressTime and duration are valid', () => {
    const progressTime = 50;
    const duration = 100;
    const expectedPercentage = 50;
    const percentage = pipe.transform(progressTime, duration);
    expect(percentage).toBe(expectedPercentage);
  });

  it('should return 0 if the percentage is NaN', () => {
    const progressTime = 100;
    const duration = 0;
    const percentage = pipe.transform(progressTime, duration);
    expect(percentage).toBe(0);
  });
});

