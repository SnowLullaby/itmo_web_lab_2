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
    return { x, yValues, r, method };
}

function handleSubmit(getDataFuncName, event) {
    const isCanvasClick = getDataFuncName === 'getCanvasData';
    const { x, yValues, r, method } = isCanvasClick ? getCanvasData(event) : getFormData();

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
        .then(response => {
            if (response.ok) {
                window.location.href=response.url;
            } else {
                return response.json().then(data => {
                    throw new Error(data.error || 'Неизвестная ошибка');
                });
            }
        })
        .catch(error => {
            alert("Ошибка: " + error.message);
        });
}

async function clearHistory() {
    if (!confirm("Очистить всю историю точек?")) return;

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
            alert("Ошибка при очистке: " + err.message);
        }
    } catch (error) {
        alert("Ошибка при очистке: " + error.message);
    }
}

window.addEventListener('pageshow', async function(event) {
    if (event.persisted) {
        await refreshPageData();
    }
});

async function refreshPageData() {
    try {
        const response = await fetch('controller/results', { method: 'GET' });
        if (!response.ok) alert('Не удалось загрузить данные');

        window.ALL_POINTS_FROM_SESSION = await response.json();
        updateResultsTable();
        drawGraph(currentR);
    } catch (error) {
        alert("Ошибка при обновлении данных: " + error.message);
    }
}

function updateResultsTable() {
    const tbody = document.querySelector('#resultsTable tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    let points = window.ALL_POINTS_FROM_SESSION;
    if (points.length === 0) return;

    [...points].reverse().forEach(result => {
        const date = new Date(result.currentTime);
        const formattedTime = date.toLocaleString('ru-RU', stat).replace(/,/, ' ');

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${result.x}</td>
            <td>${result.y}</td>
            <td>${result.r}</td>
            <td data-result="${result.hit}">${result.hit ? "Попадание" : "Промах"}</td>
            <td>${formattedTime}</td>
            <td>${result.executionTime} ns</td>
        `;
        tbody.insertBefore(row, tbody.firstChild);
    });
}
