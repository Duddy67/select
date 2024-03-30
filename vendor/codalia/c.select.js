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

            // Check for button closures in multiple drop down lists. 
            if (evt.target.classList.contains('cselect-button-close')) {
                // Get the button.
                const button = document.getElementById('cselect-button-' + evt.target.dataset.idNumber);
                // Deselect the corresponding option in the actual select.
                const select = getSelect(button);
                select.querySelector('option[value=' + evt.target.dataset.value + ']').removeAttribute('selected');
                // Then remove the button from the selected area.
                button.remove();
            }
        });

        function createCSelect(select, cselectId) {
            // 
            if (select.tagName == 'SELECT' && select.hasAttribute('name')) {
                const cselect = document.createElement('div');
                cselect.setAttribute('class', 'cselect-container');
                cselect.setAttribute('id', 'cselect-container-' + cselectId);
                // The name of the actual select.
                cselect.setAttribute('data-select-name', select.name);
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

                    //if (j == select.selectedIndex) {
                    if (select.options[j].selected) {
                        option.setAttribute('class', 'cselect-item-selected');
                        option.setAttribute('id', 'cselect-item-selected-' + cselectId + '-' + j);
                    }

                    const text = document.createTextNode(select.options[j].text);
                    option.appendChild(text);
                    itemContainer.appendChild(option);

                    // Set the selected value and close the dropdown when an item is clicked
                    option.addEventListener('click', function() {
                        // Don't treat the items already selected.
                        if (this.classList.contains('cselect-item-selected')) {
                            return;
                        }

                        if (select.hasAttribute('multiple')) {
                            updateSelectedMultiple(cselectId, this);
                        }
                        // Standard drop down list.
                        else {
                            updateSelected(cselectId, this);
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
                    // Create a button for the selected item.
                    const selectedItem = document.createElement('div');
                    selectedItem.setAttribute('class', 'cselect-button');
                    selectedItem.setAttribute('id', 'cselect-button-' + j);
                    // Create the button label.
                    const label = document.createElement('span');
                    label.setAttribute('class', 'cselect-button-label');
                    let text = document.createTextNode(select.options[j].text);
                    label.appendChild(text);
                    // Create the button closure.
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

        function createSelectedItemMultiple(select, idNumber) {

        }

        function updateSelected(cselectId, newSelectedItem) {
            const selected = document.getElementById('cselect-selected-' + cselectId);
            selected.innerHTML = newSelectedItem.innerHTML;

            const oldSelectedItem = document.querySelectorAll('[id^="cselect-item-selected-'+ cselectId +'"]')[0];
            oldSelectedItem.classList.remove('cselect-item-selected');
            oldSelectedItem.classList.add('cselect-item');
            oldSelectedItem.removeAttribute('id');

            newSelectedItem.classList.add('cselect-item-selected');
            newSelectedItem.setAttribute('id', 'cselect-item-selected-' + cselectId + '-' + newSelectedItem.dataset.idNumber);

            const itemContainer = document.getElementById('cselect-item-container-' + cselectId);
            itemContainer.style.display = 'none';

            // Update the selected option in the actual select.
            const select = getSelect(newSelectedItem);
            select.options[select.selectedIndex].removeAttribute('selected');
            select.options[newSelectedItem.dataset.idNumber].setAttribute('selected', 'selected');
        }

        function updateSelectedMultiple(cselectId, newSelectedItem) {
            // Update the selection in the actual select multiple.
            const select = getSelect(newSelectedItem);
            select.options[newSelectedItem.dataset.idNumber].setAttribute('selected', 'selected');

        }

        /*
         *  Returns the name of the actual select for a given element.
         */
        function getSelectName(elem) {
            if (elem.classList.contains('cselect-selected') || elem.classList.contains('cselect-item-container')) {
                // The CSelect main container is the parent of the element.
                return elem.parentElement.dataset.selectName;
            }

            if (elem.classList.contains('cselect-button') || elem.classList.contains('cselect-item')) {
                // The CSelect main container is the parent's parent of the element.
                return elem.parentElement.parentElement.dataset.selectName;
            }

            return null;
        }

        /*
         *  Returns the actual select element for a given element.
         */
        function getSelect(elem) {
            const selectName = getSelectName(elem);

            if (selectName !== null) {
                return document.getElementsByName(selectName)[0];
            }

            return null;
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
