const ProfilePage = () => {
  const main = document.querySelector('main');

  // Profile data
  const name = 'John Doe';
  const email = 'johndoe@example.com';
  const birthdate = '01/01/2021';
  const age = calculateAge(birthdate);

  // Creating HTML structure for the profile
  const profileHTML = `
    <div class="container">
     <div class="row justify-content-center">
         <div class="profile">
             <h1 class=text-center>Profile</h1>
             <h2 class=text-center>${name}</h2>
             <h3 class=text-center>Age: ${age}</h3>
             <h3 class=text-center>Email: ${email}</h3>
             <h3 class="text-center">date de naissance: ${birthdate}</3>
         </div>
     </div>
    </div>
    `;

  // Setting the HTML content to the main element
  main.innerHTML = profileHTML;
};
function calculateAge(birthDate) {
  // Split the date string into day, month, and year components
  const parts = birthDate.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const today = new Date();
  const birth = new Date(year, month, day);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    // eslint-disable-next-line no-plusplus
    age--;
  }

  return age;
}

export default ProfilePage;
