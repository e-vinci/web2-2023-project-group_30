const express = require('express');
const {
  readOneUserFromUsername,
  updateUserData,
  jsonDbPath,
  defaultUsers,
} = require('../models/users');
const { authorize } = require('../utils/auths');
const { parse } = require('../utils/json');

const router = express.Router();
const users = [
  { name: 'Player1', points: 100 },
  { name: 'Player2', points: 95 },
  { name: 'Player3', points: 90 },
  { name: 'Player4', points: 85 },
  { name: 'Player5', points: 80 },
  { name: 'Player6', points: 75 },
  { name: 'Player7', points: 70 },
  { name: 'Player8', points: 65 },
  { name: 'Player9', points: 60 },
  { name: 'Player10', points: 55 },
];

/* GET users listing. */
router.get('/', (req, res) => {
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
