import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import RNFS from 'react-native-fs';

const EyeImages = ({navigation}) => {
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getFiles();
  }, []);

  const getFiles = async () => {
    const result = await RNFS.readDir(RNFS.DocumentDirectoryPath + '/Enetracare/downloads');
    let tempFiles = result.filter(file => file.name.endsWith('.jpg'));
    tempFiles = tempFiles.filter(file => file.name.includes('Right') || file.name.includes('Left'));
    // console.log(tempFiles);
    setFiles(tempFiles);
    // console.log(RNFS.DocumentDirectoryPath + '/../cache/');
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const redirectToPdf = (path,name)=>{
    // console.log(":",name.split(".")[0]);
    navigation.navigate("ImageDownload",{filePath: path,name:name.split(".")[0]});
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.item} onPress={()=>redirectToPdf(item.path,item.name)}>
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Image Files</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Images"
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
        placeholderTextColor={"gray"}
      />
      <FlatList
        data={filteredFiles}
        renderItem={renderItem}
        keyExtractor={(item) => item.path}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:"black"
  },
  searchInput: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    color:"black"
  },
  listContainer: {
    flexGrow: 1,
  },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 15,
  },
  itemText: {
    fontSize: 16,
    color: '#333333',
  },
});

export default EyeImages;
