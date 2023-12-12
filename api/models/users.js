const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('node:path');
const { parse, serialize } = require('../utils/json');

const jwtSecret = 'ilovemypizza!';
const lifetimeJwt = 24 * 60 * 60 * 1000; // in ms : 24 * 60 * 60 * 1000 = 24h

const saltRounds = 10;

const jsonDbPath = path.join(__dirname, '/../data/users.json');

const defaultUsers = [
  {
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync('admin', saltRounds),
    birthdate: '1990-01-01',
    score: 0,
    skin1: false,
    skin2: false,
    skin3: false,
    skin4: false,
    skin5: false,
    skin6: false,
    skin7: false,
    skin8: false,
  },
];

const skins = {
  skin1: { price: 100 },
  skin2: { price: 200 },
  skin3: { price: 300 },
  skin4: { price: 400 },
  skin5: { price: 500 },
  skin6: { price: 600 },
  skin7: { price: 700 },
};

async function login(username, password) {
  const userFound = readOneUserFromUsername(username);
  if (!userFound) return undefined;

  const passwordMatch = await bcrypt.compare(password, userFound.password);
  if (!passwordMatch) return undefined;

  const token = jwt.sign(
    { username }, // session data added to the payload (payload : part 2 of a JWT)
    jwtSecret, // secret used for the signature (signature part 3 of a JWT)
    { expiresIn: lifetimeJwt }, // lifetime of the JWT (added to the JWT payload)
  );

  const authenticatedUser = {
    username,
    token,
  };

  return authenticatedUser;
}

// Ajoutez cette fonction pour valider la date de naissance
function isValidBirthdate(birthdate) {
  const year = parseInt(birthdate.split('-')[0], 10);
  return year >= 1900 && year <= 2023;
}

// Ajoutez cette fonction pour valider le mot de passe
function isValidPassword(password) {
  const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return regex.test(password);
}

async function register(username, password, birthdate) {
  if (!isValidBirthdate(birthdate) || !isValidPassword(password)) {
    return { success: false, message: 'Date de naissance ou mot de passe invalide' };
  }
  const userFound = readOneUserFromUsername(username);
  if (userFound) return undefined;

  await createOneUser(username, password, birthdate);

  const token = jwt.sign(
    { username }, // session data added to the payload (payload : part 2 of a JWT)
    jwtSecret, // secret used for the signature (signature part 3 of a JWT)
    { expiresIn: lifetimeJwt }, // lifetime of the JWT (added to the JWT payload)
  );

  const authenticatedUser = {
    username,
    token,
  };

  return authenticatedUser;
}

function readOneUserFromUsername(username) {
  const users = parse(jsonDbPath, defaultUsers);
  const indexOfUserFound = users.findIndex((user) => user.username === username);
  if (indexOfUserFound < 0) return undefined;

  return users[indexOfUserFound];
}

async function createOneUser(username, password, birthdate) {
  const users = parse(jsonDbPath, defaultUsers);

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const createdUser = {
    id: getNextId(),
    username,
    password: hashedPassword,
    birthdate,
    bestscore: 0,
    stars: 0,
    skin0: true,
    skin1: false,
    skin2: false,
    skin3: false,
    skin4: false,
    skin5: false,
    skin6: false,
    skin7: false,
    skin8: false,
    currentskin: 0,
  };

  users.push(createdUser);

  serialize(jsonDbPath, users);

  return createdUser;
}

function getNextId() {
  const users = parse(jsonDbPath, defaultUsers);
  const lastItemIndex = users?.length !== 0 ? users.length - 1 : undefined;
  if (lastItemIndex === undefined) return 1;
  const lastId = users[lastItemIndex]?.id;
  const nextId = lastId + 1;
  return nextId;
}

async function updateUserData(updatedUser) {
  const users = parse(jsonDbPath, defaultUsers);
  const userIndex = users.findIndex((user) => user.id === updatedUser.id);
  if (userIndex !== -1) {
    users[userIndex] = updatedUser;
    serialize(jsonDbPath, users);
  }
}
function readAllUsers() {
  const users = parse(jsonDbPath, defaultUsers);
  return users;
}

async function unlockUserSkin(username, skinName) {
  const user = readOneUserFromUsername(username);
  console.log(`Username: ${username}, SkinName: ${skinName}, SkinStatus: ${user[skinName]}`);

  if (!user) {
    return { success: false, message: 'Utilisateur non trouvé' };
  }

  if (user[skinName] === false) {
    user[skinName] = true;
    await updateUserData(user);
    return { success: true, message: `${skinName} débloqué` };
  }
  return { success: false, message: 'Ce skin est déjà débloqué' };
}

function checkUserSkin(username, skinName) {
  const user = readOneUserFromUsername(username);
  if (!user) return null;

  return user[skinName];
}

async function updateCurrentSkin(username, skinNumber) {
  const user = readOneUserFromUsername(username);
  if (!user) return { success: false, message: 'Utilisateur non trouvé' };

  if (user[`skin${skinNumber}`] !== true) {
    return { success: false, message: 'Skin non débloqué' };
  }

  user.currentskin = skinNumber;
  await updateUserData(user);
  return { success: true, message: `Current skin mis à jour vers skin${skinNumber}` };
}

async function purchaseSkin(username, skinName) {
  const user = readOneUserFromUsername(username);
  if (!user) return { success: false, message: 'Utilisateur non trouvé' };

  const skin = skins[skinName];
  if (!skin) return { success: false, message: 'Skin non trouvé' };

  if (user.stars < skin.price) {
    return { success: false, message: 'Pas assez de stars pour acheter ce skin' };
  }

  if (user[skinName]) {
    return { success: false, message: 'Skin déjà possédé' };
  }

  user.stars -= skin.price;
  user[skinName] = true;
  await updateUserData(user);
  return { success: true, message: `Skin ${skinName} acheté` };
}

module.exports = {
  login,
  register,
  readOneUserFromUsername,
  updateUserData,
  jsonDbPath,
  defaultUsers,
  unlockUserSkin,
  readAllUsers,
  checkUserSkin,
  updateCurrentSkin,
  purchaseSkin,
};
