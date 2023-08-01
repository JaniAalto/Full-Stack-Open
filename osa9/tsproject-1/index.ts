import express from 'express';
import qs from 'qs';
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

const app = express();
app.use(express.json());

type ReqQuery = {
  query: string;
};

type ExerciseValues = {
  daily_exercises: string
  target: number
};

app.get('/bmi', (req, res) => {
  const { height, weight } = qs.parse(req.query as ReqQuery);

  try {
    const bmi = calculateBmi(Number(height), Number(weight));
    const bmiValues = {
      weight: weight,
      height: height,
      bmi: bmi
    };
    res.json(bmiValues);
  } catch (error: unknown) {
    res.json({ error: "malformatted parameters" });
    console.log(`error ${error}`);
  }
});

app.post('/exercises', (req, res) => {
  try {
    const { daily_exercises, target } = req.body as ExerciseValues;

    if (!daily_exercises || !target)
      res.json({ error: "parameters missing" });
    
    const exercises_num: number[] = daily_exercises.slice(1, -1).split(',').map(Number);
    
    exercises_num.forEach(value => {
      if (typeof value !== 'number'){
        res.json({ error: "malformatted parameters" });
      }
    });

    const result = calculateExercises(exercises_num, Number(target));
    console.log("daily_exercises, target", daily_exercises, target);
    console.log("result", result);

    res.json(result);
  } catch (error: unknown) {
    res.json({ error: "malformatted parameters" });
    console.log(`error ${error}`);
  }
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});