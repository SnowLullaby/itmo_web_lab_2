const errorMessage = document.querySelector('.error-message');

function validateInput(x, yValues, r) {
    const xVal = parseFloat(x);
    const rVal = parseFloat(r);

    if (!checkR(r) || !checkRequiredFields(x, yValues) || !checkXFormat(x) || !checkXRange(xVal)
        || !checkYValues(yValues) || !checkRRange(rVal)) return false;

    hideNotification();
    return true;
}

function checkR(r) {
    if (!r) {
        showNotification("Не задано значение R");
        return false;
    }
    return true;
}


function checkRequiredFields(x, yValues) {
    if (!x || !yValues || yValues.length === 0) {
        showNotification("Не задано значение координат");
        return false;
    }
    return true;
}

function checkXFormat(x) {
    if (x.includes(',')) {
        showNotification("Используйте точку как разделитель");
        return false;
    }
    return true;
}

function checkXRange(xVal) {
    if (isNaN(xVal) || xVal < -3 || xVal > 5) {
        showNotification("X должен быть числом от -3 до 5");
        return false;
    }
    return true;
}

function checkRRange(rVal) {
    if (isNaN(rVal) || rVal < 1 || rVal > 3) {
        showNotification("R должен быть числом от 1 до 3");
        return false;
    }
    return true;
}

function checkYValues(yValues) {
    for (const yVal of yValues) {
        const yValParsed = parseFloat(yVal);
        if (isNaN(yValParsed) || yValParsed < -4 || yValParsed > 4) {
            showNotification("Y должен быть числом от -4 до 4");
            return false;
        }
    }
    return true;
}

function showNotification(notification) {
    errorMessage.textContent = notification;
    errorMessage.classList.add('show');
}

function hideNotification() {
    errorMessage.classList.remove('show');
}