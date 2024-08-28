import * as tf from '@tensorflow/tfjs';

// Definir o modelo
const model = tf.sequential();

// Adicionar camadas
model.add(tf.layers.dense({
  units: 64,
  activation: 'relu',
  inputShape: [inputDim] // inputDim deve ser o número de características dos dados
}));

model.add(tf.layers.dense({
  units: 32,
  activation: 'relu'
}));

model.add(tf.layers.dense({
  units: outputDim, // outputDim deve ser o número de saídas desejadas
  activation: 'linear' // ou 'softmax' para classificação
}));

// Compilar o modelo
model.compile({
  optimizer: 'adam',
  loss: 'meanSquaredError' // ou 'categoricalCrossentropy' para classificação
});


async function trainModel(xTrain, yTrain) {
    // Converter dados para tensores
    const xs = tf.tensor2d(xTrain);
    const ys = tf.tensor2d(yTrain);
  
    // Treinar o modelo
    await model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2
    });
  }
  

  async function generateAnalysis(inputData) {
    // Converter dados de entrada para tensor
    const inputTensor = tf.tensor2d([inputData]);
  
    // Fazer previsões
    const predictions = model.predict(inputTensor).arraySync();
  
    // Gerar análises baseadas nas previsões
    return predictions.map(prediction => {
      if (prediction > threshold) {
        return "Você está gastando mais do que o planejado. Considere revisar seu orçamento.";
      } else {
        return "Seu orçamento está dentro dos parâmetros planejados. Continue assim!";
      }
    });
  }
  