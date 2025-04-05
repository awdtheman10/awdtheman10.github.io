const canvasWidth = 800;
const canvasHeight = 600;
let money = 20;
let balls = [];

function Ball(type, speed, power, color, upgrades = {}) {
    this.type = type;
    this.speed = speed;
    this.power = power;
    this.color = color;
    this.upgrades = upgrades;
    this.x = canvasWidth / 2;
    this.y = canvasHeight / 2;
    this.direction = Math.random() * 2 * Math.PI;

    this.move = function() {
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;
        if (this.x <= 0 || this.x >= canvasWidth) this.direction = Math.PI - this.direction;
        if (this.y <= 0 || this.y >= canvasHeight) this.direction = -this.direction;
    };

    this.draw = function(context) {
        context.beginPath();
        context.arc(this.x, this.y, 10, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
    };

    this.upgrade = function(stat) {
        if (this.upgrades[stat] && this.upgrades[stat].isUpgradable) {
            this[stat] += this.upgrades[stat].increment;
            return true;
        }
        return false;
    };
}

let bricks = [];
function Brick(x, y, health) {
    this.x = x;
    this.y = y;
    this.health = health;
    this.width = 50;
    this.height = 20;
    this.color = 'rgb(255, 0, 0)';

    this.draw = function(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    };
}

function spawnBrick() {
    const x = Math.floor(Math.random() * (canvasWidth - 50));
    const y = Math.floor(Math.random() * (canvasHeight - 20));
    const health = Math.floor(Math.random() * 5) + 1;
    bricks.push(new Brick(x, y, health));
}

function checkBallBrickCollision() {
    balls.forEach(ball => {
        bricks.forEach((brick, index) => {
            if (ball.x >= brick.x && ball.x <= brick.x + brick.width &&
                ball.y >= brick.y && ball.y <= brick.y + brick.height) {
                brick.health -= ball.power;
                if (brick.health <= 0) {
                    bricks.splice(index, 1);
                    money += 1;
                }
            }
        });
    });
}

function updateGame(context) {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    balls.forEach(ball => {
        ball.move();
        ball.draw(context);
    });
    bricks.forEach(brick => brick.draw(context));
    checkBallBrickCollision();
    if (Math.random() < 0.02) {
        spawnBrick();
    }
    requestAnimationFrame(() => updateGame(context));
}

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
updateGame(context);

balls.push(new Ball('Basic Ball', 1, 1, 'rgb(0,255,255)', { speed: { isUpgradable: true, increment: 0.5 }, power: { isUpgradable: true, increment: 1 }}));

const shopItems = {
    'Basic Ball': { price: 10, upgrades: { speed: { isUpgradable: true, increment: 0.5 }, power: { isUpgradable: true, increment: 1 }}},
    'Splash Ball': { price: 50, upgrades: { speed: { isUpgradable: true, increment: 0.5 }, power: { isUpgradable: true, increment: 2 }, splashDamage: { isUpgradable: true, increment: 0 }, range: { isUpgradable: true, increment: 0.5 }}},
    'Cannon Ball': { price: 250, upgrades: { speed: { isUpgradable: false, increment: 0 }, power: { isUpgradable: true, increment: 10 }}}
};

function buyBall(type) {
    if (money >= shopItems[type].price) {
        money -= shopItems[type].price;
        balls.push(new Ball(type, 1, 1, 'rgb(0,255,255)', shopItems[type].upgrades));
        updateShop();
    }
}

function updateShop() {
    const shopContainer = document.getElementById('shop');
    shopContainer.innerHTML = '';
    Object.keys(shopItems).forEach(ballType => {
        const button = document.createElement('button');
        button.innerText = `${ballType} - Price: ${shopItems[ballType].price} Coins`;
        button.onclick = () => buyBall(ballType);
        shopContainer.appendChild(button);
    });
}

window.onload = function() {
    updateShop();
};
