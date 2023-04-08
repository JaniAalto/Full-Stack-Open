import { useState } from 'react';


const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
};

const StatisticLine = ({text, value, symbol}) => {
  return (
    <>
      <tr>
        <td>{text}</td>
        <td>{value} {symbol}</td>
      </tr>
    </>
  )
};

const Statistics = (props) => {
  if(props.good === 0 && props.neutral === 0 && props.bad === 0)
    return (
      <>
        <h1>Statistics:</h1>
        <p>No feedback given</p>
      </>
    )

  return (
    <>
      <h1>Statistics:</h1>
      <table>
        <StatisticLine text="Good" value={props.good}/>
        <StatisticLine text="Neutral" value={props.neutral} />
        <StatisticLine text="Bad" value={props.bad} />
        <StatisticLine text="All" value={props.all} />
        <StatisticLine text="Average" value={props.average} />
        <StatisticLine text="Positive" value={props.positive} symbol="%" />
      </table>
    </>
  )
};

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const handleGoodClick = () => {
    const newGood = good + 1
    setGood(newGood)
    const newAll = all + 1
    setAll(newAll)
    setAverage((newGood - bad) / newAll)
    setPositive(newGood / newAll * 100)
  }
  
  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    const newAll = all + 1
    setAll(newAll)
    setAverage((good - bad) / newAll)
    setPositive(good / newAll * 100)
  }
  
  const handleBadClick = () => {
    const newBad = bad + 1
    setBad(newBad)
    const newAll = all + 1
    setAll(newAll)
    setAverage((good - newBad) / newAll)
    setPositive(good / newAll * 100)
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick={handleGoodClick} text="Good" />
      <Button handleClick={handleNeutralClick} text="Neutral" />
      <Button handleClick={handleBadClick} text="Bad" />
      <Statistics good={good} neutral={neutral} bad={bad} 
      all={all} average={average} positive={positive} />
    </div>
  )
};


export default App;