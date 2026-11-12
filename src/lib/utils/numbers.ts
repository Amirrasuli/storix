export function isNonNegativeSafeInteger(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 0;
}

export function assertNonNegativeSafeInteger(
  value: number,
  label = "Value",
): asserts value is number {
  if (!isNonNegativeSafeInteger(value)) {
    throw new RangeError(`${label} must be a non-negative safe integer.`);
  }
}
