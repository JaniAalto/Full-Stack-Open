import { useState, useEffect } from "react";
import { DiaryEntry, NewDiaryEntry, Visibility, Weather } from "./types";
import { getAll, createNew } from "./services/diaries";


const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState("");
  const [weather, setWeather] = useState<Weather>('sunny' as Weather);
  const [visibility, setVisibility] = useState<Visibility>('great' as Visibility);
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDiaryList = async () => {
      const list = await getAll()
      setDiaries(list);
    };
    void fetchDiaryList();
  }, []);

  const createEntry = (event: React.SyntheticEvent) => {
    event.preventDefault()

    const newDiaryEntry = {
      date: date,
      weather: weather as Weather,
      visibility: visibility as Visibility,
      comment: comment
    }
    createNew(newDiaryEntry as NewDiaryEntry).then(data => {
      console.log("new entry:", data);
      setDiaries(diaries.concat(data))
    }).catch(error => {
      console.log(error)
      setErrorMessage(error.response.data)
      setTimeout(() => {
        setErrorMessage("")
      }, 5000)
    })
    setComment("")
  };


  if (diaries) {
    //console.log(diaries);

    return (
      <div>
        <h2>Add new entry:</h2>
        <form onSubmit={createEntry}>
          <p>Date: <input type="date" value={date} onChange={(event) =>
            setDate(event.target.value)} /></p>
          <p>Weather:
            sunny <input type="radio" name="weather" onChange={() => setWeather("sunny" as Weather)} />
            rainy <input type="radio" name="weather" onChange={() => setWeather("rainy" as Weather)} />
            cloudy <input type="radio" name="weather" onChange={() => setWeather("cloudy" as Weather)} />
            stormy <input type="radio" name="weather" onChange={() => setWeather("stormy" as Weather)} />
            windy <input type="radio" name="weather" onChange={() => setWeather("windy" as Weather)} />
          </p>
          <p>Visibility:
            great <input type="radio" name="visibility" onChange={() => setVisibility("great" as Visibility)} />
            good <input type="radio" name="visibility" onChange={() => setVisibility("good" as Visibility)} />
            ok <input type="radio" name="visibility" onChange={() => setVisibility("ok" as Visibility)} />
            poor <input type="radio" name="visibility" onChange={() => setVisibility("poor" as Visibility)} />
          </p>
          <p>Comment: <input value={comment} onChange={(event) =>
            setComment(event.target.value)} /></p>
          <button type='submit'>add</button>
        </form>
        <h3>{errorMessage}</h3>
        <br /><hr />
        <h2>Diary entries:</h2>
        <ul>
          {diaries.map(diary =>
            <li key={diary.id}><h3>{diary.date}</h3>
              Weather: {diary.weather}, visibility: {diary.visibility} <br />
              {diary.comment}</li>
          )}
        </ul>
      </div>
    );
  }

  return (
    <div>
      Error!
    </div>
  );
};


export default App;