import { getOriginCity } from './cbp-mappings';

describe('getOriginCity', () => {
  it('maps a Mexican port name to its origin city', () => {
    expect(getOriginCity('San Ysidro', 'MX')).toBe('Tijuana');
    expect(getOriginCity('Otay Mesa', 'MX')).toBe('Tijuana');
    expect(getOriginCity('Nogales', 'MX')).toBe('Nogales');
  });

  it('maps a Canadian port name to its origin city', () => {
    expect(getOriginCity('Blaine', 'CA')).toBe('Surrey');
    expect(getOriginCity('Detroit', 'CA')).toBe('Windsor');
  });

  it('returns the port name itself if no mapping exists', () => {
    expect(getOriginCity('Unknown Port', 'MX')).toBe('Unknown Port');
  });
});
