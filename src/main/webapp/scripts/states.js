document.querySelectorAll('input[name="method"]').forEach(radio => {
    radio.addEventListener('change', saveFormState);
});

function saveFormState() {
    const state = {
        y: document.getElementById('y').value,
        r: document.getElementById('r').value,
        method: document.querySelector('input[name="method"]:checked')?.value || 'POST'
    };

    try {
        sessionStorage.setItem('formState', JSON.stringify(state));
    } catch (e) {
        console.warn('Не удалось сохранить состояние формы', e);
    }
}

function loadFormState() {
    try {
        const saved = sessionStorage.getItem('formState');
        if (!saved) return;

        const state = JSON.parse(saved);

        if (state.x) {
            document.getElementById('x').value = state.x;
        }

        if (state.y) {
            document.getElementById('y').value = state.y;
            const yButtons = document.querySelectorAll('.y-button');
            yButtons.forEach(btn => {
                const val = btn.getAttribute('data-value');
                if (state.y.split(',').includes(val)) {
                    btn.classList.add('selected');
                } else {
                    btn.classList.remove('selected');
                }
            });
        }

        if (state.r) {
            document.getElementById('r').value = state.r;
            currentR = state.r;
        }

        if (state.method) {
            const radio = document.querySelector(`input[name="method"][value="${state.method}"]`);
            if (radio) radio.checked = true;
        }
    } catch (e) {}
}