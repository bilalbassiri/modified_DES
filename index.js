const modified_des = require("./modified_des");

// Key, Block, Iterations can be chosen with a completely random, but are needful for the decryption process

const TEXT = "WE HAVE ART IN ORDER NOT TO DIE FROM THE TRUTH",
  secret = {
    key: { a: 29, b: 17, c: 8 },
    iterations: 16,
  };

// Encrypt TEXT
const CIPHER_TEXT = modified_des._encrypt({
  text: TEXT,
  ...secret,
});

// Decrypt CIPHER_TEXT
const PLAIN_TEXT = modified_des._decrypt({
  text: CIPHER_TEXT,
  ...secret,
});

console.log(CIPHER_TEXT); // Output: SMWYFCJQFZYQWVNEELSHWVKJWAKQIQJQKZTCNAVVNAEKPPWQ
console.log(PLAIN_TEXT); // Output: WE HAVE ART IN ORDER NOT TO DIE FROM THE TRUTH

// https://github.com/bilalbassiri
