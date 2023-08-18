import { View, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useNavigate } from "react-router-dom";
import { Formik } from 'formik';
import * as yup from 'yup';
import FormikTextInput from './FormikTextInput';
import Text from './Text';
import { CREATE_REVIEW } from '../graphql/mutations';
import { useMutation } from '@apollo/client';


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

const ReviewForm = () => {
  const navigate = useNavigate();
  const [createReview] = useMutation(CREATE_REVIEW);

  const initialValues = {
    repositoryName: '',
    ownerName: '',
    rating: '',
    text: ''
  };

  const validationSchema = yup.object().shape({
    repositoryName: yup
      .string()
      .required("Owner's name is required"),
    ownerName: yup
      .string()
      .required("Repository's name is required"),
    rating: yup
      .number().integer().min(0).max(100)
      .required("Rating has to be between 0 and 100"),
    text: yup
      .string()
  });

  const onSubmit = async (values) => {
    console.log("values", values);
    const { repositoryName, ownerName, rating, text } = values;

    try {
      const { data } = await createReview({
        variables: { review: { repositoryName, ownerName, rating: Number(rating), text } }
      });
      console.log("data", data);
      const id = data.createReview.repositoryId;

      navigate(`/repository/${id}`);
    } catch (e) {
      console.log(e);
    }
  };


  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {({ handleSubmit }) => (
        <View style={styles.container}>
          <FormikTextInput style={styles.textInput} name="repositoryName" 
          placeholder="Owner's username" />
          <FormikTextInput style={styles.textInput} name="ownerName" placeholder="Repository name" />
          <FormikTextInput style={styles.textInput} name="rating" placeholder="Rating"
           keyboard="numeric" />
          <FormikTextInput style={styles.textInput} name="text" placeholder="Review"
          multiline={true} />
          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Create</Text>
          </Pressable>
        </View>
      )}
    </Formik>
  )
}


export default ReviewForm;