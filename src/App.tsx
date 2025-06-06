import './App.css';
import Header from './components/Header';
import Loading from './components/Loading';
import GameSection from './components/GameSection';
import ResultsSection from './components/ResultsSection';
import InstallPrompt from './components/InstallPrompt';
import ConfirmModal from './components/ConfirmModal';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useWordFiltering } from './hooks/useWordFiltering';
import { useGameState } from './hooks/useGameState';

function App() {
  const { showInstallButton, handleInstallClick } = usePWAInstall();

  const {
    guesses,
    wordInput,
    setWordInput,
    handleLetterStatusToggle,
    addWordToGuess,
    modalState,
    showClearAllModal,
    handleModalConfirm,
    handleModalCancel
  } = useGameState();

  const { filteredWords, loading } = useWordFiltering(guesses);

  const getModalContent = () => {
    switch (modalState.type) {
      case 'clearAll':
        return {
          title: 'Confirmare ștergere toate',
          message: 'Ești sigur că vrei să ștergi toate încercările?'
        };
      default:
        return { title: '', message: '' };
    }
  };

  const modalContent = getModalContent();

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
        onWordInputChange={setWordInput}
        onAddWord={addWordToGuess}
        onLetterStatusToggle={handleLetterStatusToggle}
        onShowClearAllModal={showClearAllModal}
      />

      <ResultsSection filteredWords={filteredWords} />

      {showInstallButton && (
        <InstallPrompt onInstallClick={handleInstallClick} />
      )}

      <ConfirmModal
        isOpen={modalState.isOpen}
        title={modalContent.title}
        message={modalContent.message}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </div>
  );
}

export default App;
