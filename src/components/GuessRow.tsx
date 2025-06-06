import React from 'react';
import type { Guess } from '../types';

interface GuessRowProps {
    guess: Guess;
    guessIndex: number;
    onLetterStatusToggle: (guessIndex: number, letterIndex: number) => void;
    onDeleteGuess: (guessIndex: number) => void;
    onStartInputting: (guessIndex: number) => void;
}

const GuessRow: React.FC<GuessRowProps> = ({
    guess,
    guessIndex,
    onLetterStatusToggle,
    onDeleteGuess,
    onStartInputting
}) => {
    const hasLetters = guess.letters.some(letter => letter.letter !== ''); return (
        <div className="guess-row">            <div className="guess-letters">
            {guess.letters.map((letterObj, letterIndex) => {
                const hasLetter = letterObj.letter.trim() !== '';

                const handleLetterClick = () => {
                    // Only allow status toggle if there's a letter
                    if (hasLetter) {
                        onLetterStatusToggle(guessIndex, letterIndex);
                    }
                };

                return (
                    <div
                        key={letterIndex}
                        className={`letter-display ${letterObj.status} ${hasLetter ? 'has-letter' : ''}`}
                        onClick={handleLetterClick}
                        title={hasLetter ? "Click to change status" : ""}
                        style={{ cursor: hasLetter ? 'pointer' : 'default' }}
                    >
                        {letterObj.letter || ''}
                    </div>
                );
            })}
        </div>

            <div className="guess-actions">
                {hasLetters ? (
                    <>
                        <button
                            onClick={() => onDeleteGuess(guessIndex)}
                            className="delete-btn"
                            title="Șterge cuvântul"
                        >
                            ❌
                        </button>
                        <button
                            onClick={() => onStartInputting(guessIndex)}
                            className="input-btn"
                            title="Schimbă cuvântul"
                        >
                            ✏️
                        </button>
                    </>
                ) : (
                    <div className="empty-slot">
                        <span className="slot-number">{guessIndex + 1}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GuessRow;
