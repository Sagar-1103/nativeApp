import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import RNPrint from 'react-native-print';
import RNFS from 'react-native-fs';
import uuid from 'react-native-uuid';

const Pdf = ({route}) => {
  const {filePath,name} = route.params;

  const printPdf = async()=>{
    await RNPrint.print({filePath:filePath});
  }
  const downloadPdf = async () => {
    try {
      const id = uuid.v4().slice(0,2);
      const destinationPath = `${RNFS.DownloadDirectoryPath}/${name.split(" ")[0]}-${id}.jpg`;
      await RNFS.copyFile(filePath, destinationPath);
      console.log(filePath);
      Alert.alert('Download Successful', `PDF downloaded to downloads folder.`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      Alert.alert('Download Failed', 'An error occurred while downloading the PDF');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={downloadPdf} >
        <Text style={styles.buttonText}>Download Image</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.button} onPress={printPdf}>
        <Text style={styles.buttonText}>Print PDF</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Background color
  },
  button: {
    backgroundColor: '#4CAF50', // Button background color
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    width: 200,
  },
  buttonText: {
    color: '#fff', // Button text color
    fontWeight: 'bold',
    fontSize: 16,
  },
});
export default Pdf;
