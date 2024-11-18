const counterWrapper = document.querySelector(".counter-wrapper");
const addNewCounterBtn = document.querySelector('.add-new-counter-btn');
const getSavedCounterBtn = document.querySelector('.load-saved-counter-btn');
const overlayElm = document.getElementById("overlay");

const countValueParaElement = counterWrapper.querySelector('.count-value');
const resetBtn = counterWrapper.querySelector('#reset-list-btn');
const increaseBtn = counterWrapper.querySelector('.count-increase-btn') ;

const catSVG = document.querySelector('.cat-svg') ;

let countTotal = 0;
let currentCountName = '';

// Fixed name to storage different counters (just like an Enum)
const counterListNameForLocalStorage = "countersList";

let countersList = [
    {
        name: 'cats',
        count: 10
    },
    {
        name: 'dogs',
        count: 90
    },
];

let dialogOpen = false;

window.onload = () => {
    const wrapperProperties = counterWrapper.getBoundingClientRect();
    const wrapperTop = wrapperProperties.top;
    const wrapperLeft = wrapperProperties.left;
    const wrapperWidth = wrapperProperties.width;
    catSVG.style.top = (wrapperTop - 102) + "px";
    catSVG.style.left = (wrapperLeft + (wrapperWidth / 2.3)) + "px";
    if(!localStorage.getItem(counterListNameForLocalStorage)) {
        localStorage.setItem(counterListNameForLocalStorage, JSON.stringify(countersList));
    }
}

increaseBtn.addEventListener('click', () => {
    const newNumber = createElementWithClass('span', 'show');
    newNumber.textContent = (countTotal + 1).toString().padStart(4, '0');

    // Add current number and apply the move-up animation
    const currentNumber = countValueParaElement.querySelectorAll("span");
    if (currentNumber) {
        currentNumber.forEach(e => e.classList.add("move-up"));
    }

    // Append the new number and increment count
    countValueParaElement.appendChild(newNumber);
    catSVG.querySelectorAll('.right-leg').forEach(e => e.classList.add("animate-right-leg"))
    countTotal++;

    // Clean up old numbers after animation
    setTimeout(() => {
        if (currentNumber) {
            catSVG.querySelectorAll('.right-leg').forEach(e => e.classList.remove("animate-right-leg"))
            currentNumber.forEach(e => {
                e.remove();
            })
        } 
    }, 300);
});

resetBtn.addEventListener("click", () => {
    const newNumber = createElementWithClass('span', 'show');
    countTotal = 0;
    newNumber.textContent = (countTotal).toString().padStart(4, '0');

    countValueParaElement.innerHTML = "";
    countValueParaElement.appendChild(newNumber);
})

addNewCounterBtn.addEventListener("click", () => {
    toggleOverlay();
    const dialog = createElementWithClass('article', 'dialog');
    const heading = createElementWithClassAndText('h2', 'dialog-heading', "Neuen Zähler erstellen");
    const inputsForm = createElementWithClass('form', 'inputs-form');

    const counterNameInputField = createInputFieldRequired('Name eingeben', 'name-input-field')

    const btnsWrapper = createElementWithClass('div', 'btns-wrapper');
    const cancelBtn = createElementWithClassAndText('button', 'cancel-btn', 'abbrechen');
    const saveBtn = createElementWithClassAndText('button', 'save-btn', 'speichern');

    btnsWrapper.appendChild(cancelBtn);
    btnsWrapper.appendChild(saveBtn);

    inputsForm.appendChild(counterNameInputField);
    inputsForm.appendChild(btnsWrapper);

    dialog.appendChild(heading);
    dialog.appendChild(inputsForm);
    overlay.appendChild(dialog);

    if(currentCountName.length > 0) {
        counterNameInputField.value = currentCountName;
    } 

    inputsForm.addEventListener("submit", (e) => addNewCounter(e, counterNameInputField, overlayElm))

    cancelBtn.addEventListener("click", (e) => {
        e.preventDefault();
        closeDialog(overlayElm);
    })

})

// @overlay reference to hide it

function addNewCounter(e, inputField, overlay) {
    e.preventDefault();
    let found = false;
    const counterName = inputField.value;

    inputField.addEventListener('input', (e) => {
        counterName = e.target.value;
    })

    if(counterName.length > 0) {
        countersList = countersList.map(eachCounter => {
            if(eachCounter.name === counterName) {
                found = true;
                eachCounter = {
                    name: counterName,
                    count: countTotal
                }
                return eachCounter;
            }
            return eachCounter;
        })
         
        if(!found) {
            countersList.push({
                name: counterName,
                count: countTotal
            })
        }

        localStorage.setItem(counterListNameForLocalStorage, JSON.stringify(countersList));
    }

    closeDialog(overlay);
}

getSavedCounterBtn.addEventListener('click', () => {
    toggleOverlay();
    const dialog = createElementWithClass('article', 'dialog');
    const heading = createElementWithClassAndText('h2', 'dialog-heading', "Wählen Sie einen Zähler aus");

    const savedCountersList = JSON.parse(localStorage.getItem(counterListNameForLocalStorage));
    const countersList = createCountersList(savedCountersList);

    dialog.appendChild(heading);
    dialog.appendChild(countersList);

    dialog.addEventListener("click", (e) => {
        const displayCountBtn = e.target.closest("button.display-counter-btn");
        if(displayCountBtn !== null) {
            const counterName = displayCountBtn.querySelector('.each-counter-name').textContent;
            const counterCount = displayCountBtn.querySelector('.each-counter-count').textContent;
            updateUIWithClickCounter(counterName, counterCount);
            closeDialog(overlay);
        }
    })

    overlay.appendChild(dialog);
})

function updateUIWithClickCounter(counterName, counterValue) {
    const newNumber = createElementWithClass('span', 'show');
    currentCountName = counterName;
    countTotal = parseInt(counterValue);
    newNumber.textContent = (countTotal).toString().padStart(4, '0');

    countValueParaElement.innerHTML = "";
    countValueParaElement.appendChild(newNumber);

}

// helper functions

function toggleOverlay() {
    overlay.style.display = "flex";
    dialogOpen = true;
    closeOnOutsideClick(dialogOpen);
}

function createCountersList(counterArray) {
    const unorderedList = createElementWithClass('ul', 'counters-list');
    for(let i = 0; i < counterArray.length; i++) {
        const listItemElm = createElementWithClass('li', 'each-counter');
        const btnToDisplayCounter = createElementWithClass('button', 'display-counter-btn');
        const counterNameElm = createElementWithClassAndText('p', 'each-counter-name', counterArray[i].name);
        const counterCount = createElementWithClassAndText('p', 'each-counter-count', counterArray[i].count);
        btnToDisplayCounter.appendChild(counterNameElm);
        btnToDisplayCounter.appendChild(counterCount);
        listItemElm.appendChild(btnToDisplayCounter);
        unorderedList.appendChild(listItemElm);
    }
    return unorderedList;
}

function createElementWithClass(elmName, classToAdd) {
    const elm = document.createElement(elmName);
    elm.classList.add(classToAdd);
    return elm;
}

function createElementWithClassAndText(elmName, classToAdd, text) {
    const elm = createElementWithClass(elmName, classToAdd);
    elm.textContent = text;
    return elm;
}

function createInputFieldRequired(placeholderText, classToAdd) {
    const elm = createElementWithClassAndText('input', classToAdd);
    elm.placeholder = placeholderText;
    elm.required = true;
    return elm;
}

function closeOnOutsideClick(dialogOpen) {
    if(dialogOpen) {
        document.onclick = (e) => {
            if(e.target.id === 'overlay') {
                overlay.style.display = "none";
                overlay.innerHTML = '';
                dialogOpen = false;
            }
        }
    }
}

function closeDialog(overlay) {
    overlay.style.display = "none";
    overlay.innerHTML = '';
    dialogOpen = false;
}

