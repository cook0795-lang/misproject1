// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Hobbies Page Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Hobby card interactions
    const hobbyCards = document.querySelectorAll('.hobby-card');
    const showcaseTitle = document.getElementById('showcase-title');
    const showcaseDescription = document.getElementById('showcase-description');

    const hobbyData = {
        photography: {
            title: 'Photography',
            description: 'Photography has been my passion for over 3 years. I specialize in landscape and portrait photography, always seeking to capture the perfect moment that tells a story. My work has been featured in local exhibitions and I continue to explore new techniques and styles.'
        },
        coding: {
            title: 'Programming',
            description: 'Building applications and solving problems through code is both my profession and passion. I love learning new technologies, contributing to open-source projects, and creating solutions that make a real difference in people\'s lives.'
        },
        music: {
            title: 'Music',
            description: 'Music is my creative outlet and stress reliever. I play both guitar and piano, and I\'m constantly learning new songs and even composing my own pieces. Music helps me think creatively and brings balance to my technical work.'
        },
        reading: {
            title: 'Reading',
            description: 'I believe continuous learning is key to personal growth. I read a mix of fiction, non-fiction, and technical books. Some of my favorites include "Clean Code" by Robert Martin and "Sapiens" by Yuval Noah Harari.'
        },
        fitness: {
            title: 'Fitness',
            description: 'Maintaining physical health is crucial for mental clarity and productivity. I work out 5 times a week, enjoy hiking on weekends, and try to stay active throughout the day. A healthy body leads to a healthy mind.'
        },
        cooking: {
            title: 'Cooking',
            description: 'Cooking is both an art and a science that I thoroughly enjoy. I love experimenting with new recipes from different cuisines around the world. It\'s a great way to be creative and also a wonderful way to bring people together.'
        }
    };

    hobbyCards.forEach(card => {
        card.addEventListener('click', function() {
            const hobby = this.dataset.hobby;
            if (hobbyData[hobby] && showcaseTitle && showcaseDescription) {
                showcaseTitle.textContent = hobbyData[hobby].title;
                showcaseDescription.textContent = hobbyData[hobby].description;
            }
        });
    });
});

// Discover Page Quiz
document.addEventListener('DOMContentLoaded', function() {
    const quizButtons = document.querySelectorAll('.quiz-btn');
    const quizResult = document.getElementById('quiz-result');

    const quizData = {
        skills: {
            title: 'My Technical Skills',
            content: 'I specialize in full-stack web development with expertise in JavaScript, React, Node.js, and Python. I\'m also learning machine learning and cloud technologies. I believe in continuous learning and staying updated with the latest technologies.'
        },
        values: {
            title: 'My Core Values',
            content: 'My core values include innovation, collaboration, continuous learning, and ethical technology development. I believe in building technology that is inclusive, accessible, and beneficial to society. I value teamwork and diverse perspectives.'
        },
        goals: {
            title: 'My Future Goals',
            content: 'I aim to become a technical leader, start my own company, and contribute to major open-source projects. I want to mentor the next generation of developers and advocate for diversity and inclusion in the tech industry.'
        },
        challenges: {
            title: 'Biggest Challenges',
            content: 'One of my biggest challenges has been balancing technical depth with leadership responsibilities. I\'m also working on improving my public speaking skills and learning to better communicate complex technical concepts to non-technical stakeholders.'
        }
    };

    quizButtons.forEach(button => {
        button.addEventListener('click', function() {
            const topic = this.dataset.topic;
            if (quizData[topic] && quizResult) {
                quizResult.innerHTML = `
                    <h4>${quizData[topic].title}</h4>
                    <p>${quizData[topic].content}</p>
                `;
            }
        });
    });
});

// Game Functions
let currentGame = null;
let gameStates = {};

// Game selection
function startGame(gameType) {
    // Hide all game containers
    document.querySelectorAll('.game-container').forEach(container => {
        container.style.display = 'none';
    });

    // Show selected game
    const gameContainer = document.getElementById(`${gameType}-game`);
    if (gameContainer) {
        gameContainer.style.display = 'block';
        currentGame = gameType;
        
        // Initialize the specific game
        switch(gameType) {
            case 'memory':
                initMemoryGame();
                break;
            case 'quiz':
                initQuizGame();
                break;
            case 'typing':
                initTypingGame();
                break;
            case 'snake':
                initSnakeGame();
                break;
        }
    }
}

function resetGame(gameType) {
    if (gameStates[gameType]) {
        gameStates[gameType].reset();
    }
}

// Memory Game
function initMemoryGame() {
    const board = document.getElementById('memory-board');
    const movesElement = document.getElementById('memory-moves');
    const matchesElement = document.getElementById('memory-matches');
    const timeElement = document.getElementById('memory-time');

    const symbols = ['🎯', '🚀', '💡', '⭐', '🎨', '🎵', '📚', '🏃'];
    const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let startTime = Date.now();
    let gameInterval;

    function updateDisplay() {
        if (movesElement) movesElement.textContent = moves;
        if (matchesElement) matchesElement.textContent = matchedPairs;
        
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        if (timeElement) timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function createCard(symbol, index) {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.textContent = symbol;
        card.addEventListener('click', () => flipCard(card, index));
        return card;
    }

    function flipCard(card, index) {
        if (flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        card.classList.add('flipped');
        flippedCards.push({ card, index, symbol: cards[index] });

        if (flippedCards.length === 2) {
            moves++;
            updateDisplay();

            if (flippedCards[0].symbol === flippedCards[1].symbol) {
                // Match found
                flippedCards.forEach(({ card }) => {
                    card.classList.add('matched');
                });
                matchedPairs++;
                flippedCards = [];
                
                if (matchedPairs === symbols.length) {
                    clearInterval(gameInterval);
                    setTimeout(() => {
                        alert(`Congratulations! You completed the game in ${moves} moves!`);
                    }, 500);
                }
            } else {
                // No match
                setTimeout(() => {
                    flippedCards.forEach(({ card }) => {
                        card.classList.remove('flipped');
                    });
                    flippedCards = [];
                }, 1000);
            }
        }
    }

    function reset() {
        board.innerHTML = '';
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        startTime = Date.now();
        clearInterval(gameInterval);
        
        cards.forEach((symbol, index) => {
            board.appendChild(createCard(symbol, index));
        });
        
        gameInterval = setInterval(updateDisplay, 1000);
        updateDisplay();
    }

    // Store game state
    gameStates.memory = { reset };
    
    // Initialize
    reset();
}

// Quiz Game
function initQuizGame() {
    const questionElement = document.getElementById('quiz-question');
    const optionsElement = document.getElementById('quiz-options');
    const scoreElement = document.getElementById('quiz-score');
    const currentElement = document.getElementById('quiz-current');
    const totalElement = document.getElementById('quiz-total');
    const feedbackElement = document.getElementById('quiz-feedback');

    const questions = [
        {
            question: "What does HTML stand for?",
            options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
            correct: 0
        },
        {
            question: "Which programming language is known as the 'language of the web'?",
            options: ["Python", "Java", "JavaScript", "C++"],
            correct: 2
        },
        {
            question: "What is the purpose of CSS?",
            options: ["To create databases", "To style web pages", "To write server code", "To manage files"],
            correct: 1
        },
        {
            question: "What does API stand for?",
            options: ["Application Programming Interface", "Advanced Programming Integration", "Automated Program Interface", "Application Process Integration"],
            correct: 0
        },
        {
            question: "Which is NOT a JavaScript framework?",
            options: ["React", "Vue", "Angular", "Django"],
            correct: 3
        },
        {
            question: "What is Git used for?",
            options: ["Web design", "Version control", "Database management", "Server hosting"],
            correct: 1
        },
        {
            question: "What does SQL stand for?",
            options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"],
            correct: 0
        },
        {
            question: "Which protocol is used for secure web communication?",
            options: ["HTTP", "FTP", "HTTPS", "SMTP"],
            correct: 2
        },
        {
            question: "What is the purpose of a database?",
            options: ["To store and organize data", "To create websites", "To send emails", "To play games"],
            correct: 0
        },
        {
            question: "Which is a cloud computing platform?",
            options: ["AWS", "HTML", "CSS", "JavaScript"],
            correct: 0
        }
    ];

    let currentQuestion = 0;
    let score = 0;
    let selectedAnswer = null;

    function displayQuestion() {
        const question = questions[currentQuestion];
        questionElement.textContent = question.question;
        
        optionsElement.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'quiz-option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => selectAnswer(index));
            optionsElement.appendChild(optionElement);
        });

        if (currentElement) currentElement.textContent = currentQuestion + 1;
        if (totalElement) totalElement.textContent = questions.length;
        if (feedbackElement) feedbackElement.innerHTML = '';
    }

    function selectAnswer(index) {
        selectedAnswer = index;
        document.querySelectorAll('.quiz-option').forEach((option, i) => {
            option.classList.remove('selected');
            if (i === index) {
                option.classList.add('selected');
            }
        });
    }

    function checkAnswer() {
        if (selectedAnswer === null) return;

        const question = questions[currentQuestion];
        const isCorrect = selectedAnswer === question.correct;
        
        if (isCorrect) {
            score++;
        }

        // Show feedback
        document.querySelectorAll('.quiz-option').forEach((option, index) => {
            option.classList.remove('selected');
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === selectedAnswer && !isCorrect) {
                option.classList.add('incorrect');
            }
        });

        if (scoreElement) scoreElement.textContent = score;
        if (feedbackElement) {
            feedbackElement.innerHTML = isCorrect ? 
                '<p style="color: #16a34a;">Correct! Well done!</p>' : 
                '<p style="color: #dc2626;">Incorrect. The correct answer was: ' + question.options[question.correct] + '</p>';
        }

        // Move to next question
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < questions.length) {
                displayQuestion();
                selectedAnswer = null;
            } else {
                // Game over
                if (feedbackElement) {
                    feedbackElement.innerHTML = `
                        <h3>Quiz Complete!</h3>
                        <p>Your final score: ${score}/${questions.length}</p>
                        <p>Percentage: ${Math.round((score / questions.length) * 100)}%</p>
                    `;
                }
            }
        }, 2000);
    }

    function reset() {
        currentQuestion = 0;
        score = 0;
        selectedAnswer = null;
        displayQuestion();
        if (scoreElement) scoreElement.textContent = '0';
    }

    // Add submit button functionality
    const submitButton = document.createElement('button');
    submitButton.className = 'btn btn-primary';
    submitButton.textContent = 'Submit Answer';
    submitButton.addEventListener('click', checkAnswer);
    
    if (optionsElement) {
        optionsElement.parentNode.appendChild(submitButton);
    }

    gameStates.quiz = { reset };
    displayQuestion();
}

// Typing Game
function initTypingGame() {
    const textElement = document.getElementById('typing-text');
    const inputElement = document.getElementById('typing-input');
    const wpmElement = document.getElementById('typing-wpm');
    const accuracyElement = document.getElementById('typing-accuracy');
    const timeElement = document.getElementById('typing-time');
    const progressElement = document.getElementById('typing-progress');

    const sampleTexts = [
        "The quick brown fox jumps over the lazy dog. This is a classic pangram that contains every letter of the alphabet.",
        "Programming is the art of telling a computer what to do through a series of instructions. It requires logical thinking and creativity.",
        "Web development combines design and programming to create interactive websites. It involves HTML, CSS, and JavaScript.",
        "Technology continues to evolve at a rapid pace, bringing new opportunities and challenges for developers worldwide.",
        "Learning to code is like learning a new language. It takes practice, patience, and persistence to become proficient."
    ];

    let currentText = '';
    let startTime = null;
    let gameInterval = null;
    let timeLeft = 60;

    function startTyping() {
        if (startTime) return; // Already started
        
        startTime = Date.now();
        inputElement.disabled = false;
        inputElement.focus();
        
        gameInterval = setInterval(() => {
            timeLeft--;
            if (timeElement) timeElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    function calculateStats() {
        if (!startTime) return { wpm: 0, accuracy: 0 };
        
        const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
        const wordsTyped = inputElement.value.trim().split(/\s+/).length;
        const wpm = Math.round(wordsTyped / elapsed);
        
        const correctChars = inputElement.value.split('').filter((char, index) => 
            char === currentText[index]
        ).length;
        const accuracy = Math.round((correctChars / inputElement.value.length) * 100) || 0;
        
        return { wpm, accuracy };
    }

    function updateDisplay() {
        const stats = calculateStats();
        if (wpmElement) wpmElement.textContent = stats.wpm;
        if (accuracyElement) accuracyElement.textContent = stats.accuracy + '%';
        
        const progress = (inputElement.value.length / currentText.length) * 100;
        if (progressElement) progressElement.style.width = Math.min(progress, 100) + '%';
    }

    function endGame() {
        clearInterval(gameInterval);
        inputElement.disabled = true;
        
        const stats = calculateStats();
        if (wpmElement) wpmElement.textContent = stats.wpm;
        if (accuracyElement) accuracyElement.textContent = stats.accuracy + '%';
        
        alert(`Game Over! Your WPM: ${stats.wpm}, Accuracy: ${stats.accuracy}%`);
    }

    function reset() {
        clearInterval(gameInterval);
        currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        if (textElement) textElement.textContent = currentText;
        
        inputElement.value = '';
        inputElement.disabled = true;
        startTime = null;
        timeLeft = 60;
        
        if (wpmElement) wpmElement.textContent = '0';
        if (accuracyElement) accuracyElement.textContent = '0%';
        if (timeElement) timeElement.textContent = '60';
        if (progressElement) progressElement.style.width = '0%';
        
        // Enable input on first keystroke
        inputElement.addEventListener('keydown', startTyping, { once: true });
    }

    inputElement.addEventListener('input', updateDisplay);
    gameStates.typing = { reset };
    reset();
}

// Snake Game
function initSnakeGame() {
    const canvas = document.getElementById('snake-canvas');
    const scoreElement = document.getElementById('snake-score');
    const highScoreElement = document.getElementById('snake-high-score');
    
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    
    let snake = [{ x: 10, y: 10 }];
    let food = {};
    let dx = 0;
    let dy = 0;
    let score = 0;
    let highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
    let gameRunning = false;
    let gameLoop = null;

    function randomFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    }

    function drawGame() {
        // Clear canvas
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        ctx.fillStyle = '#2563eb';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });
        
        // Draw food
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        
        // Check wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }
        
        // Check self collision
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }
        
        snake.unshift(head);
        
        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            if (scoreElement) scoreElement.textContent = score;
            randomFood();
        } else {
            snake.pop();
        }
    }

    function gameOver() {
        gameRunning = false;
        clearInterval(gameLoop);
        
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore.toString());
            if (highScoreElement) highScoreElement.textContent = highScore;
        }
        
        alert(`Game Over! Score: ${score}`);
    }

    function startGame() {
        if (gameRunning) return;
        
        gameRunning = true;
        snake = [{ x: 10, y: 10 }];
        dx = 0;
        dy = 0;
        score = 0;
        if (scoreElement) scoreElement.textContent = '0';
        
        randomFood();
        gameLoop = setInterval(() => {
            moveSnake();
            drawGame();
        }, 150);
    }

    function changeDirection(direction) {
        if (!gameRunning) {
            startGame();
            return;
        }
        
        switch(direction) {
            case 'up':
                if (dy !== 1) { dx = 0; dy = -1; }
                break;
            case 'down':
                if (dy !== -1) { dx = 0; dy = 1; }
                break;
            case 'left':
                if (dx !== 1) { dx = -1; dy = 0; }
                break;
            case 'right':
                if (dx !== -1) { dx = 1; dy = 0; }
                break;
        }
    }

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!gameRunning && e.code === 'Space') {
            e.preventDefault();
            startGame();
            return;
        }
        
        switch(e.code) {
            case 'ArrowUp':
            case 'KeyW':
                e.preventDefault();
                changeDirection('up');
                break;
            case 'ArrowDown':
            case 'KeyS':
                e.preventDefault();
                changeDirection('down');
                break;
            case 'ArrowLeft':
            case 'KeyA':
                e.preventDefault();
                changeDirection('left');
                break;
            case 'ArrowRight':
            case 'KeyD':
                e.preventDefault();
                changeDirection('right');
                break;
        }
    });

    function reset() {
        clearInterval(gameLoop);
        gameRunning = false;
        snake = [{ x: 10, y: 10 }];
        dx = 0;
        dy = 0;
        score = 0;
        if (scoreElement) scoreElement.textContent = '0';
        if (highScoreElement) highScoreElement.textContent = highScore;
        randomFood();
        drawGame();
    }

    // Make changeDirection available globally
    window.snakeGame = { changeDirection };
    
    gameStates.snake = { reset };
    reset();
}

// Resume download function
function downloadResume() {
    // Create a link element to download the PDF
    const link = document.createElement('a');
    link.href = 'Professional Resume (2).pdf';
    link.download = 'Professional Resume (2).pdf';
    link.style.display = 'none';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Add scroll animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .hobby-card, .discover-card, .interest-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);


