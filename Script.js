
        document.addEventListener('DOMContentLoaded', () => {
            // Game state
            let board = ['', '', '', '', '', '', '', '', ''];
            let currentPlayer = 'X';
            let gameActive = true;
            let score = { X: 0, O: 0 };
            
            // DOM elements
            const cells = document.querySelectorAll('.cell');
            const currentPlayerDisplay = document.getElementById('current-player');
            const scoreX = document.getElementById('score-x');
            const scoreO = document.getElementById('score-o');
            const resetBtn = document.getElementById('reset-btn');
            const newGameBtn = document.getElementById('new-game-btn');
            const winModal = document.getElementById('win-modal');
            const winnerText = document.getElementById('winner-text');
            const closeModalBtn = document.getElementById('close-modal');
            
            // Winning conditions
            const winningConditions = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
                [0, 4, 8], [2, 4, 6]             // diagonals
            ];
            
            // Event listeners
            cells.forEach(cell => cell.addEventListener('click', handleCellClick));
            resetBtn.addEventListener('click', resetBoard);
            newGameBtn.addEventListener('click', newGame);
            closeModalBtn.addEventListener('click', closeModal);
            
            // Functions
            function handleCellClick(e) {
                const clickedCell = e.target;
                const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
                
                // If cell already has a value or game is not active, ignore the click
                if (board[clickedCellIndex] !== '' || !gameActive) {
                    return;
                }
                
                // Update board
                board[clickedCellIndex] = currentPlayer;
                clickedCell.textContent = currentPlayer;
                clickedCell.classList.add(currentPlayer.toLowerCase());
                
                // Check for win or draw
                if (checkWin()) {
                    handleWin();
                } else if (checkDraw()) {
                    handleDraw();
                } else {
                    // Switch player
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    updateCurrentPlayerDisplay();
                }
            }
            
            function checkWin() {
                return winningConditions.some(condition => {
                    return condition.every(index => {
                        return board[index] === currentPlayer;
                    });
                });
            }
            
            function checkDraw() {
                return board.every(cell => cell !== '');
            }
            
            function handleWin() {
                // Highlight winning cells
                const winningCondition = winningConditions.find(condition => {
                    return condition.every(index => {
                        return board[index] === currentPlayer;
                    });
                });
                
                winningCondition.forEach(index => {
                    cells[index].classList.add('win');
                });
                
                // Update score
                score[currentPlayer]++;
                updateScore();
                
                // Show winner modal
                gameActive = false;
                winnerText.textContent = `Player ${currentPlayer} Wins!`;
                winnerText.className = `winner-text ${currentPlayer.toLowerCase()}`;
                winModal.style.display = 'flex';
                
                // Create confetti effect
                createConfetti();
            }
            
            function createConfetti() {
                const colors = ['#4361ee', '#3f37c9', '#7209b7', '#4cc9f0', '#f72585'];
                const container = document.querySelector('.container');
                
                for (let i = 0; i < 50; i++) {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + 'vw';
                    confetti.style.top = -10 + 'px';
                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
                    container.appendChild(confetti);
                    
                    const animationDuration = Math.random() * 3 + 2;
                    
                    confetti.animate([
                        { top: '-10px', opacity: 1, transform: `rotate(0deg)` },
                        { top: '100vh', opacity: 0, transform: `rotate(${Math.random() * 360}deg)` }
                    ], {
                        duration: animationDuration * 1000,
                        easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
                        fill: 'forwards'
                    });
                    
                    // Remove confetti after animation
                    setTimeout(() => {
                        confetti.remove();
                    }, animationDuration * 1000);
                }
            }
            
            function handleDraw() {
                gameActive = false;
                winnerText.textContent = "It's a Draw!";
                winnerText.className = 'winner-text draw';
                winModal.style.display = 'flex';
            }
            
            function resetBoard() {
                board = ['', '', '', '', '', '', '', '', ''];
                gameActive = true;
                
                // Clear cell contents and classes
                cells.forEach(cell => {
                    cell.textContent = '';
                    cell.className = 'cell';
                });
                
                // Reset to player X
                if (currentPlayer !== 'X') {
                    currentPlayer = 'X';
                    updateCurrentPlayerDisplay();
                }
            }
            
            function newGame() {
                resetBoard();
                score = { X: 0, O: 0 };
                updateScore();
            }
            
            function closeModal() {
                winModal.style.display = 'none';
                resetBoard();
            }
            
            function updateCurrentPlayerDisplay() {
                currentPlayerDisplay.textContent = `Player ${currentPlayer}'s Turn`;
                currentPlayerDisplay.className = `current-player ${currentPlayer.toLowerCase()}`;
            }
            
            function updateScore() {
                scoreX.textContent = score.X;
                scoreO.textContent = score.O;
            }
            
            // Initialize display
            updateCurrentPlayerDisplay();
            updateScore();
        });