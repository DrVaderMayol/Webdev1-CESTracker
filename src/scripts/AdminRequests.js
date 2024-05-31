// Initialize Supabase client
const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbmFvc3F3cGp4a2tvaWxpd2toIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzc2NTUzMywiZXhwIjoyMDI5MzQxNTMzfQ.psoQoU_JHltupYUWp7Uo9yFbt-C2fwMizKAVBlMNyYE";
const apiUrl = "https://zknaosqwpjxkkoiliwkh.supabase.co";
const connection = supabase.createClient(apiUrl, apiKey);

// Function to fetch pending requests
async function fetchPendingRequests() {
    const { data, error } = await connection
        .from('requests')
        .select('*')
        .eq('status', 'pending'); // Use lowercase 'pending' if that's the correct value

    if (error) {
        console.error('Error fetching pending requests:', error);
        return [];
    }

    return data;
}

// Function to approve a request
async function approveRequest(requestID) {
    try {
        const { data, error } = await connection
            .from('requests')
            .update({ status: 'confirmed' }) // Change status to 'Confirmed'
            .eq('id', requestID);

        if (error) {
            throw error;
        }

        console.log('Request approved:', data);
        // Refresh the table after approval
        populateRequestTable();
    } catch (error) {
        console.error('Error approving request:', error);
    }
}

// Function to reject a request
async function rejectRequest(requestID) {
    try {
        const { data, error } = await connection
            .from('requests')
            .update({ status: 'denied' }) // Change status to 'Denied'
            .eq('id', requestID);

        if (error) {
            throw error;
        }

        console.log('Request rejected:', data);
        // Refresh the table after rejection
        populateRequestTable();
    } catch (error) {
        console.error('Error rejecting request:', error);
    }
}

// Function to fetch student name by student ID
async function fetchStudentName(studentID) {
    try {
        const { data, error } = await connection
            .from('Student')
            .select()
            .eq('studentID', studentID)
            .single();

        if (error) {
            throw error;
        }

        if (!data) {
            throw new Error('No student found with the provided student ID');
        }

        console.log(data)
        
        return data; // Trim excess whitespace
    } catch (error) {
        console.error('Error fetching student name:', error.message);
        return '';
    }
}

// Function to fetch event name by event ID
async function fetchEventName(eventID) {
    try {
        const { data, error } = await connection
            .from('CES Event')
            .select('name')
            .eq('eventID', eventID) // Convert to bigint if necessary
            .single();

        if (error) {
            throw error;
        }

        return data.name;
    } catch (error) {
        console.error('Error fetching event name:', error.message);
        return '';
    }
}

// Function to populate the request table
async function populateRequestTable() {
    const requests = await fetchPendingRequests();
    let tableBody = document.getElementById('requestTableBody');

    // Check if tbody exists, create it if not
    if (!tableBody) {
        tableBody = document.createElement('tbody');
        tableBody.id = 'requestTableBody';
        document.querySelector('table').appendChild(tableBody);
    } else {
        // Clear existing rows
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
    }

    for (const request of requests) {
        const eventName = await fetchEventName(request.eventID);
        const studentName = await fetchStudentName(request.studentID);

        // Format the student name with the middle name in the middle
        const fullName = `${studentName.firstName} ${studentName.middleName ? studentName.middleName + ' ' : ''}${studentName.lastName}`;

        const row = document.createElement('tr');
        row.innerHTML = `
<<<<<<< Updated upstream
            <td class="w-fit py-2 px-4 border-r">${request.eventID}</td>
            <td class="w-fit py-2 px-4 border-r">${eventName}</td>
            <td class="w-fit py-2 px-4 border-r">${new Date(request.validationDate).toLocaleDateString()}</td>
            <td class="w-fit py-2 px-4 border-r">${request.studentID}</td>
            <td class="w-fit py-2 px-4 border-r">${fullName}</td> <!-- Display formatted full name -->
=======
            <td style="w-fit  py-2 px-4 border-r">${request.eventID}</td>
            <td style="w-fit  py-2 px-4 border-r pl-20">${eventName}</td>
            <td style="w-fit  py-2 px-4 border-r">${new Date(request.validationDate).toLocaleDateString()}</td>
            <td style="w-fit  py-2 px-4 border-r">${request.studentID}</td>
            <td style="w-fit  py-2 px-4 border-r">${fullName}</td> <!-- Display formatted full name -->
>>>>>>> Stashed changes
            
            <td class="py-2 px-4 flex justify-center space-x-2">
                <button id="approveRequest${request.id}" class="viewCesEventBtn bg-green-300 x-2 py-1 rounded-xl w-24 h-12 flex flex-row justify-center items-center text-darkblue hover:bg-green-800 hover:text-white pl-3">
                <span class="material-symbols-outlined pr-2">Approve</span>
                </button>
<<<<<<< Updated upstream
                <button id="rejectRequest${request.id}" class="editCesEventBtn bg-red-300 text-black px-2 py-1 rounded-xl w-24 h-12 flex flex-row justify-center items-center hover:bg-red-800 hover:text-white">
=======
                <button id="rejectRequest${request.id}" class="editCesEventBtn bg-red-300 text-black px-2 py-1 rounded-xl w-24 h-12 flex flex-row justify-center items-center hover:bg-blue-800 hover:text-white  pl-3">
>>>>>>> Stashed changes
                <span class="material-symbols-outlined pr-2">Reject</span>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    }
}

// Wait for the DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Populate the table initially
    populateRequestTable();

    // Add event listeners for approve and reject buttons
    document.addEventListener('click', async (event) => {
        if (event.target.id.startsWith('approveRequest')) {
            const requestId = event.target.id.replace('approveRequest', '');
            await approveRequest(requestId);
        } else if (event.target.id.startsWith('rejectRequest')) {
            const requestId = event.target.id.replace('rejectRequest', '');
            await rejectRequest(requestId);
        }
    });
});
