import { FlatList, View, StyleSheet } from 'react-native';
import { useNavigate } from "react-router-dom";
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';

import RepositoryItem from './RepositoryItem';
import useRepositories from '../hooks/useRepositories';
import Text from './Text';
import TextInput from './TextInput';


const styles = StyleSheet.create({
  separator: {
    height: 1,
  },
  flatList: {
    backgroundColor: 'lightgrey',
    flex: 1
  },
  searchBar: {
    backgroundColor: '#87CEFA',
    padding: 4
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <TextInput onChangeText={value => setSearchTerm(value)} value={searchTerm}
      placeholder=" (Type here to search repositories)" style={styles.searchBar} />
  )
}


export const RepositoryListContainer = ({ repositories, setSearchTerm, searchTerm, onEndReach }) => {
  const navigate = useNavigate();

  const repositoryNodes = repositories
    ? repositories.edges.map(edge => edge.node)
    : [];

  const onPress = (id) => {
    //console.log("pressed", id)
    navigate(`/repository/${id}`);
  }

  return (
    <FlatList
      style={styles.flatList}
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={<SearchBar setSearchTerm={setSearchTerm} searchTerm={searchTerm} />}
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
      renderItem={({ item }) => <RepositoryItem item={item} onPress={onPress} />}
    />
  );
};

const RepositoryList = () => {
  const [orderBy, setOrderBy] = useState("CREATED_AT");
  const [orderDirection, setOrderDirection] = useState("DESC");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchKeyword] = useDebounce(searchTerm, 1000);

  const { repositories, loading, fetchMore } = useRepositories({
    orderBy,
    orderDirection,
    searchKeyword,
    first: 5,
    after: ""
  });

  if (loading || !repositories) {
    return (<Text>Loading...</Text>)
  }

  const onEndReach = () => {
    console.log("Loading more repositories...");
    fetchMore();
  };

  return (
    <>
      <Picker
        mode={"dropdown"}
        onValueChange={(itemValue) => {
          switch (itemValue) {
            case "CREATED_AT":
              setOrderBy("CREATED_AT")
              setOrderDirection("DESC")
              break;
            case "RATING_DESCENDING":
              setOrderBy("RATING_AVERAGE")
              setOrderDirection("DESC")
              break;
            case "RATING_ASCENDING":
              setOrderBy("RATING_AVERAGE")
              setOrderDirection("ASC")
              break;
          }
        }}>
        <Picker.Item label="Select order" value="" color="grey" />
        <Picker.Item label="Latest" value="CREATED_AT" />
        <Picker.Item label="Highest rated" value="RATING_DESCENDING" />
        <Picker.Item label="Lowest rated" value="RATING_ASCENDING" />
      </Picker>
      <RepositoryListContainer repositories={repositories} setSearchTerm={setSearchTerm}
        searchTerm={searchTerm} onEndReach={onEndReach} />
    </>
  );  // a bug in the Picker component prevents the first item from being selected
};

export default RepositoryList;