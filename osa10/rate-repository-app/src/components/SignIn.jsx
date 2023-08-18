import { View, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useNavigate } from "react-router-dom";
import { Formik } from 'formik';
import * as yup from 'yup';

import Text from './Text';
import FormikTextInput from './FormikTextInput';
import useSignIn from '../hooks/useSignIn';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  button: {
    margin: 15,
    backgroundColor: "blue",
    height: 40,
    width: windowWidth - 40,
    maxWidth: 400,
    borderRadius: 4
  },
  buttonText: {
    color: "white",
    textAlign: 'center',
    fontSize: 24,
  },
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  textInput: {
    margin: 15,
    borderWidth: 1,
    borderColor: 'black',
    height: 40,
    width: windowWidth - 40,
    maxWidth: 400
  },
});


export const SignInContainer = ({ onSubmit }) => {
  const initialValues = {
    username: '',
    password: ''
  };
  
  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .required('Username is required'),
    password: yup
      .string()
      .required('Password is required'),
  });

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {({ handleSubmit }) => (
        <View style={styles.container}>
          <FormikTextInput style={styles.textInput} name="username" placeholder="Username" />
          <FormikTextInput style={styles.textInput} name="password" placeholder="Password" 
          secureTextEntry={true} />
          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Sign in</Text>
          </Pressable>
        </View>
      )}
    </Formik>
  )
}

const SignIn = () => {
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    console.log("signing in with", values);
    const { username, password } = values;

    try {
      const data = await signIn({ username, password });
      console.log("data", data);
      data && console.log("accessToken", data.authenticate.accessToken);

      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  return (<SignInContainer onSubmit={onSubmit} />)
};


export default SignIn;