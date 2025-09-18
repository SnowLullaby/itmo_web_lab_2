const stat = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
}

function getFormData() {
    const x = document.getElementById('x').value;
    const y = document.getElementById('y').value;
    const r = document.getElementById('r').value;
    const yValues = y.split(',').map(val => val.trim()).filter(val => val !== '');
    const method = document.querySelector('input[name="method"]:checked')?.value || 'POST';
    const disableRedirect = document.getElementById('disableRedirect').checked;
    return { x, yValues, r, method, disableRedirect};
}

function handleSubmit(getDataFuncName, event) {
    const isCanvasClick = getDataFuncName === 'getCanvasData';
    const { x, yValues, r, method, disableRedirect } = isCanvasClick ? getCanvasData(event) : getFormData();

    if (!validateInput(x, yValues, r)) return;
    const data = { x: parseFloat(x), y: yValues.map(y => parseFloat(y)), r: parseFloat(r) };

    let fetchOptions;

    if (method === 'GET') {
        const queryString = Object.entries(data)
            .map(([key, value]) => {
                const strValue = Array.isArray(value) ? value.join(',') : value;
                return `${key}=${encodeURIComponent(strValue)}`;
            })
            .join('&');
        fetchOptions = {
            method: 'GET',
            url: `controller?${queryString}`,
            headers: { 'Content-Type': 'application/json' } };
    } else {
        fetchOptions = {
            method: 'POST',
            url: 'controller',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
    }

    fetch(fetchOptions.url, fetchOptions)
        .then(async response => {
            if (response.ok) {
                if (disableRedirect) {
                    await refreshPageData();
                } else {
                    window.location.href = response.url;
                }
            } else {
                return response.json().then(data => {
                    throw new Error(data.error || 'Неизвестная ошибка');
                });
            }
        })
        .catch(error => {
            showNotification("Ошибка: " + error.message);
        });
}

function showModal() {
    return new Promise((resolve) => {
        const modal = document.getElementById('modal');
        const confirmButton = document.querySelector('.confirm-button');
        const cancelButton = document.querySelector('.cancel-button');
        const closeButton = document.querySelector('.modal-close');

        modal.style.display = 'flex';

        const confirmHandler = () => {
            modal.classList.remove('show');
            modal.style.display = 'none';
            resolve(true);
            confirmButton.removeEventListener('click', confirmHandler);
            cancelButton.removeEventListener('click', cancelHandler);
            closeButton.removeEventListener('click', closeHandler);
        };

        const cancelHandler = () => {
            window.open('https://youtu.be/dQw4w9WgXcQ?si=FCETBeNvI23i2I4z&t=43');
            resolve(false);
        };

        const closeHandler = () => {
            modal.classList.remove('show');
            modal.style.display = 'none';
            resolve(false);
            confirmButton.removeEventListener('click', confirmHandler);
            cancelButton.removeEventListener('click', cancelHandler);
            closeButton.removeEventListener('click', closeHandler);
        };

        confirmButton.addEventListener('click', confirmHandler);
        cancelButton.addEventListener('click', cancelHandler);
        closeButton.addEventListener('click', closeHandler);
    });
}

async function clearHistory() {
    const confirmed = await showModal();
    if (!confirmed) return;

    try {
        const response = await fetch('controller/clear', {
            method: document.querySelector('input[name="method"]:checked')?.value || 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            window.ALL_POINTS_FROM_SESSION = [];
            updateResultsTable();
            drawGraph(currentR);
        } else {
            const err = await response.json();
            showNotification("Ошибка при очистке: " + err.message);
        }
    } catch (error) {
        showNotification("Ошибка при очистке: " + error.message);
    }
}

window.addEventListener('pageshow', async function(event) {
    if (event.persisted) {
        await refreshPageData();
    }
});

async function refreshPageData() {
    try {
        const response = await fetch('controller/results', {
            method: document.querySelector('input[name="method"]:checked')?.value || 'POST',
            headers: { 'Content-Type': 'application/json' } });
        if (!response.ok) showNotification('Не удалось загрузить данные');

        window.ALL_POINTS_FROM_SESSION = await response.json();
        updateResultsTable();
        drawGraph(currentR);
    } catch (error) {
        showNotification("Ошибка при обновлении данных: " + error.message);
    }
}

function updateResultsTable() {
    const tbody = document.querySelector('#resultsTable tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    let points = window.ALL_POINTS_FROM_SESSION;
    if (points.length === 0) return;

    [...points].forEach(result => {
        const date = new Date(result.currentTime);
        const formattedTime = date.toLocaleString('ru-RU', stat).replace(/,/, ' ');

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${Number(result.x).toFixed(4).replace(/\.?0+$/, '')}</td>
            <td>${Number(result.y).toFixed(4).replace(/\.?0+$/, '')}</td>
            <td>${Number(result.r).toFixed(4).replace(/\.?0+$/, '')}</td>
            <td data-result="${result.hit}">${result.hit ? "Попадание" : "Промах"}</td>
            <td>${formattedTime}</td>
            <td>${result.executionTime} ns</td>
        `;
        tbody.insertBefore(row, tbody.firstChild);
    });
}
