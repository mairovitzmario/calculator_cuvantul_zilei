// Types for the Wordle calculator application
export type LetterStatus = 'correct' | 'present' | 'absent';

export interface GuessLetter {
    letter: string;
    status: LetterStatus;
}

export interface Guess {
    letters: GuessLetter[];
}

export interface WordConstraints {
    greenLetters: string;
    yellowLetters: string;
    grayLetters: string;
    yellowPositions?: { [letter: string]: number[] };
}
