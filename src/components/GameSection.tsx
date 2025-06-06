import React from 'react';
import WordInput from './WordInput';
import ColorLegend from './ColorLegend';
import WordleGrid from './WordleGrid';
import type { Guess } from '../types';

interface GameSectionProps {
    wordInput: string;
    guesses: Guess[];
    onWordInputChange: (word: string) => void;
    onAddWord: () => void;
    onLetterStatusToggle: (guessIndex: number, letterIndex: number) => void;
    onShowClearAllModal: () => void;
}

const GameSection: React.FC<GameSectionProps> = ({
    wordInput,
    guesses,
    onWordInputChange,
    onAddWord,
    onLetterStatusToggle,
    onShowClearAllModal
}) => {
    return (
        <div className="game-section">
            <h2>📝 Introdu încercările tale</h2>

            <WordInput
                wordInput={wordInput}
                onWordInputChange={onWordInputChange}
                onAddWord={onAddWord}
                isEditing={false}
                editingIndex={null}
            />

            <p className="instructions">
                După ce adaugi un cuvânt, apasă pe fiecare literă pentru a schimba culoarea:
            </p>

            <ColorLegend />

            <WordleGrid
                guesses={guesses}
                onLetterStatusToggle={onLetterStatusToggle}
            />

            <button onClick={onShowClearAllModal} className="clear-btn">
                🗑️ Șterge toate încercările
            </button>
        </div>
    );
};

export default GameSection;
