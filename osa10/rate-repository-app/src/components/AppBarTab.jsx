import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'react-router-native';

const styles = StyleSheet.create({
  tab: {
    width: 160,
    height: 30,
    backgroundColor: '#000000',
    alignItems: 'center'
  },
  text: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});

const AppBarTab = (props) => {
  if (props.link) {
    return (
      <Link to={props.link}>
        <View style={styles.tab}>
          <Text style={styles.text}>{props.text}</Text>
        </View>
      </Link>
    )
  }

  return (
    <Pressable style={styles.tab} onPress={props.onPress}>
      <Text style={styles.text}>{props.text}</Text>
    </Pressable>
  )
};

export default AppBarTab;