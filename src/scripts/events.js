const api_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbmFvc3F3cGp4a2tvaWxpd2toIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzc2NTUzMywiZXhwIjoyMDI5MzQxNTMzfQ.psoQoU_JHltupYUWp7Uo9yFbt-C2fwMizKAVBlMNyYE"

const api_url="https://zknaosqwpjxkkoiliwkh.supabase.co"

const connection = supabase.createClient(api_url, api_key)

// Get the addEventButton, addEventModal, and addEventCloseButton elements
const addEventButton = document.getElementById('addEventButton');
const addEventModal = document.getElementById('addEventModal');
const addEventCloseButton = document.querySelector('#addEventModal .close');
const addEventSaveButton = document.getElementById('addEventSaveButton');

// Get the delete buttons
const deleteButtons = document.querySelectorAll('#deleteCesEventBtn');
const deleteEventModal = document.getElementById('deleteEventModal');

async function deleteCesEvent(eventID) {
  const { error } = await connection
   .from("CES Event")
   .delete()
   .eq('eventID', eventID);

  if (error) {
    throw error;
  } else {
    console.log(`Event with ID ${eventID} deleted successfully.`);
  }

  // Refresh the events list to reflect the deletion
  getEvents();
}

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

async function getEvents() {
  const { data, error } = await connection.from("CES Event").select();
  if (error) {
    console.error(error.message);
    return;
  }
  console.log(data)

  const tableBody = document.querySelector('tbody');
  data.forEach(event => {
    const row = document.createElement('tr');
    const eventDate = new Date(event.event_date);
    const formattedDate = eventDate.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    row.innerHTML = `
      <td class="w-fit  py-2 px-4 border-r">${event.eventID}</td>
      <td class="w-fit py-2 px-4 border-r">${event.name}</td>
      <td class="w-2/6 py-2 px-4 border-r">${formattedDate}</td>
      <td class="w-fit py-2 px-4 border-r">${event.description}</td>
      <td class="py-2 px-4 flex justify-center space-x-2">

        <button id="myBtn" class="bg-green-300 x-2 py-1 rounded-xl w-24 h-12 flex flex-row justify-center items-center text-darkblue hover:bg-green-800 hover:text-white">
          <span class="material-symbols-outlined pr-2">visibility</span>
          View
        </button>

        <button class="bg-blue-500 text-darkblue px-2 py-1 rounded-xl w-24 h-12 flex flex-row justify-center items-center hover:bg-blue-800 hover:text-white">
          <span class="material-symbols-outlined pr-2">edit</span>
          Edit
        </button>

        <button id="deleteCesEventBtn_${event.eventID}" class="deleteCesEventBtn bg-red-300 text-darkblue px-2 py-1 rounded-xl w-24 h-12 flex flex-row justify-center items-center hover:bg-red-800 hover:text-white">
          <span class="material-symbols-outlined">delete</span>
          Delete
        </button>

      </td>
    `;
    tableBody.appendChild(row);
  });

    // Attach event listeners to the delete buttons
  const deleteButtons = document.querySelectorAll('.deleteCesEventBtn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      const eventIdWithoutPrefix = event.target.id.replace('deleteCesEventBtn_', '');
    
      deleteEventModal.classList.toggle('hidden');
    
      const eventName = event.target.parentNode.parentNode.children[1].textContent;
      document.getElementById('deleteEventQuestion').textContent = `Are you sure you want to delete event titled "${eventName}"?`;
    
      const confirmDeleteEventBtn = document.getElementById('confirmDeleteEventBtn');
    
      const cancelDeleteEventBtn = document.getElementById('cancelDeleteEventBtn');

      cancelDeleteEventBtn.addEventListener('click', () => {
        event.preventDefault();
        deleteEventModal.classList.toggle('hidden');
        console.log('cancel clicked');
      });
      
      confirmDeleteEventBtn.addEventListener('click', async () => {
        event.preventDefault();
        try {
          await deleteCesEvent(eventIdWithoutPrefix);
      
          deleteEventModal.classList.toggle('hidden');
      
          alert('Event deleted successfully');
          
        } catch (error) {
          alert(`Error deleting event: ${error.message}`);
        }
      });
      
      // Corrected event listener for closing the modal when clicking outside
      document.addEventListener('click', (event) => {
        event.preventDefault();
        // Check if the target is the modal or one of its children
        if (event.target === deleteEventModal) {
          // Hide the delete event modal
          deleteEventModal.classList.toggle('hidden');
          console.log('outside modal clicked');
        }
      });
    });
  });
}

function generateID(date, dept) {
  // Extract month, day, and year from the given date
  const eventDate = new Date(date);
  const month = String(eventDate.getMonth() + 1).padStart(2, '0');
  const day = String(eventDate.getDate()).padStart(2, '0');
  const year = String(eventDate.getFullYear()).slice(2);
  
  // Construct the ID using the provided format
  const id = `${month}${day}${year}_${dept}_${generateRandomString(5)}`;
  console.log(id);
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