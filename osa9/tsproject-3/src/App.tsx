interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDetailed extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDetailed {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartDetailed {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends CoursePartDetailed {
  requirements: object;
  kind: "special"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

interface HeaderProps {
  name: string;
}

interface ContentProps {
  coursePart: CoursePart;
}

interface TotalProps {
  courseParts: object;
}

const Header = (props: HeaderProps) => (
  <h1>{props.name}</h1>
)

const Part = (props: ContentProps) => {
  switch (props.coursePart.kind) {
    case "basic":
      return <p><b>{props.coursePart.name} {props.coursePart.exerciseCount}</b> <br />
        <i>{props.coursePart.description}</i></p>

    case "group":
      return <p><b>{props.coursePart.name} {props.coursePart.exerciseCount}</b> <br />
        Group projects: {props.coursePart.groupProjectCount}</p>

    case "background":
      return <p><b>{props.coursePart.name} {props.coursePart.exerciseCount}</b> <br />
        <i>{props.coursePart.description}</i> <br />
        Background material: {props.coursePart.backgroundMaterial}</p>

    case "special":
      return <p><b>{props.coursePart.name} {props.coursePart.exerciseCount}</b> <br />
        <i>{props.coursePart.description}</i> <br />
        Required skills: {props.coursePart.requirements.toString().replace(",", ", ")}</p>

    default:
      return assertNever(props.coursePart);
  }
}

const Content = (props: ContentProps) => (
  <Part coursePart={props.coursePart} />
)

const Total = (props: TotalProps) => (
  <u>
    Total number of exercises{" "}
    {(props.courseParts as Array<CoursePart>).reduce(
      (carry: number, part: CoursePart) => carry + part.exerciseCount, 0
    )}
  </u>
)

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};


const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    }
  ];

  return (
    <div>
      <Header name={courseName} />
      {courseParts.map(part =>
        <Content key={part.name} coursePart={part} />
      )}
      <Total courseParts={courseParts} />
    </div>
  )
};

export default App;