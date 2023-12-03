import  clearPage from '../../utils/render';

const CommandsPage = () => {
    clearPage.ClearPage();
    const main = document.querySelector('main');
    main.innerHTML = '';
    main.innerHTML = 'Leaderboard page';
  };

  export default CommandsPage;