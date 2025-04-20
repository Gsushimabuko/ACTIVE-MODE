import { ProperNamePipe } from './proper-name.pipe';

describe('ProperNamePipe', () => {
  it('create an instance', () => {
    const pipe = new ProperNamePipe();
    expect(pipe).toBeTruthy();
  });
});
