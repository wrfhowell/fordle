'use strict'

let grid  = document.getElementById('grid')

let wordList = [ 
    'limb',
    'fork',
    'cart',
    'funk',
    'pink'
];

let randomIndex = Math.floor(Math.random() * wordList.length)
let solution = wordList[randomIndex]

let attempts = []
let currentAttempt = ''
buildGrid()
updateGrid()
window.addEventListener('keydown', handleKeyDown)

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
            cell.textContent = attempt[i]
        } else {
            cell.innerHTML = '<div style="opacity: 0">X</div>'
        }
        cell.style.backgroundColor = 'transparent'

    }

}

function getBgColor(attempt, i) {
    let correctLetter = solution[i];
    let attemptLetter = attempt[i];
    if (correctLetter === attemptLetter) {
        return '#48ADAB'
    } else if (solution.includes(attemptLetter)) {
        return '#D7C647'
    }
    return '#604D53' 
}

function handleKeyDown(e) {
    let letter = e.key.toLowerCase()
    if (letter === 'enter' ) {
        if(currentAttempt.length < 4) {
            return
        }
        if (!wordList.includes(currentAttempt)) {
            alert('Not a valid word')
            return
        }
        attempts.push(currentAttempt)
        currentAttempt = ''
    } else if (letter === 'backspace') {
        currentAttempt = currentAttempt.slice(0, currentAttempt.length - 1)
    } else if (/[a-z]/.test(letter)) {
        if (currentAttempt.length < 4) {
            currentAttempt += letter
        }
    }
    updateGrid()
}


