const opponentSeats = document.querySelectorAll(".opponent-player.seat");
const clientSeat = document.querySelector(".client-player.seat");
const communitySeat = document.querySelector(".pot-area");

const addButtons = (seatEl) => {
    const buttons = document.createElement("div");
    buttons.classList.add("buttons");
    buttons.innerHTML = `<button class="show">Show</button><button class="hide">Hide</button><button class="add-card">Add Card</button><button class="remove-card">Remove Card</button><button class="reduce-size">-</button><button class="increase-size">+</button>`;
    seatEl.appendChild(buttons);

    const playerEl = seatEl.querySelector(".player");
    // const cardsEl = seatEl.querySelector(".cards");
    buttons
        .querySelector("button.show")
        .addEventListener("pointerdown", (event) => {
            playerEl.style.display = "block";
            resizeCards();
        });
    buttons
        .querySelector("button.hide")
        .addEventListener("pointerdown", (event) => {
            // remove all cards
            const cardsEl = playerEl.querySelector(".cards");
            while (cardsEl.firstChild) {
                cardsEl.removeChild(cardsEl.firstChild);
            }
            playerEl.style.display = "none";
            resizeCards();
        });
    buttons
        .querySelector("button.add-card")
        .addEventListener("pointerdown", (event) => {
            addCard(playerEl);
            resizeCards();
        });
    buttons
        .querySelector("button.remove-card")
        .addEventListener("pointerdown", (event) => {
            removeCard(playerEl);
            resizeCards();
        });
    buttons
        .querySelector("button.increase-size")
        .addEventListener("pointerdown", (event) => {
            increaseCardSize(seatEl);
        });
    buttons
        .querySelector("button.reduce-size")
        .addEventListener("pointerdown", (event) => {
            reduceCardSize(seatEl);
        });
};

const addSizeDisplay = (seatEl) => {
    const bottomInfo = seatEl.querySelector(".bottom-info");
    const sizeDisplay = document.createElement("div");
    sizeDisplay.classList.add("size-display");
    bottomInfo.appendChild(sizeDisplay);
    sizeDisplay.textContent =
        document.documentElement.style.getPropertyValue("--card-width");
};
const addCard = (playerEl) => {
    if (playerEl.display === "none") return;
    const cardEl = document.createElement("div");
    cardEl.classList.add("card");
    playerEl.querySelector(".cards").appendChild(cardEl);
    resizeCards();
};
const removeCard = (playerEl) => {
    if (playerEl.display === "none") return;
    const cardEl = playerEl.querySelector(".cards .card");
    if (cardEl) {
        playerEl.querySelector(".cards").removeChild(cardEl);
    }
    resizeCards();
};

document
    .querySelector("button.add-card-all")
    .addEventListener("pointerdown", (event) => {
        const seats = document.querySelectorAll(".seat");
        seats.forEach((seatEl) => {
            const playerEl = seatEl.querySelector(".player");
            if (playerEl) {
                addCard(playerEl);
            }
        });
    });
document
    .querySelector("button.remove-card-all")
    .addEventListener("pointerdown", (event) => {
        const seats = document.querySelectorAll(".seat");
        seats.forEach((seatEl) => {
            const playerEl = seatEl.querySelector(".player");
            if (playerEl) {
                removeCard(playerEl);
            }
        });
    });
document
    .querySelector("button.card-size-up")
    .addEventListener("pointerdown", (event) => {
        increaseCardSizeAll();
    });
document
    .querySelector("button.card-size-down")
    .addEventListener("pointerdown", (event) => {
        reduceCardSizeAll();
    });

const increaseCardSizeAll = () => {
    opponentSeats.forEach((seatEl) => {
        increaseCardSize(seatEl);
    });
    increaseCardSize(clientSeat);
    increaseCardSize(communitySeat);
    increaseCardSize(document.documentElement);
};
const reduceCardSizeAll = () => {
    opponentSeats.forEach((seatEl) => {
        reduceCardSize(seatEl);
    });
    reduceCardSize(clientSeat);
    reduceCardSize(communitySeat);
    reduceCardSize(document.documentElement);
};

const increaseCardSize = (seatEL) => {
    const currentCardSize =
        getComputedStyle(seatEL)?.getPropertyValue("--card-width") ||
        document.documentElement.style.getPropertyValue("--card-width");
    const newSize =
        Math.max(1, parseFloat(currentCardSize) + 1).toFixed(2) + "vw";
    seatEL.style.setProperty("--card-width", newSize);
    displaySize(seatEL, newSize);
};
const reduceCardSize = (seatEl) => {
    const currentCardSize =
        getComputedStyle(seatEl).getPropertyValue("--card-width") ||
        document.documentElement.style.getPropertyValue("--card-width");
    const newSize =
        Math.max(1, parseFloat(currentCardSize) - 1).toFixed(2) + "vw";
    seatEl.style.setProperty("--card-width", newSize);
    seatEl.querySelector(".size-display").textContent = newSize;
    displaySize(seatEl, newSize);
};

const displaySize = (seatEl, size) => {
    const sizeDisplay = seatEl.querySelector(".size-display");
    if (sizeDisplay) {
        seatEl.querySelector(".size-display").textContent = parseFloat(size).toFixed(2) + "vw";
    }
};

//
//  RESIZE CARDS
//
const resizeCards = () => {
    console.log("\n\rresizeCards()");
    // card width is set in vw
    const numOpponentCards = document.querySelectorAll(
        ".opponent-player .cards .card"
    ).length;
    const numClientCards = document.querySelectorAll(
        ".client-player .cards .card"
    ).length;
    const numCommunityCards = document.querySelectorAll(
        ".pot-area .cards .card"
    ).length;
    const numCards = numOpponentCards + numClientCards + numCommunityCards;
    if (numCards === 0) {
        // no cards, so no need to resize
        return;
    }

    const getNumOppRows = () => {
        const oppSeats = document.querySelectorAll(".opponent-player");
        let numRows = 0;
        const oppRowYs = [];
        oppSeats.forEach((oppSeat) => {
            // const oppCards = oppPlayer.querySelectorAll(".cards .card");
            // if (oppCards.length > 0) {
            //     numRows++;
            // }
            if (
                oppSeat.querySelector(".player").style.display !== "none" &&
                !oppRowYs.includes(oppSeat.offsetTop)
            ) {
                oppRowYs.push(oppSeat.offsetTop);
                numRows++;
            }
        });
        console.log("numOppRows", numRows);
        return numRows;
    };

    const getNumOppColumns = () => {
        const oppSeats = document.querySelectorAll(".opponent-player");
        let numCols = 0;
        const oppRowXs = [];
        oppSeats.forEach((oppSeat) => {
            if (
                oppSeat.querySelector(".player").style.display !== "none" &&
                !oppRowXs.includes(oppSeat.offsetLeft)
            ) {
                oppRowXs.push(oppSeat.offsetLeft);
                numCols++;
            }
        });
        console.log("numOppCols", numCols);
        return numCols;
    };

    const clampWidth = (widthInVw, isClient) => {
        console.log("-- clampWidth", widthInVw);
        isClient = isClient === true;
        // don't let width or height go over maxWidth or maxHeight
        const maxHeight = isClient ? 7 : 10 / numOppRows;
        const maxWidth = isClient ? 20 : 10 / numOppCols;
        // card ratio is 1.4 : 1 (height : width), inverse is 0.714 : 1
        // so we need to calculate the height in vh
        let heightInVh = widthInVw * 1.4;
        // console.log(
        //     "h/maxH",
        //     (heightInVh / maxHeight).toFixed(2),
        // );
        // console.log("w/maxW",  (widthInVw / maxWidth).toFixed(2));
        if (heightInVh / maxHeight > widthInVw / maxWidth) {
            // height is the limiting factor
            console.log("heightInVh", heightInVh, "vs", maxHeight);
            // console.log("windowHeight", windowHeight);
            // console.log(
            //     `${heightInVh} * ${windowHeight} / 100 = `,
            //     (heightInVh * windowHeight) / 100,
            //     "px"
            // );
            // console.log(
            //     `${
            //         (heightInVh * windowHeight) / 100
            //     }px / ${windowHeight} * 100 = ${
            //         ((heightInVh * windowHeight) / 100 / windowHeight) * 100
            //     }vh`
            // );
            // clamp height to maxHeight
            heightInVh = Math.min(maxHeight, heightInVh);
            console.log("--->", heightInVh);
            console.log("clampWidth", widthInVw);
            // get width from height
            widthInVw = heightInVh * 0.714;
            console.log("...to", widthInVw);
        }
        // clamp width to maxWidth
        console.log("--->", Math.min(maxWidth, widthInVw));
        return Math.min(maxWidth, widthInVw);
    };
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    console.log("windowWidth", windowWidth);
    console.log("windowHeight", windowHeight);
    const numOppRows = getNumOppRows();
    const numOppCols = getNumOppColumns();
    // Opponent and community cards
    if (numOpponentCards + numCommunityCards > 0) {
        const oppCardSize =
            clampWidth(
                Math.max(1, 30 / (numCommunityCards + numOpponentCards))
            ) + "vw";

        opponentSeats.forEach((seatEl) => {
            seatEl.style.setProperty("--card-width", oppCardSize);
            displaySize(seatEl, oppCardSize);
        });

        communitySeat.style.setProperty("--card-width", oppCardSize);
        displaySize(communitySeat, oppCardSize);
        console.log(
            "opponentCard width =",
            document.querySelector(".opponent-player .card")?.offsetWidth,
            "/",
            windowWidth,
            "* 100 :",

            (document.querySelector(".opponent-player .card")?.offsetWidth /
                windowWidth) *
                100
        );
        console.log(
            "opponentCard w/h",
            document.querySelector(".opponent-player .card")?.offsetWidth,
            document.querySelector(".opponent-player .card")?.offsetHeight
        );
    }

    // Player (client) cards
    if (numClientCards > 0) {
        const clientCardSize =
            clampWidth(Math.max(2, 1 + 30 / numClientCards), true) + "vw";
        clientSeat.style.setProperty("--card-width", clientCardSize);
        displaySize(clientSeat, clientCardSize);
        console.log(
            "clientCard width",
            document.querySelector(".client-player .card")?.offsetWidth,
            "/",
            windowWidth,
            ":",
            (document.querySelector(".client-player .card")?.offsetWidth /
                windowWidth) *
                100
        );
    }
};

addButtons(clientSeat);
addButtons(communitySeat);
opponentSeats.forEach((seatEl) => {
    addButtons(seatEl);
});
addSizeDisplay(clientSeat);
addSizeDisplay(communitySeat);
opponentSeats.forEach((seatEl) => {
    addSizeDisplay(seatEl);
});
