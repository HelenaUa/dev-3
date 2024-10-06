const inputText = document.getElementById('inputText');
const displayTextButton = document.getElementById('displayText');
const textDisplay = document.getElementById('text-display');

let isSelecting = false;
let selectionStart = null;
let highlightRect = null;
let draggedLetters = [];
let startPositions = [];
let isDragging = false;
let startX = 0;
let startY = 0;

// Показати введений рядок у блоці
displayTextButton.addEventListener('click', () => {
    const text = inputText.value;
    inputText.value = ''; 
    textDisplay.innerHTML = ''; 

    // Створити кожну літеру окремим спаном
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.classList.add('letter');
        span.dataset.index = index;

        // Додавання обробника для виділення при ctrl+click
        span.addEventListener('click', (e) => {
            if (e.ctrlKey) {
                span.classList.toggle('selected');
            }
        });

        textDisplay.appendChild(span);
    });
});

// Переміщення виділених літер за курсором миші
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.pageX - startX;
        const deltaY = e.pageY - startY;

        draggedLetters.forEach((letter, index) => {
            const initialPos = startPositions[index];
            const newLeft = initialPos.left + deltaX;
            const newTop = initialPos.top + deltaY;

            letter.style.left = `${newLeft}px`;
            letter.style.top = `${newTop}px`;
        });
    }
});

// Відпустити літери
document.addEventListener('mouseup', () => {
    isDragging = false;
    draggedLetters = [];
    startPositions = [];
});

// Функція для виділення букв при переміщенні миші (прямокутник виділення)
textDisplay.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('letter')) {
        if (e.target.classList.contains('selected')) {
            isDragging = true;
            draggedLetters = [...document.querySelectorAll('.selected')];
            startX = e.pageX;
            startY = e.pageY;

            // Зберігаємо початкові позиції для кожної літери
            startPositions = draggedLetters.map(letter => {
                const rect = letter.getBoundingClientRect();
                return {
                    left: rect.left - textDisplay.offsetLeft,
                    top: rect.top - textDisplay.offsetTop
                };
            });

            // Встановлюємо кожну букву в абсолютне позиціонування
            draggedLetters.forEach((letter, index) => {
                const rect = startPositions[index];
                letter.style.position = 'absolute';
                letter.style.left = `${rect.left}px`;
                letter.style.top = `${rect.top}px`;
            });
        }
    } else {
        // Почати виділення прямокутником
        isSelecting = true;
        selectionStart = { x: e.clientX, y: e.clientY };

        highlightRect = document.createElement('div');
        highlightRect.classList.add('highlight-rect');
        document.body.appendChild(highlightRect);

        highlightRect.style.left = `${selectionStart.x}px`;
        highlightRect.style.top = `${selectionStart.y}px`;
    }
});

// Змінити розміри прямокутника виділення та виділяти літери всередині нього
document.addEventListener('mousemove', (e) => {
    if (isSelecting && highlightRect) {
        const currentX = e.clientX;
        const currentY = e.clientY;

        highlightRect.style.width = `${Math.abs(currentX - selectionStart.x)}px`;
        highlightRect.style.height = `${Math.abs(currentY - selectionStart.y)}px`;

        highlightRect.style.left = `${Math.min(currentX, selectionStart.x)}px`;
        highlightRect.style.top = `${Math.min(currentY, selectionStart.y)}px`;

        const rect = highlightRect.getBoundingClientRect();
        document.querySelectorAll('.letter').forEach(letter => {
            const letterRect = letter.getBoundingClientRect();
            const overlaps = (
                letterRect.left < rect.right &&
                letterRect.right > rect.left &&
                letterRect.top < rect.bottom &&
                letterRect.bottom > rect.top
            );

            if (overlaps) {
                letter.classList.add('selected');
            } else {
                letter.classList.remove('selected');
            }
        });
    }
});

// Завершення виділення прямокутником
document.addEventListener('mouseup', (e) => {
    if (isSelecting && highlightRect) {
        document.body.removeChild(highlightRect);
        highlightRect = null;
        isSelecting = false;

        // Встановлюємо позицію 'absolute' для кожної вибраної літери
        draggedLetters = [...document.querySelectorAll('.selected')];
        startPositions = draggedLetters.map(letter => {
            const rect = letter.getBoundingClientRect();
            return {
                left: rect.left - textDisplay.offsetLeft,
                top: rect.top - textDisplay.offsetTop
            };
        });

        draggedLetters.forEach((letter, index) => {
            const rect = startPositions[index];
            letter.style.position = 'absolute';
            letter.style.left = `${rect.left}px`;
            letter.style.top = `${rect.top}px`;
        });

        if (draggedLetters.length > 0) {
            isDragging = true;
            startX = e.pageX;
            startY = e.pageY;
        }
    }
});