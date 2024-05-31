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
            <td style="text-align: center;">${request.eventID}</td>
            <td style="text-align: center;">${eventName}</td>
            <td style="text-align: center;">${new Date(request.validationDate).toLocaleDateString()}</td>
            <td style="text-align: center;">${request.studentID}</td>
            <td style="text-align: center;">${fullName}</td> <!-- Display formatted full name -->
            <td style="text-align: center;">
                <button onclick="approveRequest(${request.id})">Approve</button>
                <button onclick="rejectRequest(${request.id})">Reject</button>
            </td>
        `;
        tableBody.appendChild(row);
    }
}

// Wait for the DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Populate the table initially
    populateRequestTable();
});
