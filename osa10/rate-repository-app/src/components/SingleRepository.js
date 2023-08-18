import { View, Image, StyleSheet, Pressable, FlatList } from "react-native";
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import * as Linking from 'expo-linking';
import Text from "./Text";
import { GET_REPOSITORY } from "../graphql/queries";


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
  },
  button: {
    margin: 15,
    backgroundColor: "blue",
    height: 40,
    width: 200
  },
  buttonText: {
    color: "white",
    textAlign: 'center',
    fontSize: 18,
    paddingTop: 5
  },
  separator: {
    height: 1,
  },
  flatList: {
    backgroundColor: 'lightgrey',
    flex: 1
  },
  rating: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    backgroundColor: "#4169E1",
    marginLeft: 5
  },
  ratingText: {
    color: "white",
    textAlign: 'center',
    paddingTop: 5
  },
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


const RepositoryInfo = ({ repository }) => {
  return (
    <View style={styles.item} testID="repositoryItem" >
      <View style={styles.itemBody}>
        <Image
          source={{ uri: repository.ownerAvatarUrl }}
          style={{ width: 60, height: 60 }}
        />
        <View style={styles.itemText}>
          <Text fontWeight={'bold'} >{repository.fullName}</Text>
          <Text>{repository.description}</Text>
          <Text color={'textSecondary'} >{repository.language}</Text>
        </View>
      </View>

      <View style={styles.statsRow} >
        <ItemStats text={"Forks"} number={repository.forksCount} />
        <ItemStats text={"Stars"} number={repository.stargazersCount} />
        <ItemStats text={"Rating"} number={repository.ratingAverage} />
        <ItemStats text={"Reviews"} number={repository.reviewCount} />
      </View>

      <View style={styles.statsRow}>
        <Pressable style={styles.button} onPress={() => Linking.openURL(repository.url)}>
          <Text style={styles.buttonText}>Open in GitHub</Text>
        </Pressable>
      </View>
    </View>
  )
};

const ReviewItem = ({ review }) => {
  if (review) {
    const ms = Date.parse(review.createdAt)
    const timeCode = new Date(ms)
    const parsedTime = timeCode.getDate().toString() + "." + (timeCode.getMonth() + 1).toString()
      + "." + timeCode.getFullYear().toString()

    return (
      <View style={styles.item} testID="repositoryItem" >
        <View style={styles.itemBody}>
          <View style={styles.rating}>
            <Text style={styles.ratingText}>{review.rating}</Text>
          </View>
          <View style={styles.itemText}>
            <Text fontWeight={'bold'} >{review.user.username}</Text>
            <Text color={'textSecondary'} >{parsedTime}</Text>
            <Text>{review.text}</Text>
          </View>
        </View>
      </View>
    );
  }
};

const ItemSeparator = () => <View style={styles.separator} />;


const SingleRepository = () => {
  let { id } = useParams();

  if (id) {
    const { data, loading, fetchMore } = useQuery(GET_REPOSITORY, {
      variables: { repositoryId: id, first: 4, after: "" },
      fetchPolicy: 'cache-and-network'
    });
    //console.log("data", data)

    if (loading)
      return (<Text>Loading...</Text>)

    if (data) {
      const reviews = data
        ? data.repository.reviews.edges.map(edge => edge.node)
        : [];

      const handleFetchMore = () => {
        const canFetchMore = !loading && data?.repository.reviews.pageInfo.hasNextPage;
        console.log('data?.repository.reviews.pageInfo', data?.repository.reviews.pageInfo);

        if (!canFetchMore) {
          console.log("Reached the end");
          return;
        }

        fetchMore({
          variables: {
            first: 4,
            after: data.repository.reviews.pageInfo.endCursor
          },
        });
      };

      const onEndReach = () => {
        console.log("Loading more reviews...");
        handleFetchMore();
      };


      return (
        <FlatList
          style={styles.flatList}
          data={reviews}
          renderItem={({ item }) => <ReviewItem review={item} />}
          keyExtractor={({ id }) => id}
          ItemSeparatorComponent={ItemSeparator}
          onEndReached={onEndReach}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={() => <RepositoryInfo repository={data.repository} />}
        />
      );
    }
  }
};


export default SingleRepository;