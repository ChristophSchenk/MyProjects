window.onload = function() {
    
     // Function to create the blue square with a click event
     function createButton(url, textContent, isStickerPatch) {
        if (textContent === null) {
            textContent = "";
        }
    
        const textElement = document.createElement('div');
        textElement.style.width = "90px";  // Adjust width as needed
        textElement.style.height = "30px"; // Adjust height as needed
        textElement.style.backgroundColor = "green";  // Background color for better visibility
        textElement.style.color = "black";  // Text color
        textElement.style.display = "flex";
        textElement.style.alignItems = "center";
        textElement.style.justifyContent = "center";
        textElement.style.position = "absolute";  // Absolute positioning relative to parent
        textElement.style.top = "6.75%";  // Center vertically
        textElement.style.left = "75%"; // Center horizontally
        textElement.style.transform = "translate(-50%, -50%)";  // Adjust for exact centering
        textElement.style.zIndex = "1000";  // Move it to the foreground
        textElement.textContent = textContent;  // Set the text content
    
        // Add click event listener
        textElement.addEventListener('click', (event) => {
            event.stopPropagation();  // Prevents the click from bubbling up to parent elements

            //const regex = /20\d{2}/;

            const newTab = window.open(url, '_blank');
        });
    
        return textElement;
    }

    function WearShortcutToExpression(shortcutText) {
        if (!shortcutText || typeof shortcutText !== 'string') {
            return "WEAR-COULD-NOT-BE-DETECTED!!!";
        }
        
        shortcutText = shortcutText.toLowerCase();  // Normalize the text to lowercase for consistent checks
    
        if (shortcutText.includes("fn")) {
            return "factory-new";
        } else if (shortcutText.includes("mw")) {
            return "minimal-wear";
        } else if (shortcutText.includes("ft")) {
            return "field-tested";
        } else if (shortcutText.includes("ww")) {
            return "well-worn";
        } else if (shortcutText.includes("bs")) {
            return "battle-scarred";
        } else {
            return "WEAR-COULD-NOT-BE-DETECTED!!!";
        }
    }

    // Function to add a blue square to a single item card
    function addUrlButtonToItemCard(itemCard) {

            // Query the elements inside the item card
            function getTextContent(selector) {
                const element = itemCard.querySelector(selector);
                return element ? element.textContent.trim().toLowerCase() : "";
            }

        if (!itemCard.querySelector('.blue-square-wrapper')) {

            const itemTypeElem = getTextContent('span.fs-10.fw-600.lh-16.ellipsis');
            const itemNameElem = getTextContent('label[data-test="item-name"]');
            const itemPriceElem = getTextContent('span[data-test="value"]');
            const itemPercentElem = getTextContent('span.lh-16.fw-600.fs-10.ng-star-inserted');
            const itemWearShortcutElem = itemCard.querySelector('cw-item-details div.tw-text-xs.fw-600.tw-flex.tw-mb-1.tw-justify-between > div > span');
            //const itemWearShortcutElem = itemCard.querySelector('cw-item-float-indicator .fs-12.fw-600 span');  ALTE EXPRESSION, NUN OUTDATED
            //let shortcutTextContent = itemWearShortcutElem.textContent;
            //console.error(shortcutTextContent);
            const itemStickerConditionElem = itemCard.querySelector('span.sticker.d-flex.text-uppercase.justify-content-center');

        
            // Use the extracted text content to build the URL
            const itemType = itemTypeElem ? itemTypeElem.toLowerCase() : "";
            let itemName = "";
            if(itemType.includes ("★ ") && !itemType.includes("gloves")) {
                    itemName += itemNameElem ? itemNameElem.toLowerCase().replace(" phase 1", "").replace(" phase 2", "").replace(" phase 3", "")
                    .replace(" phase 4", "").replace("emerald", "doppler").replace("ruby", "doppler").replace("black pearl", "doppler").replace("sapphire", "doppler") : "";
            }
            else {
                itemName += itemNameElem ? itemNameElem.toLowerCase().replace(" phase 1", "").replace(" phase 2", "").replace(" phase 3", "")
                .replace(" phase 4", "").replace("black pearl", "doppler").replace("sapphire", "doppler") : "";
            }

            const itemPrice = itemPriceElem ? itemPriceElem.toLowerCase() : "";
            const itemPercent = itemPercentElem ? itemPercentElem.toLowerCase() : "";

    	    let itemWearExpression = "none";  // Default value if not found
            if (itemWearShortcutElem && itemWearShortcutElem.textContent) {
                itemWearExpression = WearShortcutToExpression(itemWearShortcutElem.textContent.trim());
            }

            let itemStickerCondition = "none";
            if (itemStickerConditionElem && itemStickerConditionElem.textContent) {
                itemStickerCondition = itemStickerConditionElem.textContent.trim().toLowerCase();
            }

        
            //console.error("itemType: " + itemType);
            //console.error("itemName: " + itemName);
            //console.error("itemPrice: " + itemPrice);
            //console.error("itemPercent: " + itemPercent);
            //console.error("itemWearExpression: " + itemWearExpression);

            const newSquare = document.createElement('div');
            newSquare.classList.add('blue-square-wrapper'); // Adding a class to avoid duplicate squares
    
            const itemCardUrl = buildItemCardUrl(itemCard, itemType, itemName, itemWearExpression, itemStickerCondition);
            //const itemCardUrl = "Alfons";
            const zeroPercentPrice = getZeroPercentPrice(itemPrice, itemPercent);
            const isStickerPatch = isStickerPatchBestimmer(itemType);

            //const itemCardUrl = "https://www.youtube.com/"
            const blueSquare = createButton(itemCardUrl, zeroPercentPrice, isStickerPatch);
            newSquare.appendChild(blueSquare);
            itemCard.appendChild(newSquare);
        }
    }

    function isStickerPatchBestimmer(itemType) {
        if (itemType.includes("sticker") || itemType.includes("patch")) {
            return true;
        }
        else {
            return false;
        }
    }

    function getZeroPercentPrice(price, percentage) {
        // Remove non-numeric characters and convert to float
        const priceNumber = parseFloat(price.replace(/[^0-9.]/g, ''));
        let percentageNumber = parseFloat(percentage.replace(/[^0-9.-]/g, '')); // Include "-" in regex for negative values
    
        // If percentage is null or NaN, default to 0
        if (isNaN(percentageNumber)) {
            percentageNumber = 0;
        }
    
        if (isNaN(priceNumber)) {
            console.error("Invalid price value.");
            return "ERROR";
        }
    
        // If the percentage is 0, return the original price
        if (percentageNumber === 0) {
            return priceNumber.toFixed(2);  // Return the original price rounded to 2 decimal places
        }
    
        // Calculate the zero percent price
        // For negative percentages, the formula is: price / (1 + (percentageNumber / 100))
        const zeroPercentPrice = priceNumber / (1 + (percentageNumber / 100));
    
        return zeroPercentPrice.toFixed(2);  // Return the result rounded to 2 decimal places
    }

    function buildItemCardUrl(itemCard, itemType, itemNameUnmodified, itemWearExpressionUnmodified, itemStickerCondition) {
        let itemWearExpression; 
        let itemName = itemNameUnmodified.replace(/ \| /g, "--")

        // Check if the item card is not null
        if (!itemCard) {
            console.error("Item Card is null or undefined");
            return;
        }

        if (itemWearExpressionUnmodified === "WEAR-COULD-NOT-BE-DETECTED!!!") {
            itemWearExpression = "";
        }
        else {
            itemWearExpression = itemWearExpressionUnmodified;
        }
    
        // Query the elements inside the item card
        // Print the extracted values
        //console.log(itemWearExpression);
        //console.log(itemType);
        //console.log(itemName);

        // Build the item URL (consider appending the values to the URL if necessary)
        let buildItemUrl = "https://csgoskins.gg/items/";

        //Url for stat trak and souvenir weapon skins
        if (itemType.includes("stattrak") || itemType.includes("souvenir") && !itemType.includes("package")) {

            if (itemType.includes("stattrak")) {
                const itemTypeModified = itemType.replace("★ ", "").substring(10);
                buildItemUrl += itemTypeModified.replace(/ /g, "-");
                buildItemUrl += "-";
                if (itemName === "" && itemType.includes("★ ")) {
                    buildItemUrl += "vanilla";
                    buildItemUrl += "/stattrak";
                }
                else {
                    buildItemUrl += itemName.replace(/ /g, "-").replace("--", "-");
                    buildItemUrl += "/stattrak-";
                    buildItemUrl += itemWearExpression.replace(/ /g, "-");
                }
                //console.error("Stat trak item url: " + buildItemUrl);
            } 
            else {
                //console.error("Souvenir item found!");
                const itemTypeModified = itemType.substring(9);
                buildItemUrl += itemTypeModified.replace(/ /g, "-");
                buildItemUrl += "-";
                buildItemUrl += itemName.replace(/ /g, "-").replace("--", "-");
                buildItemUrl += "/souvenir-";
                buildItemUrl += itemWearExpression.replace(/ /g, "-");
            }
        }

        else if (itemType.includes("souvenir") && itemType.includes("package")) {
            buildItemUrl += itemType.replace("--", "--").replace(/ /g, "-");
        }

        //Url for cases
        else if (itemName.includes("case") && !itemName.includes("case hardened")) {
            const itemNameModified = itemName.replace("cs:go", "csgo").replace(" & ", "-").replace("--", "-");

            buildItemUrl += itemNameModified.replace(/ /g, "-");
        }

        else if (itemType.includes("sticker")) {
            buildItemUrl += itemType;
            buildItemUrl += "-";
            let itemNameModified

            if (itemName.includes("--")) {
                itemNameModified = itemName.replace("--", "-" + itemStickerCondition + "-").replace(/ /g, "-");
                buildItemUrl += itemNameModified
            }
            else {
                itemNameModified = itemName.replace(/ /g, "-");
                buildItemUrl += itemNameModified
                buildItemUrl += "-"
                buildItemUrl += itemStickerCondition
            }
        }


        //Url for music kits
        else if (itemType.includes("music kit") || itemName.includes("music kit")) {
            const itemNameModified = itemName.replace("music kit | ", "").replace(/,/g, "").replace(/ & /g, " ").replace("stattrak™ ", "").replace(/ /g, "-").replace("--", "-");
            
            buildItemUrl += "music-kit-";
            if (itemName.includes("hua lian")) {
                buildItemUrl += "perfect-world-hua-lian-painted-face";
            }
            else {
                buildItemUrl += itemNameModified;
            }

            if (itemName.includes("stattrak")) {
                buildItemUrl += "/stattrak";
            }
            else {
                buildItemUrl += "/normal";
            }
        }

        //Url for different items which only contain a name as a description (For example included are Patches without majors)
        else if (itemWearExpression === "" && itemType === "") {
            const itemNameModified = itemName.replace("--", "-").replace(/ /g, "-");
            buildItemUrl += itemNameModified;
        }

        else if (itemType.includes("patch")) {
            buildItemUrl += itemType;
            buildItemUrl += "-";
            const itemNameModified = itemName.replace("--", "--").replace(/ /g, "-");
            buildItemUrl += itemNameModified;
        }

        //Url for "normal WEAPON skins" so NO stattrak, souvenir, cases, capsules, patches, and more!
        else {

            if (itemName === "" && itemType.includes("★ ")) {
                buildItemUrl += itemType.replace("★ ", "").replace(/ /g, "-");
                buildItemUrl += "-";
                buildItemUrl += "vanilla";
            }
            else {
                buildItemUrl += itemType.replace("★ ", "").replace(/ /g, "-");
                buildItemUrl += "-";
                buildItemUrl += itemName.replace(/ /g, "-").replace("--", "-");
                buildItemUrl += "/";
                buildItemUrl += itemWearExpression.replace(/ /g, "-");
            }
        }

        //buildItemUrl = buildItemUrl.replace(/'/g, "");

        //console.error(buildItemUrl);
        const urlReturnFixed = buildItemUrl.replace(/\./g, "").replace("legends-", "legends-holo-foil").replace("-/", "/").replace("undefined", "").replace("(holo/foil)", "holo-foil")
        .replace("csgoskinsgg", "csgoskins.gg").replace("!", "").replace("弐", "2").replace("壱", "1").replace("ö", "o").replace("'", "").replace("'", "")
        .replace("---", "-").replace("--", "-").replace("-none-", "-").replace("m4a4-龍王-(dragon-king)", "m4a4-dragon-king");
        return urlReturnFixed;
    }

    
    function test() {
        let itemCardTest = document.querySelector("body > cw-root > mat-sidenav-container > mat-sidenav-content > div > cw-withdraw > cw-withdraw-search-grid > div > div > div:nth-child(1) > cw-csgo-market-item-card > div")
        if (itemCardTest === null) {
            console.error("ERROR, cannot find the test item card (slot one of the items list)")
        } else {
            //console.error("SUCCESS, found the item card test button!");
            addUrlButtonToItemCard(itemCardTest);
        }
    }

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Ensure it's an element node
    
                        // Attempt to find the item card based on the closest selector
                        const itemCard = node.closest('cw-csgo-market-item-card');
                        if (itemCard && itemCard.querySelector('.item-card.selectable')) {
                            //console.error("Node has been found");
                            addUrlButtonToItemCard(itemCard.querySelector('.item-card.selectable'));
                        }
                    }
                });
            }
        }
    });


    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
};
