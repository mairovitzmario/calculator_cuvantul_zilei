import React from 'react';
import { isValidWord } from '../utils/gameUtils';

interface WordInputProps {
    wordInput: string;
    onWordInputChange: (word: string) => void;
    onAddWord: () => void;
    isEditing?: boolean;
    editingIndex?: number | null;
}

const WordInput: React.FC<WordInputProps> = ({
    wordInput,
    onWordInputChange,
    onAddWord,
    isEditing = false,
    editingIndex
}) => {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onAddWord();
        }
    };

    const isAddButtonEnabled = wordInput.length === 5 && isValidWord(wordInput);

    return (
        <div className="word-input-section">            <p className="instructions">
            {isEditing && editingIndex !== null && editingIndex !== undefined
                ? `Modifică cuvântul ${editingIndex + 1}: introdu un cuvânt de 5 litere`
                : "Introdu un cuvânt de 5 litere și apasă Enter sau butonul de adăugare:"
            }
        </p>
            <div className="word-input-container">
                <input
                    type="text"
                    maxLength={5}
                    value={wordInput}
                    onChange={(e) => onWordInputChange(e.target.value.toUpperCase())}
                    onKeyPress={handleKeyPress}
                    placeholder="CUVÂNT"
                    className="word-input"
                />
                <button
                    onClick={onAddWord}
                    disabled={!isAddButtonEnabled}
                    className="add-word-btn"
                >
                    {isEditing ? "✅ Actualizează" : "➕ Adaugă"}
                </button>
            </div>
        </div>
    );
};

export default WordInput;
