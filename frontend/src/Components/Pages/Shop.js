/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import { Carousel } from 'bootstrap';
import anime from 'animejs';
import { getUserSessionData, isLoggedIn } from '../../utils/auth';
import Navigate from '../Router/Navigate'
import skin0 from '../../assets/Ship1.png';
import skin1 from '../../assets/Ship2.png';
import skin2 from '../../assets/Ship3.png';
import skin3 from '../../assets/Ship4.png';
import skin4 from '../../assets/Ship5.png';
import skin5 from '../../assets/Ship6.png';
import skin6 from '../../assets/Ship7.png';
import skin7 from '../../assets/Ship8.png';
import star from '../../assets/star.png';
import { clearPage } from '../../utils/render';

const ShopPage = async () => {
    clearPage();
    const main = document.querySelector('main');
    main.innerHTML = `
      <div id="balanceDisplay"></div>
      <div class="container d-flex justify-content-center" id="shopPage">

          <div id="carouselShopItems" class="carousel slide">
          <div class="carousel-indicators">
            <button type="button" data-bs-target="#carouselShopItems" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselShopItems" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselShopItems" data-bs-slide-to="2" aria-label="Slide 3"></button>
            <button type="button" data-bs-target="#carouselShopItems" data-bs-slide-to="3" aria-label="Slide 4"></button>
            <button type="button" data-bs-target="#carouselShopItems" data-bs-slide-to="4" aria-label="Slide 5"></button>
            <button type="button" data-bs-target="#carouselShopItems" data-bs-slide-to="5" aria-label="Slide 6"></button>
            <button type="button" data-bs-target="#carouselShopItems" data-bs-slide-to="6" aria-label="Slide 7"></button>
            <button type="button" data-bs-target="#carouselShopItems" data-bs-slide-to="7" aria-label="Slide 8"></button>
          </div>
          <div class="carousel-inner h-100">
            <div class="carousel-item active h-100" id="0" data-bs-skin="0">
              <div class="h-100 shopItemContainer w-100 justify-content-center">
                  <img src="${skin0}" class="d-block shopItemImg " alt="..." >
                  <div class=" shopItemDesc">
                  <h2 class="shopItemTitle">Acquis &#x2713;</h2>
                  </div>
              </div>    
            </div>
            
            
          </div>
    
          <button class="carousel-control-prev shopInteractionBtn" type="button" data-bs-target="#carouselShopItems" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next shopInteractionBtn" type="button" data-bs-target="#carouselShopItems" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
        <button id="shopPurchaseBtn" data-uri="">Equiper</button>
      </div>
    `;

    const username = getUserSessionData()?.username;
    const token = getUserSessionData()?.token;

    const button = document.getElementById('shopPurchaseBtn');

    // First element (equip on click)

    // Get balance
    let balance;
    async function getBalance(){
      const response = await fetch(`${process.env.API_BASE_URL}/users/get-balance/${username}`);
      balance = await response.json();
      return balance;
    }
    balance = await getBalance();
    // Display it
    const balanceDisplay = document.getElementById('balanceDisplay');
    balanceDisplay.innerHTML = `<span id="balanceNumber">${balance}</span> <img src="${star}">`;

    // GET ALL THE SKINS TABLE WITH PRICES 
    async function getSkins(){
      const response = await fetch (`${process.env.API_BASE_URL}/users/get-skins`)
      const table =  await response.json();
      return table;    
    }
    const skinsTable =await getSkins();
    console.log(skinsTable[0]);

    async function getCurrentSkin(){
      const response = await fetch(`${process.env.API_BASE_URL}/users/current-skin/${username}`)
      const skin = await response.json();
      return skin;
    }

    async function getSkinStatus(skinID){
      let skinData;
      let isUnlocked; 
      try {
        const response = await fetch(`${process.env.API_BASE_URL}/users/check-skin/${username}/skin${skinID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token
          }
        });
        skinData = await response.json();
      } catch {
        console.error('CANNOT GET SKIN STATUS OF THE SKIN')
      // eslint-disable-next-line prefer-const
      } isUnlocked = skinData?.isUnlocked;
      return isUnlocked;
    }

    async function setCurrentSkin(skinID){

      const response = await fetch(`${process.env.API_BASE_URL}/users/change-current-skin`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({
          "skinNumber": skinID
        })
      }).catch(console.error("Error in the setting of the current skin"))

      // Change style of button

      button.style.opacity = "0.1";
      button.innerText = 'Equipé';
      button.style.cursor = 'not-allowed';
      button.style.pointerEvents = 'none';

      return skinID;
    };


    async function purchaseSkin(skinID, skinPrice){
      const initialBalance = await getBalance(); 
      const container = document.getElementById(`${skinID}`);
      const status = container.querySelector('.shopItemTitle');
      let currentBalance;

      try { 
        const response = await fetch (`${process.env.API_BASE_URL}/users/unlock-skin`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token
          },
          body: JSON.stringify({
            "skinName": `skin${skinID}`
          })
        })
        if (response.ok && parseInt(skinPrice, 10) <= initialBalance){
          button.innerText = 'Equiper';
          status.innerHTML = 'Acquis &#x2713;'
          currentBalance = await getBalance();
          balanceAnimation(initialBalance, currentBalance);
        } else {
          alert('Erreur lors de l\'achat');
        }
        console.log(skinPrice, skinPrice <= initialBalance);
      } catch {
        (console.error("Error in the purchase of the skin"))
      };
      
      // if (response.ok){

      // }
    }

    function balanceAnimation(initialBalance, currentBalance){
      const animated = anime({
        targets: balanceDisplay,
        scale: 1.17,
        duration: 500
      })
      const balanceNumber = document.getElementById('balanceNumber');
      const balances = {
        init: initialBalance
      }
      const animatedNumbers = anime({
        targets: balances,
        init: currentBalance,
        round: 1,
        easing: 'linear',
        delay:500,
        duration:2000,
        update: () => {
          balanceNumber.innerText = JSON.stringify(balances.init);
        }
      })
      animated.play();
      animatedNumbers.play();
      // Shrink back numbers
      // eslint-disable-next-line no-unused-expressions
      setTimeout(() => {
        anime({
          targets: balanceDisplay,
          scale: 1,
          duration: 500,
        });
      }, 2500);
    }

    let carouselShopItems = document.getElementById('carouselShopItems');

    if(isLoggedIn()){
    let currentSkin = await getCurrentSkin();

    if (currentSkin === 0){
      button.style.opacity = "0.1";
      button.innerText = 'Equipé';
      button.style.cursor = 'not-allowed';
      button.style.pointerEvents = 'none';
    };

    let iLoop = 1;
    let skinToRender = `skin${iLoop}`;
    const innerCarousel = document.querySelector('.carousel-inner');

    const assetsTable = [
      skin1,
      skin2,
      skin3, 
      skin4,
      skin5,
      skin6,
      skin7
    ]

    while(skinsTable[0][skinToRender]){
      const image = assetsTable.key;
      const html = `
        <div class="carousel-item h-100" id="${iLoop}" data-bs-skin="${iLoop}">
          <div class="h-100 shopItemContainer w-100 justify-content-center">
              <img src="${assetsTable[iLoop-1]}" class="d-block shopItemImg" alt="...">
              <div class="shopItemDesc">
                <h2 class="shopItemTitle">Prix : ${skinsTable[0][skinToRender]} <img src="${star}"></h2>
              </div>
          </div>    
        </div>
      `
      innerCarousel.innerHTML += html;
      iLoop += 1;
      skinToRender = `skin${iLoop}`
    }

    const itemImg = document.querySelectorAll('.shopItemImg');
    const animatedImage = anime({
      targets:itemImg,
      loop:true,
      translateY: [
        { value: '-20px', duration: 500, easing: 'easeInOutQuad' },
        { value: '20', duration: 500, easing: 'easeInOutQuad' },
      ],
      direction: 'alternate', 
      delay: 1500
    });

    animatedImage.play();

    button.addEventListener('click', () => {
      console.log('zhaudshzad ');
    })

    carouselShopItems = new Carousel(document.getElementById('carouselShopItems'), {
      keyboard: false,
    });
    
        
    carouselShopItems._element.addEventListener('slide.bs.carousel', async (e) => {
      // Reset style
      button.style.pointerEvents = 'auto';
      const activeSlideIndex = e.to;
      button.style.opacity = "1";
      button.style.cursor = "pointer";

      // get status of the skin
      
      const isUnlocked = await getSkinStatus(activeSlideIndex);
      const container = document.getElementById(`${activeSlideIndex}`);
      const title = container.querySelector('.shopItemTitle');

      if (isUnlocked){
        title.innerHTML = 'Acquis &#x2713;'
        button.innerHTML = 'Equiper';
      } else {
        button.innerText = 'Acheter'
      }
      
      if (currentSkin === activeSlideIndex){
        button.style.opacity = "0.1";
        button.innerText = 'Equipé';
        button.style.cursor = 'not-allowed';
        button.style.pointerEvents = 'none';
      };
    })

    button.addEventListener('click', async () => {
      let index = parseInt(carouselShopItems._activeElement?.id, 10);
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(index)) index = 0;
      const isUnlocked = await getSkinStatus(index);
      console.log(isUnlocked)
      if (isUnlocked){
        const newCurrentSkin = await setCurrentSkin(index);
        currentSkin = newCurrentSkin;
        return;
      } if (isUnlocked === false){
        await purchaseSkin(index, skinsTable[0][`skin${index}`]);
        return;
      } alert("Erreur lors de l'achat");
    });

    } else {
      document.getElementById('shopPage').addEventListener('click', () => { Navigate('/login') })
      button.innerHTML = 'Connectez-vous';
      button.style.border = "0px";
      button.dataset.uri = '/login';
    } 
};

  
  export default ShopPage;
  