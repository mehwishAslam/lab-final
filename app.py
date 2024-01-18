from flask import Flask, render_template, request, jsonify
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
from io import BytesIO
from PIL import Image

app = Flask(__name__)

# Load the pre-trained model
model = tf.keras.models.load_model('cifar10_lab_final.keras') 


def preprocess_image(img):
    img = image.img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img /= 255.0
    return img

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    try:
        img = Image.open(BytesIO(file.read()))
        img = img.resize((32, 32))  # Resize the image to match the input shape of the model
        img_array = preprocess_image(img)
        predictions = model.predict(img_array)
        predicted_class = class_names[np.argmax(predictions)]
        confidence = np.max(predictions)
        return jsonify({'class': predicted_class, 'confidence': float(confidence)})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
