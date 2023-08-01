interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseValues {
  value1: number;
  value2: number[];
}

const parseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  let value2: number[] = [];

  if (!isNaN(Number(args[2]))) {
    const latterArgs = args.slice(3);
    latterArgs.forEach(arg => {
      if (!isNaN(Number(arg))) {
        value2 = value2.concat(Number(arg));
      } else {
        throw new Error('Provided values were not numbers!');
      }
    });

    return {
      value1: Number(args[2]),
      value2: value2
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

const average = (values: number[]): number => {
  let averageValue = 0;
  values.forEach(value => averageValue += value);
  return averageValue / values.length;
};

const between = (x: number, min: number, max: number): boolean => {
  return x >= min && x <= max;
};

export const calculateExercises = (values: number[], target: number): Result => {
  console.log("values, target", typeof values, typeof target);
  const averageValue = average(values);
  let rating = 0;
  let ratingDescription = "";

  switch (true) {
    case between(target - averageValue, 0.1, target):
      rating = 1;
      ratingDescription = "You haven't exercised enough";
      break;

    case between(target - averageValue, -1, 0.1):
      rating = 2;
      ratingDescription = "Not too bad but could be better";
      break;

    case between(target - averageValue, -24, target - 1):
      rating = 3;
      ratingDescription = "You're doing great!";
      break;
  }

  if (rating === 0)
    throw new Error("Incorrect input values");

  return {
    periodLength: values.length,
    trainingDays: values.filter(value => value > 0).length,
    target: target,
    average: averageValue,
    success: averageValue >= target,
    rating: rating,
    ratingDescription: ratingDescription
  };
};

try {
  const { value1, value2 } = parseArguments(process.argv);
  console.log(calculateExercises(value2, value1));
  //console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
} catch (error: unknown) {
  let errorMessage = "Something went wrong: ";
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}