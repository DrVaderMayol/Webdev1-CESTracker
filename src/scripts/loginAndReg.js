const api_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbmFvc3F3cGp4a2tvaWxpd2toIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzc2NTUzMywiZXhwIjoyMDI5MzQxNTMzfQ.psoQoU_JHltupYUWp7Uo9yFbt-C2fwMizKAVBlMNyYE"

const api_url="https://zknaosqwpjxkkoiliwkh.supabase.co"

const connection = supabase.createClient(api_url, api_key)

let signup = document.querySelector(".signup");
let login = document.querySelector(".login");
let slider = document.querySelector(".slider");
let formSection = document.querySelector(".form-section");
 
signup.addEventListener("click", () => {
    slider.classList.add("moveslider");
    formSection.classList.add("form-section-move");
});
 
login.addEventListener("click", () => {
    slider.classList.remove("moveslider");
    formSection.classList.remove("form-section-move");
});

const loginbtn = document.getElementById('loginbtn');
const registerbtn = document.getElementById('regbtn');

async function loginf(email, password){
  const { data, error } = await connection
  .from("Student")
  .select()
  .eq('email', email)
  .eq('password', password)
  if (error) {
    console.error(error.message);
    return;
  }
  console.log(data);
}

async function register(firstName, middleName, lastName, course, studentID, email, password){

  const { error } = await connection
    .from("CES Event")
    .insert({
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      course: course,
      studentID: studentID,
      email: email,
      password: password,
    });

  if (error) {
    throw error;
  }
}

loginbtn.addEventListener('click', async(event) => {
  event.preventDefault();

   // Get the values of the email and password fields
   const email = document.getElementById('loginEmail').value.trim();
   const password = document.getElementById('loginPass').value.trim();

  // Field validation
  if (!email || !password) {
    alert('Both email and password are required.');
    return;
  }

  if (email === '' || password === '') {
    alert('Email and password cannot be empty.');
    return;
  }

  const emailPattern = /^[0-9]+@usc.edu.ph$/;
  if (!emailPattern.test(email)) {
    alert('Email must be in the format 19103939@usc.edu.ph with numbers before @ and ending with usc.edu.ph.');
    return;
  }

  try {
    await loginf(email, password);
    alert('Logged in successfully');
  } catch (error) {
    alert(`Error logging in: ${error.message}`);
  }
});


