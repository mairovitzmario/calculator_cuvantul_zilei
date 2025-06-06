import React from 'react';
import type { Guess } from '../types';

interface GuessRowProps {
    guess: Guess;
    guessIndex: number;
    onLetterStatusToggle: (guessIndex: number, letterIndex: number) => void;
}

const GuessRow: React.FC<GuessRowProps> = ({
    guess,
    guessIndex,
    onLetterStatusToggle
}) => {
    return (
        <div className="guess-row">
            <div className="guess-letters">
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

            <div className="guess-row-number">
                <span className="row-number">{guessIndex + 1}</span>
            </div>
        </div>
    );
};

export default GuessRow;
