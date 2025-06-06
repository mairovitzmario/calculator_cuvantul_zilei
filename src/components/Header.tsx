import React from 'react';

interface HeaderProps {
    showInstallButton: boolean;
    onInstallClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ showInstallButton, onInstallClick }) => {
    return (
        <header className="header">
            <h1>🎯 Calculator Cuvântul Zilei</h1>
            <p>Filtrează cuvintele pentru cuvântul zilei</p>
            {showInstallButton && (
                <button onClick={onInstallClick} className="install-btn">
                    📱 Instalează aplicația
                </button>
            )}
        </header>
    );
};

export default Header;
