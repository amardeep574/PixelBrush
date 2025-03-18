import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, ActivityIndicator, Image, TextInput, 
  SafeAreaView
} from "react-native";
import axios from "axios";

const LazyLoading = () => {
  const [ data, setData] = useState([]); // Original API data
  const [filteredData, setFilteredData] = useState([]); // Data after search filter
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch paginated data
  const fetchData = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/photos",
        {
          params: { _page: page, _limit: 10 },
        }
      ); 

      const newData = response.data;
      setData((prevData) => [...prevData, ...newData]); // Append new data
      setFilteredData((prevData) => [...prevData, ...newData]); // Update filtered data
      setPage(page + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  // Filter data when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(data); // Show full data when search is empty
    } else {
      const filtered = data.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, data]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={{ flex: 1, padding: 10 }}>
      {/* Search Input */}
      <TextInput
        placeholder="Search images..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          borderRadius: 10,
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
      />

      {/* Image List */}
      <FlatList
        data={filteredData} // Show filtered data
        keyExtractor={(item,index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 28, borderBottomWidth: 1 }}>
            {/* <Image
              source={{ uri: item.thumbnailUrl }}
              style={{ width: 100, height: 100, borderRadius: 10 }}
            /> */}
            <Text>{item.id}</Text>
            <Text>{item.title}</Text>
          </View>
        )}
        onEndReached={fetchData} // Fetch next page on scroll end
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
      />
    </View>
    </SafeAreaView>
  );
};

export default LazyLoading;


