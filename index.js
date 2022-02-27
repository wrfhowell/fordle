'use strict'

let wordList = [ 
    'limb',
    'fork',
    'cart',
    'funk',
    'pink',
    "affe"
];

let randomIndex = Math.floor(Math.random() * wordList.length)
let solution = wordList[0]

let attempts = []
let currentAttempt = ''

let grid  = document.getElementById('grid')
let keyboard = document.getElementById('keyboard')


function buildGrid() {
    for (let i = 0; i < 6; i++) {
        let row = document.createElement('div')
        for (let j = 0; j < 4; j++) {
            let cell = document.createElement('div')
            cell.className = 'cell'
            cell.textContent = ''
            row.appendChild(cell)
        }
        grid.appendChild(row)
    }
}

function updateGrid() {
    let row = grid.firstChild
    for (let attempt of attempts) {
        drawPastAttempt(row, attempt)
        row = row.nextSibling
    }
    drawCurrentAttempt(row, currentAttempt)
}

function drawPastAttempt(row, attempt) {
    for (let i = 0; i < 4; i++) {
        let cell= row.children[i]
        if (attempt[i] !== undefined) {
            cell.textContent = attempt[i]
        } else {
            cell.innerHTML = '<div style="opacity: 0">X</div>'
        }
        
        cell.style.backgroundColor = getBgColor(attempt,i)
        cell.style.border = '0.04em solid transparent'

    }

}

function drawCurrentAttempt(row, attempt) {
    for (let i = 0; i < 4; i++) {
        let cell= row.children[i]
        if (attempt[i] !== undefined) {
            cell.style.borderColor = 'white'
            cell.textContent = attempt[i]
        } else {
            cell.innerHTML = '<div style="opacity: 0">X</div>'
            cell.style.borderColor = '#D3D3D3'
        }
        cell.style.backgroundColor = 'transparent'

    }

}

let GREEN = '#48ADAB'
let YELLOW = '#D7C647'
let GREY = '#604D53'

function getBgColor(attempt, i) {
    let correctLetter = solution[i];
    let attemptLetter = attempt[i];
    if (correctLetter === attemptLetter) {
        return GREEN
    } else if (solution.includes(attemptLetter)) {
        return YELLOW
    }
    return GREY 
}

function handleKeyDown(e) {
    // ignore commands
    if (e.ctrlKey || e.metaKey || e.altKey) {
        return
    }

    handleKeyPress(e.key);
}

function buildKeyboard() {
    buildKeyboardRow('qwertyuiop', false)
    buildKeyboardRow('asdfghjkl', false)
    buildKeyboardRow('zxcvbnm', true)
}

function buildKeyboardRow(letters, isLastRow) {
    let row = document.createElement('div')
    row.style.alignContent = true;

    if (isLastRow) {
        let button = document.createElement('button')
        button.className = 'keyboardButton'
        button.textContent = 'enter'
        button.style.fontSize = '10px'
        button.onclick = () => {
            handleKeyPress('enter')
        };
        row.appendChild(button)
    }
    for (let letter of letters) {
        let button = document.createElement('button')
        button.className = 'keyboardButton'
        button.textContent = letter
        button.onclick = () => {
            handleKeyPress(letter)
        };
        keyboardButtons.set(letter, button)
        row.appendChild(button)
    }
    if (isLastRow) {
        let button = document.createElement('button')
        button.className = 'keyboardButton'
        button.textContent = 'del'
        button.style.fontSize = '10px'
        button.onclick = () => {
            handleKeyPress('backspace')
        };
        row.appendChild(button)
    }
    
    
    keyboard.appendChild(row)
    
}


function handleKeyPress(key) {
    if (attempts[attempts.length - 1] === solution) {
        return
    }
    if (attempts.length === 6) {
        return
    }
    let letter = key.toLowerCase()
    if (letter === 'enter' ) {
        if(currentAttempt.length < 4) {
            return
        }
        if (!wordList.includes(currentAttempt)) {
            alert('Not a valid word')
            return
        }
        if (attempts.length === 5 && currentAttempt !== solution) {
            alert(solution)
        }
        attempts.push(currentAttempt)
        currentAttempt = ''
        updateKeyboard()
        saveGame()
        

    } 
    //delete letter on backspace
    else if (letter === 'backspace') {
        currentAttempt = currentAttempt.slice(0, currentAttempt.length - 1)
    } 
    // add letter if letter pressed and less than 4 chars in currentAttempt
    else if (/^[a-z]$/.test(letter)) {
        if (currentAttempt.length < 4) {
            currentAttempt += letter
        }
    }
    updateGrid()
}

function getBetterColor(a,b) {
    if (a === GREEN || b === GREEN) {
        return GREEN
    }
    if (a === YELLOW || b === YELLOW) {
        return YELLOW
    }
    return '#303030'
}

let keyboardButtons = new Map()
function updateKeyboard() {
    let bestColors = new Map()
    for (let attempt of attempts) {
        for (let i = 0; i < attempt.length; i++) {
            let color = getBgColor(attempt, i)
            let bestColor = bestColors.get(color)
            bestColors.set(attempt[i], getBetterColor(color, bestColor))
        }
    }

    for (let [key, button] of keyboardButtons) {
         button.style.backgroundColor = bestColors.get(key)
    }
}

function loadGame() {
    let data
    try {
        data = JSON.parse(localStorage.getItem('data'))
    } catch { }
    if (data != null) {
        if (data.solution === solution) {
            attempts = data.attempts
        }
    }
}

function saveGame() {
    let data = JSON.stringify({
        solution,
        attempts
    })
    try {
        localStorage.setItem('data', data)
    } catch {}
}

loadGame()
buildGrid()
buildKeyboard()
updateGrid()
updateKeyboard()
window.addEventListener('keydown', handleKeyDown)
