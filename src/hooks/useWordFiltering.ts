import { useState, useEffect } from 'react';
import { filterWordsEasy, loadWords } from '../wordFilter';
import { extractWordConstraints } from '../utils/constraintUtils';
import type { Guess } from '../types';

export const useWordFiltering = (guesses: Guess[]) => {
    const [words, setWords] = useState<string[]>([]);
    const [filteredWords, setFilteredWords] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Load words on component mount
    useEffect(() => {
        const loadWordList = async () => {
            setLoading(true);
            const wordList = await loadWords();
            setWords(wordList);
            setFilteredWords(wordList);
            setLoading(false);
        };
        loadWordList();
    }, []);    // Filter words whenever guesses change
    useEffect(() => {
        if (words.length > 0) {
            const { greenLetters, yellowLetters, grayLetters, yellowPositions } = extractWordConstraints(guesses);
            const filtered = filterWordsEasy(words, greenLetters, yellowLetters, grayLetters, yellowPositions);
            setFilteredWords(filtered);
        }
    }, [words, guesses]);

    return {
        words,
        filteredWords,
        loading
    };
};
