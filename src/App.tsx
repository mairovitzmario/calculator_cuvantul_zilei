import './App.css';
import Header from './components/Header';
import Loading from './components/Loading';
import GameSection from './components/GameSection';
import ResultsSection from './components/ResultsSection';
import InstallPrompt from './components/InstallPrompt';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useWordFiltering } from './hooks/useWordFiltering';
import { useGameState } from './hooks/useGameState';

function App() {
  const { showInstallButton, handleInstallClick } = usePWAInstall();

  const {
    guesses,
    wordInput,
    setWordInput,
    editingGuessIndex,
    handleLetterStatusToggle,
    addWordToGuess,
    startInputting,
    modalState,
    showDeleteWordModal,
    showClearAllModal,
    handleModalConfirm,
    handleModalCancel
  } = useGameState();

  const { filteredWords, loading } = useWordFiltering(guesses);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="app">
      <Header
        showInstallButton={showInstallButton}
        onInstallClick={handleInstallClick}
      />

      <GameSection
        wordInput={wordInput}
        guesses={guesses}
        editingGuessIndex={editingGuessIndex}
        modalState={modalState}
        onWordInputChange={setWordInput}
        onAddWord={addWordToGuess}
        onLetterStatusToggle={handleLetterStatusToggle}
        onStartInputting={startInputting}
        onShowDeleteWordModal={showDeleteWordModal}
        onShowClearAllModal={showClearAllModal}
        onModalConfirm={handleModalConfirm}
        onModalCancel={handleModalCancel}
      />

      <ResultsSection filteredWords={filteredWords} />

      {showInstallButton && (
        <InstallPrompt onInstallClick={handleInstallClick} />
      )}
    </div>
  );
}

export default App;
