// Initialize Supabase client
const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbmFvc3F3cGp4a2tvaWxpd2toIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzc2NTUzMywiZXhwIjoyMDI5MzQxNTMzfQ.psoQoU_JHltupYUWp7Uo9yFbt-C2fwMizKAVBlMNyYE";
const apiUrl = "https://zknaosqwpjxkkoiliwkh.supabase.co";
const connection = supabase.createClient(apiUrl, apiKey);

// Function to fetch the event name from Supabase
async function fetchEventName(eventID) {
  const { data, error } = await connection
    .from('CES Event')
    .select('name')
    .eq('eventID', eventID)
    .single();

  if (error) {
    console.error('Error fetching event name:', error);
    return 'Unknown Event';
  }
  return data.name;
}

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
const loggedInStudentId = queryParams.studentID;

// Function to fetch student name from Supabase
async function fetchStudentName(studentID) {
  const { data, error } = await connection
    .from('Student')
    .select('firstName')
    .eq('studentID', studentID)
    .single();

  if (error) {
    console.error('Error fetching student name:', error);
    return 'Unknown Student';
  }
  return data.firstName;
}

// Function to fetch confirmed requests by student ID
async function fetchConfirmedRequests(studentID) {
  const { data, error } = await connection
    .from('requests')
    .select('*')
    .eq('studentID', studentID)
    // .eq('status', 'confirmed');

  if (error) {
    console.error('Error fetching confirmed requests:', error);
    return [];
  }
  return data;
}

// Function to populate the table with the logged-in student's requests
async function populateStudentRequests(studentID) {
  const requests = await fetchConfirmedRequests(studentID);
  const tableBody = document.querySelector('tbody');
  tableBody.innerHTML = '';  // Clear existing rows

  for (const request of requests) {
    const eventName = await fetchEventName(request.eventID);
    const studentName = await fetchStudentName(request.studentID);
    const formattedDate = new Date(request.validationDate).toLocaleDateString();

    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="w-fit py-2 px-4 border-r">${request.eventID}</td>
      <td class="w-fit py-2 px-4 border-r">${eventName}</td>
      <td class="w-fit py-2 px-4 border-r">${request.studentID}</td>
      <td class="w-fit py-2 px-4 border-r">${studentName}</td>
      <td class="w-fit py-2 px-4 border-r">${formattedDate}</td>
      <td class="w-fit py-2 px-4 border-r">${request.status}</td>
    `;
    
    tableBody.appendChild(row);
  }
}

// Fetch and populate the table with the logged-in student's requests
populateStudentRequests(loggedInStudentId);

// Function to fetch the number of confirmed statuses
async function fetchConfirmedStatuses() {
    const { data, error } = await connection
      .from('requests')
      .select('status')
      .eq('status', 'confirmed');
  
    if (error) {
      console.error('Error fetching confirmed statuses:', error);
      return 0;
    }
  
    return data.length;
  }
  
  // Function to fetch the "Total Needed" from the HTML
  function getTotalNeeded() {
    const totalNeededElement = document.getElementById('totalNeeded');
    return parseInt(totalNeededElement.textContent);
  }
  
  // Function to update the "Points Missing" dynamically
  function updatePointsMissing(totalNeeded, pointsEarned) {
    const pointsMissingElement = document.getElementById('pointsMissing');
    const pointsMissing = totalNeeded - pointsEarned;
    pointsMissingElement.textContent = pointsMissing.toString();
  }
  
  // Function to update the "Points Earned" dynamically and then update "Points Missing"
  async function updatePoints() {
    const pointsEarned = await fetchConfirmedStatuses();
    const totalNeeded = getTotalNeeded();
    const pointsEarnedElement = document.getElementById('pointsEarned');
    pointsEarnedElement.textContent = pointsEarned.toString();
    updatePointsMissing(totalNeeded, pointsEarned);
  }
  
  // Call the function to update the points initially and then set an interval to update them periodically
  updatePoints();
  setInterval(updatePoints, 60000); // Update every minute
  