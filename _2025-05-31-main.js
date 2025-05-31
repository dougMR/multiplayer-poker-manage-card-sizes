const opponentSeats = Array.from(
    document.querySelectorAll(".opponent-player.seat")
);
const clientSeat = document.querySelector(".client-player.seat");
const communitySeat = document.querySelector(".pot-area");

//
// CONTROLS
//

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
            // playerEl.style.display = "block";
            playerEl.classList.remove("hidden");
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
            // playerEl.style.display = "none";
            playerEl.classList.add("hidden");
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
    // resizeCards();
};
const removeCard = (playerEl) => {
    if (playerEl.display === "none") return;
    const cardEl = playerEl.querySelector(".cards .card");
    if (cardEl) {
        playerEl.querySelector(".cards").removeChild(cardEl);
    }
    // resizeCards();
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
        resizeCards();
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
        resizeCards();
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
        seatEl.querySelector(".size-display").textContent =
            parseFloat(size).toFixed(2) + "vw";
    }
};

//
//
//
/*

        v THESE FUNCTIONS EXIST IN card-reorder.js

*/
//

const getCardsAcrossAndNumRows = (seatEl) => {
    /* 
        how many rows high is the group of cards?
        how many cards wide is the group?
    */
    const cardsEl = seatEl.querySelector(".cards");
    const cardEl = cardsEl.querySelector(".card");
    if (!cardEl) return { cardsAcross: 0, numRows: 0 };
    const numItems = cardsEl.childElementCount;

    // Sizes
    const containerWidth = cardsEl.clientWidth;
    const gapSize = parseInt(
        window.getComputedStyle(cardsEl).getPropertyValue("gap")
    );
    const cardWidth = cardEl.offsetWidth + gapSize;
    // const cardHeight = itemEl.offsetHeight + gapSize;

    // Most that can fit in a row
    const maxItemsAcross = Math.min(
        numItems,
        Math.floor((containerWidth + gapSize) / cardWidth)
    );

    // vars for calculating target x/y of elements (can't use .offsetLeft/.offsetTop because they may be moving)
    const numRows = Math.ceil(numItems / maxItemsAcross);
    return { cardsAcross: maxItemsAcross, numRows: numRows };

    // const rowWidth = maxItemsAcross * cardWidth - gapSize;
    // const rowStartX = (containerWidth - rowWidth) / 2;

    // last row length is the remaining items after all the full rows
    // const lastRowLength = numItems - maxItemsAcross * (numRows - 1);
    // const lastRowWidth = lastRowLength * cardWidth - gapSize;
    // const lastRowStartX = (containerWidth - lastRowWidth) / 2;
};

/*









*/
//
//  RESIZE CARDS
//
const resizeCards = () => {
    // return;
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

    // const cardsGroupDimensions = getCardsAcrossAndNumRows(seatEl);

    const getOpponentRows = () => {
        // opponentRows.length = 0;
        const opponentRows = [];
        const oppSeats = Array.from(
            document.querySelectorAll(".opponent-player")
        );
        oppSeats.push(communitySeat);
        oppSeats.forEach((oppSeat) => {
            const seatY = parseInt(
                oppSeat.getBoundingClientRect().y -
                    parseFloat(window.getComputedStyle(oppSeat).marginTop)
            );
            // oppSeat.offsetTop -
            const rowIndex = opponentRows.findIndex(
                (row) => row[0]?.y === seatY
            );
            // if (opponentRows[0])
            //     console.log(
            //         `rows[0].y: ${opponentRows[0][0].y} === ${seatY} ? ${
            //             opponentRows[0][0].y === seatY
            //         }`
            //     );
            // console.log(`seatY: ${seatY}`);
            // console.log("rowIndex:", rowIndex);
            const seatHasPlayer =
                getComputedStyle(
                    oppSeat.querySelector(".player")
                ).getPropertyValue("display") !== "none";
            if (seatHasPlayer) {
                const seatObj = { y: seatY, seatEl: oppSeat };
                if (rowIndex === -1) {
                    // create new row
                    opponentRows.push([seatObj]);
                } else {
                    // row already exists
                    opponentRows[rowIndex].push(seatObj);
                }
            }
        });
        // console.log("opponentRows:", JSON.parse(JSON.stringify(opponentRows)));
        // make sure these are in order from top to bottom
        opponentRows.sort((rowA, rowB) => {
            return rowA[0].y - rowB[0].y;
        });
        // console.log("numOppRows", opponentRows.length);
        console.log("opponentRows", opponentRows);

        return opponentRows;
    };

    const getOpponentCols = () => {
        const opponentColumns = [];
        const oppSeats = Array.from(
            document.querySelectorAll(".opponent-player")
        );
        oppSeats.push(communitySeat);

        oppSeats.forEach((oppSeat) => {
            const seatX = parseInt(
                oppSeat.getBoundingClientRect().x -
                    parseFloat(window.getComputedStyle(oppSeat).marginLeft)
            );
            const columnIndex = opponentColumns.findIndex(
                (col) => col[0]?.x === seatX
            );
            const seatHasPlayer =
                getComputedStyle(
                    oppSeat.querySelector(".player")
                ).getPropertyValue("display") !== "none";
            if (seatHasPlayer) {
                const seatObj = { x: seatX, seatEl: oppSeat };
                if (columnIndex === -1) {
                    // create new column
                    opponentColumns.push([seatObj]);
                } else {
                    // column already exists
                    opponentColumns[columnIndex].push(seatObj);
                }
            }
        });
        // make sure these are in order from left to right
        opponentColumns.sort((columnA, columnB) => {
            return columnA[0].x - columnB[0].x;
        });
        console.log("opponentColumns", opponentColumns);
        return opponentColumns;
    };

    const clampWidth = (widthInVw, isClient) => {
        console.log("-- clampWidth", widthInVw);
        console.log("numROws:", numOppRows);
        isClient = isClient === true;

        // don't let width or height go over maxWidth or maxHeight
        // const maxOpponentCardWidth =
        const maxHeight = isClient
            ? 8
            : (22 / numOppRows) * (6 / totalCardsDown);
        const maxWidth = isClient ? 12 : 22 / numOppCols;

        // card ratio is 1.4 : 1 (height : width), inverse is 0.714 : 1
        // so we need to calculate the height in vh
        let heightInVh = widthInVw * 1.4;

        if (heightInVh / maxHeight > widthInVw / maxWidth) {
            // height is the limiting factor
            console.log("heightInVh", heightInVh, "vs maxHeight", maxHeight);

            // clamp height to maxHeight
            heightInVh = Math.min(maxHeight, heightInVh);
            console.log("--->", heightInVh);
            console.log("clampWidth", widthInVw);

            // get width from height
            widthInVw = heightInVh * 0.714;
            console.log("...to", widthInVw);
        }

        // clamp width to maxWidth
        console.log(
            "--->",
            `Math.min(${maxWidth},${widthInVw})`,
            Math.min(maxWidth, widthInVw)
        );
        const minWidthPx = 30;
        const pxPerVw = windowWidth / 100;
        const minWidthVw = minWidthPx / pxPerVw;
        console.log(
            `minVw = minPx / (windowWidth/100)... ${minWidthPx} / (${windowWidth}/100) = ${minWidthVw}`
        );
        return Math.max(minWidthVw, Math.min(maxWidth, widthInVw));
    };
    const opponentCard = document.querySelector(".seat.opponent-player .card");
    const opponentCardWidth = opponentCard.offsetWidth;
    const opponentColumns = getOpponentCols();
    const opponentRows = getOpponentRows();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const maxCardsAcross = windowWidth / opponentCardWidth;
    // console.log("windowWidth", windowWidth);
    // console.log("windowHeight", windowHeight);
    const numOppRows = opponentRows.length;
    const numOppCols = opponentColumns.length;

    // count total opponent cards across & down
    let totalCardsAcross = 0;
    let totalCardsDown = 0;
    for (const col of opponentColumns) {
        // find seat in this column with most cards
        // const seatEl = col[0].seatEl;
        let seatEl = null;
        let mostCardsThisCol = 0;
        for (const seat of col) {
            const numCards = seat.seatEl.querySelectorAll(".card").length;
            if (numCards > mostCardsThisCol) {
                mostCardsThisCol = numCards;
                seatEl = seat.seatEl;
            }
        }
    }
    const acrossAndDown = getCardsAcrossAndNumRows(seatEl);
    totalCardsAcross += acrossAndDown.cardsAcross;
    totalCardsDown += acrossAndDown.numRows;
    console.log(
        "totalCardsAcross:",
        totalCardsAcross,
        "totalCardsDown: ",
        totalCardsDown
    );
    // Opponent and community cards
    if (numOpponentCards + numCommunityCards > 0) {
        const oppCardSize =
            clampWidth(Math.max(1, maxCardsAcross / totalCardsAcross)) + "vw";

        opponentSeats.forEach((seatEl) => {
            seatEl.style.setProperty("--card-width", oppCardSize);
            displaySize(seatEl, oppCardSize);
        });

        communitySeat.style.setProperty("--card-width", oppCardSize);
        displaySize(communitySeat, oppCardSize);
    }

    // Player (client) cards
    if (numClientCards > 0) {
        const clientCardSize =
            clampWidth(Math.max(2, 1 + 30 / numClientCards), true) + "vw";
        clientSeat.style.setProperty("--card-width", clientCardSize);
        displaySize(clientSeat, clientCardSize);
        // console.log(
        //     "clientCard width",
        //     document.querySelector(".client-player .card")?.offsetWidth,
        //     "/",
        //     windowWidth,
        //     ":",
        //     (document.querySelector(".client-player .card")?.offsetWidth /
        //         windowWidth) *
        //         100
        // );
    }
};

window.addEventListener("resize", (event) => {
    resizeCards();
});

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
