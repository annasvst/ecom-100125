import '@testing-library/jest-dom';
import { parseTags } from '@/lib/utils';

describe('util functions', () => {
  it('parseTags should trim, lowercase, and filter out empty tags', () => {
    const exampleTagsInput = 'abs,  Csdp,  Sfa, ,';
    expect(parseTags(exampleTagsInput)).toStrictEqual(['abs', 'csdp', 'sfa']);
  });

  it('parseTags should trim tags', () => {
    const exampleTagsInput = 'abs  ,  mobile phone ,     sfa';
    expect(parseTags(exampleTagsInput)).toStrictEqual(['abs','mobile phone','sfa']);
  });

  it('parseTags should lowercase tags', () => {
    const exampleTagsInput = 'ABS,CsDP,SfA';
    expect(parseTags(exampleTagsInput)).toStrictEqual(['abs','csdp','sfa']);
  });

  it('parseTags should filter out empty tags', () => {
    const exampleTagsInput = 'abs,  , ,csdp,  sfa, ,';
    expect(parseTags(exampleTagsInput)).toStrictEqual(['abs', 'csdp', 'sfa']);
  });
});
