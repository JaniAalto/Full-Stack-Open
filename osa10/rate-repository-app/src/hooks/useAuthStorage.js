import { useContext } from 'react';
import AuthStorageContext from '../contexts/AuthStorageContext';

const useAuthStorage = () => {
  const context = useContext(AuthStorageContext);
  //console.log("context", context);
  return context;
};

export default useAuthStorage;