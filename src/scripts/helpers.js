function generateID(date, format) {
  // Extract month, day, and year from the given date
  const [month, day, year] = date.split('-');

  // Generate a random string for the Ys part of the ID
  const randomString = generateRandomString(5);

  // Construct the ID using the provided format
  const id = `${month}${day}${year}_${format}_${randomString}`;

  return id;
}

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return randomString;
}

// Example usage
const generatedID = generateID("05-29-24", "DCISM");
console.log(generatedID);