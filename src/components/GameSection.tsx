import React from 'react';
import WordInput from './WordInput';
import ColorLegend from './ColorLegend';
import WordleGrid from './WordleGrid';
import ConfirmModal from './ConfirmModal';
import type { Guess } from '../types';

interface GameSectionProps {
    wordInput: string;
    guesses: Guess[];
    editingGuessIndex: number | null;
    modalState: {
        isOpen: boolean;
        type: 'deleteWord' | 'clearAll' | null;
        guessIndex?: number;
    };
    onWordInputChange: (word: string) => void;
    onAddWord: () => void;
    onLetterStatusToggle: (guessIndex: number, letterIndex: number) => void;
    onStartInputting: (guessIndex: number) => void;
    onShowDeleteWordModal: (guessIndex: number) => void;
    onShowClearAllModal: () => void;
    onModalConfirm: () => void;
    onModalCancel: () => void;
}

const GameSection: React.FC<GameSectionProps> = ({
    wordInput,
    guesses,
    editingGuessIndex,
    modalState,
    onWordInputChange,
    onAddWord,
    onLetterStatusToggle,
    onStartInputting,
    onShowDeleteWordModal,
    onShowClearAllModal,
    onModalConfirm,
    onModalCancel
}) => {
    const getModalContent = () => {
        switch (modalState.type) {
            case 'deleteWord':
                return {
                    title: 'Confirmare ștergere',
                    message: 'Ești sigur că vrei să ștergi acest cuvânt?'
                };
            case 'clearAll':
                return {
                    title: 'Confirmare ștergere toate',
                    message: 'Ești sigur că vrei să ștergi toate încercările?'
                };
            default:
                return { title: '', message: '' };
        }
    };

    const modalContent = getModalContent(); return (
        <div className="game-section">
            <h2>📝 Introdu încercările tale</h2>

            <WordInput
                wordInput={wordInput}
                onWordInputChange={onWordInputChange}
                onAddWord={onAddWord}
                isEditing={editingGuessIndex !== null}
                editingIndex={editingGuessIndex}
            />

            <p className="instructions">
                După ce adaugi un cuvânt, apasă pe fiecare literă pentru a schimba culoarea:
            </p>

            <ColorLegend />

            <WordleGrid
                guesses={guesses}
                onLetterStatusToggle={onLetterStatusToggle}
                onDeleteGuess={onShowDeleteWordModal}
                onStartInputting={onStartInputting}
            />

            <button onClick={onShowClearAllModal} className="clear-btn">
                🗑️ Șterge toate încercările
            </button>

            <ConfirmModal
                isOpen={modalState.isOpen}
                title={modalContent.title}
                message={modalContent.message}
                onConfirm={onModalConfirm}
                onCancel={onModalCancel}
            />
        </div>
    );
};

export default GameSection;
