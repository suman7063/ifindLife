
interface FunctionTest {
  name: string;
  path: string;
  test: () => Promise<boolean>;
  errorMessage?: string;
  lastTested?: Date;
  working?: boolean;
}

export const functionTests: FunctionTest[] = [];

export function registerTest(test: FunctionTest) {
  functionTests.push(test);
}

export async function runAllTests() {
  const results = [];
  for (const test of functionTests) {
    try {
      test.lastTested = new Date();
      test.working = await test.test();
      results.push({
        ...test,
        success: test.working
      });
    } catch (error: any) {
      test.working = false;
      test.errorMessage = error.message;
      results.push({
        ...test,
        success: false,
        error
      });
    }
  }
  return results;
}
