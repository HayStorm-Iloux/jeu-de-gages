import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import GageApp from './Gage/GageApp';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PlayerSetupPage />} />
      <Route path="/GageApp/:player1/:player2" element={<GageApp />} />
    </Routes>
  );
};

// Composant pour la saisie des noms
const PlayerSetupPage = () => {
  const navigate = useNavigate();
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [currentStep, setCurrentStep] = useState('player1'); // 'player1', 'player2', 'ready'

  const resetNames = () => {
    setPlayer1Name('');
    setPlayer2Name('');
    setCurrentStep('player1');
  };

  const handleStartGame = () => {
    // Navigation vers /GageApp avec les noms des joueurs dans l'URL
    navigate(`/GageApp/${encodeURIComponent(player1Name)}/${encodeURIComponent(player2Name)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: '#001B2E'}}>
      <div className="rounded-3xl shadow-2xl p-10 w-full max-w-lg border-8 transform hover:scale-105 transition-all duration-300" style={{
        backgroundColor: '#294C60', 
        borderColor: '#FFC49B',
        boxShadow: '16px 16px 0px #ADB6C4'
      }}>
        
        {/* Titre principal */}
        <div className="text-center mb-10">
          <h1 className="text-6xl font-black mb-4 transform -rotate-1 cartoon-font" style={{
            color: '#FFC49B',
            textShadow: '5px 5px 0px #001B2E, 10px 10px 0px #ADB6C4'
          }}>
            JEU DE GAGES
          </h1>
        </div>

        {/* Étape 1 : Joueur 1 */}
        {currentStep === 'player1' && (
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-4xl font-black mb-6 transform rotate-1 cartoon-font" style={{
                color: '#FFEFD3',
                textShadow: '4px 4px 0px #001B2E'
              }}>
                JOUEUR 1
              </h2>
              <div className="px-8 py-4 rounded-2xl text-xl font-black border-4 transform -rotate-1 cartoon-font" style={{
                backgroundColor: '#FFC49B', 
                color: '#001B2E',
                borderColor: '#FFEFD3',
                textShadow: '2px 2px 0px #FFEFD3',
                boxShadow: '6px 6px 0px #ADB6C4'
              }}>
                À TOI DE JOUER !
              </div>
            </div>
            
            <div className="space-y-6">
              <input
                type="text"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                placeholder="TON NOM ICI..."
                className="w-full px-6 py-4 rounded-2xl text-center font-black text-2xl border-6 focus:outline-none focus:ring-4 transform hover:scale-105 transition-all duration-200 cartoon-font"
                style={{
                  backgroundColor: '#FFEFD3',
                  color: '#001B2E',
                  borderColor: '#FFC49B',
                  textShadow: '2px 2px 0px #ADB6C4',
                  boxShadow: '6px 6px 0px #ADB6C4'
                }}
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && player1Name.trim() && setCurrentStep('player2')}
              />
              <button
                onClick={() => player1Name.trim() && setCurrentStep('player2')}
                disabled={!player1Name.trim()}
                className="w-full font-black py-4 px-8 rounded-2xl text-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-1 disabled:cursor-not-allowed border-6 cartoon-font"
                style={{
                  backgroundColor: player1Name.trim() ? '#FFC49B' : '#ADB6C4',
                  color: '#001B2E',
                  borderColor: player1Name.trim() ? '#FFEFD3' : '#294C60',
                  textShadow: player1Name.trim() ? '2px 2px 0px #FFEFD3' : '2px 2px 0px #FFEFD3',
                  boxShadow: player1Name.trim() ? '8px 8px 0px #ADB6C4' : '4px 4px 0px #294C60'
                }}
                onMouseEnter={(e) => {
                  if (player1Name.trim()) {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#FFEFD3';
                    (e.target as HTMLButtonElement).style.boxShadow = '12px 12px 0px #ADB6C4';
                  }
                }}
                onMouseLeave={(e) => {
                  if (player1Name.trim()) {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#FFC49B';
                    (e.target as HTMLButtonElement).style.boxShadow = '8px 8px 0px #ADB6C4';
                  }
                }}
              >
                VALIDER !
              </button>
            </div>
          </div>
        )}

        {/* Étape 2 : Joueur 2 */}
        {currentStep === 'player2' && (
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-4xl font-black mb-6 transform -rotate-1 cartoon-font" style={{
                color: '#FFEFD3',
                textShadow: '4px 4px 0px #001B2E'
              }}>
                JOUEUR 2
              </h2>
              <div className="px-8 py-4 rounded-2xl text-xl font-black mb-4 border-4 transform rotate-1 cartoon-font" style={{
                backgroundColor: '#FFC49B', 
                color: '#001B2E',
                borderColor: '#FFEFD3',
                textShadow: '2px 2px 0px #FFEFD3',
                boxShadow: '6px 6px 0px #ADB6C4'
              }}>
                À TOI MAINTENANT !
              </div>
              <div className="text-lg font-bold cartoon-font" style={{
                color: '#FFC49B',
                textShadow: '2px 2px 0px #001B2E'
              }}>
                {player1Name} EST PRÊT !
              </div>
            </div>
            
            <div className="space-y-6">
              <input
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                placeholder="TON NOM ICI..."
                className="w-full px-6 py-4 rounded-2xl text-center font-black text-2xl border-6 focus:outline-none focus:ring-4 transform hover:scale-105 transition-all duration-200 cartoon-font"
                style={{
                  backgroundColor: '#FFEFD3',
                  color: '#001B2E',
                  borderColor: '#FFC49B',
                  textShadow: '2px 2px 0px #ADB6C4',
                  boxShadow: '6px 6px 0px #ADB6C4'
                }}
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && player2Name.trim() && setCurrentStep('ready')}
              />
              <button
                onClick={() => player2Name.trim() && setCurrentStep('ready')}
                disabled={!player2Name.trim()}
                className="w-full font-black py-4 px-8 rounded-2xl text-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-1 disabled:cursor-not-allowed border-6 cartoon-font"
                style={{
                  backgroundColor: player2Name.trim() ? '#FFC49B' : '#ADB6C4',
                  color: '#001B2E',
                  borderColor: player2Name.trim() ? '#FFEFD3' : '#294C60',
                  textShadow: player1Name.trim() ? '2px 2px 0px #FFEFD3' : '2px 2px 0px #FFEFD3',
                  boxShadow: player1Name.trim() ? '8px 8px 0px #ADB6C4' : '4px 4px 0px #294C60'
                }}
                onMouseEnter={(e) => {
                  if (player2Name.trim()) {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#FFEFD3';
                    (e.target as HTMLButtonElement).style.boxShadow = '12px 12px 0px #ADB6C4';
                  }
                }}
                onMouseLeave={(e) => {
                  if (player2Name.trim()) {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#FFC49B';
                    (e.target as HTMLButtonElement).style.boxShadow = '8px 8px 0px #ADB6C4';
                  }
                }}
              >
                VALIDER !
              </button>
            </div>
            
            <button
              onClick={() => setCurrentStep('player1')}
              className="mt-6 underline text-lg font-bold transition-all duration-200 transform hover:scale-110 cartoon-font"
              style={{
                color: '#FFEFD3',
                textShadow: '2px 2px 0px #001B2E'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.color = '#FFC49B';
                (e.target as HTMLButtonElement).style.transform = 'scale(1.1) rotate(2deg)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.color = '#FFEFD3';
                (e.target as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              MODIFIER LE NOM DU JOUEUR 1
            </button>
          </div>
        )}

        {/* Étape 3 : Prêt à jouer */}
        {currentStep === 'ready' && (
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-4xl font-black mb-8 transform rotate-1 cartoon-font" style={{
                color: '#FFEFD3',
                textShadow: '4px 4px 0px #001B2E'
              }}>
                PRÊTS À JOUER ?
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="px-8 py-4 rounded-2xl text-2xl font-black border-4 transform -rotate-1 cartoon-font" style={{
                  backgroundColor: '#FFC49B', 
                  color: '#001B2E',
                  borderColor: '#FFEFD3',
                  textShadow: '2px 2px 0px #FFEFD3',
                  boxShadow: '6px 6px 0px #ADB6C4'
                }}>
                  {player1Name}
                </div>
                <div className="font-black text-2xl transform rotate-2 cartoon-font" style={{
                  color: '#FFC49B',
                  textShadow: '3px 3px 0px #001B2E'
                }}>
                  VS
                </div>
                <div className="px-8 py-4 rounded-2xl text-2xl font-black border-4 transform rotate-1 cartoon-font" style={{
                  backgroundColor: '#FFC49B', 
                  color: '#001B2E',
                  borderColor: '#FFEFD3',
                  textShadow: '2px 2px 0px #FFEFD3',
                  boxShadow: '6px 6px 0px #ADB6C4'
                }}>
                  {player2Name}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleStartGame}
                className="w-full font-black py-5 px-8 rounded-2xl text-3xl transition-all duration-300 transform hover:scale-110 hover:rotate-1 border-6 cartoon-font"
                style={{
                  backgroundColor: '#FFEFD3',
                  color: '#001B2E',
                  borderColor: '#FFC49B',
                  textShadow: '3px 3px 0px #FFC49B',
                  boxShadow: '10px 10px 0px #ADB6C4'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#FFC49B';
                  (e.target as HTMLButtonElement).style.color = '#001B2E';
                  (e.target as HTMLButtonElement).style.textShadow = '3px 3px 0px #FFEFD3';
                  (e.target as HTMLButtonElement).style.boxShadow = '15px 15px 0px #ADB6C4';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#FFEFD3';
                  (e.target as HTMLButtonElement).style.color = '#001B2E';
                  (e.target as HTMLButtonElement).style.textShadow = '3px 3px 0px #FFC49B';
                  (e.target as HTMLButtonElement).style.boxShadow = '10px 10px 0px #ADB6C4';
                }}
              >
                COMMENCER LE JEU !
              </button>
              
              <button
                onClick={resetNames}
                className="w-full font-black py-3 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 border-4 cartoon-font"
                style={{
                  backgroundColor: '#ADB6C4',
                  color: '#001B2E',
                  borderColor: '#294C60',
                  textShadow: '2px 2px 0px #FFEFD3',
                  boxShadow: '6px 6px 0px #294C60'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#294C60';
                  (e.target as HTMLButtonElement).style.color = '#FFEFD3';
                  (e.target as HTMLButtonElement).style.boxShadow = '8px 8px 0px #001B2E';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#ADB6C4';
                  (e.target as HTMLButtonElement).style.color = '#001B2E';
                  (e.target as HTMLButtonElement).style.boxShadow = '6px 6px 0px #294C60';
                }}
              >
                RECOMMENCER
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;