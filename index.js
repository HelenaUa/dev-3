const inputText = document.getElementById('inputText');
const displayTextButton = document.getElementById('displayText');
const textDisplay = document.getElementById('text-display');

let isSelecting = false;
let selectionStart = null;
let highlightRect = null;
let selectedLetters = [];
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;

// Показати введений рядок у блоці
displayTextButton.addEventListener('click', () => {
    const text = inputText.value;
    inputText.value = ''; 

    // Створити кожну літеру окремим спаном
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.classList.add('letter');
        span.dataset.index = index;

        // Додавання обробника для переміщення при ctrl+click
        span.addEventListener('click', (e) => {
            if (e.ctrlKey) {
                if (span.classList.contains('selected')) {
                    span.classList.remove('selected');
                } else {
                    span.classList.add('selected');
                }
            }
        });

        // Додавання функціоналу для перетягування літери
        span.addEventListener('mousedown', (e) => {
            draggedElement = span;
            offsetX = e.offsetX;
            offsetY = e.offsetY;
        });

        textDisplay.appendChild(span);
    });
});

// Переміщення літери за курсором миші
document.addEventListener('mousemove', (e) => {
    if (draggedElement) {
        draggedElement.style.position = 'absolute';
        draggedElement.style.left = `${e.pageX - offsetX}px`;
        draggedElement.style.top = `${e.pageY - offsetY}px`;
    }
});

// Відпустити літеру
document.addEventListener('mouseup', () => {
    draggedElement = null;
});

// Функція для виділення букв при переміщенні миші
textDisplay.addEventListener('mousedown', (e) => {
    if (!e.target.classList.contains('letter')) return;
    isSelecting = true;
    selectionStart = { x: e.clientX, y: e.clientY };
    
    highlightRect = document.createElement('div');
    highlightRect.classList.add('highlight-rect');
    textDisplay.appendChild(highlightRect);

    highlightRect.style.left = `${selectionStart.x}px`;
    highlightRect.style.top = `${selectionStart.y}px`;
});

textDisplay.addEventListener('mousemove', (e) => {
    if (!isSelecting || !highlightRect) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    highlightRect.style.width = `${Math.abs(currentX - selectionStart.x)}px`;
    highlightRect.style.height = `${Math.abs(currentY - selectionStart.y)}px`;

    highlightRect.style.left = `${Math.min(currentX, selectionStart.x)}px`;
    highlightRect.style.top = `${Math.min(currentY, selectionStart.y)}px`;

    // Виділити букви в межах прямокутника
    const rect = highlightRect.getBoundingClientRect();
    document.querySelectorAll('.letter').forEach(letter => {
        const letterRect = letter.getBoundingClientRect();
        if (letterRect.left >= rect.left && letterRect.right <= rect.right &&
            letterRect.top >= rect.top && letterRect.bottom <= rect.bottom) {
            letter.classList.add('selected');
        } else {
            letter.classList.remove('selected');
        }
    });
});

textDisplay.addEventListener('mouseup', () => {
    isSelecting = false;
    if (highlightRect) {
        textDisplay.removeChild(highlightRect);
        highlightRect = null;
    }
});

