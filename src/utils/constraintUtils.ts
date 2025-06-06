import type { Guess, WordConstraints } from '../types';

export const extractWordConstraints = (guesses: Guess[]): WordConstraints => {
    let yellowLetters = '';
    const grayLetters = new Set<string>();
    const greenPattern = ['?', '?', '?', '?', '?'];
    const yellowPositions: { [letter: string]: number[] } = {};

    guesses.forEach(guess => {
        guess.letters.forEach((letterObj, index) => {
            if (letterObj.letter) {
                const letter = letterObj.letter.toLowerCase();
                switch (letterObj.status) {
                    case 'correct':
                        greenPattern[index] = letter;
                        break;
                    case 'present':
                        if (!yellowLetters.includes(letter)) {
                            yellowLetters += letter;
                        }
                        // Track the wrong position for this yellow letter
                        if (!yellowPositions[letter]) {
                            yellowPositions[letter] = [];
                        }
                        if (!yellowPositions[letter].includes(index)) {
                            yellowPositions[letter].push(index);
                        }
                        break;
                    case 'absent':
                        grayLetters.add(letter);
                        break;
                }
            }
        });
    });

    // Debug logging for impossible constraints
    for (const [letter, positions] of Object.entries(yellowPositions)) {
        if (positions.length >= 5) {
            console.log(`Warning: Letter '${letter}' marked as yellow in all positions - impossible constraint!`);
        }
    }

    return {
        greenLetters: greenPattern.join(''),
        yellowLetters,
        grayLetters: Array.from(grayLetters).join(''),
        yellowPositions
    };
};
