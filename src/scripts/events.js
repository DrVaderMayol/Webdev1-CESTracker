const api_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbmFvc3F3cGp4a2tvaWxpd2toIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzc2NTUzMywiZXhwIjoyMDI5MzQxNTMzfQ.psoQoU_JHltupYUWp7Uo9yFbt-C2fwMizKAVBlMNyYE"

const api_url="https://zknaosqwpjxkkoiliwkh.supabase.co"

const connection = supabase.createClient(api_url,api_key)

async function getEvents() {
  const { data, error } = await connection.from("CES Event").select();
  if (error) {
    console.error(error.message);
    return;
  }else{
    console.log(data)
  }

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
        <button class="bg-green-300 x-2 py-1 rounded-xl w-24 h-12 flex flex-row justify-center items-center text-darkblue hover:bg-green-800 hover:text-white">
          <span class="material-symbols-outlined pr-2">visibility</span>View
        </button>
        <button class="bg-blue-500 text-darkblue px-2 py-1 rounded-xl w-24 h-12 flex flex-row justify-center items-center hover:bg-blue-800 hover:text-white">
          <span class="material-symbols-outlined pr-2">edit</span>Edit
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

document.addEventListener('DOMContentLoaded', getEvents);