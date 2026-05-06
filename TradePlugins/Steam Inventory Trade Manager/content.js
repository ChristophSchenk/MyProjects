window.onload = function() {

    //IMPORTANT BROWSER CONSOLE COMMAND TO CLEAR CACHE: "localStorage.clear();" / "window.localStorage.clear();"
    //YOUR NOTES WILL BE DELETED BY USING THIS COMMAND INTO THE BROWSER CONSOLE (Press F12 to get to this console)

    // Function to create the button with click event
    function createButton(url, itemId) {
        const button = document.createElement('div');
        button.style.width = "16px";
        button.style.height = "16px";
        button.style.backgroundColor = "green";
        button.style.color = "black";
        button.style.display = "flex";
        button.style.alignItems = "center";
        button.style.justifyContent = "center";
        button.style.position = "absolute";
        button.style.top = "8%";
        button.style.left = "92%";
        button.style.transform = "translate(-50%, -50%)";
        button.style.zIndex = "1000";
        button.textContent = "";

        // Load button color from localStorage
        const notes = JSON.parse(localStorage.getItem('notes')) || {};
        const buttonColor = notes[itemId]?.color;
        if (buttonColor) {
            button.style.backgroundColor = buttonColor;
        }

        // Add click event listener to show/hide note
        button.addEventListener('click', () => {
            toggleNoteVisibility(button, itemId);
        });

        return button;
    }

    // Function to create the note element
    function createNote(button, itemId) {
        const noteContainer = document.createElement('div');
        noteContainer.style.position = "absolute";
        noteContainer.style.top = "20%";
        noteContainer.style.left = "50%";
        noteContainer.style.transform = "translate(-50%, -50%)";
        noteContainer.style.backgroundColor = "#fff";
        noteContainer.style.border = "1px solid #000";
        noteContainer.style.padding = "10px";
        noteContainer.style.zIndex = "1001";
        noteContainer.style.display = "none"; // Initially hidden

        const textArea = document.createElement('textarea');
        textArea.style.width = "200px";
        textArea.style.height = "100px";
        noteContainer.appendChild(textArea);

        // Load note text from localStorage
        const notes = JSON.parse(localStorage.getItem('notes')) || {};
        const savedNote = notes[itemId]?.text;
        if (savedNote) {
            textArea.value = savedNote;
        }

        const saveButton = document.createElement('button');
        saveButton.textContent = "Save";
        saveButton.addEventListener('click', () => {
            saveNoteText(textArea.value, itemId);
            noteContainer.style.display = "none"; // Hide the note after saving
        });
        noteContainer.appendChild(saveButton);

        return noteContainer;
    }

    // Function to show/hide the note
    function toggleNoteVisibility(button, itemId) {
        const itemCard = button.closest('.item');
        let noteContainer = itemCard.querySelector('.note-container');

        if (!noteContainer) {
            noteContainer = createNote(button, itemId);
            noteContainer.classList.add('note-container');
            itemCard.appendChild(noteContainer);
        }

        noteContainer.style.display = noteContainer.style.display === "none" ? "block" : "none";
    }

    // Function to save note text and button color to localStorage
    function saveNoteText(text, itemId) {
        const notes = JSON.parse(localStorage.getItem('notes')) || {};
        notes[itemId] = {
            text: text,
            color: text.trim() === "" ? "green" : "red"
        };
        localStorage.setItem('notes', JSON.stringify(notes));

        const button = document.querySelector(`[data-item-id="${itemId}"]`);
        if (button) {
            button.style.backgroundColor = notes[itemId].color;
        }
        console.log("Note saved:", text); // Replace with your saving logic
    }

    function addUrlButtonToItemCard(itemCard) {
        if (!itemCard.querySelector('.blue-square-wrapper')) {
            const newSquare = document.createElement('div');
            newSquare.classList.add('blue-square-wrapper');

            const itemId = itemCard.id; // Assuming each itemCard has a unique ID
            const itemCardUrl = "https://www.youtube.com";
            const blueSquare = createButton(itemCardUrl, itemId);
            blueSquare.setAttribute('data-item-id', itemId); // Add data attribute for itemId
            newSquare.appendChild(blueSquare);
            itemCard.appendChild(newSquare);
        }
    }

    function processItemCards() {
        const items = document.querySelectorAll('.item.app730.context2');
        items.forEach(item => {
            addUrlButtonToItemCard(item);
        });
    }

    setTimeout(processItemCards, 1000);
    setInterval(processItemCards, 5000);

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const items = node.querySelectorAll('.item.app730.context2');
                        items.forEach(item => {
                            addUrlButtonToItemCard(item);
                        });
                    }
                });
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
};
