// Name under which user data will be stored in the localStorage

const STORE_NAME = 'user';


// storing user's data

const setUserSessionData = (user) => {
  const storageValue = JSON.stringify(user);
  localStorage.setItem(STORE_NAME, storageValue);
};

// returns the sessiondata 

const getUserSessionData = () => {
  const retrievedUser = localStorage.getItem(STORE_NAME);
  if (!retrievedUser) return;
  // eslint-disable-next-line consistent-return
  return JSON.parse(retrievedUser);
};

// delete the sessiondata

const removeSessionData = () => {
  localStorage.removeItem(STORE_NAME);
};

// return true if authentificated, false otherwise

// eslint-disable-next-line arrow-body-style
const isLoggedIn = () => {
  // Vérifie si l'utilisateur est authentifié en se basant sur les données enregistrées en session
  return !!getUserSessionData();
};

// logs out the user + deletes his session data

const logoutuser = () => {
    removeSessionData();
  };
  

export { setUserSessionData, getUserSessionData, removeSessionData, isLoggedIn, logoutuser };
