function getFormData() {
    const x = document.getElementById('x').value;
    const y = document.getElementById('y').value;
    const r = document.getElementById('r').value;
    const yValues = y.split(',').map(val => val.trim()).filter(val => val !== '');
    const method = document.querySelector('input[name="method"]:checked')?.value || 'POST';
    return { x, yValues, r, method };
}

function handleSubmission(getDataFuncName, event) {
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
                return response.json().then(data => {
                    if (data.redirect) {
                        window.location.href = data.redirect;
                    } else {
                        console.warn("Нет redirect в ответе");
                    }
                });
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