document.addEventListener('DOMContentLoaded', () => {

    // Create a new drop down list dynamically.
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

    // Set a CSelect item for the drop down list newly created.
    cselect = new C_Select.init();
    cselect.setCSelect(select);

    // Add an extra option to the car drop down list.
    const cars = document.getElementById('cars');

    const newOption = document.createElement('option');
    newOption.setAttribute('value', 'renault');
    newOption.innerHTML = 'Renault';
    cars.appendChild(newOption);

    // Rebuild a new CSelect item for the modified drop down list.
    cselect.rebuildCSelect(cars);
});
