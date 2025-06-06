import { useState } from 'react';
import type { Guess } from '../types';
import { createInitialGuesses, createEmptyGuess, cycleLetterStatus } from '../utils/gameUtils';

export const useGameState = () => {
    const [guesses, setGuesses] = useState<Guess[]>(createInitialGuesses());
    const [wordInput, setWordInput] = useState('');
    const [editingGuessIndex, setEditingGuessIndex] = useState<number | null>(null);
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        type: 'deleteWord' | 'clearAll' | null;
        guessIndex?: number;
    }>({ isOpen: false, type: null });
    const handleLetterStatusToggle = (guessIndex: number, letterIndex: number) => {
        const newGuesses = [...guesses];
        const currentLetter = newGuesses[guessIndex].letters[letterIndex];
        newGuesses[guessIndex].letters[letterIndex].status = cycleLetterStatus(currentLetter.status);
        setGuesses(newGuesses);
    }; const addWordToGuess = () => {
        if (wordInput.length !== 5) return;

        let targetGuessIndex: number;

        if (editingGuessIndex !== null) {
            // Replace existing word
            targetGuessIndex = editingGuessIndex;
        } else {
            // Find first empty slot
            targetGuessIndex = guesses.findIndex(guess =>
                guess.letters.every(letter => letter.letter === '')
            );
            if (targetGuessIndex === -1) return; // No empty slots
        }

        const newGuesses = [...guesses];
        const wordLetters = wordInput.toUpperCase().split('');

        newGuesses[targetGuessIndex] = {
            letters: wordLetters.map(letter => ({ letter, status: 'absent' as const }))
        };

        setGuesses(newGuesses);
        setWordInput('');
        setEditingGuessIndex(null);
    }; const deleteGuess = (guessIndex: number) => {
        const newGuesses = [...guesses];
        newGuesses[guessIndex] = createEmptyGuess();
        setGuesses(newGuesses);
        // If we were editing this guess, clear the editing state
        if (editingGuessIndex === guessIndex) {
            setEditingGuessIndex(null);
            setWordInput('');
        }
    };

    const startInputting = (guessIndex: number) => {
        const currentWord = guesses[guessIndex].letters.map(letter => letter.letter).join('');
        setWordInput(currentWord);
        setEditingGuessIndex(guessIndex);
    }; const clearAllGuesses = () => {
        setGuesses(createInitialGuesses());
        setEditingGuessIndex(null);
        setWordInput('');
    };

    const showDeleteWordModal = (guessIndex: number) => {
        setModalState({ isOpen: true, type: 'deleteWord', guessIndex });
    };

    const showClearAllModal = () => {
        setModalState({ isOpen: true, type: 'clearAll' });
    };

    const handleModalConfirm = () => {
        if (modalState.type === 'deleteWord' && modalState.guessIndex !== undefined) {
            deleteGuess(modalState.guessIndex);
        } else if (modalState.type === 'clearAll') {
            clearAllGuesses();
        }
        setModalState({ isOpen: false, type: null });
    };

    const handleModalCancel = () => {
        setModalState({ isOpen: false, type: null });
    }; return {
        guesses,
        wordInput,
        setWordInput,
        editingGuessIndex,
        handleLetterStatusToggle,
        addWordToGuess,
        deleteGuess,
        startInputting,
        clearAllGuesses,
        modalState,
        showDeleteWordModal,
        showClearAllModal,
        handleModalConfirm,
        handleModalCancel
    };
};
