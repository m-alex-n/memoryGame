import { useEffect, useState } from "react";

const MemoryGame = () => {
  // Game state variables
  const [gridSize, setGridSize] = useState(4); // Current grid size (default 4x4)
  const [maxMoves, setMaxMoves] = useState(0); // Maximum allowed moves (0 = unlimited)
  const [movesUsed, setMovesUsed] = useState(0); // Counter for moves used
  const [cards, setCards] = useState([]); // Array of card objects
  const [flipped, setFlipped] = useState([]); // Array of currently flipped card IDs
  const [solved, setSolved] = useState([]); // Array of solved card IDs
  const [disabled, setDisabled] = useState(false); // Flag to disable clicks during animations
  const [won, setWon] = useState(false); // Flag for game won state
  const [gameOver, setGameOver] = useState(false); // Flag for game over state

  // Handler for grid size input change
  const handleGridSizeChange = (e) => {
    const size = parseInt(e.target.value);
    // Validate grid size is between 2 and 10
    if (size >= 2 && size <= 10) {
      setGridSize(size);
    }
  };

  // Handler for max moves input change
  const handleMaxMovesChange = (e) => {
    const moves = parseInt(e.target.value);
    // Ensure moves is positive or zero (unlimited)
    setMaxMoves(moves >= 0 ? moves : 0);
  };

  // Initialize or reset the game
  const initializeGame = () => {
    // Calculate total cards needed based on grid size
    const totalCards = gridSize * gridSize;
    // Calculate how many unique pairs we need
    const pairCount = Math.floor(totalCards / 2);
    // Create array of numbers for pairs
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    // Create and shuffle cards
    const shuffledCards = [...numbers, ...numbers] // Create pairs
      .sort(() => Math.random() - 0.5) // Shuffle
      .slice(0, totalCards) // Ensure correct number of cards
      .map((number, index) => ({ id: index, number })); // Add unique IDs

    // Reset all game state
    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setMovesUsed(0);
    setWon(false);
    setGameOver(false);
  };

  // Initialize game when grid size changes
  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  // Check if two flipped cards match
  const checkMatch = (secondId) => {
    const [firstId] = flipped; // Get first flipped card ID
    
    // If cards match
    if (cards[firstId].number === cards[secondId].number) {
      // Add both cards to solved array
      setSolved([...solved, firstId, secondId]);
      // Reset flipped cards
      setFlipped([]);
      // Re-enable clicks
      setDisabled(false);
    } 
    // If cards don't match
    else {
      // Increment move counter only for unsuccessful attempts
      const newMovesUsed = movesUsed + 1;
      setMovesUsed(newMovesUsed);
      
      // Check if moves limit reached
      if (maxMoves > 0 && newMovesUsed >= maxMoves) {
        setGameOver(true);
      }

      // Flip cards back after delay
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };

  // Handle card click
  const handleClick = (id) => {
    // Don't allow clicks if:
    // - Game is disabled (during animations)
    // - Game is already won
    // - Game is over
    if (disabled || won || gameOver) return;

    // If no cards flipped yet
    if (flipped.length === 0) {
      // Flip this card
      setFlipped([id]);
      return;
    }

    // If one card already flipped
    if (flipped.length === 1) {
      // Disable further clicks during animation
      setDisabled(true);
      
      // If clicking a different card
      if (id !== flipped[0]) {
        // Flip the second card
        setFlipped([...flipped, id]);
        // Check if they match
        checkMatch(id);
      } 
      // If clicking the same card
      else {
        // Just keep it flipped (no match check needed)
        setFlipped([id]);
        setDisabled(false);
      }
    }
  };

  // Helper to check if card is flipped
  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  // Helper to check if card is solved
  const isSolved = (id) => solved.includes(id);

  // Check for win condition
  useEffect(() => {
    // If all cards are solved and we have cards
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
    }
  }, [solved, cards]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-grey-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Memory Game</h1>
      
      {/* Game Controls */}
      <div className="mb-4 flex flex-wrap justify-center gap-4">
        {/* Grid Size Input */}
        <div>
          <label htmlFor="gridSize" className="mr-2">
            Grid Size: (max 10)
          </label>
          <input
            type="number"
            id="gridSize"
            min="2"
            max="10"
            value={gridSize}
            onChange={handleGridSizeChange}
            className="border-2 border-gray-300 rounded px-2 py-1"
          />
        </div>
        
        {/* Max Moves Input */}
        <div>
          <label htmlFor="maxMoves" className="mr-2">
            Max Moves (0 = unlimited):
          </label>
          <input
            type="number"
            id="maxMoves"
            min="0"
            value={maxMoves}
            onChange={handleMaxMovesChange}
            className="border-2 border-gray-300 rounded px-2 py-1"
          />
        </div>
      </div>
      
      {/* Moves Counter Display */}
      <div className="mb-2 text-lg">
        Moves: {movesUsed} {maxMoves > 0 && `/ ${maxMoves}`}
      </div>

      {/* Game Board */}
      <div
        className="grid gap-2 mb-4"
        style={{
          // Dynamic grid layout based on gridSize
          gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
          // Responsive width calculation
          width: `min(100%, ${gridSize * 5.5}rem)`,
        }}
      >
        {/* Render each card */}
        {cards.map((card) => {
          return (
            <div
              key={card.id}
              onClick={() => handleClick(card.id)}
              className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300 ${
                // Dynamic card styling based on state
                isFlipped(card.id)
                  ? isSolved(card.id)
                    ? "bg-green-500 text-white" // Solved cards
                    : "bg-blue-500 text-white" // Flipped but not solved
                  : gameOver 
                    ? "bg-red-300 text-gray-600" // Game over state
                    : "bg-gray-300 text-gray-400" // Default state
              }`}
            >
              {/* Show number if flipped or game over, otherwise show "?" */}
              {isFlipped(card.id) || gameOver ? card.number : "?"}
            </div>
          );
        })}
      </div>

      {/* Win Message */}
      {won && (
        <div className="mt-4 text-4xl font-bold text-green-600 animate-bounce">
          You won!
        </div>
      )}
      
      {/* Game Over Message */}
      {gameOver && !won && (
        <div className="mt-4 text-4xl font-bold text-red-600 animate-bounce">
          Game Over!
        </div>
      )}

      {/* Reset/Play Again Button */}
      <button 
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        onClick={initializeGame}
      >
        {won || gameOver ? "Play Again" : "Reset"}
      </button>
    </div>
  );
};

export default MemoryGame;