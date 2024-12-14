const states = {
    score: {
        playerScore: 0,
        computerScore: 0,
        playerScoreById: document.getElementById("player_score"),
        computerScoreById: document.getElementById("computer_score")
    },
    cardSprites: {
        avatar: document.getElementById("avatar_card"),
        name: document.getElementById("card_name"),
        type: document.getElementById("card_type")
    },
    fieldCards: {
        player: document.getElementById("player_cards"),
        computer: document.getElementById("computer_cards"),
    },
    fieldsBox: {
        playerBox: document.querySelector("#player_field_card"),
        computerBox: document.querySelector("#computer_field_card")
    },
    actions: {
        button: document.getElementById("next_duel_button")
    }
}

const pathImage = "./src/assets/icons/"

const cardData = [
    {
        id: 0,
        type: "Paper",
        name: "Blue-Eyes White Dragon",
        img: `${pathImage}dragon.png`,
        winOf: [1],
        loseOf: [2]
    },
    {
        id: 1,
        type: "Rock",
        name: "Dark magician",
        img: `${pathImage}magician.png`,
        winOf: [2],
        loseOf: [0]
    },
    {
        id: 2,
        type: "Scissors",
        name: "Exodia",
        img: `${pathImage}exodia.png`,
        winOf: [0],
        loseOf: [1]
    }
]

async function playAudio(audioName) {
    const audio = new Audio(`./src/assets/audios/${audioName}.wav`);
    audio.play();
}

async function checkDuelResults(playerCardId, computerCardId) {
    let result = "Draw";

    if (cardData[playerCardId].winOf.includes(computerCardId)) {
        result = "Win";
        states.score.playerScore++;
    }

    if (cardData[playerCardId].loseOf.includes(computerCardId)) {
        result = "Lose";
        states.score.computerScore++;
    }

    playAudio(result);

    return result;
}

async function removeAllCardsImages() {
    let playerBox = states.fieldCards.player;
    let computerBox = states.fieldCards.computer;

    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = playerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawButton(result) {
    states.actions.button.innerText = result.toUpperCase() + "!";
    states.actions.button.style.display = "block";
}

async function setCardsField(cardId) {
    removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    states.fieldsBox.computerBox.style.display = "block";
    states.fieldsBox.playerBox.style.display = "block";

    states.fieldsBox.playerBox.src = cardData[cardId].img;
    states.fieldsBox.computerBox.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function updateScore() {
    states.score.computerScoreById.innerText = states.score.computerScore;
    states.score.playerScoreById.innerText = states.score.playerScore;
}

async function getRandomCardId() {
    const numberIndex = Math.floor(Math.random() * cardData.length);

    return cardData[numberIndex].id;
}

async function drawSelectCard(cardIndex) {
    states.cardSprites.avatar.src = cardData[cardIndex].img;
    states.cardSprites.name.innerText = cardData[cardIndex].name;
    states.cardSprites.type.innerText = "Attribute: " + cardData[cardIndex].type;
}

async function createCardImageById(cardId, field) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "120%");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", cardId);
    cardImage.classList.add("card");

    if (field === states.fieldCards.player) {
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        })
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(cardId);
        })
    }

    return cardImage;
}

async function drawCards(numberCards, field) {
    for (let i=0; i<numberCards; i++) {
        const randomCardId = await getRandomCardId();
        const cardImageById = await createCardImageById(randomCardId, field);

        field.appendChild(cardImageById);
    }
}

async function resetDuel() {
    states.cardSprites.avatar.src = "";
    states.actions.button.style.display = "none";

    states.fieldsBox.computerBox.style.display = "none";
    states.fieldsBox.playerBox.style.display = "none";

    states.cardSprites.name.innerText = "Name";
    states.cardSprites.type.innerText = "Atribute";

    main()
}

function main() {
    const bgm = document.getElementById("bgm");
    bgm.play();
    
    states.fieldsBox.computerBox.style.display = "none";
    states.fieldsBox.playerBox.style.display = "none";

    drawCards(5, states.fieldCards.player);
    drawCards(5, states.fieldCards.computer);
}

main();