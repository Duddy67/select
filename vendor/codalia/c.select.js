// Anonymous function with namespace.
const C_Select = (function() {

    document.addEventListener('DOMContentLoaded', () => {

        const selects = document.getElementsByClassName('cselect');

        for (let i = 0; i < selects.length; i++) {
            const select = selects[i];
            createCSelect(select, i);
        }

        document.addEventListener('click', function(evt) {
            // Close the dropdown if the user clicks outside of it
            closeAllLists(evt.target);

            // 
            if (evt.target.classList.contains('cselect-button-close')) {

            }
        });

        function createCSelect(select, cselectId) {
            // 
            if (select.tagName == 'SELECT') {
                const cselect = document.createElement('div');
                cselect.setAttribute('class', 'cselect-container');
                cselect.setAttribute('id', 'cselect-container-' + cselectId);
                cselect.setAttribute('data-name', select.name);
                cselect.setAttribute('data-id-number', cselectId);
                //cselect.setAttribute('style', 'width: 200px;');

                const selected = document.createElement('div');
                selected.setAttribute('class', 'cselect-selected');
                selected.setAttribute('id', 'cselect-selected-' + cselectId);

                if (select.hasAttribute('multiple')) {
                    createSelectedMultiple(select, selected, cselectId);
                }
                else {
                    const text = document.createTextNode(select.options[select.selectedIndex].text);
                    selected.appendChild(text);
                }

                cselect.appendChild(selected);

                const itemContainer = document.createElement('div');
                itemContainer.setAttribute('class', 'cselect-item-container');
                itemContainer.setAttribute('id', 'cselect-item-container-' + cselectId);
                const optionNb = select.options.length;

                for (let j = 0; j < optionNb; j++) {

                    const option = document.createElement('div');
                    option.setAttribute('data-value', select.options[j].value);
                    option.setAttribute('data-id-number', j);
                    option.setAttribute('class', 'cselect-item');

                    if (j == select.selectedIndex) {
                        option.setAttribute('class', 'cselect-item-selected');
                        option.setAttribute('id', 'cselect-item-selected-' + cselectId + '-' + j);
                    }

                    const text = document.createTextNode(select.options[j].text);
                    option.appendChild(text);
                    itemContainer.appendChild(option);

                    // Set the selected value and close the dropdown when an option is clicked
                    option.addEventListener('click', function() {
                        if (select.hasAttribute('multiple')) {

                        }
                        // Standard drop down list.
                        else {
                            shiftSelected(cselectId, this);
                        }
                    });
                }

                cselect.appendChild(itemContainer);

                // Toggle the dropdown when the cselect select is clicked
                selected.addEventListener('click', function() {
                    if (itemContainer.style.display === 'block') {
                        itemContainer.style.display = 'none';
                    }
                    else {
                        itemContainer.style.display = 'block';
                    }
                });

                select.insertAdjacentElement('afterend', cselect);
            }
        }

        /*
         * Create a button area for multiple selections.
         */
        function createSelectedMultiple(select, selected, cselectId) {
            // Loop through the options of the original select.
            for (let j = 0; j < select.options.length; j++) {
                if (select.options[j].selected) {
                    console.log(select.options[j].text);
                    const selectedItem = document.createElement('div');
                    selectedItem.setAttribute('class', 'cselect-button');
                    const label = document.createElement('span');
                    label.setAttribute('class', 'cselect-button-label');
                    let text = document.createTextNode(select.options[j].text);
                    label.appendChild(text);
                    const close = document.createElement('span');
                    close.setAttribute('class', 'cselect-button-close');
                    close.setAttribute('data-id-number', j);
                    close.setAttribute('data-value', select.options[j].value);
                    text = document.createTextNode('x');
                    close.appendChild(text);
                    selectedItem.appendChild(close);
                    selectedItem.appendChild(label);

                    selected.appendChild(selectedItem);
                }   
            }
        }

        function shiftSelected(id, newSelected) {
            const selected = document.getElementById('cselect-selected-' + id);
            selected.innerHTML = newSelected.innerHTML;

            //const oldSelected = document.getElementById('cselect-item-selected-' + id);
            const oldSelected = document.querySelectorAll('[id^="cselect-item-selected-'+ id +'"]')[0];
            oldSelected.classList.remove('cselect-item-selected');
            oldSelected.classList.add('cselect-item');
            oldSelected.removeAttribute('id');

            newSelected.classList.add('cselect-item-selected');
            newSelected.setAttribute('id', 'cselect-item-selected-' + id + '-' + newSelected.dataset.idNumber);

            const itemContainer = document.getElementById('cselect-item-container-' + id);
            itemContainer.style.display = 'none';

            const cselect = document.getElementById('cselect-container-' + id);
            const select = document.getElementsByName(cselect.dataset.name)[0];
            select.options[select.selectedIndex].removeAttribute('selected');
            select.options[newSelected.dataset.idNumber].setAttribute('selected', 'selected');
        }

        function closeAllLists(elem) {
            // Get all the custom selects.
            const cselects = document.getElementsByClassName('cselect-container');

            for (let i = 0; i < cselects.length; i++) {
                const idNb = cselects[i].dataset.idNumber;
                const selected = document.getElementById('cselect-selected-' + idNb);
                const itemContainer = document.getElementById('cselect-item-container-' + idNb);

                if (elem != selected && elem != itemContainer) {
                    itemContainer.style.display = 'none';
                }
            }
        }
    });

})();
