import axios from "axios";
import { DiaryEntry, NewDiaryEntry } from "../types";

const apiBaseUrl = 'http://localhost:3001/api/diaries'

export const getAll = async () => {
  const { data } = await axios.get<DiaryEntry[]>(apiBaseUrl);

  return data;
};

export const createNew = async (object: NewDiaryEntry) => {
  const { data } = await axios.post<DiaryEntry>(apiBaseUrl, object);

  return data;
};