import React from 'react';
import type { GuessLetter } from '../types';

interface LetterInputProps {
    letter: GuessLetter;
    onLetterChange: (value: string) => void;
    onStatusToggle: () => void;
}

const LetterInput: React.FC<LetterInputProps> = ({
    letter,
    onLetterChange,
    onStatusToggle
}) => {
    const hasLetter = letter.letter.trim() !== '';

    const handleClick = () => {
        // Only allow status toggle if there's a letter
        if (hasLetter) {
            onStatusToggle();
        }
    }; return (
        <div className="letter-container">
            <input
                type="text"
                maxLength={1}
                value={letter.letter}
                onChange={(e) => onLetterChange(e.target.value)}
                className={`letter-input ${letter.status} ${hasLetter ? 'has-letter' : ''}`}
                onClick={handleClick}
                title={hasLetter ? "Click to change status" : ""}
                style={{ cursor: hasLetter ? 'pointer' : 'text' }}
            />
        </div>
    );
};

export default LetterInput;
