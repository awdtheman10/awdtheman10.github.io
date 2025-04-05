const gameArea = document.getElementById('gameArea');
const buttonContainer = document.getElementById('buttonContainer');

const ballTypes = [
  {
    name: "Basic ball",
    price: 50,
    color: "rgb(0,255,255)",
    stats: {
      speed: 1,
      power: 1,
      isUpgradable: true
    }
  },
  {
    name: "Splash ball",
    price: 150,
    color: "rgb(175, 0, 155)",
    stats: {
      speed: 1,
      power: 2,
      splashDamage: true,
      range: 2,
      isUpgradable: true
    }
  },
  {
    name: "Cannon ball",
    price: 300,
    color: "rgb(0,0,0)",
    stats: {
      speed: 1.5,
      power: 10,
      smashesThroughBricks: true,
      maxSmashes: 2,
      isUpgradable: true
    }
  }
];

ballTypes.forEach((ball, index) => {
  const btn = document.createElement('button');
  btn.className = 'ball-button';
  btn.textContent = `${ball.name} - $${ball.price}`;
  btn.onclick = () => spawnBall(ball);
  buttonContainer.appendChild(btn);
});

function spawnBall(ballData) {
  const ball = document.createElement('div');
  ball.className = 'ball';
  ball.style.backgroundColor = ballData.color;
  ball.style.left = `${gameArea.clientWidth / 2 - 10}px`;
  ball.style.top = `${gameArea.clientHeight / 2 - 10}px`;
  gameArea.appendChild(ball);

  const angle = Math.random() * Math.PI * 2;
  const velocity = {
    x: Math.cos(angle) * ballData.stats.speed * 2,
    y: Math.sin(angle) * ballData.stats.speed * 2
  };

  const update = () => {
    let left = parseFloat(ball.style.left);
    let top = parseFloat(ball.style.top);

    left += velocity.x;
    top += velocity.y;

    if (left <= 0 || left + 20 >= gameArea.clientWidth) {
      velocity.x *= -1;
    }

    if (top <= 0 || top + 20 >= gameArea.clientHeight) {
      velocity.y *= -1;
    }

    ball.style.left = `${left}px`;
    ball.style.top = `${top}px`;
  };

  setInterval(update, 16);
}
