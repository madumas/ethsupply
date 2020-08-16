import ethSupply from '../src/ethSupply';

test('base reward block 0 and 1', () => {
  const eths = new ethSupply();
  expect(eths.baseReward(0)).toBe(0);
  expect(eths.baseReward(1)).toBe(5);
});

test('base reward around block 4370000', () => {
  const eths = new ethSupply();
  expect(eths.baseReward(4356999)).toBe(5);
  expect(eths.baseReward(4370000)).toBe(3);
  expect(eths.baseReward(4370001)).toBe(3);
});

test('base reward around block 7280000', () => {
  const eths = new ethSupply();
  expect(eths.baseReward(7279999)).toBe(3);
  expect(eths.baseReward(7280000)).toBe(2);
  expect(eths.baseReward(7280001)).toBe(2);
});
