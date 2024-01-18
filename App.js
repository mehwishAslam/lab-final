import React, { useState, useEffect } from 'react';
import { View, Button, Image, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { uploadImage, pickImageFromGallery } from './src/api';

const classLabels = ['airplane', 'automobile', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck'];

const App = () => {
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [predictedClass, setPredictedClass] = useState('');
  const [userImages, setUserImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load previously uploaded images on component mount (if needed)
    // const storedImages = loadStoredImages();
    // setUserImages(storedImages);
  }, []);

  const handleImageSelection = async () => {
    try {
      const selectedImage = await pickImageFromGallery();

      if (selectedImage) {
        setSelectedImageUri(selectedImage);

        Alert.alert(
          'Confirmation',
          'Do you want to upload and predict this image?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'OK',
              onPress: async () => {
                try {
                  setLoading(true);
                  const predicted = await uploadImage(selectedImage);
                  setPredictedClass(predicted);
                } catch (error) {
                  // Handle error if needed
                } finally {
                  setLoading(false);
                }
              },
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Select Image" onPress={handleImageSelection} />
      </View>
      {selectedImageUri && <Image source={{ uri: selectedImageUri }} style={styles.image} />}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {predictedClass && (
        <View style={styles.predictionContainer}>
          <Text style={styles.predictionText}>{`Prediction: ${predictedClass}`}</Text>
          <Text>{`Actual Class: ${classLabels[classLabels.indexOf(predictedClass)]}`}</Text>
        </View>
      )}
      <FlatList
        data={userImages}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        renderItem={({ item }) => (
          <View style={styles.userImageContainer}>
            <Image source={{ uri: item.uri }} style={styles.userImage} />
            {item.predictedClass && (
              <Text style={styles.userImagePrediction}>{`Prediction: ${item.predictedClass}`}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%',
    backgroundColor:'Red',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  predictionContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  predictionText: {
    fontWeight: 'bold',
  },
  userImageContainer: {
    margin: 5,
  },
  userImage: {
    width: 50,
    height: 50,
  },
  userImagePrediction: {
    textAlign: 'center',
    marginTop: 5,
  },
});

export default App;
