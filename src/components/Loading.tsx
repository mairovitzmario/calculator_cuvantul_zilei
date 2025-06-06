import React from 'react';

interface LoadingProps { }

const Loading: React.FC<LoadingProps> = () => {
    return (
        <div className="app">
            <div className="loading">Se încarcă cuvintele...</div>
        </div>
    );
};

export default Loading;
