import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import questionsData from '../Json/questions.json';

interface Question {
  text: string;
  category: string;
}

const QuestionApp: React.FC = () => {
  const { player1, player2, targetScore: targetScoreParam, currentGage: loserGageParam } = useParams<{ 
    player1: string; 
    player2: string; 
    targetScore: string;
    currentGage: string;
  }>();
  const navigate = useNavigate();

  // États principaux
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [targetPlayer, setTargetPlayer] = useState<'player1' | 'player2'>('player1'); // Joueur ciblé par la question
  const [gameStep, setGameStep] = useState<'player1' | 'player2' | 'comparison' | 'gameOver'>('player1');
  
  // Réponses des joueurs
  const [player1Answer, setPlayer1Answer] = useState('');
  const [player2Answer, setPlayer2Answer] = useState('');
  
  // Scores
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  // Décodage des noms, score cible et gage du perdant
  const player1Name = player1 ? decodeURIComponent(player1) : 'Joueur 1';
  const player2Name = player2 ? decodeURIComponent(player2) : 'Joueur 2';
  const targetScore = targetScoreParam ? parseInt(targetScoreParam) : 15;
  const currentGage = loserGageParam ? decodeURIComponent(loserGageParam) : 'Gage par défaut';

  // Initialisation des questions depuis l'import JSON
  useEffect(() => {
    const allQuestions: Question[] = [];
    questionsData.categories.forEach((category) => {
      category.questions.forEach((questionText) => {
        allQuestions.push({
          text: questionText,
          category: category.name
        });
      });
    });
    
    setQuestions(allQuestions);
    // Lancer directement une première question
    if (allQuestions.length > 0) {
      selectRandomQuestion(allQuestions);
    }
  }, []);

  // Sélectionner une question aléatoire et un joueur cible
  const selectRandomQuestion = (questionsList = questions) => {
    if (questionsList.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * questionsList.length);
    const selectedQuestion = questionsList[randomIndex];
    
    // Choisir aléatoirement le joueur ciblé avec plus de randomisation
    const randomTarget = Math.floor(Math.random() * 2) === 0 ? 'player1' : 'player2';
    const targetName = randomTarget === 'player1' ? player1Name : player2Name;
    
    console.log(`Question aléatoire ciblée sur: ${targetName} (${randomTarget})`); // Debug
    
    // Adapter la question avec le nom du joueur ciblé
    let adaptedText = selectedQuestion.text;
    
    // Remplacements plus complets
    adaptedText = adaptedText.replace(/il\/elle/gi, targetName);
    adaptedText = adaptedText.replace(/Il\/Elle/g, targetName);
    adaptedText = adaptedText.replace(/son\/sa/gi, `${targetName}'s`);
    adaptedText = adaptedText.replace(/lui\/elle/gi, targetName);
    
    const adaptedQuestion = {
      ...selectedQuestion,
      text: adaptedText
    };
    
    setCurrentQuestion(adaptedQuestion);
    setTargetPlayer(randomTarget);
    resetAnswers();
    setGameStep('player1');
  };

  // Réinitialiser les réponses
  const resetAnswers = () => {
    setPlayer1Answer('');
    setPlayer2Answer('');
  };

  // Passer à l'étape suivante
  const nextStep = () => {
    if (gameStep === 'player1' && player1Answer.trim()) {
      setGameStep('player2');
    } else if (gameStep === 'player2' && player2Answer.trim()) {
      setGameStep('comparison');
    }
  };

  // Donner un point
  const givePoint = (toPlayer: 'player1' | 'player2') => {
    let newPlayer1Score = player1Score;
    let newPlayer2Score = player2Score;
    
    if (toPlayer === 'player1') {
      newPlayer1Score = player1Score + 1;
      setPlayer1Score(newPlayer1Score);
    } else {
      newPlayer2Score = player2Score + 1;
      setPlayer2Score(newPlayer2Score);
    }
    
    // Vérifier si quelqu'un a gagné
    if (newPlayer1Score >= targetScore || newPlayer2Score >= targetScore) {
      setGameStep('gameOver');
    } else {
      selectRandomQuestion(); // Nouvelle question
    }
  };

  // Nouvelle question sans donner de point
  const newQuestion = () => {
    selectRandomQuestion();
  };

  // Retour vers la page des gages
  const goBackToGages = () => {
    navigate(`/GageApp/${encodeURIComponent(player1Name)}/${encodeURIComponent(player2Name)}`);
  };

  return (
    <div className="min-h-screen p-4" style={{backgroundColor: '#001B2E'}}>
      {/* Header avec scores */}
      <div className="flex justify-between items-center mb-8">
        {/* Score Joueur 1 */}
        <div className="text-center">
          <div className="cartoon-font text-2xl font-black mb-2" style={{
            color: '#FFEFD3',
            textShadow: '2px 2px 0px #294C60'
          }}>
            {player1Name}
          </div>
          <div className="w-24 h-24 rounded-2xl border-6 flex flex-col items-center justify-center" style={{
            backgroundColor: '#FFC49B',
            borderColor: '#294C60',
            boxShadow: '6px 6px 0px #ADB6C4'
          }}>
            <span className="cartoon-font text-3xl font-black" style={{
              color: '#001B2E',
              textShadow: '2px 2px 0px #FFEFD3'
            }}>
              {player1Score}
            </span>
            <span className="cartoon-font text-sm font-bold" style={{
              color: '#001B2E',
              textShadow: '1px 1px 0px #FFEFD3'
            }}>
              /{targetScore}
            </span>
          </div>
        </div>

        {/* Titre central */}
        <div className="text-center">
          <h1 className="cartoon-font text-5xl font-black transform -rotate-1" style={{
            color: '#FFC49B',
            textShadow: '4px 4px 0px #294C60, 8px 8px 0px #001B2E'
          }}>
            QUESTIONS
          </h1>
        </div>

        {/* Score Joueur 2 */}
        <div className="text-center">
          <div className="cartoon-font text-2xl font-black mb-2" style={{
            color: '#FFEFD3',
            textShadow: '2px 2px 0px #294C60'
          }}>
            {player2Name}
          </div>
          <div className="w-24 h-24 rounded-2xl border-6 flex flex-col items-center justify-center" style={{
            backgroundColor: '#FFC49B',
            borderColor: '#294C60',
            boxShadow: '6px 6px 0px #ADB6C4'
          }}>
            <span className="cartoon-font text-3xl font-black" style={{
              color: '#001B2E',
              textShadow: '2px 2px 0px #FFEFD3'
            }}>
              {player2Score}
            </span>
            <span className="cartoon-font text-sm font-bold" style={{
              color: '#001B2E',
              textShadow: '1px 1px 0px #FFEFD3'
            }}>
              /{targetScore}
            </span>
          </div>
        </div>
      </div>

      {/* Zone principale */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          
          {/* Affichage de la catégorie et de la question (visible sauf en fin de partie) */}
          {gameStep !== 'gameOver' && (
            <div className="text-center mb-8">
              <div className="cartoon-font text-xl font-black mb-4 px-6 py-3 rounded-2xl border-4 inline-block" style={{
                backgroundColor: '#294C60',
                color: '#FFC49B',
                borderColor: '#FFC49B',
                textShadow: '2px 2px 0px #001B2E',
                boxShadow: '6px 6px 0px #ADB6C4'
              }}>
                {currentQuestion?.category || 'Catégorie'}
              </div>
              
              <div className="cartoon-font text-3xl font-black mt-6 px-8 py-6 rounded-3xl border-8" style={{
                backgroundColor: '#FFC49B',
                color: '#001B2E',
                borderColor: '#294C60',
                textShadow: '3px 3px 0px #FFEFD3',
                boxShadow: '12px 12px 0px #ADB6C4',
                lineHeight: '1.2'
              }}>
                {currentQuestion?.text || 'Question en cours de chargement...'}
              </div>

              {/* Indication du joueur ciblé */}
              <div className="cartoon-font mt-4 text-lg font-bold px-4 py-2 rounded-xl inline-block" style={{
                backgroundColor: '#FFEFD3',
                color: '#001B2E',
                textShadow: '1px 1px 0px #ADB6C4'
              }}>
                Question sur : {targetPlayer === 'player1' ? player1Name : player2Name}
              </div>
            </div>
          )}

          {/* Étape: Réponse Joueur 1 */}
          {gameStep === 'player1' && (
            <div className="text-center">
              <h2 className="cartoon-font text-4xl font-black mb-6 transform rotate-1" style={{
                color: '#FFEFD3',
                textShadow: '4px 4px 0px #294C60'
              }}>
                {player1Name}, à toi !
              </h2>

              <div className="space-y-6">
                <input
                  type="text"
                  value={player1Answer}
                  onChange={(e) => setPlayer1Answer(e.target.value)}
                  placeholder="Ta réponse ici..."
                  className="cartoon-font w-full px-6 py-4 rounded-2xl text-center font-black text-xl border-6 focus:outline-none focus:ring-4"
                  style={{
                    backgroundColor: '#FFEFD3',
                    color: '#001B2E',
                    borderColor: '#FFC49B',
                    textShadow: '2px 2px 0px #ADB6C4',
                    boxShadow: '6px 6px 0px #ADB6C4'
                  }}
                  autoFocus
                />
                
                <button
                  onClick={nextStep}
                  disabled={!player1Answer.trim()}
                  className="cartoon-font font-black py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-110 hover:rotate-1 border-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: player1Answer.trim() ? '#FFC49B' : '#ADB6C4',
                    color: '#001B2E',
                    borderColor: player1Answer.trim() ? '#294C60' : '#294C60',
                    textShadow: '2px 2px 0px #FFEFD3',
                    boxShadow: '8px 8px 0px #ADB6C4'
                  }}
                >
                  VALIDER !
                </button>
              </div>
            </div>
          )}

          {/* Étape: Réponse Joueur 2 */}
          {gameStep === 'player2' && (
            <div className="text-center">
              <h2 className="cartoon-font text-4xl font-black mb-6 transform -rotate-1" style={{
                color: '#FFEFD3',
                textShadow: '4px 4px 0px #294C60'
              }}>
                {player2Name}, à toi !
              </h2>
              
              <div className="cartoon-font mb-4 text-lg font-bold" style={{
                color: '#FFC49B',
                textShadow: '2px 2px 0px #001B2E'
              }}>
                {player1Name} a donné sa réponse !
              </div>

              <div className="space-y-6">
                <input
                  type="text"
                  value={player2Answer}
                  onChange={(e) => setPlayer2Answer(e.target.value)}
                  placeholder="Ta réponse ici..."
                  className="cartoon-font w-full px-6 py-4 rounded-2xl text-center font-black text-xl border-6 focus:outline-none focus:ring-4"
                  style={{
                    backgroundColor: '#FFEFD3',
                    color: '#001B2E',
                    borderColor: '#FFC49B',
                    textShadow: '2px 2px 0px #ADB6C4',
                    boxShadow: '6px 6px 0px #ADB6C4'
                  }}
                  autoFocus
                />
                
                <button
                  onClick={nextStep}
                  disabled={!player2Answer.trim()}
                  className="cartoon-font font-black py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-110 hover:rotate-1 border-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: player2Answer.trim() ? '#FFC49B' : '#ADB6C4',
                    color: '#001B2E',
                    borderColor: player2Answer.trim() ? '#294C60' : '#294C60',
                    textShadow: '2px 2px 0px #FFEFD3',
                    boxShadow: '8px 8px 0px #ADB6C4'
                  }}
                >
                  VALIDER !
                </button>
              </div>
            </div>
          )}

          {/* Étape: Comparaison des réponses */}
          {gameStep === 'comparison' && (
            <div className="text-center">
              <h2 className="cartoon-font text-4xl font-black mb-8 transform rotate-1" style={{
                color: '#FFEFD3',
                textShadow: '4px 4px 0px #294C60'
              }}>
                COMPARAISON !
              </h2>
              
              <div className="space-y-6 mb-8">
                {/* Réponse Joueur 1 */}
                <div className="px-6 py-4 rounded-2xl border-6" style={{
                  backgroundColor: '#294C60',
                  borderColor: '#FFC49B',
                  boxShadow: '8px 8px 0px #ADB6C4'
                }}>
                  <div className="cartoon-font text-lg font-black mb-2" style={{
                    color: '#FFC49B',
                    textShadow: '2px 2px 0px #001B2E'
                  }}>
                    {player1Name} :
                  </div>
                  <div className="cartoon-font text-xl font-bold" style={{
                    color: '#FFEFD3',
                    textShadow: '2px 2px 0px #001B2E'
                  }}>
                    "{player1Answer}"
                  </div>
                </div>
                
                {/* Réponse Joueur 2 */}
                <div className="px-6 py-4 rounded-2xl border-6" style={{
                  backgroundColor: '#294C60',
                  borderColor: '#FFC49B',
                  boxShadow: '8px 8px 0px #ADB6C4'
                }}>
                  <div className="cartoon-font text-lg font-black mb-2" style={{
                    color: '#FFC49B',
                    textShadow: '2px 2px 0px #001B2E'
                  }}>
                    {player2Name} :
                  </div>
                  <div className="cartoon-font text-xl font-bold" style={{
                    color: '#FFEFD3',
                    textShadow: '2px 2px 0px #001B2E'
                  }}>
                    "{player2Answer}"
                  </div>
                </div>
              </div>
              
              {/* Boutons de scoring */}
              <div className="space-y-4">
                <div className="cartoon-font text-2xl font-black mb-4" style={{
                  color: '#FFC49B',
                  textShadow: '3px 3px 0px #001B2E'
                }}>
                  QUI GAGNE LE POINT ?
                </div>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => givePoint('player1')}
                    className="cartoon-font font-black py-3 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-110 hover:rotate-1 border-4"
                    style={{
                      backgroundColor: '#FFC49B',
                      color: '#001B2E',
                      borderColor: '#294C60',
                      textShadow: '2px 2px 0px #FFEFD3',
                      boxShadow: '6px 6px 0px #ADB6C4'
                    }}
                  >
                    {player1Name}
                  </button>
                  
                  <button
                    onClick={() => givePoint('player2')}
                    className="cartoon-font font-black py-3 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-110 hover:rotate-1 border-4"
                    style={{
                      backgroundColor: '#FFC49B',
                      color: '#001B2E',
                      borderColor: '#294C60',
                      textShadow: '2px 2px 0px #FFEFD3',
                      boxShadow: '6px 6px 0px #ADB6C4'
                    }}
                  >
                    {player2Name}
                  </button>
                  
                  <button
                    onClick={newQuestion}
                    className="cartoon-font font-black py-3 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-110 border-4"
                    style={{
                      backgroundColor: '#ADB6C4',
                      color: '#001B2E',
                      borderColor: '#294C60',
                      textShadow: '2px 2px 0px #FFEFD3',
                      boxShadow: '6px 6px 0px #294C60'
                    }}
                  >
                    ÉGALITÉ
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Étape: Fin de partie */}
          {gameStep === 'gameOver' && (
            <div className="text-center">
              <h2 className="cartoon-font text-6xl font-black mb-8 transform rotate-2" style={{
                color: '#FFC49B',
                textShadow: '6px 6px 0px #294C60, 12px 12px 0px #001B2E'
              }}>
                PARTIE TERMINÉE !
              </h2>
              
              {/* Affichage du gagnant */}
              <div className="mb-8">
                <div className="cartoon-font text-4xl font-black mb-4 transform -rotate-1" style={{
                  color: '#FFEFD3',
                  textShadow: '4px 4px 0px #294C60'
                }}>
                  🏆 GAGNANT : {player1Score >= targetScore ? player1Name : player2Name} ! 🏆
                </div>
                
                <div className="cartoon-font text-2xl font-bold mb-6" style={{
                  color: '#ADB6C4',
                  textShadow: '2px 2px 0px #001B2E'
                }}>
                  Score final : {player1Score} - {player2Score}
                </div>
              </div>
              
              {/* Gage pour le perdant */}
              <div className="mb-8">
                <h3 className="cartoon-font text-3xl font-black mb-4 transform rotate-1" style={{
                  color: '#FFC49B',
                  textShadow: '3px 3px 0px #001B2E'
                }}>
                  GAGE POUR {player1Score >= targetScore ? player2Name : player1Name} :
                </h3>
                
                <div className="px-8 py-6 rounded-3xl border-8 mx-auto max-w-lg" style={{
                  backgroundColor: '#FFC49B',
                  borderColor: '#294C60',
                  boxShadow: '12px 12px 0px #ADB6C4'
                }}>
                  <p className="cartoon-font text-2xl font-black transform -rotate-1" style={{
                    color: '#001B2E',
                    textShadow: '3px 3px 0px #FFEFD3',
                    lineHeight: '1.3'
                  }}>
                    {currentGage}
                  </p>
                </div>
              </div>
              
              {/* Boutons d'action */}
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setPlayer1Score(0);
                    setPlayer2Score(0);
                    selectRandomQuestion();
                  }}
                  className="cartoon-font font-black py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-110 hover:rotate-1 border-6 mr-4"
                  style={{
                    backgroundColor: '#FFEFD3',
                    color: '#001B2E',
                    borderColor: '#FFC49B',
                    textShadow: '2px 2px 0px #FFC49B',
                    boxShadow: '8px 8px 0px #ADB6C4'
                  }}
                >
                  REJOUER !
                </button>
                
                <button
                  onClick={goBackToGages}
                  className="cartoon-font font-black py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-110 hover:rotate-1 border-6"
                  style={{
                    backgroundColor: '#294C60',
                    color: '#FFC49B',
                    borderColor: '#FFC49B',
                    textShadow: '2px 2px 0px #001B2E',
                    boxShadow: '8px 8px 0px #ADB6C4'
                  }}
                >
                  RETOUR AUX GAGES
                </button>
              </div>
            </div>
          )}
          
          {/* Bouton nouvelle question (visible sauf en comparaison et fin de partie) */}
          {gameStep !== 'comparison' && gameStep !== 'gameOver' && (
            <div className="text-center mt-8">
              <button
                onClick={newQuestion}
                className="cartoon-font font-black py-3 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 border-4"
                style={{
                  backgroundColor: '#294C60',
                  color: '#FFEFD3',
                  borderColor: '#FFC49B',
                  textShadow: '2px 2px 0px #001B2E',
                  boxShadow: '6px 6px 0px #ADB6C4'
                }}
              >
                NOUVELLE QUESTION
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionApp;