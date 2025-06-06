import React from 'react';

interface ResultsSectionProps {
    filteredWords: string[];
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ filteredWords }) => {
    const maxDisplayedWords = 100;
    const displayedWords = filteredWords.slice(0, maxDisplayedWords);
    const hasMoreWords = filteredWords.length > maxDisplayedWords;

    return (
        <div className="results">
            <div className="results-header">
                <h3>Rezultate: {filteredWords.length} cuvinte</h3>
            </div>

            <div className="words-grid">
                {displayedWords.map((word, index) => (
                    <div key={index} className="word-item">
                        {word}
                    </div>
                ))}
                {hasMoreWords && (
                    <div className="more-results">
                        ... și încă {filteredWords.length - maxDisplayedWords} cuvinte
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsSection;
