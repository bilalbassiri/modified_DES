const ALPHA = [
  " ",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
const getSetupKeys = ({ text, block, iterations, key }) => {
  let series = [key.U_0];
  const partLen = Math.round(block / 2);
  const msgLength = text.length;
  const divisions = Math.round(msgLength / block);
  let keys = [];
  for (let i = 1; i < iterations * divisions * partLen; i++) {
    series[i] = (key.a * series[i - 1] + key.b * (i - 1)) % 27;
  }
  for (let k = 0; k < divisions; k++) {
    keys[k] = series.slice(
      k * partLen * iterations,
      (k + 1) * partLen * iterations
    );
  }
  return { keys, divisions, msgLength, partLen };
};

const des = {
  _encrypt: (config) => {
    let cryptedNumbers = [];
    const { text, block, iterations } = config;
    const { keys, divisions, msgLength, partLen } = getSetupKeys(config);
    for (let i = 0; i < divisions; i++) {
      let msgIndexs = text
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
        rightPart[rightPart.length - 1] = firstNumber;
        const iterationKey = blockKey.slice(
          j * rightPart.length,
          (j + 1) * rightPart.length
        );
        rightPart = rightPart.map(
          (num, index) => (iterationKey[index] + num) % 27
        );
      }
      cryptedNumbers = [...cryptedNumbers, ...leftPart, ...rightPart];
    }
    return cryptedNumbers.map((num) => ALPHA[num]).join("");
  },
  _decrypt: (config) => {
    const { text, block, iterations } = config;
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
    return result.map((num) => ALPHA[num]).join("");
  },
};

module.exports = des;
