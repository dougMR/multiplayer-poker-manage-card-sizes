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
    buttons.innerHTML = `<button class="show">Show</button><button class="hide">Hide</button><button class="add-card">Add Card</button><button class="remove-card">Remove Card</button><button class="reduce-size">-</button><button class="increase-size">+</button><button class="toggle-layout">horizontal</button>`;
    seatEl.appendChild(buttons);

    const handHolderEl = seatEl.querySelector(".hand-holder");
    // const cardsEl = seatEl.querySelector(".cards");
    buttons
        .querySelector("button.show")
        .addEventListener("pointerdown", (event) => {
            // handHolderEl.style.display = "block";
            handHolderEl.classList.remove("hidden");
            // show buttons
            const buttons = event.target
                .closest(".seat")
                .querySelectorAll(".buttons > button");
            buttons.forEach((button) => {
                button.style.display = "inline-block";
            });
            resizeCards();
        });
    buttons
        .querySelector("button.hide")
        .addEventListener("pointerdown", (event) => {
            // remove all cards
            const cardsEl = handHolderEl.querySelector(".cards");
            while (cardsEl.firstChild) {
                cardsEl.removeChild(cardsEl.firstChild);
            }
            // handHolderEl.style.display = "none";
            handHolderEl.classList.add("hidden");
            // hide buttons
            const buttons = event.target
                .closest(".seat")
                .querySelectorAll(".buttons > button");
            buttons.forEach((button) => {
                if (button.textContent.toLowerCase() !== "show") {
                    button.style.display = "none";
                }
            });
            resizeCards();
        });
    buttons
        .querySelector("button.add-card")
        .addEventListener("pointerdown", (event) => {
            addCard(handHolderEl);
            resizeCards();
        });
    buttons
        .querySelector("button.remove-card")
        .addEventListener("pointerdown", (event) => {
            removeCard(handHolderEl);
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
    buttons
        .querySelector("button.toggle-layout")
        .addEventListener("pointerdown", (event) => {
            const buttonEl = event.target;
            const seatEl = buttonEl.closest(".seat");
            seatEl.classList.toggle("horizontal-layout");
            buttonEl.textContent = seatEl.classList.contains(
                "horizontal-layout"
            )
                ? "vertical"
                : "horizontal";
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
const addCard = (handHolderEl) => {
    if (handHolderEl.display === "none") return;
    const cardEl = document.createElement("div");
    cardEl.classList.add("card");
    handHolderEl.querySelector(".cards").appendChild(cardEl);
    // resizeCards();
};
const removeCard = (handHolderEl) => {
    if (handHolderEl.display === "none") return;
    const cardEl = handHolderEl.querySelector(".cards .card");
    if (cardEl) {
        handHolderEl.querySelector(".cards").removeChild(cardEl);
    }
    // resizeCards();
};

document
    .querySelector("button.add-card-all")
    .addEventListener("pointerdown", (event) => {
        const seats = document.querySelectorAll(".seat");
        seats.forEach((seatEl) => {
            const handHolderEl = seatEl.querySelector(".hand-holder");
            if (handHolderEl) {
                addCard(handHolderEl);
            }
        });
        resizeCards();
    });
document
    .querySelector("button.remove-card-all")
    .addEventListener("pointerdown", (event) => {
        const seats = document.querySelectorAll(".seat");
        seats.forEach((seatEl) => {
            const handHolderEl = seatEl.querySelector(".hand-holder");
            if (handHolderEl) {
                removeCard(handHolderEl);
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

document
    .querySelector("button.toggle-layout-all")
    .addEventListener("pointerdown", (event) => {
        const seats = document.querySelectorAll(".seat");
        const buttonEl = event.target;
        const changingToHorizontal =
            buttonEl.textContent.includes("horizontal");
        seats.forEach((seatEl) => {
            if (changingToHorizontal) {
                seatEl.classList.add("horizontal-layout");
            } else {
                seatEl.classList.remove("horizontal-layout");
            }
        });

        buttonEl.textContent = changingToHorizontal ? "vertical" : "horizontal";
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

        this is with the current size of card elements
    */
    const cardsEl = seatEl.querySelector(".cards");
    const cardEl = cardsEl.querySelector(".card");
    if (!cardEl) return { cardsAcross: 0, numRows: 0 };

    const numItems = cardsEl.childElementCount;

    // Sizes
    const containerWidth = seatEl.querySelector(".hand-holder").clientWidth;
    const gapSize = parseInt(
        window.getComputedStyle(cardsEl).getPropertyValue("gap")
    );
    const cardPlusGapWidth = cardEl.offsetWidth + gapSize;

    // Most that can fit in a row
    const maxItemsAcross = Math.min(
        numItems,
        Math.floor((containerWidth + gapSize) / cardPlusGapWidth)
    );

    const numRows = Math.ceil(numItems / maxItemsAcross);
    return { cardsAcross: maxItemsAcross, numRows: numRows };
};

//
//
//
/*

        v HELPER FUNCTIONS FOR RESIZE CARDS

*/
//

const getOpponentRows = () => {
    // opponentRows.length = 0;
    const rows = [];
    const oppSeats = Array.from(document.querySelectorAll(".opponent-player"));
    oppSeats.push(communitySeat);
    oppSeats.forEach((oppSeat) => {
        const seatY = parseInt(
            oppSeat.getBoundingClientRect().y -
                parseFloat(window.getComputedStyle(oppSeat).marginTop)
        );
        // oppSeat.offsetTop -
        const rowIndex = rows.findIndex((row) => row[0]?.y === seatY);
        // if (rows[0])
        //     console.log(
        //         `rows[0].y: ${rows[0][0].y} === ${seatY} ? ${
        //             rows[0][0].y === seatY
        //         }`
        //     );
        // console.log(`seatY: ${seatY}`);
        // console.log("rowIndex:", rowIndex);
        const seatHasPlayer =
            getComputedStyle(
                oppSeat.querySelector(".hand-holder")
            ).getPropertyValue("display") !== "none";
        if (seatHasPlayer) {
            const seatObj = { y: seatY, seatEl: oppSeat };
            if (rowIndex === -1) {
                // create new row
                rows.push([seatObj]);
            } else {
                // row already exists
                rows[rowIndex].push(seatObj);
            }
        }
    });
    // console.log("opponentRows:", JSON.parse(JSON.stringify(opponentRows)));
    // make sure these are in order from top to bottom
    rows.sort((rowA, rowB) => {
        return rowA[0].y - rowB[0].y;
    });
    // console.log("numOppRows", opponentRows.length);
    console.log("opponentRows", rows);

    return rows;
};

const getOpponentCols = () => {
    const opponentColumns = [];
    const oppSeats = Array.from(document.querySelectorAll(".opponent-player"));
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
                oppSeat.querySelector(".hand-holder")
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

/*









*/
//
//  RESIZE CARDS
//
const resizeCards = () => {
    console.log("\n\rresizeCards()");

    /* 
    For each seat (opponents, community, player), 
    get its width
    get its number of cards
    determine optimal card size.  This will be whatever results in minimum height.
    Also, determine if cards fit better with horizontal seat content layout vs default vertical layout
    */

    const opponentColumns = getOpponentCols();
    const opponentRows = getOpponentRows();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    const seatsEls = Array.from(document.querySelectorAll(".seat"));
    const pxPerVh = windowHeight / 100;
    const totalTargetOpponentsHeight = 70;
    const maxOpponentSeatVh = Math.floor(
        totalTargetOpponentsHeight / opponentRows.length
    );
    const maxOpponentSeatHeightPx = pxPerVh * maxOpponentSeatVh;

    // This will individually size each opponent's cards
    for (const seatEl of seatsEls) {
        const isCommunity = seatEl.classList.contains("pot-area");
        const seatWidth = seatEl.clientWidth;
        const numCards = seatEl.querySelectorAll(".card").length;
        if(!isCommunity){

            const topInfoEl = seatEl.querySelector(".top-info");
            const topInfoWidth = topInfoEl.offsetWidth;
            const topInfoHeight = topInfoEl.offsetHeight;
            const bottomInfoEl = seatEl.querySelector(".bottom-info");
            const bottomInfoWidth = bottomInfoEl.offsetWidth;
            const bottomInfoHeight = bottomInfoEl.offsetHeight;
    
            // horizontal card space is width left for cards if seat is set to horizontal layout
            const horizontalLayoutCardsWidth =
                seatWidth - topInfoWidth - bottomInfoWidth;
            const horizontalLayoutCardsHeight = maxOpponentSeatHeightPx;
    
            // vertical card space is width left for cards if seat is set to vertical layout
            const verticalLayoutCardsWidth = seatWidth;
            const verticalLayoutCardsHeight =
                maxOpponentSeatHeightPx - topInfoHeight - bottomInfoHeight;
        } else {
            const horizontalLayoutCardsWidth = seatWidth, verticalLayoutCardsWidth = seatWidth;
            const cardSpaceHeight = seatEl.clientHeight - seatEl.querySelector(".title").offsetHeight - seatEl.querySelector(".pot-amount").offsetHeight;
            const horizontalLayoutCardsHeight = cardSpaceHeight, verticalLayoutCardsHeight = cardSpaceHeight;
        }


    }

    const clampWidth = (widthInVw, isClient) => {
        // console.log("-- clampWidth", widthInVw);
        // console.log("numROws:", numOppRows);
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
            // console.log("heightInVh", heightInVh, "vs maxHeight", maxHeight);

            // clamp height to maxHeight
            heightInVh = Math.min(maxHeight, heightInVh);
            // console.log("--->", heightInVh);
            // console.log("clampWidth", widthInVw);

            // get width from height
            widthInVw = heightInVh * 0.714;
            // console.log("...to", widthInVw);
        }

        // clamp width to maxWidth
        // console.log(
        //     "--->",
        //     `Math.min(${maxWidth},${widthInVw})`,
        //     Math.min(maxWidth, widthInVw)
        // );
        const minWidthPx = 30;
        const pxPerVw = windowWidth / 100;
        const minWidthVw = minWidthPx / pxPerVw;

        return Math.max(minWidthVw, Math.min(maxWidth, widthInVw));
    };

    // card width gets set in vw

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

    const opponentCard = document.querySelector(".seat.opponent-player .card");
    const opponentCardWidth = opponentCard.offsetWidth;

    const maxCardsAcross = windowWidth / opponentCardWidth;
    // console.log("windowWidth", windowWidth);
    // console.log("windowHeight", windowHeight);
    const numOppRows = opponentRows.length;
    const numOppCols = opponentColumns.length;

    // count total opponents' cards across & down
    let totalCardsAcross = 0;
    let totalCardsDown = 0;
    for (const col of opponentColumns) {
        // find seat in this column with most cards
        let seatEl = null;
        let mostCardsThisCol = 0;
        for (const seat of col) {
            const numCards = seat.seatEl.querySelectorAll(".card").length;
            if (numCards > mostCardsThisCol) {
                mostCardsThisCol = numCards;
                seatEl = seat.seatEl;
            }
        }
        const acrossAndDown = getCardsAcrossAndNumRows(seatEl);
        totalCardsAcross += acrossAndDown.cardsAcross;
        totalCardsDown += acrossAndDown.numRows;
    }

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
