const express = require('express');
const {
  readOneUserFromUsername,
  updateUserData,
  jsonDbPath,
  defaultUsers,
  readAllUsers,
} = require('../models/users');
const { authorize } = require('../utils/auths');
const { parse } = require('../utils/json');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  const users = readAllUsers();
  res.json(users);
});

// eslint-disable-next-line consistent-return
router.post('/update-score', authorize, async (req, res) => {
  const { newScore } = req.body;
  const { username } = req.user; // Récupérer le nom d'utilisateur du middleware 'authorize'

  const user = readOneUserFromUsername(username);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  if (newScore > user.score) {
    user.score = newScore;
    await updateUserData(user);
    res.json({ success: true, message: 'Score mis à jour' });
  } else {
    res.json({ success: false, message: 'Le nouveau score n est pas plus élevé' });
  }
});

router.get('/classement', (req, res) => {
  const usersleaderboard = parse(jsonDbPath, defaultUsers);
  usersleaderboard.sort((a, b) => b.score - a.score);
  res.json(usersleaderboard.map((user) => ({ username: user.username, score: user.score })));
});

module.exports = router;
