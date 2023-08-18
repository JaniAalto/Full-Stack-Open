import { View, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { useQuery, useApolloClient } from '@apollo/client';
import { useNavigate } from 'react-router-native';

import AppBarTab from './AppBarTab';
import { GET_USER } from '../graphql/queries';
import Text from './Text';
import useAuthStorage from '../hooks/useAuthStorage';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flexDirection: 'row',
    backgroundColor: '#24292e',
  },
  scroll: {
    justifyContent: 'space-evenly',
    flexGrow: 1,
  }
});

const AppBar = () => {
  const { data, loading } = useQuery(GET_USER);
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();
  const navigate = useNavigate();

  const signOut = async () => {
    console.log("signing out")
    await authStorage.removeAccessToken()
    await apolloClient.resetStore();
    navigate("/");
  }
  
  if (loading) {
    return (<Text>Loading...</Text>)
  }

  console.log("user", data)

  if (data.me) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} horizontal>
          <AppBarTab text={"Repositories"} link={"/"} />
          <AppBarTab text={"Create a review"} link={"/newreview"} />
          <AppBarTab text={"My reviews"} link={"/myreviews"} />
          <AppBarTab text={"Sign out"} onPress={signOut} />
        </ScrollView>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} horizontal>
        <AppBarTab text={"Repositories"} link={"/"} />
        <AppBarTab text={"Sign up"} link={"/signup"} />
        <AppBarTab text={"Sign in"} link={"/signin"} />
      </ScrollView>
    </View>
  )
};

export default AppBar;