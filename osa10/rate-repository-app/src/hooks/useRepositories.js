import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_REPOSITORIES } from '../graphql/queries';


const useRepositories = ({ orderBy, orderDirection, searchKeyword, first, after }) => {
  const [repositories, setRepositories] = useState();
  const [loadingStatus, setLoading] = useState(true);
  const [errorStatus, setError] = useState(false);
  const variables = { orderBy, orderDirection, searchKeyword, first, after };

  //console.log("orderBy, orderDirection", orderBy, orderDirection)
  //console.log("searchKeyword in query", searchKeyword)

  const { data, error, loading, fetchMore } = useQuery(GET_REPOSITORIES, {
    variables: variables,
    fetchPolicy: 'cache-and-network'
  });

  const handleFetchMore = () => {
    const canFetchMore = !loading && data?.repositories.pageInfo.hasNextPage;
    console.log('data?.repositories.pageInfo', data?.repositories.pageInfo);

    if (!canFetchMore) {
      console.log("Reached the end");
      return;
    }

    fetchMore({
      variables: {
        first: first,
        after: data.repositories.pageInfo.endCursor
      },
    });
  };

  //console.log("loading", loading)
  //console.log("data", data)

  useEffect(() => {
    setLoading(loading);
    setError(error);
    data && setRepositories(data.repositories);
  }, [data, error, loading]);


  return { repositories, loading: loadingStatus, error: errorStatus, fetchMore: handleFetchMore };
};


export default useRepositories;