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

    // console.log("getCardsAcrossAndNumRows()", args);

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

function getNumberOfRows(container) {
    if (!container || !container.children) {
        return 0;
    }

    const items = Array.from(container.children);
    if (items.length === 0) {
        return 0;
    }
    let baseOffset = items[0].offsetTop;
    let numberOfRows = 1; // Start with 1 row

    items.forEach((item) => {
        if (item.offsetTop > baseOffset) {
            baseOffset = item.offsetTop;
            numberOfRows++;
        }
    });
    return numberOfRows;
}

const getWidestWordWidth = (element) => {
    // get widest word in element
    // return px width of widest word in element

    // get element's font styles
    const elStyle = getComputedStyle(element);
    // console.log("elStyle:",elStyle);
    // const fontFamily = elStyle.fontFamily;
    // const fontSize = elStyle.fontSize;
    // const fontWeight = elStyle.fontWeight;
    // const letterSpacing = elStyle.letterSpacing;

    const text = element.textContent; // Get the text content
    const words = text.trim().split(/\s+/); // Split into words

    let widestWord = ""; // Initialize the widest word
    let maxWidth = 0; // Initialize the maximum width

    const tempSpan = document.createElement("span"); // Create a temporary span
    // set its font styles to match element's
    tempSpan.style.fontFamily = elStyle.getPropertyValue("font-family");
    tempSpan.style.fontSize = elStyle.getPropertyValue("font-size");
    tempSpan.style.fontWeight = elStyle.getPropertyValue("font-weight");
    tempSpan.style.letterSpacing = elStyle.getPropertyValue("letter-spacing");
    tempSpan.style.fontStyle = elStyle.getPropertyValue("font-style");
    tempSpan.style.display = "inline-block"; // Ensure it's measured correctly
    tempSpan.style.width = "fit-content";
    document.body.appendChild(tempSpan); // Add to the body

    // Iterate through each word
    for (const word of words) {
        tempSpan.textContent = word; // Set its text

        // console.log(
        //     "tempSpan:",
        //     tempSpan,
        //     tempSpan.offsetWidth,
        //     "[" + getComputedStyle(tempSpan).getPropertyValue("width") + "]"
        // );
        const width = tempSpan.offsetWidth; // Get the width

        // Update if the current word is wider than the current maximum
        if (width > maxWidth) {
            maxWidth = width;
            widestWord = word;
        }
    }
    tempSpan.remove(); // Remove the span
    return maxWidth; // widestWord;
};

const getElementMargins = (el) => {
    if (!el || el === undefined)
        return {
            horizontal: 0,
            vertical: 0,
        };
    const elStyle = getComputedStyle(el);
    if (
        elStyle.display === "none" ||
        elStyle.position === "absolute" ||
        elStyle.position === "fixed"
    )
        return {
            horizontal: 0,
            vertical: 0,
        };

    const topMargin = parseFloat(elStyle.getPropertyValue("margin-top"));
    const bottomMargin = parseFloat(elStyle.getPropertyValue("margin-bottom"));
    const leftMargin = parseFloat(elStyle.getPropertyValue("margin-left"));
    const rightMargin = parseFloat(elStyle.getPropertyValue("margin-right"));
    if (
        topMargin === undefined ||
        bottomMargin === undefined ||
        leftMargin === undefined ||
        rightMargin === undefined
    ) {
        console.log(
            "left,top,right,bottom margin:",
            leftMargin,
            topMargin,
            rightMargin,
            bottomMargin
        );
    }

    return {
        horizontal: leftMargin + rightMargin,
        vertical: topMargin + bottomMargin,
    };
};

const getOffsetHeightPlusMargin = (el) => {
    if (!el) return 0;
    const elStyle = getComputedStyle(el);
    if (
        elStyle.display === "none" ||
        elStyle.position === "absolute" ||
        elStyle.position === "fixed"
    )
        return 0;

    const topMargin = parseFloat(elStyle.getPropertyValue("margin-top"));
    const bottomMargin = parseFloat(elStyle.getPropertyValue("margin-bottom"));
    return el.offsetHeight + topMargin + bottomMargin;
};

const getOffsetWidthPlusMargin = (el) => {
    if (!el) return 0;
    let elStyle = getComputedStyle(el);
    const leftMargin = parseFloat(elStyle.getPropertyValue("margin-left"));
    const rightMargin = parseFloat(elStyle.getPropertyValue("margin-right"));
    return el.offsetWidth + leftMargin + rightMargin;
};

const getElementSiblings = (element) => {
    const allSiblings = Array.from(element.parentNode.children).filter(
        (sibling) => sibling !== element
    );
    return allSiblings;
};

const getSiblingsHeight = (el) => {
    const siblingsEls = getElementSiblings(el);

    let siblingsHeight = 0;
    for (const sibEl of siblingsEls) {
        siblingsHeight += getOffsetHeightPlusMargin(sibEl);
    }

    return siblingsHeight;
};
const getHandHolderSiblingsHeight = (seatEl) => {
    // return combined height of all elements besides hand-holder, which are not display:none or position:absolute

    return getSiblingsHeight(seatEl.querySelector(".hand-holder"));
};

const getSeatChildrenWidthBesidesHandHolder = (seatEl) => {
    // return combined height of all elements besides hand-holder, which are not display:none or position:absolute

    const handHolderSiblings = getElementSiblings(
        seatEl.querySelector(".hand-holder")
    );

    let siblingsWidth = 0;
    for (const sibEl of handHolderSiblings) {
        siblingsWidth += getOffsetWidthPlusMargin(sibEl);
    }

    return siblingsWidth;
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

    // elements we'll want reference to
    const cardTableEl = document.getElementById("card-table");
    const cardTableBorderAndPadding = getBorderAndPadding(cardTableEl);
    const cardTableMargins = getElementMargins(cardTableEl);
    const cardTableBorderPaddingMarginVertical =
        cardTableBorderAndPadding.vertical + cardTableMargins.vertical;
    const cardTableBorderPaddingMarginHorizontal =
        cardTableBorderAndPadding.horizontal + cardTableMargins.horizontal;

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

    // How much height can opponent seats take up?
    const totalTargetOpponentsHeightVh = 65; // vh
    const totalTargetOpponentsHeightPx =
        pxPerVh * totalTargetOpponentsHeightVh -
        cardTableBorderPaddingMarginVertical;
    const maxOpponentSeatHeightPx =
        totalTargetOpponentsHeightPx / opponentRows.length;

    // How much height can client player seat take up?
    const maxClientSeatHeightPx = windowHeight - totalTargetOpponentsHeightPx;

    // This will individually size each seat's cards
    let verticalLayoutCardsInnerWidth,
        verticalLayoutCardsInnerHeight,
        horizontalLayoutCardsInnerWidth,
        horizontalLayoutCardsInnerHeight;

    let seatNum = 0;
    for (const seatEl of seatsEls) {
        console.log("\n\r   seatNum:", seatNum);
        console.log("seatEl:", seatEl);
        seatNum++;

        const isCommunity = seatEl.classList.contains("pot-area");
        const isClientPlayer = seatEl.classList.contains("client-player");

        // Get borders and padding for accurate measurement estimates
        const seatBordersAndPadding = getBorderAndPadding(seatEl);
        const seatMargins = getElementMargins(seatEl);

        // Handholder borders, padding, margins
        // HandHolder width (holds .cards, .top-info, .bottom-info)
        const handHolderEl = seatEl.querySelector(".hand-holder");
        const handHolderBordersAndPadding = getBorderAndPadding(handHolderEl);
        const handHolderMargins = getElementMargins(handHolderEl);

        // .cards element
        const cardsEl = seatEl.querySelector(".cards");
        const cardsBordersAndPadding = getBorderAndPadding(cardsEl);
        const cardsMargins = getElementMargins(cardsEl);
        const cardsBordersPaddingMargins = {
            horizontal:
                cardsBordersAndPadding.horizontal + cardsMargins.horizontal,
            vertical: cardsBordersAndPadding.vertical + cardsMargins.vertical,
        };

        // console.log("cardsBordersPaddingMargins:", cardsBordersPaddingMargins);

        // We are calculating sizes, not measuring elements

        // Calculate seat width
        const seatWidth = isClientPlayer
            ? windowWidth - cardTableBorderPaddingMarginHorizontal
            : (windowWidth - cardTableBorderPaddingMarginHorizontal) /
              opponentColumns.length;

        // console.log(
        //     "seatWidth = windowWidth / opponentColumns.length",
        //     `${seatWidth} = ${windowWidth} / ${opponentColumns.length}`
        // );

        const seatHandHolderInnerWidth =
            seatWidth -
            seatBordersAndPadding.horizontal -
            seatMargins.horizontal -
            handHolderBordersAndPadding.horizontal -
            handHolderMargins.horizontal;

        // console.log(
        //     "seatHandHolderInnerWidth = \n\rseatWidth\n\r - seatBordersAndPadding.horizontal \n\r - seatMargins.horizontal\n\r - handHolderBordersAndPadding.horizontal \n\r- handHolderMargins.horizontal",
        //     `\n\r${seatHandHolderInnerWidth} = \n\r${seatWidth}\n\r - ${seatBordersAndPadding.horizontal}\n\r - ${seatMargins.horizontal}\n\r - ${handHolderBordersAndPadding.horizontal}\n\r - ${handHolderMargins.horizontal}`
        // );

        // this needs to be per-seat, because name, hand-name etc will be different
        const maxSeatHeightPx = isClientPlayer
            ? maxClientSeatHeightPx
            : maxOpponentSeatHeightPx;

        const maxCardsHeightPxWithoutInfos =
            maxSeatHeightPx -
            getHandHolderSiblingsHeight(seatEl) -
            seatBordersAndPadding.vertical -
            handHolderBordersAndPadding.vertical -
            handHolderMargins.vertical -
            cardsBordersPaddingMargins.vertical;

        // console.log(
        //     "maxCardsHeightPxWithoutInfos = \n\rmaxSeatHeightPx \n\r- getHandHolderSiblingsHeight(seatEl) \n\r- seatBordersAndPadding.vertical \n\r- handHolderBordersAndPadding.vertical \n\r- handHolderMargins.vertical \n\r- cardsBordersPaddingMargins.vertical",
        //     `\n\r${maxCardsHeightPxWithoutInfos} = \n\r${maxSeatHeightPx} \n\r- ${getHandHolderSiblingsHeight(
        //         seatEl
        //     )} \n\r- ${seatBordersAndPadding.vertical} \n\r- ${
        //         handHolderBordersAndPadding.vertical
        //     } \n\r- ${handHolderMargins.vertical} \n\r- ${
        //         cardsBordersPaddingMargins.vertical
        //     }`
        // );

        // const maxOpponentCardsHeightPx =
        //     maxOpponentSeatHeightPx -
        //     seatsEls[0].querySelector(".buttons").offsetHeight -
        //     getBorderAndPadding(opponentSeatsEls[0]).vertical;

        // const maxClientCardsHeightPx =
        //     maxClientSeatHeightPx -
        //     seatsEls
        //         .find((sel) => sel.classList.contains("client-player"))
        //         ?.querySelector(".buttons")?.offsetHeight -
        //     getBorderAndPadding(clientSeatEl)?.vertical;

        const numCards = seatEl.querySelectorAll(".card").length;
        if (numCards < 1) continue;

        if (isCommunity) {
            // DMR 2025-06-11 - rebuild community cards space calculations

            // Community Seat
            console.log("COMMUNITY SEAT");
            horizontalLayoutCardsInnerWidth =
                seatHandHolderInnerWidth -
                cardsBordersPaddingMargins.horizontal;
            verticalLayoutCardsInnerWidth =
                seatHandHolderInnerWidth -
                cardsBordersPaddingMargins.horizontal;
            // How much height to allow for cards element
            const cardSpaceHeight = maxCardsHeightPxWithoutInfos;

            // seatEl.clientHeight -
            // seatEl.querySelector(".title").offsetHeight -
            // seatEl.querySelector(".pot-amount").offsetHeight;
            horizontalLayoutCardsInnerHeight = cardSpaceHeight;
            verticalLayoutCardsInnerHeight = cardSpaceHeight;
        } else {
            // How much height does this leave for seat's .cards?

            // Vertical Layout cards space
            // cards height room = seat height - hand-holder siblings' height - top-info height - bottom-info height
            // cards width room = seat width - top-info width - bottom-info width

            // Opponent or Client Seat
            // const maxCardsHeightPxWithoutInfos = isClientPlayer
            //     ? maxClientCardsHeightPx
            //     : maxOpponentCardsHeightPx;

            // DMR 06/07/2025 - top and bottom info elements' dimensions could change if we adjust font-size and content text.  Avoid feedback-loop.
            const topInfoEl = seatEl.querySelector(".top-info");
            const topInfoMargins = getElementMargins(topInfoEl);
            const topInfoWidth =
                getWidestWordWidth(topInfoEl) + topInfoMargins.horizontal;
            // console.log(
            //     "topInfoWidth = \n\rgetWidestWordWidth(topInfoEl)\n\r + topInfoMargins.horizontal",
            //     `\n\r${topInfoWidth} = \n\r${getWidestWordWidth(
            //         topInfoEl
            //     )}\n\r + ${topInfoMargins.horizontal}`
            // );
            const topInfoHeight =
                topInfoEl.offsetHeight + topInfoMargins.vertical;

            const bottomInfoEl = seatEl.querySelector(".bottom-info");
            const bottomInfoMargins = getElementMargins(bottomInfoEl);
            const bottomInfoWidth =
                getWidestWordWidth(bottomInfoEl) + bottomInfoMargins.horizontal;
            const bottomInfoHeight =
                bottomInfoEl.offsetHeight + bottomInfoMargins.vertical;

            // horizontal card space is width left for cards if seat is set to horizontal layout
            horizontalLayoutCardsInnerWidth =
                seatHandHolderInnerWidth -
                topInfoWidth -
                bottomInfoWidth -
                cardsBordersPaddingMargins.horizontal;
            // console.log(
            //     "horizontalLayoutCardsInnerWidth = \n\r seatHandHolderInnerWidth\n\r  - topInfoWidth\n\r  - bottomInfoWidth\n\r  - cardsBordersPaddingMargins.horizontal ... ",
            //     `\n\r ${horizontalLayoutCardsInnerWidth} = \n\r ${seatHandHolderInnerWidth}\n\r  - ${topInfoWidth}\n\r  - ${bottomInfoWidth}\n\r  - ${cardsBordersPaddingMargins.horizontal}`
            // );

            horizontalLayoutCardsInnerHeight = maxCardsHeightPxWithoutInfos;
            // console.log(
            //     " horizontalLayoutCardsInnerHeight = \n\rmaxCardsHeightPxWithoutInfos",
            //     `\n\r${horizontalLayoutCardsInnerHeight} = \n\r${maxCardsHeightPxWithoutInfos}`
            // );

            // vertical card space is width left for cards if seat is set to vertical layout
            verticalLayoutCardsInnerWidth =
                seatHandHolderInnerWidth -
                cardsBordersPaddingMargins.horizontal;
            // console.log(
            //     "\n\rverticalLayoutCardsInnerWidth = seatHandHolderInnerWidth - cardsBordersPaddingMargins.horizontal",
            //     `\n\r${verticalLayoutCardsInnerWidth} = \n\r${seatHandHolderInnerWidth} \n\r- ${cardsBordersPaddingMargins.horizontal}`
            // );
            verticalLayoutCardsInnerHeight =
                maxCardsHeightPxWithoutInfos - topInfoHeight - bottomInfoHeight;
            // console.log(
            //     "verticalLayoutCardsInnerHeight =\n\r maxCardsHeightPxWithoutInfos \n\r- topInfoHeight \n\r- bottomInfoHeight",
            //     `\n\r${verticalLayoutCardsInnerHeight} = \n\r${maxCardsHeightPxWithoutInfos} \n\r- ${topInfoHeight} \n\r- ${bottomInfoHeight}`
            // );
            horizontalLayoutCardsInnerHeight = Math.max(
                0,
                horizontalLayoutCardsInnerHeight
            );
            horizontalLayoutCardsInnerWidth = Math.max(
                0,
                horizontalLayoutCardsInnerWidth
            );
            verticalLayoutCardsInnerWidth = Math.max(
                0,
                verticalLayoutCardsInnerWidth
            );
            verticalLayoutCardsInnerHeight = Math.max(
                0,
                verticalLayoutCardsInnerHeight
            );

            // console.log(
            //     "verticalLayoutCardsInnerWidth:",
            //     verticalLayoutCardsInnerWidth
            // );
            // console.log(
            //     "verticalLayoutCardsInnerHeight = maxOpponentSeatHeightPx - topInfoHeight - bottomInfoHeight | ",
            //     `${verticalLayoutCardsInnerHeight} =
            //     ${maxCardsHeightPxWithoutInfos} - ${topInfoHeight} - ${bottomInfoHeight}`
            // );
        }

        // Starting with biggest card size, see if it fits in either layout.
        // then, reduce it by steps until we find a layout where it fits.
        // if it won't fit in either layout at minimum size,
        // (?) increase totalTargetOpponentsHeightVh? up to 85% ?

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
                verticalLayoutCardsInnerHeight
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
                horizontalLayoutCardsInnerHeight
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

        // console.log(
        //     "cardSize = cardWidth / pxPerVw | ",
        //     `${cardSize} = ${cardWidth} / ${pxPerVw}`
        // );

        // acrossAndNumRows.numRows
        // acrossAndNumRows.cardsAcross

        // set seat's card width
        seatEl.style.setProperty("--card-width", cardSize);
        // legacy unit
        seatEl.style.setProperty("--card-unit", cardWidth / 6 / pxPerVw + "vw");

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
            ? horizontalLayoutCardsInnerHeight
            : verticalLayoutCardsInnerHeight;
        const acrossAndNumRows = getCardsAcrossAndNumRows({
            numCards,
            cardWidth,
            gapSize: cardWidth * 0.1,
            widthAvailable,
            heightAvailable,
        });

        const actualCardsRows = getNumberOfRows(cardsEl);

        if (actualCardsRows !== acrossAndNumRows.numRows) {
            console.log("actualCardsRows vs acrossAndNumRows.numRows:",actualCardsRows,acrossAndNumRows.numRows)
            console.log(
                "horizontalLayout:",
                horizontalLayoutCardsInnerWidth,
                horizontalLayoutCardsInnerHeight,
                "\n\rverticalLayout:",
                verticalLayoutCardsInnerWidth,
                verticalLayoutCardsInnerHeight,
                "\n\cardSize:",
                cardSize,
                "\n\rcards:",
                cardsEl.clientWidth,
                cardsEl.clientHeight
            );
        }

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
