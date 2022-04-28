'use strict';

// Connect
const socket = io();

// Initialise game variable
let game;

// Main game loop
const gameloop = function () {
    // If there is a game, draw it to the canvas
    if (game) game.draw();
    window.requestAnimationFrame(gameloop);
};
window.requestAnimationFrame(gameloop);

const getPlayerScore = function (score) {
    let playerScore = "";

    Array(7 - score).fill().map(() => {
        playerScore += `<img src='/img/eight-ball.png'>`;
    })
    Array(score).fill().map(() => {
        playerScore += '<div class="bin-ball"></div>'
    })
    return playerScore;
}

// Join queue button click event
$('#btn-joinQueue').click(() => {
    // Send queue join event to server
    socket.emit('queue-join');
    // Show the queue
    showQueue();
});

// Leave queue button click event
$('#btn-leaveQueue').click(() => {
    // Send queue leave event to server
    socket.emit('queue-leave');
    // Show the menu
    showMenu();
});

// Show menu button click event
$('#btn-showMenu').click(showMenu);

// Shoot function
const shoot = function (power, angle) {
    // Send shoot event to server
    socket.emit('shoot', { power, angle });
};


// Game start event listener
socket.on('game-start', (data) => {

    // Create a new game with the data
    game = new Game(data);
    // Display player and opponent names
    $('#playerUserAvatar').html(`<img src="/img/user${game.player.id}.png">`);
    $('#opponentUserAvatar').html(`<img src="/img/user${game.opponent.id}.png">`);

    // Display player and opponent scores
    let playerScore = getPlayerScore(game.player.score);
    let opponentScore = getPlayerScore(game.opponent.score);;

    $('#playerScore').html(playerScore);
    $('#opponentScore').html(opponentScore);

    // Display  and opponent colours
    $('#playerColour').css('background-color', game.player.colour);
    $('#opponentColour').css('background-color', game.opponent.colour);

    // If player's turn
    if (game.turn) {
        $('#playerStict').css('visibility', 'visible');
        $('#opponentStict').css('visibility', 'hidden');
    // If opponent's turn
    } else {
        $('#playerStict').css('visibility', 'hidden');
        $('#opponentStict').css('visibility', 'visible');
    }

    // Show the game
    showGame();

});

// Game update event listener
socket.on('game-update', (data) => {
    // Update current game with the data
    if (game) game.update(data);
});

// Game turn update event listener
socket.on('game-updateTurn', (data) => {
    if (game) {

        // Update current game turns with the data
        game.updateTurn(data);

        // Update player and oppoenent scores
        let playerScore = getPlayerScore(game.player.score);
        let opponentScore = getPlayerScore(game.opponent.score);;
    
        $('#playerScore').html(playerScore);
        $('#opponentScore').html(opponentScore);

        // Update player and opponent colours
        $('#playerColour').css('background-color', game.player.colour);
        $('#opponentColour').css('background-color', game.opponent.colour);

        // If player's turn
        if (game.turn) {
            $('#playerStict').css('visibility', 'visible');
            $('#opponentStict').css('visibility', 'hidden');
        // If opponent's turn
        } else {
            $('#playerStict').css('visibility', 'hidden');
            $('#opponentStict').css('visibility', 'visible');
        }
    }
});

// Game end event listener
socket.on('game-end', (data) => {

    // If player has won, display win text
    if (data.winner) {
        $('#endMsg').text('You have Won!');
    // If player has lost, display lose text
    } else {
        $('#endMsg').text('You have Lost!');
    }

    game = null;

    // Show game ending
    showGameEnd();

});