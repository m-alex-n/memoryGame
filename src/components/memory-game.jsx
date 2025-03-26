import React, { useState, useEffect } from 'react'

const MemoryGame = () => {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);

  // Generate unique card pairs
  const generateCards = (size) => {
    const totalCards = size * size;
    const uniquePairs = totalCards / 2;
    const cardValues = Array.from({ length: uniquePairs }, (_, i) => i + 1);
    
    // Create pairs and shuffle
    const shuffledCards = [...cardValues, ...cardValues]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        flipped: false
      }));
    
    return shuffledCards;
  };

  // Handle grid size change
  const handleGridSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    if (newSize >= 2 && newSize <= 10) {
      setGridSize(newSize);
      resetGame(newSize);
    }
  };

  // Reset game 
  const resetGame = (size = gridSize) => {
    setCards(generateCards(size));
    setFlipped([]);
    setMatched([]);
    setDisabled(false);
    setWon(false);
    setMoves(0);
  };

  // Handle card click
  const handleCardClick = (clickedCard) => {
    // Prevent interactions if game is disabled or card is already matched/flipped
    if (disabled || flipped.includes(clickedCard.id) || matched.includes(clickedCard.id)) {
      return;
    }

    const newFlipped = [...flipped, clickedCard.id];
    setFlipped(newFlipped);
    setMoves(prevMoves => prevMoves + 1);

    // If two cards are flipped, check for match
    if (newFlipped.length === 2) {
      setDisabled(true);
      const [firstCardId, secondCardId] = newFlipped;
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = cards.find(card => card.id === secondCardId);

      // Check if cards match
      if (firstCard.value === secondCard.value) {
        setMatched(prev => [...prev, firstCardId, secondCardId]);
        setDisabled(false);
      } else {
        // Unflip cards after a short delay
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  // Check for win condition
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setWon(true);
      setDisabled(true);
    }
  }, [matched, cards]);

  // Initialize cards when component mounts or grid size changes
  useEffect(() => {
    resetGame();
  }, [gridSize]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Memory Game</h1>
      
      {/* Grid Size Input */}
      <div className="mb-4">
        <label htmlFor="gridSize" className="mr-2">Grid Size (max 10):</label>
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

      {/* Game Board */}
      <div 
        className="grid gap-2"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          width: `${gridSize * 4}rem`, // Adjust width based on grid size
        }}
      >
        {cards.map((card) => (
          <div 
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`
              w-16 h-16 flex items-center justify-center 
              border-2 rounded-lg cursor-pointer transition-all duration-300
              ${flipped.includes(card.id) || matched.includes(card.id) 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-300 hover:bg-gray-400'}
              ${matched.includes(card.id) ? 'opacity-50' : ''}
            `}
          >
            {(flipped.includes(card.id) || matched.includes(card.id)) 
              ? card.value 
              : '?'}
          </div>
        ))}
      </div>

      {/* Game Stats */}
      <div className="mt-4">
        <p>Moves: {moves}</p>
      </div>

      {/* Win Condition */}
      {won && (
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold text-green-600">
            Congratulations! You Won!
          </h2>
          <button 
            onClick={() => resetGame()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Reset Button */}
      {!won && (
        <button 
          onClick={() => resetGame()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset Game
        </button>
      )}
    </div>
  );
};

export default MemoryGame;