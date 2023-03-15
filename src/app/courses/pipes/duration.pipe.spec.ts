import { DurationPipe } from './duration.pipe';

describe('DurationPipe', () => {
  let pipe: DurationPipe;

  beforeEach(() => {
    pipe = new DurationPipe();
  });

  it('should return "00:00" for null input', () => {
    const transformedValue = pipe.transform(null);
    expect(transformedValue).toEqual('00:00');
  });

  it('should return "00:00" for undefined input', () => {
    const transformedValue = pipe.transform(undefined);
    expect(transformedValue).toEqual('00:00');
  });

  it('should return "00:00" for negative input', () => {
    const transformedValue = pipe.transform(-1);
    expect(transformedValue).toEqual('00:00');
  });

  it('should return "01:00" for 3600 seconds input', () => {
    const transformedValue = pipe.transform(3600);
    expect(transformedValue).toEqual('01:00:00');
  });

  it('should return "01:01:01" for 3661 seconds input', () => {
    const transformedValue = pipe.transform(3661);
    expect(transformedValue).toEqual('01:01:01');
  });

  it('should return "10:00:01" for 36001 seconds input', () => {
    const transformedValue = pipe.transform(36001);
    expect(transformedValue).toEqual('10:00:01');
  });
});
