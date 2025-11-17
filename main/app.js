// Definimos las filas del teclado con Mayus, números y símbolos
let isUpper = true; // Estado de mayúsculas/minúsculas
const baseLayout = [
    ['Mayus','1','2','3','4','5','6','7','8','9','0'],
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L','Ñ'],
    ['Z','X','C','V','B','N','M'],
    ['.',',','¡','!','¿','?'],
    ['Espacio','Borrar']
];
let keyboardLayout = baseLayout;

const keyboard = document.getElementById('keyboard');
const display = document.getElementById('display');


// Estado del texto y posición del cursor
let text = '';
let cursorPos = 0;

// Renderiza el área de texto con el cursor visual
function renderDisplay() {
    const before = text.slice(0, cursorPos);
    const after = text.slice(cursorPos);
    // Mostrar espacios correctamente
    const beforeHtml = before.replace(/ /g, '&nbsp;');
    const afterHtml = after.replace(/ /g, '&nbsp;');
    display.innerHTML = beforeHtml + '<span class="cursor"></span>' + afterHtml;
}

// Render inicial del área de texto
renderDisplay();


// Función para renderizar el teclado virtual
function renderKeyboard() {
    keyboard.innerHTML = '';
    keyboardLayout.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';
        row.forEach(key => {
            const button = document.createElement('button');
            button.className = 'key';
            // Mostrar Mayus resaltado si está activo
            if (key === 'Mayus' && isUpper) button.classList.add('pressed');
            // Mostrar texto según mayúsculas/minúsculas
            if (/^[a-zA-ZñÑ]$/.test(key)) {
                button.textContent = isUpper ? key.toUpperCase() : key.toLowerCase();
            } else {
                button.textContent = key;
            }
            if (['Espacio','Borrar','Mayus'].includes(key)) {
                button.classList.add('special');
            }
            button.addEventListener('click', () => {
                if (key === 'Espacio') {
                    text = text.slice(0, cursorPos) + ' ' + text.slice(cursorPos);
                    cursorPos++;
                } else if (key === 'Borrar') {
                    if (cursorPos > 0) {
                        text = text.slice(0, cursorPos - 1) + text.slice(cursorPos);
                        cursorPos--;
                    }
                } else if (key === 'Mayus') {
                    isUpper = !isUpper;
                    renderKeyboard();
                    return;
                } else {
                    // Insertar letra/símbolo según estado de mayúsculas
                    let char = key;
                    if (/^[a-zA-ZñÑ]$/.test(key)) {
                        char = isUpper ? key.toUpperCase() : key.toLowerCase();
                    }
                    text = text.slice(0, cursorPos) + char + text.slice(cursorPos);
                    cursorPos++;
                }
                renderDisplay();
                // Si se presionó Mayus, desactivar después de una letra
                if (key !== 'Mayus' && isUpper && /^[a-zA-ZñÑ]$/.test(key)) {
                    isUpper = false;
                    renderKeyboard();
                }
            });
            rowDiv.appendChild(button);
        });
        keyboard.appendChild(rowDiv);
    });
}

// Render inicial del teclado
renderKeyboard();

// Permitir mover el cursor haciendo clic en el display
display.addEventListener('click', function(e) {
    // Calcular la posición del cursor según el click
    let x = e.clientX - display.getBoundingClientRect().left;
    // Crear un span temporal para medir la posición de cada carácter
    let temp = document.createElement('span');
    temp.style.visibility = 'hidden';
    temp.style.position = 'absolute';
    display.appendChild(temp);
    let found = false;
    for (let i = 0; i <= text.length; i++) {
        temp.innerHTML = text.slice(0, i).replace(/ /g, '\u00A0');
        if (temp.offsetWidth >= x) {
            cursorPos = i;
            found = true;
            break;
        }
    }
    if (!found) cursorPos = text.length;
    temp.remove();
    renderDisplay();
});

// Opcional: permitir mover el cursor con flechas del teclado
display.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        if (cursorPos > 0) cursorPos--;
        renderDisplay();
        e.preventDefault();
    } else if (e.key === 'ArrowRight') {
        if (cursorPos < text.length) cursorPos++;
        renderDisplay();
        e.preventDefault();
    }
});

// Fin del código del teclado virtual
