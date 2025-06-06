import React from 'react';
import type { Guess } from '../types';
import GuessRow from './GuessRow';

interface WordleGridProps {
    guesses: Guess[];
    onLetterStatusToggle: (guessIndex: number, letterIndex: number) => void;
}

const WordleGrid: React.FC<WordleGridProps> = ({
    guesses,
    onLetterStatusToggle
}) => {
    return (
        <div className="wordle-grid">
            {guesses.map((guess, guessIndex) => (
                <GuessRow
                    key={guessIndex}
                    guess={guess}
                    guessIndex={guessIndex}
                    onLetterStatusToggle={onLetterStatusToggle}
                />
            ))}
        </div>
    );
};

export default WordleGrid;
