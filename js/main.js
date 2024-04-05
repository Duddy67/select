document.addEventListener('DOMContentLoaded', () => {

    const select = document.createElement('select');
    select.setAttribute('name', 'operating-system');
    select.setAttribute('class', 'form-select');
    select.setAttribute('id', 'operating-system');

    const operatingSystems = ['Linux', 'Windows', 'Mac', 'Android']

    for (let i = 0; i < operatingSystems.length; i++) {
        const option = document.createElement('option');
        option.setAttribute('value', operatingSystems[i]);
        option.innerHTML = operatingSystems[i];
        select.appendChild(option);
    }

    const label = document.getElementById('dynamical-element');
    label.insertAdjacentElement('afterend', select);

    cselect = new C_Select.init();
    cselect.setCSelect(select);
});
