import React, { useState, useEffect, useCallback } from 'react';
import './SnakeAndLadder.css';

const SnakeAndLadderGame = () => {
  // Game configuration
  const BOARD_SIZE = 100;
  const ROWS = 10;
  const COLS = 10;

  // Traditional Snake and Ladder positions based on classic boards
  const snakes = {
    16: 6,   // Early setback
    47: 26,  // Mid-game slide  
    49: 11,  // Big fall
    56: 53,  // Small slide
    62: 19,  // Major setback
    64: 60,  // Minor slide
    87: 24,  // Huge fall near end
    93: 73,  // Late game disappointment
    95: 75,  // Almost there but not
    98: 78   // So close to winning
  };

  const ladders = {
    1: 38,   // Great start boost
    4: 14,   // Early advantage
    9: 21,   // Good progress
    21: 42,  // Mid-game boost
    28: 84,  // Major jump
    36: 44,  // Steady climb
    51: 67,  // Good advancement
    71: 91,  // Near-end boost
    80: 100  // Final victory ladder
  };

  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [players, setPlayers] = useState([]);
  const [playerNames, setPlayerNames] = useState(['', '']);
  const [numPlayers, setNumPlayers] = useState(2);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [message, setMessage] = useState('Enter player names to start!');
  const [showSetup, setShowSetup] = useState(true);

  // Initialize players
  const initializePlayers = useCallback(() => {
    const newPlayers = [];
    for (let i = 0; i < numPlayers; i++) {
      newPlayers.push({
        id: i,
        name: playerNames[i] || `Player ${i + 1}`,
        position: 1,
        color: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'][i]
      });
    }
    setPlayers(newPlayers);
  }, [numPlayers, playerNames]);

  // Start game
  const startGame = () => {
    if (playerNames.filter(name => name.trim()).length < numPlayers) {
      setMessage('Please enter names for all players!');
      return;
    }
    
    initializePlayers();
    setShowSetup(false);
    setGameStarted(true);
    setGameOver(false);
    setWinner('');
    setCurrentPlayer(0);
    setMessage(`${playerNames[0]}'s turn! Roll the dice!`);
  };

  // Reset game
  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setWinner('');
    setCurrentPlayer(0);
    setPlayers([]);
    setPlayerNames(['', '']);
    setShowSetup(true);
    setMessage('Enter player names to start!');
    setDiceValue(1);
  };

  // Roll dice with animation
  const rollDice = () => {
    if (isRolling || gameOver) return;

    setIsRolling(true);
    let rollCount = 0;
    
    const rollAnimation = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      
      if (rollCount >= 10) {
        clearInterval(rollAnimation);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalRoll);
        setIsRolling(false);
        movePlayer(finalRoll);
      }
    }, 100);
  };

  // Move player logic
  const movePlayer = (steps) => {
    const player = players[currentPlayer];
    let newPosition = player.position + steps;

    // Check if move exceeds 100
    if (newPosition > 100) {
      setMessage(`${player.name} rolled ${steps} but can't move beyond 100! Turn skipped.`);
      setTimeout(() => nextPlayer(), 2000);
      return;
    }

    // Update player position
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayer].position = newPosition;
    setPlayers(updatedPlayers);

    // Check for snakes and ladders
    let finalPosition = newPosition;
    let specialMove = '';

    if (snakes[newPosition]) {
      finalPosition = snakes[newPosition];
      specialMove = ` 🐍 Oh no! Snake bite! Slid down to ${finalPosition}`;
      updatedPlayers[currentPlayer].position = finalPosition;
      setPlayers(updatedPlayers);
    } else if (ladders[newPosition]) {
      finalPosition = ladders[newPosition];
      specialMove = ` 🪜 Great! Climbed the ladder to ${finalPosition}`;
      updatedPlayers[currentPlayer].position = finalPosition;
      setPlayers(updatedPlayers);
    }

    // Check for win
    if (finalPosition === 100) {
      setWinner(player.name);
      setGameOver(true);
      setMessage(`🎉 ${player.name} wins the game! 🎉`);
      return;
    }

    // Update message
    setMessage(`${player.name} rolled ${steps} and moved to ${newPosition}${specialMove}`);

    // Next player after delay
    setTimeout(() => nextPlayer(), 2500);
  };

  // Switch to next player
  const nextPlayer = () => {
    if (gameOver) return;
    
    const nextPlayerIndex = (currentPlayer + 1) % players.length;
    setCurrentPlayer(nextPlayerIndex);
    setMessage(`${players[nextPlayerIndex]?.name}'s turn! Roll the dice!`);
  };

  // Get cell number for display (serpentine pattern)
  const getCellNumber = (index) => {
    const row = Math.floor(index / COLS);
    const col = index % COLS;
    
    if (row % 2 === 0) {
      return (9 - row) * COLS + col + 1;
    } else {
      return (9 - row) * COLS + (9 - col) + 1;
    }
  };

  // Check if cell has snake or ladder
  const getCellType = (cellNumber) => {
    if (snakes[cellNumber]) return 'snake-head';
    if (Object.values(snakes).includes(cellNumber)) return 'snake-tail';
    if (ladders[cellNumber]) return 'ladder-bottom';
    if (Object.values(ladders).includes(cellNumber)) return 'ladder-top';
    return '';
  };

  // Get players on a cell
  const getPlayersOnCell = (cellNumber) => {
    return players.filter(player => player.position === cellNumber);
  };

  // Handle player name change
  const handlePlayerNameChange = (index, name) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  // Handle number of players change
  const handleNumPlayersChange = (num) => {
    setNumPlayers(num);
    const newNames = [...playerNames];
    while (newNames.length < num) {
      newNames.push('');
    }
    setPlayerNames(newNames);
  };

  // Render the game board
  const renderBoard = () => {
    const cells = [];
    
    for (let i = 0; i < BOARD_SIZE; i++) {
      const cellNumber = getCellNumber(i);
      const cellType = getCellType(cellNumber);
      const playersOnCell = getPlayersOnCell(cellNumber);

      cells.push(
        <div
          key={i}
          className={`cell ${cellType}`}
          title={
            cellType.includes('snake') 
              ? `🐍 Snake: ${cellType.includes('head') ? `Goes to ${snakes[cellNumber]}` : 'Snake tail'}`
              : cellType.includes('ladder')
              ? `🪜 Ladder: ${cellType.includes('bottom') ? `Goes to ${ladders[cellNumber]}` : 'Ladder top'}`
              : `Square ${cellNumber}`
          }
        >
          <span className="cell-number">{cellNumber}</span>
          
          {/* Snake/Ladder indicators */}
          {snakes[cellNumber] && <span className="indicator">🐍</span>}
          {ladders[cellNumber] && <span className="indicator">🪜</span>}
          {Object.values(snakes).includes(cellNumber) && <span className="indicator tail">🐍</span>}
          {Object.values(ladders).includes(cellNumber) && <span className="indicator tail">🪜</span>}
          
          {/* Player pieces */}
          {playersOnCell.map((player, index) => (
            <div
              key={player.id}
              className={`player-piece ${currentPlayer === player.id ? 'active' : ''}`}
              style={{
                backgroundColor: player.color,
                transform: `translate(${index * 4}px, ${index * 4}px)`
              }}
              title={`${player.name} (Position: ${player.position})`}
            >
              {player.name.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
      );
    }
    
    return cells;
  };

  return (
    <div className="snake-ladder-game">
      <h1>🐍 Snake and Ladder Game 🪜</h1>
      
      {showSetup && (
        <div className="setup-screen">
          <h2>Game Setup</h2>
          
          <div className="player-count">
            <label>Number of Players:</label>
            <div className="player-buttons">
              {[2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => handleNumPlayersChange(num)}
                  className={numPlayers === num ? 'active' : ''}
                >
                  {num} Players
                </button>
              ))}
            </div>
          </div>

          <div className="player-names">
            {Array.from({ length: numPlayers }, (_, i) => (
              <div key={i} className="name-input-group">
                <label>Player {i + 1} Name:</label>
                <input
                  type="text"
                  value={playerNames[i] || ''}
                  onChange={(e) => handlePlayerNameChange(i, e.target.value)}
                  placeholder={`Enter Player ${i + 1} name`}
                  maxLength={15}
                />
              </div>
            ))}
          </div>

          <button onClick={startGame} className="start-btn">
            🎮 Start Game
          </button>
        </div>
      )}

      {gameStarted && !showSetup && (
        <div className="game-screen">
          {/* Legend */}
          <div className="legend">
            <div className="legend-item">
              <span className="snake-color">🐍</span>
              <span>Snakes - Slide down from head to tail</span>
            </div>
            <div className="legend-item">
              <span className="ladder-color">🪜</span>
              <span>Ladders - Climb up from bottom to top</span>
            </div>
          </div>

          {/* Game Board */}
          <div className="game-board">
            {renderBoard()}
          </div>

          {/* Game Controls */}
          <div className="game-controls">
            {/* Player Info */}
            <div className="players-info">
              {players.map((player, index) => (
                <div
                  key={player.id}
                  className={`player-info ${currentPlayer === index ? 'active' : ''}`}
                >
                  <div
                    className="player-avatar"
                    style={{ backgroundColor: player.color }}
                  >
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="player-details">
                    <h3>{player.name}</h3>
                    <p>Position: {player.position}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dice Section */}
            <div className="dice-section">
              <div className={`dice ${isRolling ? 'rolling' : ''}`}>
                {diceValue}
              </div>
              <button
                onClick={rollDice}
                disabled={isRolling || gameOver}
                className="roll-btn"
              >
                {isRolling ? 'Rolling...' : 'Roll Dice'}
              </button>
            </div>
          </div>

          {/* Message Display */}
          <div className="message-display">
            {message}
          </div>

          {/* Winner Modal */}
          {gameOver && (
            <div className="winner-modal">
              <div className="winner-content">
                <h2>🎉 Congratulations! 🎉</h2>
                <p>{winner} wins the game!</p>
                <button onClick={resetGame} className="play-again-btn">
                  Play Again
                </button>
              </div>
            </div>
          )}

          {/* Reset Button */}
          <button onClick={resetGame} className="reset-btn">
            🔄 New Game
          </button>
        </div>
      )}
    </div>
  );
};

export default SnakeAndLadderGame;
