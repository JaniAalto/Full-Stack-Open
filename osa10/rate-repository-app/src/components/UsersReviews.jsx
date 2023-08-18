import { FlatList, View, StyleSheet, Pressable, Alert } from 'react-native';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-native';
import { GET_USER } from '../graphql/queries';
import { DELETE_REVIEW } from '../graphql/mutations';
import Text from './Text';


const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: '#87CEFA',
    padding: 4
  },
  item: {
    backgroundColor: 'white',
    margin: 5,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: "flex-start",
  },
  horizontal: {
    flex: 1,
    flexDirection: 'column'
  },
  vertical: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  itemText: {
    flex: 1,
    paddingLeft: 10
  },
  button: {
    margin: 15,
    backgroundColor: "blue",
    height: 40,
    width: 120,
    flex: 1,
  },
  secButton: {
    margin: 15,
    backgroundColor: "red",
    height: 40,
    width: 120,
    flex: 1,
  },
  buttonText: {
    color: "white",
    textAlign: 'center',
    fontSize: 16,
    paddingTop: 8
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

const ItemSeparator = () => <View style={styles.separator} />;

const ReviewItem = ({ review, viewRepository, deleteAReview }) => {
  if (review) {
    const ms = Date.parse(review.createdAt)
    const timeCode = new Date(ms)
    const parsedTime = timeCode.getDate().toString() + "." + (timeCode.getMonth() + 1).toString()
      + "." + timeCode.getFullYear().toString()

    const showAlert = () => {
      Alert.alert(
        'Delete review',
        'Are you sure you want to delete this review?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => deleteAReview(review.id) },
        ],
      );
    };

    return (
      <View style={styles.item} testID="repositoryItem">
        <View style={styles.rating}>
          <Text style={styles.ratingText}>{review.rating}</Text>
        </View>
        <View style={styles.horizontal} >
          <View style={styles.itemText}>
            <Text fontWeight={'bold'} >{review.repository.fullName}</Text>
            <Text color={'textSecondary'} >{parsedTime}</Text>
            <Text>{review.text}</Text>
          </View>
          <View style={styles.vertical} >
            <Pressable style={styles.button} onPress={() => viewRepository(review.repository.id)}>
              <Text style={styles.buttonText} >View repository</Text>
            </Pressable>
            <Pressable style={styles.secButton} onPress={showAlert}>
              <Text style={styles.buttonText} >Delete review</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }
};

const UsersReviews = () => {
  const navigate = useNavigate();
  const [deleteReview] = useMutation(DELETE_REVIEW);

  const { data, loading, refetch } = useQuery(GET_USER, {
    variables: { includeReviews: true },
    fetchPolicy: 'cache-and-network'
  });
  //console.log("data", data)

  const viewRepository = (id) => {
    navigate(`/repository/${id}`);
  };

  const deleteAReview = async (deleteReviewId) => {
    console.log("deleting:", deleteReviewId);

    try {
      await deleteReview({ variables: { deleteReviewId } });
      refetch();
    } catch (e) {
      console.log(e);
    }
  };


  if (loading || !data.me) {
    return (<Text>Loading...</Text>)
  }

  const reviews = data.me.reviews
    ? data.me.reviews.edges.map(edge => edge.node)
    : [];

  return (
    <FlatList
      style={styles.flatList}
      data={reviews}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => <ReviewItem review={item} viewRepository={viewRepository}
        deleteAReview={deleteAReview} />}
    />
  );
};


export default UsersReviews;