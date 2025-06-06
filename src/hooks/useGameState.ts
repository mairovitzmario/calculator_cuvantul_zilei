import { useState } from 'react';
import type { Guess } from '../types';
import { createInitialGuesses, cycleLetterStatus } from '../utils/gameUtils';

export const useGameState = () => {
    const [guesses, setGuesses] = useState<Guess[]>(createInitialGuesses());
    const [wordInput, setWordInput] = useState('');
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        type: 'clearAll' | null;
    }>({ isOpen: false, type: null });

    const handleLetterStatusToggle = (guessIndex: number, letterIndex: number) => {
        const newGuesses = [...guesses];
        const currentLetter = newGuesses[guessIndex].letters[letterIndex];
        newGuesses[guessIndex].letters[letterIndex].status = cycleLetterStatus(currentLetter.status);
        setGuesses(newGuesses);
    };

    const addWordToGuess = () => {
        if (wordInput.length !== 5) return;

        // Find first empty slot
        const targetGuessIndex = guesses.findIndex(guess =>
            guess.letters.every(letter => letter.letter === '')
        );
        if (targetGuessIndex === -1) return; // No empty slots

        const newGuesses = [...guesses];
        const wordLetters = wordInput.toUpperCase().split('');

        newGuesses[targetGuessIndex] = {
            letters: wordLetters.map(letter => ({ letter, status: 'absent' as const }))
        };

        setGuesses(newGuesses);
        setWordInput('');
    };

    const clearAllGuesses = () => {
        setGuesses(createInitialGuesses());
        setWordInput('');
    };

    const showClearAllModal = () => {
        setModalState({ isOpen: true, type: 'clearAll' });
    };

    const handleModalConfirm = () => {
        if (modalState.type === 'clearAll') {
            clearAllGuesses();
        }
        setModalState({ isOpen: false, type: null });
    };

    const handleModalCancel = () => {
        setModalState({ isOpen: false, type: null });
    };

    return {
        guesses,
        wordInput,
        setWordInput,
        handleLetterStatusToggle,
        addWordToGuess,
        clearAllGuesses,
        modalState,
        showClearAllModal,
        handleModalConfirm,
        handleModalCancel
    };
};
