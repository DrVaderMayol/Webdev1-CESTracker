const api_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbmFvc3F3cGp4a2tvaWxpd2toIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzc2NTUzMywiZXhwIjoyMDI5MzQxNTMzfQ.psoQoU_JHltupYUWp7Uo9yFbt-C2fwMizKAVBlMNyYE"

const api_url="https://zknaosqwpjxkkoiliwkh.supabase.co"

const connection = supabase.createClient(api_url, api_key)

let signup = document.querySelector(".signup");
let login = document.querySelector(".login");
let slider = document.querySelector(".slider");
let formSection = document.querySelector(".form-section");
const loginbtn = document.getElementById('loginbtn');

async function loginAdmin(username, password){
  const { data, error } = await connection
  .from("Admin")
  .select()
  .eq('username', username)
  .eq('password', password)
  if (error) {
    console.error(error.message);
    return;
  }
}


loginbtn.addEventListener('click', async(event) => {
  event.preventDefault();

   // Get the values of the email and password fields
   const username = document.getElementById('loginEmail').value.trim();
   const password = document.getElementById('loginPass').value.trim();

  // Field validation
  if (!username || !password) {
    alert('Both email and password are required.');
    return;
  }

  if (username === '' || password === '') {
    alert('Email and password cannot be empty.');
    return;
  }

  try {
    await loginAdmin(username, password);
    window.location.href = "http://127.0.0.1:5500/src/pages/admin/event.html";
    
  } catch (error) {
    alert(`Error logging in: ${error.message}`);
  }
});
