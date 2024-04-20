import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  ScrollView
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const Eye = ({route,navigation}) => {
  const {phoneNumber, referenceName, referencePhoneNumber} = route.params;
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [leftEyeScore, setLeftEyeScore] = useState('');
  const [rightEyeScore, setRightEyeScore] = useState('');
  const [leftEyeImage, setLeftEyeImage] = useState(null);
  const [rightEyeImage, setRightEyeImage] = useState(null);
  const [showNextMenu, setShowNextMenu] = useState(true);

  //   useEffect(()=>{
  //     get();
  //   },[]);

  //   const get = async()=>{
  //     const result = await RNFS.readDir(RNFS.DocumentDirectoryPath+"/Enetracare");
  //     console.log(result);
  //   }
  useEffect(()=>{
    perm();
  },[]);
  const perm = async()=>{
await requestCameraPermission();
await requestStoragePermission();
  }

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message:
            'This App needs access to your camera ' +
            'so you can take pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message:
            'App needs access to your storage ' +
            'so you can save photos and files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const selectImage = (side) => {
    let options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      includeBase64: true,
    };
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        return;
      } else if (response.error) {
        console.log(response.error);
        return;
      }
      if (side === 'left') {
        setLeftEyeImage(response.assets[0]);
      } else if (side === 'right') {
        setRightEyeImage(response.assets[0]);
      }
    });
  };

  const submitForm = async () => {
    // Create folder if it doesn't exist
    if (!name || !gender || !address || !leftEyeScore || !rightEyeScore || !leftEyeImage || !rightEyeImage || !age) {
        Alert.alert('Error', 'Please fill in all the required information.');
        return;
      }
    const folderPath = RNFS.DocumentDirectoryPath + '/Enetracare'; // Define the folder path
    try {
      await RNFS.mkdir(folderPath, {NSURLIsExcludedFromBackupKey: true}); // Create the directory
      await RNFS.mkdir(folderPath+"/downloads", {NSURLIsExcludedFromBackupKey: true}); // Create the directory
      console.log('Directory created successfully:', folderPath);
    } catch (error) {
      console.error('Error creating directory:', error);
    }

    // Save images
    let leftEyeImageUri = null;
    let rightEyeImageUri = null;
    let leftEyeImageBase64 = null;
    let rightEyeImageBase64 = null;

    if (leftEyeImage) {
      const leftEyeImageName = `leftEye_${name}_${phoneNumber}.jpg`;
      const leftEyeImagePath = `${folderPath}/${leftEyeImageName}`;
      // Copy the image from the original path to the new path
      leftEyeImageBase64 = `data:${leftEyeImage.type};base64,${leftEyeImage.base64}`;
      await RNFS.writeFile(leftEyeImagePath, leftEyeImageBase64, 'base64');
      await RNFS.copyFile(leftEyeImage.uri, `${folderPath}/downloads/${name}_Left.jpg`);
      await RNFS.copyFile(leftEyeImage.uri, leftEyeImagePath)
      .then(() => {
        console.log('Left Eye Image saved successfully at:', leftEyeImagePath);
        leftEyeImageUri = leftEyeImagePath;
      })
      .catch(error => {
        console.log('Error saving Left Eye Image:', error);
      });
      await RNFS.writeFile(`${folderPath+"/downloads"}/${name+"_Left"}`, leftEyeImageBase64, 'base64');

      console.log('hii');
      leftEyeImageUri = leftEyeImagePath;
      console.log('Left Eye Image Path:', leftEyeImageUri);
    }
    if (rightEyeImage) {
      const rightEyeImageName = `rightEye_${name}_${phoneNumber}.jpg`;
      const rightEyeImagePath = `${folderPath}/${rightEyeImageName}`;
      // Copy the image from the original path to the new path
      rightEyeImageBase64 = `data:${rightEyeImage.type};base64,${rightEyeImage.base64}`;
      await RNFS.writeFile(rightEyeImagePath, rightEyeImageBase64, 'base64');
      await RNFS.copyFile(rightEyeImage.uri, `${folderPath}/downloads/${name}_Right.jpg`);
      await RNFS.copyFile(rightEyeImage.uri, rightEyeImagePath)
      .then(() => {
        console.log('Right Eye Image saved successfully at:', rightEyeImagePath);
        rightEyeImageUri = rightEyeImagePath;
      })
      .catch(error => {
        console.log('Error saving Right Eye Image:', error);
      });
      await RNFS.writeFile(`${folderPath+"/downloads"}/${name+"_Right"}`, rightEyeImageBase64, 'base64');
      rightEyeImageUri = rightEyeImagePath;
      console.log('Left Eye Image Path:', rightEyeImageUri);
    }

    // Generate PDF content
    const pdfContent = `<!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        h2 {
          color: #4A90E2;
        }
        p {
          margin: 5px 0;
        }
        .info-section, .image-section {
          margin-bottom: 20px;
        }
        .flex-row {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-top: 10px;
        }
        .eye-image {
          max-width: 45%; /* Adjusted for better layout on PDF */
          height: auto; /* Changed to auto for responsive height */
          margin: 10px;
          border: 1px solid #ddd; /* Add a light border around the images */
          padding: 5px;
          background: #f7f7f7;
        }
        img {
          width: 100%;
          height: auto;
        }
        hr {
          margin-top: 20px;
          border: 0;
          border-top: 1px solid #ccc;
        }
      </style>
    </head>
    <body>
      <div class="info-section">
        <h2>Form Information:</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber}</p>
        <p><strong>Reference Name:</strong> ${referenceName}</p>
        <p><strong>Reference Phone Number:</strong> ${referencePhoneNumber}</p>
        <p><strong>Gender:</strong> ${gender}</p>
        <p><strong>Age:</strong> ${age}</p>
        <p><strong>Address:</strong> ${address}</p>
        <div>
          <p><strong>Left Eye Score:</strong> ${leftEyeScore}</p>
          <p><strong>Right Eye Score:</strong> ${rightEyeScore}</p>
        </div>
      </div>
      <hr/>
      <div class="image-section">
        <h2>Images:</h2>
        <div class="flex-row">
          <div class="eye-image">
            <p><strong>Left Eye Image:</strong></p>
            <img src="${leftEyeImageBase64}" alt="Left Eye Image" />
          </div>
          <div class="eye-image">
            <p><strong>Right Eye Image:</strong></p>
            <img src="${rightEyeImageBase64}" alt="Right Eye Image" />
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const rightEyePdfContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f7f7f7;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    img {
      max-width: 100%;
      height: auto;
      border: 1px solid #ddd;
      padding: 5px;
    }
  </style>
</head>
<body>
  <img src="${rightEyeImageBase64}" alt="Right Eye Image" />
</body>
</html>
`;
  const leftEyePdfContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f7f7f7;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    img {
      max-width: 100%;
      height: auto;
      border: 1px solid #ddd;
      padding: 5px;
    }
  </style>
</head>
<body>
  <img src="${leftEyeImageBase64}" alt="Right Eye Image" />
</body>
</html>
`;


    // Save PDF
    const pdfFilePath = `${folderPath}/${name}_${phoneNumber}_info.pdf`;
    const rightPdf = `${folderPath}/${name}_Right.pdf`;
    const leftPdf = `${folderPath}/${name}_Left.pdf`;
    await RNFS.writeFile(pdfFilePath, pdfContent, 'utf8');
    await RNFS.writeFile(rightPdf, rightEyePdfContent, 'utf8');
    await RNFS.writeFile(leftPdf, leftEyePdfContent, 'utf8');
    //   const pdfInfo = await RNFS.getInfoAsync(pdfFilePath);
    const pdfInfo = await RNFS.exists(pdfFilePath);
    console.log(pdfInfo);
    if (pdfInfo) {
      console.log('PDF is saved successfully.');
    } else {
      console.log('Failed to save PDF.');
      return;
    }

    const printOptions = {
      html: pdfContent, // You can provide HTML content directly if needed
      fileName:`${name}-${phoneNumber.slice(0,11)}`, 
    };
    const rightPrintOptions = {
      html: rightEyePdfContent, // You can provide HTML content directly if needed
      fileName: `${name}_Right.pdf`,
    };
    const leftPrintOptions = {
      html: leftEyePdfContent, // You can provide HTML content directly if needed
      fileName: `${name}_Left.pdf`,
    };

    let pdf = await RNHTMLtoPDF.convert(printOptions);
    console.log('Pdf Generated');
    await RNHTMLtoPDF.convert(rightPrintOptions);
    await RNHTMLtoPDF.convert(leftPrintOptions);
  
    // Alert.alert('Success', 'Form submitted successfully!');
    navigation.navigate("Pdf",{filePath: pdf.filePath,name:name});

    // Reset form fields
    setName('');
    setGender('');
    setAddress('');
    setLeftEyeScore('');
    setRightEyeScore('');
    setAge('');
    setLeftEyeImage(null);
    setRightEyeImage(null);
    setShowNextMenu(false);
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      {showNextMenu && (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            placeholderTextColor={"gray"}
            value={name}
            autoCapitalize="words"
            onChangeText={(text) => setName(text)}
          />
          <Text style={styles.label}>Gender:</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={"gray"}
            placeholder="Enter gender"
            value={gender}
            onChangeText={(text) => setGender(text)}
          />
          <Text style={styles.label}>Age:</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={"gray"}
            placeholder="Enter age"
            value={age}
            onChangeText={(text) => setAge(text)}
          />
          <Text style={styles.label}>Address:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            placeholderTextColor={"gray"}
            value={address}
            onChangeText={(text) => setAddress(text)}
          />
          <Text style={styles.label}>Eye Score:</Text>
          <Image
                source={require('./../assets/SnellensChart.jpg')}
                style={styles.chartImage}
                resizeMode="contain"
            />
            <View style={styles.InputButtonsContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter left eye score"
              value={leftEyeScore}            
              placeholderTextColor={"gray"}
              onChangeText={(text) => setLeftEyeScore(text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Enter right eye score"
            placeholderTextColor={"gray"}
            value={rightEyeScore}
              onChangeText={(text) => setRightEyeScore(text)}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.photoButtonsContainer}>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={() => selectImage('left')}
            >
              <Text style={styles.buttonText}>Take Left Eye Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={() => selectImage('right')}
            >
              <Text style={styles.buttonText}>Take Right Eye Photo</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.imageContainer}>
            {leftEyeImage && (
              <Image
                source={{
                  uri: `data:${leftEyeImage.type};base64,${leftEyeImage.base64}`,
                }}
                style={styles.image}
              />
            )}
            {rightEyeImage && (
              <Image
                source={{
                  uri: `data:${rightEyeImage.type};base64,${rightEyeImage.base64}`,
                }}
                style={styles.image}
              />
            )}
          </View>
          <TouchableOpacity style={styles.button} onPress={submitForm}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Background color
    marginVertical:50
  },
   chartImage: {
        width: 200, // Adjust the width according to your image size
        height: 200, // Adjust the height according to your image size
        marginBottom: 16,
        alignSelf:"center"
    },
  formContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: '#ffffff', // Form background color
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  InputButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color:"black"
  },
  button: {
    backgroundColor: '#4CAF50', // Button background color
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // Button text color
    fontWeight: 'bold',
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  photoButton: {
    backgroundColor: '#2196F3', // Photo button background color
    padding: 15,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  label: {
    marginBottom: 5,
    color:"black",
    fontWeight: 'bold',
  },
});


export default Eye;
