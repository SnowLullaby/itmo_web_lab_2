const yButtons = document.querySelectorAll('.y-button');
const yInput = document.getElementById('y');

let selectedYValues = [];

yButtons.forEach(button => {
    button.addEventListener('click', () => {
        const yValue = button.getAttribute('data-value');
        const index = selectedYValues.indexOf(yValue);

        if (index === -1) {
            selectedYValues.push(yValue);
            button.classList.add('selected');
        } else {
            selectedYValues.splice(index, 1);
            button.classList.remove('selected');
        }

        yInput.value = selectedYValues.join(',');
        saveFormState();
    });
});