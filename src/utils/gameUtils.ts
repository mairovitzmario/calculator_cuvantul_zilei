import type { GuessLetter, LetterStatus } from '../types';

export const EMPTY_LETTER: GuessLetter = { letter: '', status: 'absent' };

export const createEmptyGuess = () => ({
    letters: Array(5).fill(null).map(() => ({ ...EMPTY_LETTER }))
});

export const createInitialGuesses = () => Array(6).fill(null).map(() => createEmptyGuess());

export const cycleLetterStatus = (currentStatus: LetterStatus): LetterStatus => {
    const statusCycle: LetterStatus[] = ['absent', 'present', 'correct'];
    const currentIndex = statusCycle.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusCycle.length;
    console.log(`Cycling status from ${currentStatus} to ${statusCycle[nextIndex]}`);
    return statusCycle[nextIndex];
};

export const isValidWord = (word: string): boolean => {
    return word.length === 5 && /^[A-ZĂÎÂȘȚ]+$/.test(word);
};
