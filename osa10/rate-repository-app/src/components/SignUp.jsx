import { View, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useNavigate } from "react-router-dom";
import { Formik } from 'formik';
import { useMutation } from '@apollo/client';
import * as yup from 'yup';

import FormikTextInput from './FormikTextInput';
import Text from './Text';
import { CREATE_USER } from '../graphql/mutations';
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

const SignUp = () => {
  const navigate = useNavigate();
  const [createUser] = useMutation(CREATE_USER);
  const [signIn] = useSignIn();

  const initialValues = {
    username: '',
    password: ''
  };

  const validationSchema = yup.object().shape({
    username: yup
      .string().min(5).max(30)
      .required("Username has to be between 5 and 30 characters"),
    password: yup
      .string().min(5).max(30)
      .required("Password has to be between 5 and 30 characters"),
    rePassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Password does not match')
      .required('Required')
  });

  const onSubmit = async (values) => {
    console.log("signing up with", values);
    const { username, password } = values;

    try {
      const { data } = await createUser({
        variables: { user: { username, password } }
      });
      console.log("data", data);

      const credentials = await signIn({ username, password });
      console.log("credentials", credentials);
      credentials && console.log("accessToken", credentials.authenticate.accessToken);

      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };


  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {({ handleSubmit }) => (
        <View style={styles.container}>
          <FormikTextInput style={styles.textInput} name="username" placeholder="Username" />
          <FormikTextInput style={styles.textInput} name="password" placeholder="Password"
            secureTextEntry={true} />
          <FormikTextInput style={styles.textInput} name="rePassword"
            placeholder="Password confirmation" secureTextEntry={true} />
          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Create</Text>
          </Pressable>
        </View>
      )}
    </Formik>
  )
}


export default SignUp;