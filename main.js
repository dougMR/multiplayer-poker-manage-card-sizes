import { resizeCards } from "./resize-cards.js";

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
            resizeCards([seatEl]);
        });
    buttons
        .querySelector("button.remove-card")
        .addEventListener("pointerdown", (event) => {
            removeCard(handHolderEl);
            resizeCards([seatEl]);
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

const clientSeat = document.querySelector(".client-player.seat");
const communitySeat = document.querySelector(".pot-area");
const opponentSeats = Array.from(
    document.querySelectorAll(".opponent-player.seat")
);

let lastResizeTime = 0;
let resizeFrequency = 250;
window.addEventListener("resize", (event) => {
    const now = Date.now();
    if (now - lastResizeTime > resizeFrequency) {
        lastResizeTime = now;
        resizeCards();
    }
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

export { displaySize };
