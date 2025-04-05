window.onload = function () {
  const canvas = document.getElementById('gameCanvas');
  const context = canvas.getContext('2d');

  let money = 20;  // Starting money
  const balls = [];

  // Ball class to handle ball properties and upgrades
  class Ball {
    constructor(type, speed, power, color, upgrades) {
      this.type = type;
      this.speed = speed;
      this.power = power;
      this.color = color;
      this.upgrades = upgrades;
      this.x = canvas.width / 2;
      this.y = canvas.height / 2;
      this.direction = Math.random() * 2 * Math.PI;
    }

    // Method to upgrade speed of the ball
    upgradeSpeed() {
      if (this.upgrades.speed.isUpgradable) {
        this.speed += this.upgrades.speed.increment;
        this.upgrades.speed.isUpgradable = false;  // Prevent further upgrades for speed
      }
    }

    // Method to upgrade power of the ball
    upgradePower() {
      if (this.upgrades.power.isUpgradable) {
        this.power += this.upgrades.power.increment;
        this.upgrades.power.isUpgradable = false;  // Prevent further upgrades for power
      }
    }
  }

  // Predefined ball types with prices and upgrades
  const shopItems = {
    'Basic Ball': { price: 10, upgrades: { speed: { isUpgradable: true, increment: 0.5 }, power: { isUpgradable: true, increment: 1 }}},
    'Splash Ball': { price: 50, upgrades: { speed: { isUpgradable: true, increment: 0.5 }, power: { isUpgradable: true, increment: 2 }, splashDamage: { isUpgradable: true, increment: 0 }, range: { isUpgradable: true, increment: 0.5 }}},
    'Cannon Ball': { price: 250, upgrades: { speed: { isUpgradable: false, increment: 0 }, power: { isUpgradable: true, increment: 10 }}}
  };

  // Create an initial ball for the player to start with
  balls.push(new Ball('Basic Ball', 1, 1, 'rgb(0,255,255)', { speed: { isUpgradable: true, increment: 0.5 }, power: { isUpgradable: true, increment: 1 }}));

  // Function to buy a ball from the shop
  function buyBall(type) {
    if (money >= shopItems[type].price) {
      money -= shopItems[type].price;
      balls.push(new Ball(type, 1, 1, 'rgb(0,255,255)', shopItems[type].upgrades));
      updateShop();
      updateMoneyCounter();
    }
  }

  // Function to upgrade a ball
  function upgradeBall(ball, upgradeType) {
    if (upgradeType === 'speed') {
      ball.upgradeSpeed();
    } else if (upgradeType === 'power') {
      ball.upgradePower();
    }
    updateShop();
    updateMoneyCounter();
  }

  // Update the money counter display
  function updateMoneyCounter() {
    const moneyCounter = document.getElementById('moneyCounter');
    moneyCounter.innerText = `Money: ${money}`;
  }

  // Update the shop UI with available items
  function updateShop() {
    const shopContainer = document.getElementById('shopItems');
    shopContainer.innerHTML = '';  // Clear the shop items display

    Object.keys(shopItems).forEach(type => {
      const ballContainer = document.createElement('div');
      const ballLabel = document.createElement('p');
      ballLabel.innerText = `${type} - Price: ${shopItems[type].price}`;
      ballContainer.appendChild(ballLabel);

      // Add buy button for the ball
      const buyButton = document.createElement('button');
      buyButton.innerText = `Buy ${type}`;
      buyButton.onclick = () => buyBall(type);
      ballContainer.appendChild(buyButton);

      // Add upgrade buttons for the ball
      balls.forEach(ball => {
        if (ball.type === type) {
          if (ball.upgrades.speed.isUpgradable) {
            const upgradeSpeedButton = document.createElement('button');
            upgradeSpeedButton.innerText = 'Upgrade Speed';
            upgradeSpeedButton.onclick = () => upgradeBall(ball, 'speed');
            ballContainer.appendChild(upgradeSpeedButton);
          }

          if (ball.upgrades.power.isUpgradable) {
            const upgradePowerButton = document.createElement('button');
            upgradePowerButton.innerText = 'Upgrade Power';
            upgradePowerButton.onclick = () => upgradeBall(ball, 'power');
            ballContainer.appendChild(upgradePowerButton);
          }
        }
      });

      shopContainer.appendChild(ballContainer);
    });
  }

  // Show/Hide the shop GUI when "Shop" button is clicked
  function toggleShop() {
    const shopContainer = document.getElementById('shop');
    shopContainer.style.display = shopContainer.style.display === 'none' ? 'block' : 'none';
  }

  // Main game loop
  function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas

    // Draw each ball
    balls.forEach((ball, index) => {
      context.beginPath();
      context.arc(100 + index * 40, 100, 10, 0, Math.PI * 2);  // Positioning balls
      context.fillStyle = ball.color;
      context.fill();
      context.closePath();
    });

    // Call gameLoop again for the next frame
    requestAnimationFrame(gameLoop);
  }

  // Start the game loop
  gameLoop();

  // Initialize the shop and money display
  updateShop();
  updateMoneyCounter();

  // Create Shop button
  const shopButton = document.createElement('button');
  shopButton.innerText = 'Shop';
  shopButton.onclick = toggleShop;
  document.body.appendChild(shopButton);

  // Create Money Counter display
  const moneyCounter = document.createElement('div');
  moneyCounter.id = 'moneyCounter';
  document.body.appendChild(moneyCounter);

  // Create Shop Container (initially hidden)
  const shopContainer = document.createElement('div');
  shopContainer.id = 'shop';
  shopContainer.style.display = 'none';  // Hidden initially
  document.body.appendChild(shopContainer);
};
