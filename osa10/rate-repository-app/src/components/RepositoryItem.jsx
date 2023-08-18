import { View, Image, StyleSheet, Pressable } from "react-native";
import Text from "./Text";

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    margin: 5,
    paddingVertical: 6
  },
  itemBody: {
    flexDirection: 'row',
    justifyContent: "flex-start",
  },
  itemText: {
    flex: 1,
    paddingLeft: 10
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: "space-around",
    margin: 10,
    paddingHorizontal: 20
  },
  statsText: {
    textAlign: "center",
  }
});

const ItemStats = (props) => {
  let numValue = props.number
  if (numValue >= 1000)
    numValue = ((numValue / 1000).toFixed(1)).toString() + "k"

  return (
    <View>
      <Text style={styles.statsText} fontWeight={'bold'} >{numValue}</Text>
      <Text style={styles.statsText} >{props.text}</Text>
    </View>
  )
}

const RepositoryItem = ({ item, onPress }) => {
  //console.log("item.id", item.id)

  return (
    <Pressable style={styles.item} onPress={() => onPress(item.id)} testID="repositoryItem" >
      <View style={styles.itemBody}>
        <Image
          source={{ uri: item.ownerAvatarUrl }}
          style={{ width: 60, height: 60 }}
        />
        <View style={styles.itemText}>
          <Text fontWeight={'bold'} >{item.fullName}</Text>
          <Text>{item.description}</Text>
          <Text color={'textSecondary'} >{item.language}</Text>
        </View>
      </View>

      <View style={styles.statsRow} >
        <ItemStats text={"Forks"} number={item.forksCount} />
        <ItemStats text={"Stars"} number={item.stargazersCount} />
        <ItemStats text={"Rating"} number={item.ratingAverage} />
        <ItemStats text={"Reviews"} number={item.reviewCount} />
      </View>
    </Pressable>
  );
};

export default RepositoryItem;