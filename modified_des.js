const ALPHA = " ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  block = 8;

const getSetupKeys = ({ text, iterations, key }) => {
  let series = [key.c];
  const partLen = Math.round(block / 2);
  const msgLength = text.length;
  const divisions = Math.round(msgLength / block); // Number of blocks
  let keys = [];
  for (let i = 1; i < iterations * divisions * partLen; i++) {
    // Generate the secondary keys
    series[i] = (key.a * series[i - 1] + key.b) % 27;
  }
  for (let k = 0; k < divisions; k++) {
    // Divide secondary keys into a collection for every block
    keys[k] = series.slice(
      k * partLen * iterations,
      (k + 1) * partLen * iterations
    );
  }
  return { keys, divisions, partLen };
};

const modified_des = {
  // Encryption method
  _encrypt: (config) => {
    const { text, iterations } = config;
    let cryptedNumbers = [];
    const { keys, divisions, partLen } = getSetupKeys(config);
    for (let i = 0; i < divisions; i++) {
      let msgIndexs = text
        .concat("       ")
        .slice(i * block, i * block + block)
        .split("")
        .map((letter) => ALPHA.indexOf(letter));
      let leftPart = msgIndexs.slice(
        0,
        Math.round(block / (msgIndexs.length <= 4 ? 4 : 2))
      );
      let rightPart = msgIndexs.slice(
        Math.round(block / (msgIndexs.length <= 4 ? 4 : 2))
      );
      const blockKey = keys[i];
      for (let j = 0; j < iterations; j++) {
        let temp_1 = leftPart;
        leftPart = rightPart;
        rightPart = temp_1;
        const firstNumber = rightPart[0];
        for (let k = 0; k < rightPart.length - 1; k++) {
          rightPart[k] = rightPart[k + 1];
        }
        rightPart[partLen - 1] = firstNumber;
        const iterationKey = blockKey.slice(j * partLen, (j + 1) * partLen);
        rightPart = rightPart.map(
          (num, index) => (iterationKey[index] + num) % 27
        );
      }
      cryptedNumbers = [...cryptedNumbers, ...leftPart, ...rightPart];
    }
    return cryptedNumbers
      .map((num) => ALPHA[num])
      .join("")
      .trim();
  },
  // Decryption method
  _decrypt: (config) => {
    const { text, iterations } = config;
    let result = [];
    const { keys, divisions, partLen } = getSetupKeys(config);
    for (let i = 0; i < divisions; i++) {
      let msgIndexs = text
        .slice(i * block, (i + 1) * block)
        .split("")
        .map((letter) => ALPHA.indexOf(letter));
      let leftPart = msgIndexs.slice(
        0,
        Math.round(block / (msgIndexs.length <= 4 ? 4 : 2))
      );
      let rightPart = msgIndexs.slice(
        Math.round(block / (msgIndexs.length <= 4 ? 4 : 2))
      );
      const blockKey = keys[i];
      for (let j = iterations - 1; j >= 0; j--) {
        const iterationKey = blockKey.slice(j * partLen, (j + 1) * partLen);
        rightPart = rightPart.map(
          (num, index) => (num - iterationKey[index] + 27) % 27
        );
        const lastNumber = rightPart[partLen - 1];
        for (let k = partLen - 1; k >= 0; k--) {
          rightPart[k] = rightPart[k - 1];
        }
        rightPart[0] = lastNumber;
        const temp_1 = rightPart;
        rightPart = leftPart;
        leftPart = temp_1;
      }
      result = [...result, ...leftPart, ...rightPart];
    }
    return result
      .map((num) => ALPHA[num])
      .join("")
      .trim();
  },
};

module.exports = modified_des;
