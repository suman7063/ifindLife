
export function warnIfUndefined(value: any, name: string) {
  if (value === undefined) {
    console.warn(`WARNING: ${name} is undefined`);
  }
  return value;
}

export function logFunctionCall(name: string, args: any[] = []) {
  console.log(`Function called: ${name}`, args);
}

export function logFunctionError(name: string, error: any) {
  console.error(`Error in function ${name}:`, error);
}
