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

const editEventModal = document.getElementById('editEventModal');

const viewEventModal = document.getElementById('viewEventModal');

const eventSearchBtn = document.getElementById('searchEventButton');

  // Function to get URL parameters
function getQueryParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const paramPairs = queryString.split("&");
  paramPairs.forEach(pair => {
      const [key, value] = pair.split("=");
      params[key] = decodeURIComponent(value);
  });
  return params;
}

// Retrieve studentID from URL parameters
const queryParams = getQueryParams();
const studentID = queryParams.studentID;

// Set the href attribute for the Requests link
const requestsLink = document.getElementById('requestsLink');
if (studentID) {
  requestsLink.href = `./pointsAndRequests.html?studentID=${studentID}`;
} else {
  requestsLink.href = './pointsAndRequests.html';
}

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

async function editCesEvent(eventID, name, department, description, event_date){
  const newEventID = generateID(event_date, department);
  
  const { error } = await connection
    .from("CES Event")
    .update({
      eventID: newEventID,
      name: name,
      description: description,
      event_date: event_date,
    })
    .eq('eventID', eventID);

  if (error) {
    throw error;
  }
}

async function addRequest(eventID, studentID) {
  console.log(studentID);
  const { error } = await connection
    .from("requests")
    .insert({
      eventID: eventID,
      studentID: studentID,
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
  console.log(data);

  const tableBody = document.querySelector('tbody');
  tableBody.innerHTML = ''; // Clear existing rows
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
        <button id="viewCesEventBtn_${event.eventID}" class="viewCesEventBtn bg-green-300 x-2 py-1 rounded-xl w-24 h-12 flex flex-row justify-center items-center text-darkblue hover:bg-green-800 hover:text-white">
          <span class="material-symbols-outlined pr-2">visibility</span>
          View
        </button>
        <button id="requestCesEventBtn_${event.eventID}" class="deleteCesEventBtn bg-blue-300 text-darkblue px-2 py-1 rounded-xl w-fit h-12 flex flex-row justify-center items-center hover:bg-blue-800 hover:text-white">
          <span class="material-symbols-outlined">delete</span>
          Request
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  
  // Attach event listeners to the delete buttons
  const requestButton = document.querySelectorAll('.deleteCesEventBtn');
  requestButton.forEach(button => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      const eventIdWithoutPrefix = event.target.id.replace('requestCesEventBtn_', '');
    
      try {
        await addRequest(eventIdWithoutPrefix, studentID)
        alert('Event point requested successfully');
      } catch (error) {
        alert('Error requesting event point');
      }
    });
  });


  // Attach event listeners to the view buttons
  const viewButtons = document.querySelectorAll('.viewCesEventBtn');
  viewButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault(); // Add this line to prevent default behavior

      // Show the view event modal
      viewEventModal.classList.remove('hidden');
      
      const eventIdWithoutPrefix = event.target.id.replace('viewCesEventBtn_', '');

      // Populate the view fields with the event details
      const eventRow = event.target.closest('tr');
      const eventNameText = eventRow.children[1].textContent;
      const eventDateText = eventRow.children[2].textContent;
      const eventDescriptionText = eventRow.children[3].textContent;

      // Extract department from event ID
      const department = eventIdWithoutPrefix.split('_')[1];

      document.getElementById('view_eventName').textContent = eventNameText;
      document.getElementById('view_department').textContent = department;
      document.getElementById('view_datetime').textContent = eventDateText;
      document.getElementById('view_description').textContent = eventDescriptionText;

      // Event listener for closing the view modal
      const viewCloseBtn = document.getElementById('viewCloseBtn');
      
      viewCloseBtn.addEventListener('click', () => {
        viewEventModal.classList.add('hidden');
        console.log('cancel clicked');
      });
    });
  });

  eventSearchBtn.addEventListener('click', (event) => {
    event.preventDefault();
  
    const eventID = document.getElementById('searchEventID').value.trim().toLowerCase();
    const eventName = document.getElementById('searchEventName').value.trim().toLowerCase();
  
    // Check if at least one field is filled
    if (!eventID && !eventName){
      alert('Please fill in at least one search field.');
      return;
    }
  
    // Filter events based on the search criteria
    searchEvents({ eventID, name: eventName});
  });

  async function searchEvents(filter = {}) {
    const { data, error } = await connection.from("CES Event").select();
    if (error) {
      console.error(error.message);
      return;
    }
  
    // Filter the data based on the search criteria
    const filteredData = data.filter(event => {
      if (filter.eventID && !event.eventID.toLowerCase().includes(filter.eventID)) return false;
      if (filter.name && !event.name.toLowerCase().includes(filter.name)) return false;
      return true;
    });
  
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = ''; // Clear existing rows
    filteredData.forEach(event => {
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
        <td class="w-fit py-2 px-4 border-r">${event.eventID}</td>
        <td class="w-fit py-2 px-4 border-r">${event.name}</td>
        <td class="w-2/6 py-2 px-4 border-r">${formattedDate}</td>
        <td class="w-fit py-2 px-4 border-r">${event.description}</td>
        <td class="py-2 px-4 flex justify-center space-x-2">
          <button id="viewCesEventBtn_${event.eventID}" class="viewCesEventBtn bg-green-300 x-2 py-1 rounded-xl w-24 h-12 flex flex-row justify-center items-center text-darkblue hover:bg-green-800 hover:text-white">
            <span class="material-symbols-outlined pr-2">visibility</span>
            View
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });
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



// Add an event listener to the document to close the modal when clicking outside
document.addEventListener('click', (event) => {
  if (event.target === addEventModal) {
    // Hide the addEventModal
    addEventModal.classList.add('hidden');
  }
}); 

document.addEventListener('DOMContentLoaded', getEvents);