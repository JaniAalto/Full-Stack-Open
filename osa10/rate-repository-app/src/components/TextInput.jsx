import { TextInput as NativeTextInput, StyleSheet } from 'react-native';

const TextInput = ({ style, error, ...props }) => {
  const styles = StyleSheet.create({
    error: {
      ...style,
      borderColor: 'red'
    }
  })

  let textInputStyle = [style];
  if (error)
    textInputStyle = styles.error;

  return <NativeTextInput style={textInputStyle} {...props} />;
};

export default TextInput;