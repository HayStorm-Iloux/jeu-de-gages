import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gagesData from '../Json/gages.json';

const GageApp: React.FC = () => {
  const { player1, player2 } = useParams<{ player1: string; player2: string }>();
  const navigate = useNavigate();

  // États pour la gestion de la carte et du gage
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentGage, setCurrentGage] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [targetScore, setTargetScore] = useState<number>(15); // Score cible par défaut
  const [allGages, setAllGages] = useState<string[]>([]); // Liste de tous les gages

  // Décodage des noms
  const player1Name = player1 ? decodeURIComponent(player1) : 'Joueur 1';
  const player2Name = player2 ? decodeURIComponent(player2) : 'Joueur 2';

  // Initialisation des gages depuis l'import JSON
  useEffect(() => {
    const gagesList: string[] = [];
    gagesData.gages.forEach((category) => {
      category.items.forEach((gageText) => {
        gagesList.push(gageText);
      });
    });
    setAllGages(gagesList);
  }, []);

  const handleBackToSetup = () => {
    navigate('/');
  };

  const handleGoToQuestions = () => {
    // Utiliser le gage de la carte ou un gage par défaut si aucun n'est affiché
    const gageToUse = currentGage || getRandomGage();
    const encodedGage = encodeURIComponent(gageToUse);
    navigate(`/GageApp/${encodeURIComponent(player1Name)}/${encodeURIComponent(player2Name)}/QuestionApp/${targetScore}/${encodedGage}`);
  };

  const getRandomGage = () => {
    if (allGages.length === 0) return "Aucun gage disponible";
    const randomIndex = Math.floor(Math.random() * allGages.length);
    return allGages[randomIndex];
  };

  const handleLaunchGage = () => {
    if (isAnimating) return; // Empêche les clics multiples

    setIsAnimating(true);
    
    // Phase 1: Retour à la face avant si on est sur la face arrière
    if (isFlipped) {
      setIsFlipped(false);
      // Attendre que la carte revienne à la face avant
      setTimeout(() => {
        // Phase 2: Rotation vers l'arrière
        setIsFlipped(true);
        // Phase 3: Changement du contenu au milieu de cette rotation
        setTimeout(() => {
          const newGage = getRandomGage();
          setCurrentGage(newGage);
        }, 300);
        // Phase 4: Fin de l'animation
        setTimeout(() => {
          setIsAnimating(false);
        }, 600);
      }, 600);
    } else {
      // Si on est déjà sur la face avant, rotation directe
      setIsFlipped(true);
      // Phase 2: Changement du contenu au milieu de l'animation
      setTimeout(() => {
        const newGage = getRandomGage();
        setCurrentGage(newGage);
      }, 300);
      // Phase 3: Fin de l'animation
      setTimeout(() => {
        setIsAnimating(false);
      }, 600);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{backgroundColor: '#001B2E'}}>
      {/* En-tête */}
      <div className="text-center mb-8">
        <h1 className="text-6xl font-black mb-6 transform cartoon-font -rotate-1" style={{ 
          color: '#FFC49B',
          textShadow: '5px 5px 0px #294C60, 10px 10px 0px #001B2E'
        }}>
          JEU DE GAGES
        </h1>
        
        <div className="text-2xl font-black mb-4 cartoon-font" style={{
          color: '#FFEFD3',
          textShadow: '3px 3px 0px #294C60'
        }}>
          {player1Name} VS {player2Name}
        </div>

        {/* Sélecteur de score cible */}
        <div className="text-center mt-8">
          <h3 className="text-2xl font-black mb-4 transform rotate-1 cartoon-font" style={{
            color: '#FFEFD3',
            textShadow: '3px 3px 0px #294C60'
          }}>
            NOMBRE DE POINTS POUR GAGNER :
          </h3>
          
          <div className="flex gap-4 justify-center">
            {[10, 15, 20, 30].map((score) => (
              <button
                key={score}
                onClick={() => setTargetScore(score)}
                className={`font-black cartoon-font py-3 px-6 rounded-2xl text-xl transition-all duration-300 transform hover:scale-110 hover:rotate-1 border-6 ${
                  targetScore === score ? 'scale-110' : ''
                }`}
                style={{
                  backgroundColor: targetScore === score ? '#FFC49B' : '#294C60',
                  color: targetScore === score ? '#001B2E' : '#FFC49B',
                  borderColor: '#FFC49B',
                  textShadow: targetScore === score ? '2px 2px 0px #FFEFD3' : '2px 2px 0px #001B2E',
                  boxShadow: targetScore === score ? '8px 8px 0px #ADB6C4' : '6px 6px 0px #ADB6C4'
                }}
                onMouseEnter={(e) => {
                  if (targetScore !== score) {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#FFC49B';
                    (e.target as HTMLButtonElement).style.color = '#001B2E';
                    (e.target as HTMLButtonElement).style.textShadow = '2px 2px 0px #FFEFD3';
                  }
                }}
                onMouseLeave={(e) => {
                  if (targetScore !== score) {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#294C60';
                    (e.target as HTMLButtonElement).style.color = '#FFC49B';
                    (e.target as HTMLButtonElement).style.textShadow = '2px 2px 0px #001B2E';
                  }
                }}
              >
                {score}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Carte de gage */}
      <div className="mb-8">
        <div 
          className="relative w-80 h-60 cursor-pointer"
          style={{
            perspective: '1000px'
          }}
        >
          <div
            className="w-full h-full transition-transform duration-600 transform-style-preserve-3d"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.6s ease-in-out'
            }}
          >
            {/* Face avant - Titre "Gage" */}
            <div
              className="absolute inset-0 w-full h-full rounded-3xl border-8 flex items-center justify-center"
              style={{
                backgroundColor: '#294C60',
                borderColor: '#FFC49B',
                boxShadow: '12px 12px 0px #ADB6C4',
                backfaceVisibility: 'hidden'
              }}
            >
              <h2 className="text-5xl font-black transform rotate-2 cartoon-font" style={{
                color: '#FFC49B',
                textShadow: '4px 4px 0px #001B2E, 8px 8px 0px #ADB6C4'
              }}>
                GAGE
              </h2>
            </div>

            {/* Face arrière - Gage affiché */}
            <div
              className="absolute inset-0 w-full h-full rounded-3xl border-8 flex items-center justify-center p-6"
              style={{
                backgroundColor: '#FFC49B',
                borderColor: '#294C60',
                boxShadow: '12px 12px 0px #ADB6C4',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <p className="text-xl font-black text-center transform -rotate-1 cartoon-font" style={{
                color: '#001B2E',
                textShadow: '2px 2px 0px #FFEFD3',
                lineHeight: '1.3'
              }}>
                {currentGage || "Clique sur 'Lancer le gage' !"}
              </p>
            </div>
          </div>
        </div>

        {/* Boutons de contrôle */}
        <div className="flex justify-center mt-6 w-full">
          <div className="flex gap-6 justify-center items-center">
            <button
              onClick={handleLaunchGage}
              disabled={isAnimating}
              className="font-black py-4 px-8 cartoon-font rounded-2xl text-xl transition-all duration-300 transform hover:scale-110 hover:rotate-1 border-6 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isAnimating ? '#ADB6C4' : '#FFEFD3',
                color: '#001B2E',
                borderColor: '#FFC49B',
                textShadow: '2px 2px 0px #FFC49B',
                boxShadow: '8px 8px 0px #ADB6C4'
              }}
              onMouseEnter={(e) => {
                if (!isAnimating) {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#FFC49B';
                  (e.target as HTMLButtonElement).style.boxShadow = '12px 12px 0px #ADB6C4';
                }
              }}
              onMouseLeave={(e) => {
                if (!isAnimating) {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#FFEFD3';
                  (e.target as HTMLButtonElement).style.boxShadow = '8px 8px 0px #ADB6C4';
                }
              }}
            >
              {isAnimating ? 'LANCEMENT...' : 'LANCER LE GAGE !'}
            </button>

            <button
              onClick={handleGoToQuestions}
              className="font-black py-4 px-6 cartoon-font rounded-2xl text-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-1 border-6"
              style={{
                backgroundColor: '#294C60',
                color: '#FFC49B',
                borderColor: '#FFC49B',
                textShadow: '2px 2px 0px #001B2E',
                boxShadow: '8px 8px 0px #ADB6C4'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#FFC49B';
                (e.target as HTMLButtonElement).style.color = '#001B2E';
                (e.target as HTMLButtonElement).style.boxShadow = '12px 12px 0px #ADB6C4';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#294C60';
                (e.target as HTMLButtonElement).style.color = '#FFC49B';
                (e.target as HTMLButtonElement).style.boxShadow = '8px 8px 0px #ADB6C4';
              }}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Bouton retour */}
      <button
        onClick={handleBackToSetup}
        className="font-black py-3 px-8 rounded-3xl text-lg transition-all duration-300 transform hover:scale-110 hover:rotate-1 border-4 cartoon-font"
        style={{
          backgroundColor: '#FFC49B',
          color: '#001B2E',
          borderColor: '#294C60',
          textShadow: '2px 2px 0px #FFEFD3',
          boxShadow: '8px 8px 0px #294C60'
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = '#FFEFD3';
          (e.target as HTMLButtonElement).style.boxShadow = '12px 12px 0px #294C60';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = '#FFC49B';
          (e.target as HTMLButtonElement).style.boxShadow = '8px 8px 0px #294C60';
        }}
      >
        RETOUR À L'ACCUEIL
      </button>
    </div>
  );
};

export default GageApp;