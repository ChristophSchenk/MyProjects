window.onload = function() {

     // Function to create the blue square with a click event
     function createButton(url) {
        const textElement = document.createElement('div');
        textElement.style.width = "30px";  // Adjust width as needed
        textElement.style.height = "30px"; // Adjust height as needed
        textElement.style.backgroundColor = "green";  // Background color for better visibility
        textElement.style.color = "black";  // Text color
        textElement.style.display = "flex";
        textElement.style.alignItems = "center";
        textElement.style.justifyContent = "center";
        textElement.style.position = "absolute";  // Absolute positioning relative to parent
        textElement.style.top = "6.75%";  // Center vertically
        textElement.style.left = "90.5%"; // Center horizontally
        textElement.style.transform = "translate(-50%, -50%)";  // Adjust for exact centering
        textElement.style.zIndex = "1000";  // Move it to the foreground
        //textElement.textContent = "";  // Set the text content
        
        // Add click event listener
        textElement.addEventListener('click', () => {
            // Open URL in a new tab and store the reference to the new window
            const newTab = window.open(url, '_blank'); 
            // Call the function after a timeout to ensure the page is fully loaded
            setTimeout(getBuffPriceFromPage, 3000);

            // Listen for messages from the new tab
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                if (message.type === 'buffPrice') {
                    console.log('Buff price received from new tab:', message.price);
                    // Now you can update the green square with the price
                    textElement.textContent = `$${message.price}`;
                    // Call the function after a timeout to ensure the page is fully loaded
                }
            });
            // Optionally: set a timeout or check for window closure to stop listening
        });
        
        return textElement;
    }

    // Function to get the Buff price from the page
    function getBuffPriceFromPage() {
        let buffPrice = 1000000;
        const buffElement = document.querySelector('a[href*="buff163"]');
        
        if (buffElement) {
            try {
                const priceElement = buffElement.closest('div').querySelector('div.w-1/2.sm\\:w-1\\/4.p-4.flex-none span.font-bold.text-xl');
                if (priceElement) {
                    const priceText = priceElement.textContent;
                    const priceCleaned = parseFloat(priceText.replace('$', '').replace(',', ''));
                    buffPrice = priceCleaned;

                    // Send the price back to the original tab
                    chrome.runtime.sendMessage({ type: 'buffPrice', price: buffPrice });
                }
            } catch (error) {
                console.error('Error extracting buff price:', error);
            }
        } else {
            console.error("Buff element not found!");
        }

        console.log(buffPrice);
        return buffPrice;
    }

    // Function to add a blue square to a single item card
    function addUrlButtonToItemCard(itemCard) {
        if (!itemCard.querySelector('.blue-square-wrapper')) {
            const newSquare = document.createElement('div');
            newSquare.classList.add('blue-square-wrapper'); // Adding a class to avoid duplicate squares
    
            const itemCardUrl = buildItemCardUrl(itemCard);
            const blueSquare = createButton(itemCardUrl);
            newSquare.appendChild(blueSquare);
            itemCard.appendChild(newSquare);
        }
    }

    function buildItemCardUrl(itemCard) {
        // Check if the item card is not null
        if (!itemCard) {
            console.error("Item Card is null or undefined");
            return;
        }

        // Query the elements inside the item card
        const itemConditionElem = itemCard.querySelector('[data-testid="item-card-quality"]');
        const itemTypeElem = itemCard.querySelector('[data-testid="item-card-item-type"]');
        const itemNameElem = itemCard.querySelector('[data-testid="item-card-item-name"]');

        // Extract text content and handle null cases
        const itemCondition = itemConditionElem ? itemConditionElem.textContent.toLowerCase() : "";
        const itemType = itemTypeElem ? itemTypeElem.textContent.toLowerCase().replace("★ ", "") : "";
        //Replace all phases from doppler weapons because csgoskins doesnt differentiate between phases for the url
        const itemName = itemNameElem ? itemNameElem.textContent.toLowerCase()
        .replace("'", "")
        .replace(" - phase 1", "")
        .replace(" - phase 2", "")
        .replace(" - phase 3", "")
        .replace(" - phase 4", "") 
        : "";

        // Print the extracted values
        //console.log(itemCondition);
        //console.log(itemType);
        //console.log(itemName);

        // Build the item URL (consider appending the values to the URL if necessary)
        let buildItemUrl = "https://csgoskins.gg/items/";

        //Url for stat trak and souvenir weapon skins
        if (itemType.includes("stattrak") || itemType.includes("souvenir")) {

            if (itemType.includes("stattrak")) {
                const itemTypeModified = itemType.substring(10);
                buildItemUrl += itemTypeModified.replace(/ /g, "-");
                buildItemUrl += "-";
                buildItemUrl += itemName.replace(/ /g, "-");
                buildItemUrl += "/stattrak-";
                buildItemUrl += itemCondition.replace(/ /g, "-");
            } 
            else {
                const itemTypeModified = itemType.substring(9);
                buildItemUrl += itemTypeModified.replace(/ /g, "-");
                buildItemUrl += "-";
                buildItemUrl += itemName.replace(/ /g, "-");
                buildItemUrl += "/souvenir-";
                buildItemUrl += itemCondition.replace(/ /g, "-");
            }
        }

        //Url for cases
        else if (itemName.includes("case") && !itemName.includes("case hardened")) {
            const itemNameModified = itemName.replace("cs:go", "csgo").replace(" & ", "-")

            buildItemUrl += itemNameModified.replace(/ /g, "-")
        }

        //Url for stickers
        else if (itemType.includes("sticker")) {
            buildItemUrl += itemType;
            buildItemUrl += "-";

            //Stickers from majors contain " - " to separate the Major name from the year
            if (itemName.includes(" - ")) {
                if (itemCondition === "") {
                    const itemNameModified = itemName.replace(" - ", "-").replace(/ /g, "-");
                    buildItemUrl += itemNameModified;
                } 
                else {
                    const itemNameModified = itemName.replace(" - ", "-" + itemCondition + "-").replace(/ /g, "-");
                    buildItemUrl += itemNameModified;
                }
            }
            else {
                buildItemUrl += itemName.replace(/ /g, "-");
                buildItemUrl += "-";
                buildItemUrl += itemCondition.replace(/ /g, "-");
            }
        }

        //Url for music kits
        else if (itemType.includes("music kit") || itemName.includes("music kit")) {
            const itemNameModified = itemName.replace("music kit | ", "").replace(/,/g, "").replace(/ & /g, " ").replace("stattrak™ ", "").replace(/ /g, "-");
            
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
        else if (itemCondition === "" && itemType === "") {
            const itemNameModified = itemName.replace(" | ", "-").replace(/ /g, "-");
            buildItemUrl += itemNameModified;
        }

        else if (itemType.includes("patch")) {
            let itemNameModified = "";

            if (itemCondition === "") {
                itemNameModified += itemName.replace(" - ", "-").replace(/ /g, "-");
            } 
            else {
                itemNameModified += itemName.replace(" - ", "-" + itemCondition + "-").replace(/ /g, "-");
            }

            buildItemUrl += itemType;
            buildItemUrl += "-";
            buildItemUrl += itemNameModified; 
        }

        //Url for "normal WEAPON skins" so NO stattrak, souvenir, cases, capsules, patches, and more!
        else {
            buildItemUrl += itemType.replace(/ /g, "-");
            buildItemUrl += "-";
            buildItemUrl += itemName.replace(/ /g, "-");
            buildItemUrl += "/";
            buildItemUrl += itemCondition.replace(/ /g, "-");
        }

        // Print the URL
        buildItemUrl = buildItemUrl.replace("(holo/foil)", "holo-foil").replace("legends-", "legends-holo-foil").replace("-/", "/")
        .replace(/\./g, "").replace("csgoskinsgg", "csgoskins.gg").replace("!", "").replace("ö", "o").replace("'", "").replace("'", "")
        .replace("---", "-").replace("--", "-");
        return buildItemUrl;
    }

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Process only newly added nodes
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('relative') && node.classList.contains('rounded-lg') && node.classList.contains('bg-dark-3')) {
                        // Add blue square to the new item card
                        addUrlButtonToItemCard(node);
                    }
                });
            }
        }
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
};
