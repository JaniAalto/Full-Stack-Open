export interface BMIValues {
  value1: number;
  value2: number;
}

const parseTwoArguments = (args: string[]): BMIValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

export const between = (x: number, min: number, max: number): boolean => {
  return x >= min && x <= max;
};

export const calculateBmi = (height: number, weight: number): string => {
  height = height / 100;
  const result = weight / (height * height);
  console.log(result);

  switch (true) {
    case between(result, 0, 18.5):
      return "Underweight";

    case between(result, 18.5, 24.9):
      return "Normal (healthy weight)";

    case between(result, 25, 29.9):
      return "Overweight";

    case between(result, 30, 100):
      return "Obese";

    default:
      throw new Error("Incorrect input values");
  }
};

try {
  const { value1, value2 } = parseTwoArguments(process.argv);
  console.log(calculateBmi(value1, value2));
} catch (error: unknown) {
  let errorMessage = "Something went wrong: ";
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}