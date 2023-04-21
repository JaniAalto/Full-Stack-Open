
const Header = ({ name }) => <h2>{name}</h2>;

const Part = (props) => <p>{props.name} {props.exercises}</p>;

const Content = ({ parts }) => {
  //console.log(parts);
  return (
    <>
      {parts.map(part =>
        <Part name={part.name} exercises={part.exercises} key={part.id} />
      )}
    </>
  )
};

const Total = ({ parts }) => {
    const exercises = parts.map(part => part.exercises)
    console.log(exercises);
    return (
      <p><b>Total of {exercises.reduce((accumulator, currentValue) => accumulator + currentValue)} exercises</b></p>
    )
  };
  
const Course = ({ course }) => {
  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  )
};


export default Course;