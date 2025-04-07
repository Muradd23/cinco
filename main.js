document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const toggleRulesBtn = document.getElementById('toggle-rules');
    const rulesContent = document.getElementById('rules-content');
    const drawCardBtn = document.getElementById('draw-card');
    const endGameBtn = document.getElementById('end-game');
    const centralDeck = document.getElementById('central-deck');
    const discardPile = document.getElementById('discard-pile');
    const playerCardsContainer = document.getElementById('player-cards');
    const opponentsArea = document.getElementById('opponents-area');
    const deckCount = document.getElementById('deck-count');
    const discardCount = document.getElementById('discard-count');
    const gameStatus = document.getElementById('game-status');
    
    // Modales
    const cardSelectionModal = document.getElementById('card-selection-modal');
    const modalCardsContainer = document.getElementById('modal-cards');
    const cancelSelectionBtn = document.getElementById('cancel-selection');
    const initialSelectionModal = document.getElementById('initial-selection-modal');
    const initialSelectionCards = document.getElementById('initial-selection-cards');
    const confirmSelectionBtn = document.getElementById('confirm-selection');
    const gameResultModal = document.getElementById('game-result-modal');
    const resultTitle = document.getElementById('result-title');
    const resultContent = document.getElementById('result-content');
    const closeResultBtn = document.getElementById('close-result');

    // Estado del juego
    let gameState = {
        players: [],
        currentPlayer: null,
        deck: [],
        discardPile: [],
        gameStarted: false,
        gameEnded: false,
        currentDrawnCard: null,
        selectedCards: []
    };

    // Mostrar/ocultar reglas
    toggleRulesBtn.addEventListener('click', function() {
        rulesContent.classList.toggle('hidden');
        toggleRulesBtn.textContent = rulesContent.classList.contains('hidden') ? 
            'Mostrar Reglas' : 'Ocultar Reglas';
    });

    // Inicializar el juego (simulación)
     function initGame() {
          //Simular jugadores (en un juego real esto vendría del servidor)
         gameState.players = [
             { id: 'player1', name: 'Jugador 1', cards: [], isPlayer: true },
             { id: 'player2', name: 'Jugador 2', cards: [], isPlayer: false },
             { id: 'player3', name: 'Jugador 3', cards: [], isPlayer: false }
         ];
        
          //Simular mazo de cartas (valores del 1 al 5)
         gameState.deck = Array.from({length: 20}, (_, i) => ({
             id: `card-${i}`,
             value: Math.floor(Math.random() * 5) + 1,
             skill: Math.random() > 0.7 ? 'Habilidad especial' : null
         }));
        
          //Repartir cartas
         gameState.players.forEach(player => {
             player.cards = [];
             for (let i = 0; i < 5; i++) {
                 if (gameState.deck.length > 0) {
                     player.cards.push({
                         ...gameState.deck.pop(),
                         faceUp: false
                     });
                 }
             }
         });
        
          //Actualizar UI
         updateGameUI();
        
          //Mostrar selección inicial de cartas para el jugador humano
         showInitialCardSelection();
        
          //Simular que el juego ha comenzado
         gameState.gameStarted = true;
         gameState.currentPlayer = 'player1';  //Suponemos que el jugador humano es player1
         gameStatus.textContent = 'Es tu turno';
         drawCardBtn.disabled = false;
     }

    // Actualizar la interfaz de usuario
    function updateGameUI() {
        // Actualizar contadores
        deckCount.textContent = gameState.deck.length;
        discardCount.textContent = gameState.discardPile.length;
        
        // Mostrar cartas del jugador
        renderPlayerCards();
        
        // Mostrar oponentes
        renderOpponents();
        
        // Mostrar pozo (si hay cartas)
        renderDiscardPile();
    }

    // Renderizar cartas del jugador
    function renderPlayerCards() {
        playerCardsContainer.innerHTML = '';
        const player = gameState.players.find(p => p.isPlayer);
        
        if (player) {
            player.cards.forEach((card, index) => {
                const cardElement = createCardElement(card, index, true);
                playerCardsContainer.appendChild(cardElement);
            });
        }
    }

    // Renderizar oponentes
    function renderOpponents() {
        opponentsArea.innerHTML = '';
        const opponents = gameState.players.filter(p => !p.isPlayer);
        
        opponents.forEach(opponent => {
            const opponentElement = document.createElement('div');
            opponentElement.className = 'opponent';
            opponentElement.innerHTML = `<h3>${opponent.name}</h3>`;
            
            const cardsContainer = document.createElement('div');
            cardsContainer.className = 'opponent-cards';
            
            opponent.cards.forEach(card => {
                const cardElement = createCardElement(card, null, false);
                cardsContainer.appendChild(cardElement);
            });
            
            opponentElement.appendChild(cardsContainer);
            opponentsArea.appendChild(opponentElement);
        });
    }

    // Renderizar pozo de descarte
    function renderDiscardPile() {
        discardPile.innerHTML = '';
        discardPile.innerHTML = '<div class="pile-count">Pozo: <span id="discard-count">0</span></div>';
        
        if (gameState.discardPile.length > 0) {
            const topCard = gameState.discardPile[gameState.discardPile.length - 1];
            const cardElement = createCardElement(topCard, null, true);
            discardPile.appendChild(cardElement);
        }
    }

    // Crear elemento de carta
    function createCardElement(card, index, isPlayer) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        
        if (!card.faceUp && isPlayer) {
            cardElement.classList.add('card-face-down');
            cardElement.textContent = '?';
            cardElement.dataset.index = index;
        } else if (!card.faceUp) {
            cardElement.classList.add('card-face-down');
            cardElement.textContent = '?';
        } else {
            cardElement.innerHTML = `
                <div class="card-value">${card.value}</div>
                ${card.skill ? `<div class="card-skill">${card.skill}</div>` : ''}
            `;
            cardElement.dataset.value = card.value;
        }
        
        return cardElement;
    }

    // Mostrar selección inicial de cartas
    function showInitialCardSelection() {
        initialSelectionCards.innerHTML = '';
        const player = gameState.players.find(p => p.isPlayer);
        
        if (player) {
            player.cards.forEach((card, index) => {
                const cardElement = document.createElement('div');
                cardElement.className = 'card card-face-down';
                cardElement.textContent = '?';
                cardElement.dataset.index = index;
                
                cardElement.addEventListener('click', function() {
                    if (gameState.selectedCards.includes(index)) {
                        gameState.selectedCards = gameState.selectedCards.filter(i => i !== index);
                        cardElement.classList.remove('selected');
                    } else if (gameState.selectedCards.length < 2) {
                        gameState.selectedCards.push(index);
                        cardElement.classList.add('selected');
                    }
                    
                    confirmSelectionBtn.disabled = gameState.selectedCards.length !== 2;
                    confirmSelectionBtn.textContent = `Confirmar (${gameState.selectedCards.length}/2)`;
                });
                
                initialSelectionCards.appendChild(cardElement);
            });
            
            initialSelectionModal.classList.remove('hidden');
        }
    }

    // Confirmar selección inicial de cartas
    confirmSelectionBtn.addEventListener('click', function() {
        const player = gameState.players.find(p => p.isPlayer);
        
        if (player) {
            gameState.selectedCards.forEach(index => {
                player.cards[index].faceUp = true;
            });
            
            initialSelectionModal.classList.add('hidden');
            updateGameUI();
        }
    });

    // Robar carta
    drawCardBtn.addEventListener('click', function() {
        if (gameState.deck.length > 0) {
            const drawnCard = gameState.deck.pop();
            gameState.currentDrawnCard = drawnCard;
            
            // Mostrar opciones para la carta robada
            showCardOptions(drawnCard);
        } else {
            alert('No quedan cartas en el mazo!');
        }
    });

    // Mostrar opciones para carta robada
    function showCardOptions(card) {
        const player = gameState.players.find(p => p.isPlayer);
        
        // Crear modal de selección
        modalCardsContainer.innerHTML = '';
        
        // Opción 1: Intercambiar por una carta boca abajo
        const faceDownCards = player.cards
            .map((c, i) => ({card: c, index: i}))
            .filter(({card}) => !card.faceUp);
        
        if (faceDownCards.length > 0) {
            const optionTitle = document.createElement('h4');
            optionTitle.textContent = 'Intercambiar por una carta boca abajo:';
            modalCardsContainer.appendChild(optionTitle);
            
            faceDownCards.forEach(({index}) => {
                const cardElement = document.createElement('div');
                cardElement.className = 'card card-face-down';
                cardElement.textContent = '?';
                cardElement.dataset.index = index;
                
                cardElement.addEventListener('click', function() {
                    // Intercambiar cartas
                    const oldCard = player.cards[index];
                    player.cards[index] = {...card, faceUp: true};
                    gameState.discardPile.push(oldCard);
                    
                    // Cerrar modal y actualizar UI
                    cardSelectionModal.classList.add('hidden');
                    updateGameUI();
                    endTurn();
                });
                
                modalCardsContainer.appendChild(cardElement);
            });
        }
        
        // Opción 2: Quemar la carta
        const burnOption = document.createElement('div');
        burnOption.className = 'burn-option';
        burnOption.innerHTML = `
            <h4>Opciones:</h4>
            <button id="burn-card" class="action-btn">Quemar Carta</button>
            ${card.skill ? `<button id="use-skill" class="action-btn">Usar Habilidad (${card.skill})</button>` : ''}
        `;
        modalCardsContainer.appendChild(burnOption);
        
        document.getElementById('burn-card').addEventListener('click', function() {
            gameState.discardPile.push(card);
            cardSelectionModal.classList.add('hidden');
            updateGameUI();
            endTurn();
        });
        
        if (card.skill) {
            document.getElementById('use-skill').addEventListener('click', function() {
                alert(`Habilidad especial usada: ${card.skill}`);
                // Aquí iría la lógica de la habilidad
                gameState.discardPile.push(card);
                cardSelectionModal.classList.add('hidden');
                updateGameUI();
                endTurn();
            });
        }
        
        // Mostrar modal
        cardSelectionModal.classList.remove('hidden');
    }

    // Cancelar selección de carta
    cancelSelectionBtn.addEventListener('click', function() {
        cardSelectionModal.classList.add('hidden');
    });

    // Terminar turno
    function endTurn() {
        // Verificar si el jugador puede eliminar una carta (si tiene la última del pozo)
        const player = gameState.players.find(p => p.isPlayer);
        const lastDiscard = gameState.discardPile[gameState.discardPile.length - 1];
        
        if (lastDiscard && player.cards.some(c => c.id === lastDiscard.id)) {
            if (confirm('Tienes la última carta del pozo en tu mano. ¿Quieres eliminar una carta de tu mazo?')) {
                showCardEliminationOptions();
                return;
            }
        }
        
        // Simular turno de otros jugadores (en un juego real esto lo manejaría el servidor)
        simulateOpponentTurns();
    }

    // Mostrar opciones para eliminar carta
    function showCardEliminationOptions() {
        const player = gameState.players.find(p => p.isPlayer);
        
        modalCardsContainer.innerHTML = '<h3>Selecciona una carta para eliminar</h3>';
        
        player.cards.forEach((card, index) => {
            const cardElement = createCardElement(card, index, true);
            
            cardElement.addEventListener('click', function() {
                // Eliminar la carta seleccionada
                player.cards.splice(index, 1);
                
                // Cerrar modal y actualizar UI
                cardSelectionModal.classList.add('hidden');
                updateGameUI();
                
                // Continuar con el turno de los oponentes
                simulateOpponentTurns();
            });
            
            modalCardsContainer.appendChild(cardElement);
        });
        
        cardSelectionModal.classList.remove('hidden');
    }

    // Simular turnos de oponentes (en un juego real esto lo manejaría el servidor)
    function simulateOpponentTurns() {
        gameStatus.textContent = 'Turno de otros jugadores...';
        drawCardBtn.disabled = true;
        
        // Simular un retraso para los turnos de la IA
        setTimeout(() => {
            const opponents = gameState.players.filter(p => !p.isPlayer);
            
            opponents.forEach(opponent => {
                // Simular acciones de la IA (simplificado)
                if (gameState.deck.length > 0) {
                    const drawnCard = gameState.deck.pop();
                    
                    // IA simple: intercambia si la carta es mejor (valor más bajo)
                    const faceDownCards = opponent.cards
                        .map((c, i) => ({card: c, index: i}))
                        .filter(({card}) => !card.faceUp);
                    
                    if (faceDownCards.length > 0 && drawnCard.value < 3) {
                        // Intercambiar por una carta aleatoria boca abajo
                        const randomIndex = Math.floor(Math.random() * faceDownCards.length);
                        const oldCard = opponent.cards[faceDownCards[randomIndex].index];
                        opponent.cards[faceDownCards[randomIndex].index] = {...drawnCard, faceUp: true};
                        gameState.discardPile.push(oldCard);
                    } else {
                        // Quemar la carta
                        gameState.discardPile.push(drawnCard);
                    }
                }
            });
            
            // Volver al turno del jugador humano
            gameStatus.textContent = 'Es tu turno';
            drawCardBtn.disabled = false;
            updateGameUI();
        }, 2000);
    }

    // Terminar el juego
    endGameBtn.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que quieres terminar el juego? Se revelarán todas las cartas.')) {
            endGame();
        }
    });

    // Finalizar el juego y mostrar resultados
    function endGame() {
        // Revelar todas las cartas
        gameState.players.forEach(player => {
            player.cards.forEach(card => {
                card.faceUp = true;
            });
        });
        
        updateGameUI();
        
        // Calcular resultados
        const results = gameState.players.map(player => {
            const sum = player.cards.reduce((total, card) => total + card.value, 0);
            return {
                player: player.name,
                sum: sum,
                cards: player.cards
            };
        });
        
        // Ordenar por suma (menor a mayor)
        results.sort((a, b) => a.sum - b.sum);
        
        // Mostrar resultados
        showGameResults(results);
    }

    // Mostrar resultados del juego
    function showGameResults(results) {
        resultTitle.textContent = 'Resultado del Juego';
        resultContent.innerHTML = '';
        
        const winner = results.find(r => r.sum < 5) || results[0];
        
        const winnerElement = document.createElement('div');
        winnerElement.className = 'result-winner';
        winnerElement.innerHTML = `<h3>Ganador: ${winner.player} (Suma: ${winner.sum})</h3>`;
        resultContent.appendChild(winnerElement);
        
        const allResults = document.createElement('div');
        allResults.className = 'all-results';
        
        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'player-result';
            resultElement.innerHTML = `
                <h4>${result.player} - Suma: ${result.sum}</h4>
                <div class="result-cards">
                    ${result.cards.map(card => `
                        <div class="card">
                            <div class="card-value">${card.value}</div>
                            ${card.skill ? `<div class="card-skill">${card.skill}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
            allResults.appendChild(resultElement);
        });
        
        resultContent.appendChild(allResults);
        gameResultModal.classList.remove('hidden');
    }

    // Cerrar resultados
    closeResultBtn.addEventListener('click', function() {
        gameResultModal.classList.add('hidden');
    });

    // Iniciar el juego (simulación)
    initGame();
});