import { useMutation, useApolloClient  } from '@apollo/client';
import { SIGN_IN } from '../graphql/mutations';
import useAuthStorage from './useAuthStorage';

const useSignIn = () => {
  const [authenticate, result] = useMutation(SIGN_IN);
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();

  const signIn = async ({ username, password }) => {
    console.log("username/password", username, password);

    const { data } = await authenticate({
      variables: { credentials: { username: username, password: password } }
    });
    console.log("data", data);

    await authStorage.setAccessToken(data.authenticate.accessToken);
    await apolloClient.resetStore();

    return data
  };

  return [signIn, result];
};

export default useSignIn;