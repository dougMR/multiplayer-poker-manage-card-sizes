import { displaySize } from "./main.js";

//
//
//
/*

        v THESE FUNCTIONS EXIST IN card-reorder.js

*/
//

const getCardsAcrossAndNumRows = (args) => {
    /* 
        how many rows high is the group of cards?
        how many cards wide is the group?

        this is based on the current size of card elements
    */

    /*
        args:
        {
            numCards,
            cardWidth,
            gapSize,
            widthAvailable,
            heightAvailable,
        }
    */

    console.log("getCardsAcrossAndNumRows()", args);

    const seatEl = args.seatEl;
    let cardPlusGapWidth, containerWidth, numItems, gapSize;

    if (seatEl) {
        // DMR - 6/7/2025 - We don't seem to be calling this with seatEl.  That's good, because we should not be doing any direct measuring of elements.  Remove this if() altogether?

        console.log("WE SHOULDN'T BE HERE!!!!");
        const cardsEl = seatEl.querySelector(".cards");
        const cardEl = cardsEl.querySelector(".card");
        const playerName = seatEl.querySelector(
            ".top-info .player-name"
        ).textContent;

        if (!cardEl) return { cardsAcross: 0, numRows: 0 };

        numItems = cardsEl.childElementCount;

        // Measure elements
        containerWidth = seatEl.querySelector(".hand-holder").clientWidth;
        gapSize = parseInt(
            window.getComputedStyle(cardsEl).getPropertyValue("gap")
        );
        cardPlusGapWidth = cardEl.offsetWidth + gapSize;
    } else {
        // console.log("no seatEl provided.");
        const {
            numCards,
            cardWidth,
            gapSize: gs,
            widthAvailable,
            heightAvailable,
        } = args;
        gapSize = gs;
        numItems = numCards;
        containerWidth = widthAvailable;
        cardPlusGapWidth = cardWidth + gapSize;
    }

    // Most that can fit in a row
    const maxItemsAcross = Math.min(
        numItems,
        Math.floor((containerWidth + gapSize) / cardPlusGapWidth)
    );
    // console.log(
    //     "maxItemsAcross: Math.floor((containerWidth + gapSize) / cardPlusGapWidth) |  ",
    //     `Math.floor((${containerWidth} + ${gapSize}) / ${cardPlusGapWidth})`
    // );
    const numRows = Math.ceil(numItems / maxItemsAcross);
    // console.log(
    //     "num-items:",
    //     numItems,
    //     ", max-across:",
    //     maxItemsAcross,
    //     ", available width:",
    //     containerWidth,
    //     ", num seat Rows:",
    //     numRows
    // );

    return { cardsAcross: maxItemsAcross, numRows: numRows };
};

//
//
//
//
//
//
//
//
//
//
//
//
/*

        v HELPER FUNCTIONS FOR RESIZE CARDS

*/
//

const findWidestWord = (element) => {
    // get widest word in element

    // get element's font styles
    const elStyle = getComputedStyle(element);
    // const fontFamily = elStyle.fontFamily;
    // const fontSize = elStyle.fontSize;
    // const fontWeight = elStyle.fontWeight;
    // const letterSpacing = elStyle.letterSpacing;

    const text = element.textContent; // Get the text content
    const words = text.split(/\s+/); // Split into words

    let widestWord = ""; // Initialize the widest word
    let maxWidth = 0; // Initialize the maximum width

    // Iterate through each word
    for (const word of words) {
        const tempSpan = document.createElement("span"); // Create a temporary span

        // set its font styles
        tempSpan.style.fontFamily = elStyle.fontFamily;
        tempSpan.style.fontSize = elStyle.fontSize;
        tempSpan.style.fontWeight = elStyle.fontWeight;
        tempSpan.style.letterSpacing = elStyle.letterSpacing;

        tempSpan.textContent = word; // Set its text
        document.body.appendChild(tempSpan); // Add to the body
        tempSpan.style.display = "inline-block"; // Ensure it's measured correctly
        const width = tempSpan.offsetWidth; // Get the width
        tempSpan.remove(); // Remove the span
        // Update if the current word is wider than the current maximum
        if (width > maxWidth) {
            maxWidth = width;
            widestWord = word;
        }
    }
    return widestWord;
};

const getBorderAndPadding = (el) => {
    const style = getComputedStyle(el);
    const borders = {
        top: parseFloat(style.getPropertyValue("border-top-width")),
        right: parseFloat(style.getPropertyValue("border-right-width")),
        bottom: parseFloat(style.getPropertyValue("border-bottom-width")),
        left: parseFloat(style.getPropertyValue("border-left-width")),
    };
    const padding = {
        top: parseFloat(style.paddingTop),
        right: parseFloat(style.paddingRight),
        bottom: parseFloat(style.paddingBottom),
        left: parseFloat(style.paddingLeft),
    };

    // Round up for better clearance
    const bordersAndPadding = {
        vertical: Math.ceil(
            borders.top + borders.bottom + padding.top + padding.bottom
        ),
        horizontal: Math.ceil(
            borders.left + borders.right + padding.left + padding.right
        ),
    };
    return bordersAndPadding;
};

const getOpponentRows = () => {
    // Organize opponent seats by rows
    const rows = [];
    const oppSeats = Array.from(document.querySelectorAll(".opponent-player"));
    oppSeats.push(communitySeat);
    oppSeats.forEach((oppSeat) => {
        const seatY = parseInt(
            oppSeat.getBoundingClientRect().y -
                parseFloat(window.getComputedStyle(oppSeat).marginTop)
        );
        const rowIndex = rows.findIndex((row) => row[0]?.y === seatY);

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
    // console.log("opponentRows", rows);

    return rows;
};

const getOpponentCols = () => {
    // Organize opponent seats by columns
    const opponentColumns = [];
    const oppSeats = Array.from(document.querySelectorAll(".opponent-player"));
    oppSeats.push(communitySeat);

    oppSeats.forEach((oppSeat) => {
        const seatX = Math.round(
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
    // console.log("opponentColumns", opponentColumns);
    return opponentColumns;
};

const doCardsFitLayout = (
    numCards,
    cardWidth,
    widthAvailable,
    heightAvailable
) => {
    // console.log(
    //     "doCardsFitLayout() numCards:",
    //     numCards,
    //     "cardWidth:",
    //     cardWidth,
    //     "cardHeight:",
    //     cardWidth * 1.4,
    //     "widthAvailable:",
    //     widthAvailable,
    //     "heightAvailable:",
    //     heightAvailable
    // );
    // does numCards card at cardWidth fit into the available space?

    // gapSize has to agree with the css!
    const gapSize = cardWidth * 0.1;
    console.log("gapSize:", gapSize);
    const cardHeight = cardWidth * 1.4;
    const acrossAndDown = getCardsAcrossAndNumRows({
        numCards,
        cardWidth,
        gapSize,
        widthAvailable,
        heightAvailable,
    });
    // console.log(
    //     "fit horizontal: ",
    //     acrossAndDown.cardsAcross * (cardWidth + gapSize) - gapSize <=
    //         widthAvailable
    // );
    // console.log(
    //     "fit vertical: ",
    //     acrossAndDown.numRows * (cardHeight + gapSize) - gapSize <=
    //         heightAvailable
    // );
    // console.log(
    //     "numRows * (cardHeight + gapSize) - gapSize <= heightAvailable | ",
    //     `${acrossAndDown.numRows} * (${cardHeight} + ${gapSize}) - ${gapSize} <= ${heightAvailable} | `,
    //     acrossAndDown.numRows * (cardHeight + gapSize) - gapSize <=
    //         heightAvailable
    // );
    // console.log(
    //     "cardsAcross * (cardWidth + gapSize) - gapSize <= widthAvailable | ",
    //     `${acrossAndDown.cardsAcross} * (${cardWidth} + ${gapSize}) - ${gapSize} <= ${widthAvailable}`,
    //     "  |  ",
    //     acrossAndDown.cardsAcross * (cardWidth + gapSize) - gapSize <=
    //         widthAvailable
    // );

    if (
        acrossAndDown.numRows * (cardHeight + gapSize) - gapSize <=
            heightAvailable &&
        acrossAndDown.cardsAcross * (cardWidth + gapSize) - gapSize <=
            widthAvailable
    ) {
        console.log(
            "CARDS FIT LAYOUT: numRows * (cardHeight + gapSize) - gapSize <= heightAvailable | ",
            `${acrossAndDown.numRows} * (${cardHeight} + ${gapSize}) - ${gapSize} <= ${heightAvailable} | `,
            acrossAndDown.numRows * (cardHeight + gapSize) - gapSize <=
                heightAvailable
        );
    }
    // do cards at this size fit both width and height of available space?
    return (
        acrossAndDown.numRows * (cardHeight + gapSize) - gapSize <=
            heightAvailable &&
        acrossAndDown.cardsAcross * (cardWidth + gapSize) - gapSize <=
            widthAvailable
    );
};

/*









*/
//
//  RESIZE CARDS
//
const resizeCards = (seatElsAr) => {
    console.log("\n\rresizeCards()");

    /* 
    For each seat (opponents, community, player), 
    get its width
    get its number of cards
    determine optimal card size.  This will be whatever results in minimum height.
    Also, determine if cards fit better with horizontal seat content layout vs default vertical layout
    */

    const minCardWidth = 30;
    const maxCardWidth = 130;
    const minCardHeight = minCardWidth * 1.4;
    const maxCardHeight = maxCardWidth * 1.4;

    const opponentColumns = getOpponentCols();
    const opponentRows = getOpponentRows();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    console.log("windowWidth/windowHeight:", windowWidth, windowHeight);

    const seatsEls =
        seatElsAr || Array.from(document.querySelectorAll(".seat"));

    const pxPerVh = windowHeight / 100;
    const pxPerVw = windowWidth / 100;

    // How much height should opponent seats take up?
    const totalTargetOpponentsHeight = 65; // vh
    const maxOpponentSeatVh = Math.floor(
        totalTargetOpponentsHeight / opponentRows.length
    );
    const maxOpponentSeatHeightPx = pxPerVh * maxOpponentSeatVh;

    // How much height does this leave for opponent seat's .cards?
    const maxOpponentCardsHeightPx =
        maxOpponentSeatHeightPx -
        seatsEls[0].querySelector(".buttons").offsetHeight -
        getBorderAndPadding(opponentSeatsEls[0]).vertical;

    // DMR - 6/7/2025 - in mega-poker, make adjustments for seat elements like we do here for ".buttons".  eg. countdown meter etc etc.

    // Same height allowances for client player
    const maxClientSeatHeightPx = pxPerVh * (100 - totalTargetOpponentsHeight);
    const maxClientCardsHeightPx =
        maxClientSeatHeightPx -
        seatsEls
            .find((sel) => sel.classList.contains("client-player"))
            ?.querySelector(".buttons")?.offsetHeight -
        getBorderAndPadding(clientSeatEl)?.vertical;

    // This will individually size each opponent's cards
    let verticalLayoutCardsInnerWidth,
        verticalLayoutCardsHeight,
        horizontalLayoutCardsInnerWidth,
        horizontalLayoutCardsHeight;

    let seatNum = 0;
    for (const seatEl of seatsEls) {
        console.log("\n\r   seatNum:", seatNum);
        seatNum++;
        const isCommunity = seatEl.classList.contains("pot-area");
        const isClientPlayer = seatEl.classList.contains("client-player");

        // Get borders and padding for accurate measurement estimates
        const seatBordersAndPadding = getBorderAndPadding(seatEl);

        // We are calculating sizes, not measuring elements

        // Calculate seat width
        const seatOuterWidth = isClientPlayer
            ? windowWidth
            : windowWidth / opponentColumns.length;

        console.log(
            "seatOuterWidth = windowWidth / opponentColumns.length",
            `${seatOuterWidth} = ${windowWidth} / ${opponentColumns.length}`
        );

        // HandHolder width (holds .cards, .top-info, .bottom-info)
        const seatHandHolderBordersAndPadding = getBorderAndPadding(
            seatEl.querySelector(".hand-holder")
        );
        const seatHandHolderInnerWidth =
            seatOuterWidth -
            seatBordersAndPadding.horizontal -
            seatHandHolderBordersAndPadding.horizontal;

        console.log(
            "seatHandHolderInnerWidth = \n\rseatOuterWidth\n\r - seatBordersAndPadding.horizontal\n\r - seatHandHolderBordersAndPadding.horizontal",
            `\n\r${seatHandHolderInnerWidth} = \n\r${seatOuterWidth}\n\r - ${seatBordersAndPadding.horizontal}\n\r - ${seatHandHolderBordersAndPadding.horizontal}`
        );

        // .cards element
        const cardsEl = seatEl.querySelector(".cards");
        const cardsBordersAndPadding = getBorderAndPadding(cardsEl);

        const numCards = seatEl.querySelectorAll(".card").length;
        if (numCards < 1) return;

        if (isCommunity) {
            // Community Seat
            console.log("COMMUNITY SEAT");
            horizontalLayoutCardsInnerWidth =
                seatHandHolderInnerWidth - cardsBordersAndPadding.horizontal;
            verticalLayoutCardsInnerWidth =
                seatHandHolderInnerWidth - cardsBordersAndPadding.horizontal;
            // How much height to allow for cards element
            const cardSpaceHeight =
                maxOpponentCardsHeightPx - cardsBordersAndPadding.vertical;

            // seatEl.clientHeight -
            // seatEl.querySelector(".title").offsetHeight -
            // seatEl.querySelector(".pot-amount").offsetHeight;
            horizontalLayoutCardsHeight = cardSpaceHeight;
            verticalLayoutCardsHeight = cardSpaceHeight;
        } else {
            // Opponent or Client Seat
            const maxCardsHeightPx = isClientPlayer
                ? maxClientCardsHeightPx
                : maxOpponentCardsHeightPx;

            // DMR 06/07/2025 - top and bottom info elements' dimensions could change if we adjust font-size and content text.  Avoid feedback-loop.
            const topInfoEl = seatEl.querySelector(".top-info");
            const topInfoWidth = topInfoEl.offsetWidth;
            const topInfoHeight = topInfoEl.offsetHeight;

            const bottomInfoEl = seatEl.querySelector(".bottom-info");
            const bottomInfoWidth = bottomInfoEl.offsetWidth;
            const bottomInfoHeight = bottomInfoEl.offsetHeight;

            // horizontal card space is width left for cards if seat is set to horizontal layout

            horizontalLayoutCardsInnerWidth =
                seatHandHolderInnerWidth -
                topInfoWidth -
                bottomInfoWidth -
                cardsBordersAndPadding.horizontal;
            horizontalLayoutCardsHeight =
                maxCardsHeightPx - cardsBordersAndPadding.horizontal;

            // vertical card space is width left for cards if seat is set to vertical layout
            verticalLayoutCardsInnerWidth =
                seatHandHolderInnerWidth - cardsBordersAndPadding.horizontal;
            verticalLayoutCardsHeight =
                maxCardsHeightPx - topInfoHeight - bottomInfoHeight;
            console.log(
                "horizontalLayoutCardsInnerWidth = \n\r seatHandHolderInnerWidth\n\r  - topInfoWidth\n\r  - bottomInfoWidth\n\r  - cardsBordersAndPadding.horizontal ... ",
                `\n\r ${horizontalLayoutCardsInnerWidth} = \n\r ${seatHandHolderInnerWidth}\n\r  - ${topInfoWidth}\n\r  - ${bottomInfoWidth}\n\r  - ${cardsBordersAndPadding.horizontal}`
            );
            // console.log(
            //     "horizontalLayoutCardsInnerWidth:",
            //     horizontalLayoutCardsInnerWidth,
            //     "seatHandHolderInnerWidth:",
            //     seatHandHolderInnerWidth,
            //     "topInfoWidth:",
            //     topInfoWidth,
            //     "bottomInfoWidth:",
            //     bottomInfoWidth
            // );

            // console.log(
            //     "verticalLayoutCardsInnerWidth:",
            //     verticalLayoutCardsInnerWidth
            // );
            // console.log(
            //     "verticalLayoutCardsHeight = maxOpponentSeatHeightPx - topInfoHeight - bottomInfoHeight | ",
            //     `${verticalLayoutCardsHeight} =
            //     ${maxCardsHeightPx} - ${topInfoHeight} - ${bottomInfoHeight}`
            // );
        }

        // Starting with biggest card size, see if it fits in either layout.
        // then, reduce it by steps until we find a layout where it fits.
        // if it won't fit in either layout at minimum size,
        // (?) increase totalTargetOpponentsHeight? up to 85% ?

        let cardWidth = maxCardWidth;
        let cardsFitVertical = false;
        let cardsFitHorizontal = false;
        let cardsFit = false;
        let tempSafety = 0;
        let makeHorizontal = false;

        while (!cardsFit && tempSafety < 20) {
            tempSafety++;
            console.log("\n\rloop cardWidth:", cardWidth);
            // try again to fit
            // console.log("try vertical...");
            cardsFitVertical = doCardsFitLayout(
                numCards,
                cardWidth,
                verticalLayoutCardsInnerWidth,
                verticalLayoutCardsHeight
            );
            if (cardsFitVertical) {
                console.log("CARDS FIT VERTICAL", cardWidth);
                cardsFit = true;
                break;
            }
            // console.log("try horizontal...");
            cardsFitHorizontal = doCardsFitLayout(
                numCards,
                cardWidth,
                horizontalLayoutCardsInnerWidth,
                horizontalLayoutCardsHeight
            );

            if (cardsFitHorizontal) {
                makeHorizontal = true;
                cardsFit = true;
                console.log("CARDS FIT HORIZONTAL", cardWidth);
                break;
            }
            if (cardWidth <= minCardWidth) {
                cardWidth = minCardWidth;
                console.log("minimum card size", cardWidth);
                break;
            }
            // reduce size
            cardWidth -= 5;
        }
        const cardSize = cardWidth / pxPerVw + "vw";
        console.log(
            "cardSize = cardWidth / pxPerVw | ",
            `${cardSize} = ${cardWidth} / ${pxPerVw}`
        );

        // acrossAndNumRows.numRows
        // acrossAndNumRows.cardsAcross

        // set seat's card width
        seatEl.style.setProperty("--card-width", cardSize);

        // set seat layout
        if (makeHorizontal) {
            seatEl.classList.add("horizontal-layout");
        } else {
            seatEl.classList.remove("horizontal-layout");
        }

        // display measurements for testing
        displaySize(seatEl, cardSize);
        const widthAvailable = makeHorizontal
            ? horizontalLayoutCardsInnerWidth
            : verticalLayoutCardsInnerWidth;
        const heightAvailable = makeHorizontal
            ? horizontalLayoutCardsHeight
            : verticalLayoutCardsHeight;
        const acrossAndNumRows = getCardsAcrossAndNumRows({
            numCards,
            cardWidth,
            gapSize: cardWidth * 0.1,
            widthAvailable,
            heightAvailable,
        });

        seatEl.querySelector(".size-display").innerHTML = `rows: ${
            acrossAndNumRows.numRows
        }, cardsAcross: ${acrossAndNumRows.cardsAcross} <br /> ${Math.round(
            widthAvailable
        )} x ${Math.round(heightAvailable)}`;
    }
};

const clientSeatEl = document.querySelector(".client-player.seat");
const communitySeat = document.querySelector(".pot-area");
const opponentSeatsEls = Array.from(
    document.querySelectorAll(".opponent-player.seat")
);

export { resizeCards };
