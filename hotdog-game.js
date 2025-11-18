

class Game {
   constructor() {
       this.canvas = document.getElementById('gameCanvas');
       if (!this.canvas) {
           console.error('Canvas element not found!');
           throw new Error('Canvas element not found');
       }
       this.ctx = this.canvas.getContext('2d');
       if (!this.ctx) {
           console.error('Could not get 2D context from canvas!');
           throw new Error('Could not get 2D context');
       }
       
       this.score = 0;
       this.gameOver = false;
       this.imagesLoaded = false;
       this.showRestartButton = false;
       this.showNextLevelButton = false;
       this.currentWave = 1;
       this.baseEnemySpeed = 180; // 50% slower than current 120ms (now 180ms total)
       this.currentEnemySpeed = this.baseEnemySpeed; // Current speed that will increase
       this.speedIncreaseRate = 0.025; // Speed increases by 2.5% per level
       this.maxEnemySpeed = 40; // Maximum speed


       // Initialize audio system
       this.initAudio();


       // Load images
       this.loadImages();


       // Hotdog player with horizontal-only movement
       this.player = {
           x: this.canvas.width / 2,
           y: this.canvas.height - 60,
           width: 60,
           height: 30,
           speed: 15 // 50% more movement distance (was 10)
       };


       // Game state
       this.projectiles = [];
       this.enemies = [];
       this.keys = {};
       
       // Group movement variables
       this.enemyGroupDirection = 1; // 1 = right, -1 = left
       this.enemyGroupSpeed = this.currentEnemySpeed; // Start with slower speed
       this.enemyGroupStepX = 20; // horizontal step distance
       this.enemyGroupStepY = 30; // vertical step distance
       this.lastGroupMove = 0;
       
       // Event listeners
       document.addEventListener('keydown', (e) => this.keys[e.code] = true);
       document.addEventListener('keyup', (e) => this.keys[e.code] = false);
       
       // Spawn new wave
       this.spawnEnemyWave();
       
       console.log('Game initialized:', {
           canvas: this.canvas ? 'found' : 'missing',
           enemies: this.enemies.length,
           player: this.player
       });
       
       // Start game loop - bind and start immediately
       this.animate = this.animate.bind(this);
       requestAnimationFrame(this.animate);
   }


   // Initialize audio system
   initAudio() {
       try {
           this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
       } catch (e) {
           console.log('Web Audio API not supported');
           this.audioContext = null;
       }
   }


   // Create laser shooting sound
   playLaserSound() {
       if (!this.audioContext) return;
      
       const oscillator = this.audioContext.createOscillator();
       const gainNode = this.audioContext.createGain();
      
       oscillator.connect(gainNode);
       gainNode.connect(this.audioContext.destination);
      
       oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
       oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
      
       gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
       gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
      
       oscillator.type = 'sawtooth';
       oscillator.start(this.audioContext.currentTime);
       oscillator.stop(this.audioContext.currentTime + 0.1);
   }


   // Create condiment destruction sound
   playCondimentDestroySound() {
       if (!this.audioContext) return;
      
       const oscillator = this.audioContext.createOscillator();
       const gainNode = this.audioContext.createGain();
      
       oscillator.connect(gainNode);
       gainNode.connect(this.audioContext.destination);
      
       oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
       oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
      
       gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
       gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
      
       oscillator.type = 'square';
       oscillator.start(this.audioContext.currentTime);
       oscillator.stop(this.audioContext.currentTime + 0.2);
   }


   // Create level completion sound
   playLevelCompleteSound() {
       if (!this.audioContext) return;
      
       const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C
      
       notes.forEach((frequency, index) => {
           setTimeout(() => {
               const oscillator = this.audioContext.createOscillator();
               const gainNode = this.audioContext.createGain();
              
               oscillator.connect(gainNode);
               gainNode.connect(this.audioContext.destination);
              
               oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
               gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
               gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
              
               oscillator.type = 'sine';
               oscillator.start(this.audioContext.currentTime);
               oscillator.stop(this.audioContext.currentTime + 0.3);
           }, index * 200);
       });
   }


   // Load images
   loadImages() {
       this.images = {
           hotdog: new Image(),
           ketchup: new Image(),
           mustard: new Image()
       };


       this.images.hotdog.src = 'images/hotdog.svg';
       this.images.ketchup.src = 'images/ketchup.svg';
       this.images.mustard.src = 'images/mustard.svg';


       // Wait for all images to load
       Promise.all([
           this.loadImagePromise(this.images.hotdog),
           this.loadImagePromise(this.images.ketchup),
           this.loadImagePromise(this.images.mustard)
       ]).then(() => {
           this.imagesLoaded = true;
       }).catch(() => {
           console.log('Some images failed to load, continuing with shapes');
           this.imagesLoaded = true; // Continue with shapes if images fail
       });
   }


   // Promise wrapper for image loading
   loadImagePromise(img) {
       return new Promise((resolve, reject) => {
           img.onload = resolve;
           img.onerror = reject;
       });
   }


   // Shoot method
   shoot() {
       if (!this.gameOver && !this.projectiles.length) {
           // Randomly choose between ketchup and mustard bottle
           const bottleType = Math.random() < 0.5 ? 'ketchup' : 'mustard';
           this.projectiles.push({
               x: this.player.x + this.player.width / 2,
               y: this.player.y,
               speed: 7,
               type: bottleType
           });
           this.playLaserSound(); // Play laser sound
       }
   }


   // Draw picnic background
   drawBackground() {
       // Create a picnic blanket pattern
       this.drawPicnicBlanket();
      
       // Add some grass texture
       this.drawGrassTexture();
   }


   // Draw picnic blanket with checkered pattern
   drawPicnicBlanket() {
       const tileSize = 40;
      
       for (let x = 0; x < this.canvas.width; x += tileSize) {
           for (let y = 0; y < this.canvas.height; y += tileSize) {
               const colorIndex = ((x / tileSize) + (y / tileSize)) % 2;
               this.ctx.fillStyle = colorIndex === 0 ? '#FFB6C1' : '#FFFFFF';
               this.ctx.fillRect(x, y, tileSize, tileSize);
           }
       }
   }


   // Draw grass texture
   drawGrassTexture() {
       this.ctx.fillStyle = '#90EE90';
       this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);
      
       // Add some grass blades
       this.ctx.fillStyle = '#228B22';
       for (let i = 0; i < 50; i++) {
           const x = Math.random() * this.canvas.width;
           const y = this.canvas.height - Math.random() * 100;
           this.ctx.fillRect(x, y, 1, Math.random() * 10);
       }
   }


   // Draw restart button
   drawRestartButton() {
       const buttonX = this.canvas.width / 2 - 100;
       const buttonY = this.canvas.height / 2 + 60;
       const buttonWidth = 200;
       const buttonHeight = 50;
      
       // Button background
       this.ctx.fillStyle = '#4CAF50';
       this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
      
       // Button border
       this.ctx.strokeStyle = '#2E7D32';
       this.ctx.lineWidth = 3;
       this.ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
      
       // Button text
       this.ctx.fillStyle = 'white';
       this.ctx.font = 'bold 20px Arial';
       this.ctx.textAlign = 'center';
       this.ctx.fillText('Play Again', this.canvas.width / 2, buttonY + 32);
   }


   // Draw next level button
   drawNextLevelButton() {
       const buttonX = this.canvas.width / 2 - 100;
       const buttonY = this.canvas.height / 2 + 60;
       const buttonWidth = 200;
       const buttonHeight = 50;
      
       // Button background
       this.ctx.fillStyle = '#FF6B35';
       this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
      
       // Button border
       this.ctx.strokeStyle = '#E55A2B';
       this.ctx.lineWidth = 3;
       this.ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
      
       // Button text
       this.ctx.fillStyle = 'white';
       this.ctx.font = 'bold 20px Arial';
       this.ctx.textAlign = 'center';
       this.ctx.fillText('Next Level', this.canvas.width / 2, buttonY + 32);
   }


   // Check if restart button is clicked
   checkRestartButtonClick(x, y) {
       const buttonX = this.canvas.width / 2 - 100;
       const buttonY = this.canvas.height / 2 + 60;
       const buttonWidth = 200;
       const buttonHeight = 50;
      
       return x >= buttonX && x <= buttonX + buttonWidth &&
              y >= buttonY && y <= buttonY + buttonHeight;
   }


   // Next level method
   nextLevel() {
       this.currentWave++;
       this.gameOver = false;
       this.showNextLevelButton = false;
       this.projectiles = [];
       this.enemies = [];
       this.keys = {};
       this.player.x = this.canvas.width / 2;
       this.player.y = this.canvas.height - 60;
      
       // Increase speed progressively using 2.5% increase
       this.currentEnemySpeed = Math.max(this.maxEnemySpeed, this.baseEnemySpeed * Math.pow(1 - this.speedIncreaseRate, this.currentWave - 1));
       this.enemyGroupSpeed = this.currentEnemySpeed;
       this.enemyGroupDirection = 1;
       this.lastGroupMove = 0;
      
       // Clear the canvas
       this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
       // Start new wave
       this.spawnEnemyWave();
      
       // Animation continues automatically
   }


   // Restart game
   restart() {
       this.score = 0;
       this.gameOver = false;
       this.showRestartButton = false;
       this.currentWave = 1;
       this.currentEnemySpeed = this.baseEnemySpeed;
       this.projectiles = [];
       this.enemies = [];
       this.keys = {};
       this.player.x = this.canvas.width / 2;
       this.player.y = this.canvas.height - 60;
       this.enemyGroupDirection = 1;
       this.enemyGroupSpeed = this.currentEnemySpeed;
       this.lastGroupMove = 0;
      
       // Clear the canvas
       this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
       // Start new wave
       this.spawnEnemyWave();
      
       // Animation continues automatically
   }


   // Draw the hotdog player
   drawPlayer() {
       // Check if image exists, is loaded, and not broken
       const useImage = this.imagesLoaded && 
                       this.images && 
                       this.images.hotdog && 
                       this.images.hotdog.complete && 
                       this.images.hotdog.naturalWidth > 0;
       
       if (useImage) {
           try {
               this.ctx.drawImage(this.images.hotdog, this.player.x, this.player.y, this.player.width, this.player.height);
               return;
           } catch (e) {
               // If drawImage fails, fall through to shape drawing
               console.log('Failed to draw hotdog image, using shape fallback');
           }
       }
       
       // Fallback to shapes if images not loaded or broken
       // Draw bun
       this.ctx.fillStyle = '#DEB887'; // Hotdog bun color
       this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
       
       // Draw outline
       this.ctx.strokeStyle = '#8B4513';
       this.ctx.lineWidth = 2;
       this.ctx.strokeRect(this.player.x, this.player.y, this.player.width, this.player.height);
       
       // Draw hotdog
       this.ctx.fillStyle = '#8B4513'; // Hotdog color
       this.ctx.fillRect(this.player.x + 5, this.player.y + 5, this.player.width - 10, this.player.height - 10);
       
       // Draw grill marks
       this.ctx.strokeStyle = '#654321';
       this.ctx.lineWidth = 1;
       for (let i = 0; i < 3; i++) {
           this.ctx.beginPath();
           this.ctx.moveTo(this.player.x + 10 + i * 15, this.player.y + 8);
           this.ctx.lineTo(this.player.x + 10 + i * 15, this.player.y + this.player.height - 8);
           this.ctx.stroke();
       }
   }


   // Draw projectiles (condiment bottles) - Enhanced visibility
   drawProjectiles() {
       this.projectiles.forEach(proj => {
           const bottleWidth = 20;
           const bottleHeight = 30;
           const x = proj.x - bottleWidth / 2;
           const y = proj.y - bottleHeight;
           
           // Randomly choose between ketchup and mustard bottle
           const isKetchup = proj.type === 'ketchup' || (proj.type === undefined && Math.random() < 0.5);
           
           // Draw bottle body
           this.ctx.fillStyle = isKetchup ? '#FF0000' : '#FFD700'; // Red for ketchup, yellow for mustard
           this.ctx.fillRect(x, y, bottleWidth, bottleHeight);
           
           // Draw bottle outline
           this.ctx.strokeStyle = '#333';
           this.ctx.lineWidth = 2;
           this.ctx.strokeRect(x, y, bottleWidth, bottleHeight);
           
           // Draw bottle cap
           this.ctx.fillStyle = '#8B4513'; // Brown cap
           this.ctx.fillRect(x + 5, y - 5, 10, 5);
           this.ctx.strokeRect(x + 5, y - 5, 10, 5);
           
           // Draw label/design on bottle
           this.ctx.fillStyle = '#FFFFFF';
           this.ctx.fillRect(x + 2, y + 5, bottleWidth - 4, 8);
           
           // Add glow effect
           this.ctx.shadowColor = isKetchup ? '#FF0000' : '#FFD700';
           this.ctx.shadowBlur = 8;
           this.ctx.fillStyle = isKetchup ? '#FF0000' : '#FFD700';
           this.ctx.fillRect(x, y, bottleWidth, bottleHeight);
           this.ctx.shadowBlur = 0;
       });
   }


   // Draw enemies (condiment bottles)
   drawEnemies() {
       this.enemies.forEach(enemy => {
           // Check if image exists, is loaded, and not broken
           const img = this.images && this.images[enemy.type];
           const useImage = this.imagesLoaded && 
                          img && 
                          img.complete && 
                          img.naturalWidth > 0;
           
           if (useImage) {
               try {
                   this.ctx.drawImage(img, enemy.x, enemy.y, enemy.width, enemy.height);
               } catch (e) {
                   // If drawImage fails, use shape fallback
                   this.drawEnemyShape(enemy);
               }
           } else {
               // Always use fallback shapes if images not loaded or broken
               this.drawEnemyShape(enemy);
           }
       });
   }


   // Fallback method to draw enemy shapes
   drawEnemyShape(enemy) {
       // Draw bottle body with outline for visibility
       this.ctx.fillStyle = enemy.type === 'ketchup' ? '#FF0000' : '#FFD700';
       this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
       
       // Draw outline
       this.ctx.strokeStyle = '#000000';
       this.ctx.lineWidth = 2;
       this.ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
       
       // Bottle cap
       this.ctx.fillStyle = '#8B4513';
       this.ctx.fillRect(enemy.x + 10, enemy.y - 5, 10, 5);
       this.ctx.strokeRect(enemy.x + 10, enemy.y - 5, 10, 5);
       
       // Label
       this.ctx.fillStyle = '#FFFFFF';
       this.ctx.fillRect(enemy.x + 5, enemy.y + 8, enemy.width - 10, 8);
   }


   // Spawn enemy wave
   spawnEnemyWave() {
       this.enemies = [];
       const rows = 4;
       const cols = 6;
       const enemyWidth = 30;
       const enemyHeight = 40;
       const spacingX = 80;
       const spacingY = 60;
       const startX = (this.canvas.width - (cols * spacingX)) / 2;
       const startY = 50;


       // Spawn regular condiment enemies
       for (let row = 0; row < rows; row++) {
           for (let col = 0; col < cols; col++) {
               const type = Math.random() < 0.5 ? 'ketchup' : 'mustard';
               this.enemies.push({
                   x: startX + col * spacingX,
                   y: startY + row * spacingY,
                   width: enemyWidth,
                   height: enemyHeight,
                   type: type
               });
           }
       }
       
       console.log(`Spawned ${this.enemies.length} enemies at positions:`, this.enemies.slice(0, 3));
   }


   // Move enemy group
   moveEnemyGroup() {
       const now = Date.now();
       if (now - this.lastGroupMove < this.enemyGroupSpeed) return;


       this.lastGroupMove = now;
       let shouldMoveDown = false;


       // Check if any enemy will hit the edge
       for (let enemy of this.enemies) {
           if (this.enemyGroupDirection === 1 && enemy.x + enemy.width >= this.canvas.width - 20) {
               shouldMoveDown = true;
               break;
           }
           if (this.enemyGroupDirection === -1 && enemy.x <= 20) {
               shouldMoveDown = true;
               break;
           }
       }


       if (shouldMoveDown) {
           // Move all enemies down
           this.enemies.forEach(enemy => {
               enemy.y += this.enemyGroupStepY;
           });
           this.enemyGroupDirection *= -1; // Reverse direction
       } else {
           // Move all enemies horizontally
           this.enemies.forEach(enemy => {
               enemy.x += this.enemyGroupDirection * this.enemyGroupStepX;
           });
       }
   }


   // Update game objects
   update() {
       if (this.gameOver) return;


       // Horizontal player movement only
       if (this.keys['ArrowLeft'] && this.player.x > 0) {
           this.player.x -= this.player.speed;
       }
       if (this.keys['ArrowRight'] && this.player.x < this.canvas.width - this.player.width) {
           this.player.x += this.player.speed;
       }
      
       // Vertical movement REMOVED for classic Space Invaders feel


       // Shoot projectiles using S key
       if (this.keys['KeyS']) {
           this.shoot();
       }


       // Move enemy group
       this.moveEnemyGroup();


       // Update projectiles
       this.projectiles = this.projectiles.filter(proj => {
           proj.y -= proj.speed;
           
           // Add bottle dimensions for collision detection
           const bottleWidth = 20;
           const bottleHeight = 30;
           const projBounds = {
               x: proj.x - bottleWidth / 2,
               y: proj.y - bottleHeight,
               width: bottleWidth,
               height: bottleHeight
           };
           
           // Check collision with enemies
           this.enemies = this.enemies.filter(enemy => {
               if (this.checkCollision(projBounds, enemy)) {
                   this.score += 10;
                   const scoreElement = document.getElementById('score');
                   if (scoreElement) {
                       scoreElement.textContent = this.score;
                   }
                   this.playCondimentDestroySound(); // Play condiment destruction sound
                   return false;
               }
               return true;
           });


           return proj.y > -bottleHeight; // Remove when fully off screen
       });


       // Check if enemies reached the bottom
       for (let enemy of this.enemies) {
           if (enemy.y + enemy.height >= this.canvas.height - 100) {
               this.gameOver = true;
               this.showRestartButton = true;
               return;
           }
       }


       // Check if all enemies are destroyed
       if (this.enemies.length === 0) {
           this.showNextLevelButton = true;
           this.gameOver = true; // Pause game to show next level button
           this.playLevelCompleteSound(); // Play level completion sound
       }
   }


   // Check collision between two objects
   checkCollision(obj1, obj2) {
       return obj1.x < obj2.x + obj2.width &&
              obj1.x + (obj1.width || 0) > obj2.x &&
              obj1.y < obj2.y + obj2.height &&
              obj1.y + (obj1.height || 0) > obj2.y;
   }


   // Game loop - FIXED VERSION
   animate() {
       if (!this.canvas || !this.ctx) {
           console.error('Canvas or context missing in animate loop');
           return;
       }
       
       this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
       
       if (!this.gameOver) {
           // Draw background
           this.drawBackground();
           
           this.update();
           this.drawPlayer();
           this.drawProjectiles();
           this.drawEnemies();
       } else {
           // Draw background
           this.drawBackground();
          
           if (this.showNextLevelButton) {
               // Level cleared screen
               this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
               this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
              
               this.ctx.fillStyle = '#FFFFFF';
               this.ctx.font = '48px Arial';
               this.ctx.textAlign = 'center';
               this.ctx.fillText('Level Cleared!', this.canvas.width / 2, this.canvas.height / 2 - 20);
               this.ctx.font = '24px Arial';
               this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
               this.ctx.fillText(`Level ${this.currentWave} Complete`, this.canvas.width / 2, this.canvas.height / 2 + 50);
              
               this.drawNextLevelButton();
           } else {
               // Game over screen
               this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
               this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
              
               this.ctx.fillStyle = '#FFFFFF';
               this.ctx.font = '48px Arial';
               this.ctx.textAlign = 'center';
               this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 20);
               this.ctx.font = '24px Arial';
               this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
               this.ctx.fillText(`Level Reached: ${this.currentWave}`, this.canvas.width / 2, this.canvas.height / 2 + 50);
              
               if (this.showRestartButton) {
                   this.drawRestartButton();
               }
           }
       }
      
       // ALWAYS call requestAnimationFrame to keep the loop running
       requestAnimationFrame(this.animate);
   }
}


// Add click event listener for buttons
let gameInstance = null;
let gameInitialized = false;


// Start the game immediately when DOM is ready
function startGame() {
   if (gameInitialized) return;
   
   const canvas = document.getElementById('gameCanvas');
   if (!canvas) {
       console.error('Canvas element not found, retrying...');
       setTimeout(startGame, 100);
       return;
   }
   
   try {
       gameInstance = new Game();
       if (!gameInstance || !gameInstance.canvas) {
           console.error('Failed to create game instance');
           setTimeout(startGame, 100);
           return;
       }
       
       gameInitialized = true;
       window.gameInstance = gameInstance; // Make it globally accessible
       canvas.gameInstance = gameInstance; // Also attach to canvas for compatibility
     
       // Add click listener for buttons (only once)
       canvas.addEventListener('click', (e) => {
           if (gameInstance) {
               const rect = e.target.getBoundingClientRect();
               const x = e.clientX - rect.left;
               const y = e.clientY - rect.top;
              
               if (gameInstance.gameOver) {
                   if (gameInstance.showRestartButton && gameInstance.checkRestartButtonClick(x, y)) {
                       gameInstance.restart();
                   } else if (gameInstance.showNextLevelButton && gameInstance.checkRestartButtonClick(x, y)) {
                       gameInstance.nextLevel();
                   }
               }
           }
       });
       
       console.log('Game started successfully!');
   } catch (error) {
       console.error('Error starting game:', error);
       gameInitialized = false;
       setTimeout(startGame, 200);
   }
}

// Start game when DOM is ready
function initializeGame() {
   if (gameInitialized) return;
   
   if (document.readyState === 'loading') {
       document.addEventListener('DOMContentLoaded', () => {
           if (!gameInitialized) {
               setTimeout(startGame, 100);
           }
       });
   } else {
       // DOM is already loaded
       setTimeout(startGame, 100);
   }
   
   // Also use window.onload as backup
   window.addEventListener('load', () => {
       if (!gameInitialized && !window.gameInstance) {
           setTimeout(startGame, 100);
       }
   });
}

// Start initialization
initializeGame();



