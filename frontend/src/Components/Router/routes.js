import GamePage from '../Pages/GamePage';
import HomePage from '../Pages/HomePage';
import NewPage from '../Pages/NewPage';
import LoginPage from '../Pages/LoginPage';
import LeaderboardPage from '../Pages/LeaderboardPage';
import RegisterPage from '../Pages/RegisterPage';
import CommandsPage from '../Pages/CommandsPage';
import Shoppage from '../Pages/Shop';
import ProfilePage from '../Pages/ProfilPage';

const routes = {
  '/': HomePage,
  '/game': GamePage,
  '/new': NewPage,
  '/login': LoginPage,
  '/leaderboard': LeaderboardPage,
  '/register': RegisterPage,
  '/commands': CommandsPage,
  '/shop': Shoppage,
  '/profile': ProfilePage,
};

export default routes;
