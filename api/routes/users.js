const express = require('express');

const router = express.Router();
const user = [
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
  res.json(user);
});

module.exports = router;
