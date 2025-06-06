/**
 * TypeScript implementation of Wordle word filtering
 */

export interface FilterOptions {
  green: { [position: number]: string };
  yellow: { [letter: string]: Set<number> };
  gray: Set<string>;
}

/**
 * Core filtering function that applies all constraints
 */
export function filterWordleWords(words: string[], options: FilterOptions): string[] {
  // Check for impossible constraints first
  for (const [letter, wrongPositions] of Object.entries(options.yellow)) {
    // If a yellow letter has all 5 positions marked as wrong, it's impossible
    if (wrongPositions.size >= 5) {
      console.log(`Impossible constraint: letter '${letter}' cannot be in any position`);
      return []; // No valid words possible
    }
  }

  return words.filter(word => {
    const wordLower = word.toLowerCase();

    // Check green letters (correct position)
    for (const [position, letter] of Object.entries(options.green)) {
      if (wordLower[parseInt(position)] !== letter) {
        return false;
      }
    }

    // Check yellow letters (in word but wrong position)
    for (const [letter, wrongPositions] of Object.entries(options.yellow)) {
      // Letter must be in the word
      if (!wordLower.includes(letter)) {
        return false;
      }

      // Letter must not be in any of the wrong positions
      for (const pos of wrongPositions) {
        if (wordLower[pos] === letter) {
          return false;
        }
      }

      // Additional check: if this letter has wrong positions marked,
      // ensure it appears in at least one allowed position
      if (wrongPositions.size > 0) {
        let hasValidPosition = false;
        for (let i = 0; i < wordLower.length; i++) {
          if (wordLower[i] === letter && !wrongPositions.has(i)) {
            // Also check this position isn't taken by a green letter
            if (!options.green[i] || options.green[i] === letter) {
              hasValidPosition = true;
              break;
            }
          }
        }
        if (!hasValidPosition) {
          return false;
        }
      }
    }

    // Check gray letters (not in word)
    for (const letter of options.gray) {
      if (wordLower.includes(letter)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Easy-to-use function for filtering Wordle words.
 * 
 * @param words Array of words to filter
 * @param greenLetters String where each position represents a green letter (use '?' for unknown)
 *                     Example: "a?b??" means 'a' at position 0, 'b' at position 2
 * @param yellowLetters String of letters that are in the word but in wrong positions
 *                      Example: "xy" means 'x' and 'y' are in the word but not where you guessed
 * @param grayLetters String of letters that are NOT in the word
 *                    Example: "ert" means 'e', 'r', 't' are not in the word
 * @returns Filtered array of words
 */
export function filterWordsEasy(
  words: string[],
  greenLetters: string = "",
  yellowLetters: string = "",
  grayLetters: string = "",
  yellowPositions?: { [letter: string]: number[] }
): string[] {
  // Convert green_letters string to dictionary
  const green: { [position: number]: string } = {};
  for (let i = 0; i < greenLetters.length; i++) {
    const letter = greenLetters[i];
    if (letter !== '?' && letter !== '' && letter !== '_') {
      green[i] = letter.toLowerCase();
    }
  }

  // Convert yellow_letters to dictionary with position tracking
  const yellow: { [letter: string]: Set<number> } = {};
  for (const letter of yellowLetters.toLowerCase()) {
    if (letter && letter !== ' ') {
      // Use the tracked wrong positions if available
      yellow[letter] = new Set(yellowPositions?.[letter] || []);
    }
  }

  // Convert gray_letters to set
  const gray = new Set(grayLetters.toLowerCase().split('').filter(l => l !== ' '));

  return filterWordleWords(words, { green, yellow, gray });
}

/**
 * Load words from the public text file
 */
export async function loadWords(): Promise<string[]> {
  try {
    const response = await fetch('/wordle_romanian_words.txt');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    return text.split('\n')
      .map(word => word.trim())
      .filter(word => word.length > 0);
  } catch (error) {
    console.error('Error loading words:', error);
    return [];
  }
}
