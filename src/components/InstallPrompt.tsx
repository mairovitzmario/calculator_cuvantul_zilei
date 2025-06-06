import React from 'react';

interface InstallPromptProps {
    onInstallClick: () => void;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ onInstallClick }) => {
    return (
        <div className="install-prompt">
            <p>Instalează aplicația pentru o experiență mai bună!</p>
            <button onClick={onInstallClick} className="install-btn">
                Instalează
            </button>
        </div>
    );
};

export default InstallPrompt;
