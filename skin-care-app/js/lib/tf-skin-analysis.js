// TensorFlow.js Skin Analysis Model
import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.18.0/dist/tf.min.js';

class SkinAnalyzer {
  constructor() {
    this.model = null;
    this.labels = ['عادية', 'دهنية', 'جافة', 'مختلطة', 'حساسة'];
    this.loaded = false;
  }

  async loadModel() {
    try {
      // Load pre-trained skin analysis model
      this.model = await tf.loadLayersModel('models/skin-model/model.json');
      this.loaded = true;
      console.log('Skin analysis model loaded');
    } catch (error) {
      console.error('Failed to load model:', error);
    }
  }

  async analyze(imageElement) {
    if (!this.loaded) await this.loadModel();
    
    // Preprocess image
    const tensor = tf.browser.fromPixels(imageElement)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .div(tf.scalar(255.0))
      .expandDims();

    // Predict
    const predictions = this.model.predict(tensor);
    const results = await predictions.data();
    predictions.dispose();

    // Get top prediction
    const topResult = tf.argMax(results).dataSync()[0];
    return {
      skinType: this.labels[topResult],
      confidence: results[topResult].toFixed(2)
    };
  }
}

export default SkinAnalyzer;