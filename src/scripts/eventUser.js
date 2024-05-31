const api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbmFvc3F3cGp4a2tvaWxpd2toIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzc2NTUzMywiZXhwIjoyMDI5MzQxNTMzfQ.psoQoU_JHltupYUWp7Uo9yFbt-C2fwMizKAVBlMNyYE";
const api_url = "https://zknaosqwpjxkkoiliwkh.supabase.co";

const connection = supabase.createClient(api_url, api_key);

const addEventModal = document.getElementById('addEventModal');
const addEventCloseButton = document.querySelector('#addEventModal .close');
const addEventSaveButton = document.getElementById('addEventSaveButton');

async function addCesEvent(name, department, description, event_date) {
  const generatedEventID = generateID(event_date, department);

  const { error } = await connection
    .from("CES Event")
    .insert({
      eventID: generatedEventID,
      name: name,
      description: description,
      event_date: event_date,
    });

  if (error) {
    throw error;
  }
}

// Function to handle date conversion
function convertToDateTimeLocal(dateString) {
  const months = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
  };

  const datePattern = /(\w+) (\d+), (\d+) at (\d+):(\d+) (\w+)/;
  const match = dateString.match(datePattern);

  if (!match) {
    return '';
  }

  const month = months[match[1]];
  const day = parseInt(match[2]);
  const year = parseInt(match[3]);
  let hour = parseInt(match[4]);
  const minute = parseInt(match[5]);
  const period = match[6];

  if (period === 'PM' && hour < 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  const eventDate = new Date(year, month, day, hour, minute);
  return eventDate.toISOString().substring(0, 16); // Format to "YYYY-MM-DDTHH:MM"
}

function generateID(date, dept) {
  // Extract month, day, and year from the given date
  const eventDate = new Date(date);
  const month = String(eventDate.getMonth() + 1).padStart(2, '0');
  const day = String(eventDate.getDate()).padStart(2, '0');
  const year = String(eventDate.getFullYear()).slice(2);

  // Construct the ID using the provided format
  const id = `${month}${day}${year}_${dept}_${generateRandomString(5)}`;
  return id;
}

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return randomString;
}

// Add an event listener to the addEventButton
addEventButton.addEventListener('click', () => {
  // Toggle the visibility of the addEventModal
  addEventModal.classList.toggle('hidden');
});

// Add an event listener to the close button
addEventCloseButton.addEventListener('click', () => {
  // Hide the addEventModal
  addEventModal.classList.add('hidden');
});

// Add an event listener to the "Save" button inside the addEventModal
addEventSaveButton.addEventListener('click', async () => {
  event.preventDefault(); // Prevent the default form submission behavior
  // Get the values from the input fields
  const name = document.getElementById('eventName').value;
  const department = document.getElementById('department').value;
  const description = document.getElementById('description').value;
  const event_date = document.getElementById('datetime').value;

  try {
    // Call the addCesEvent function with the gathered values
    await addCesEvent(name, department, description, event_date);

    // Show a success alert
    alert('Event added successfully!');

    // Clear the input fields
    document.getElementById('eventName').value = '';
    document.getElementById('department').value = '';
    document.getElementById('description').value = '';
    document.getElementById('datetime').value = '';

    // Hide the addEventModal
    addEventModal.classList.add('hidden');
  } catch (error) {
    // Show an error alert
    alert(`Error adding event: ${error.message}`);
  }
});

// Add an event listener to the document to close the modal when clicking outside
document.addEventListener('click', (event) => {
  if (event.target === addEventModal) {
    // Hide the addEventModal
    addEventModal.classList.add('hidden');
  }
}); 

document.addEventListener('DOMContentLoaded', getEvents);  