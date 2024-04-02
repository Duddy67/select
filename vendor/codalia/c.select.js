// Anonymous function with namespace.
const C_Select = (function() {

    document.addEventListener('DOMContentLoaded', () => {

        // Get all the initial select tags with a cselect class.
        const selects = document.getElementsByClassName('cselect');

        // Create a CSelect drop down list item for each actual select tag.
        for (let i = 0; i < selects.length; i++) {
            const select = selects[i];
            // Use i as cselect id.
            createCSelect(select, i);
        }

        document.addEventListener('click', function(evt) {
            // Close the dropdown if the user clicks outside of it
            closeAllLists(evt.target);

            // Check for button closure in a multiple drop down list. 
            if (evt.target.classList.contains('cselect-button-close')) {
                // Get the button from the button closure span.
                const button = document.getElementById('cselect-button-' + evt.target.dataset.idNumber);
                // Get the cselect id from the cselect container (ie: the parent's parent of the button).
                const cselectId = button.parentElement.parentElement.dataset.idNumber;

                // Set the attribute and class of the unselected item.
                const unselectedItem = document.getElementById('cselect-item-selected-' + cselectId + '-' + evt.target.dataset.idNumber);
                unselectedItem.classList.remove('cselect-item-selected');
                unselectedItem.classList.add('cselect-item');
                unselectedItem.removeAttribute('id');

                // Unselect the corresponding option in the actual select.
                const select = getSelect(button);
                select.querySelector('option[value=' + evt.target.dataset.value + ']').removeAttribute('selected');

                // Then remove the button from the selected area.
                button.remove();
            }
        });

        /*
         * Create a CSelect drop down list.
         */
        function createCSelect(select, cselectId) {
            // Make sure the tag is a select and has a name attribute. 
            if (select.tagName == 'SELECT' && select.hasAttribute('name')) {
                // Build the CSelect drop down list container.
                const cselect = document.createElement('div');
                cselect.setAttribute('class', 'cselect-container');
                cselect.setAttribute('id', 'cselect-container-' + cselectId);
                // The name of the actual select.
                cselect.setAttribute('data-select-name', select.name);
                cselect.setAttribute('data-id-number', cselectId);

                // Build the selection area.
                const selection = document.createElement('div');
                selection.setAttribute('id', 'cselect-selection-' + cselectId);
                selection.setAttribute('class', 'cselect-selection');

                if (select.hasAttribute('multiple')) {
                    // Create a button for each selected option (if any) and put them into the selection area.
                    for (let i = 0; i < select.options.length; i++) {
                        if (select.options[i].selected) {
                            const buttonItem = createButtonItem(select, i);
                            selection.appendChild(buttonItem);
                        }   
                    }

                    selection.classList.add('cselect-multiple');
                }
                else {
                    const text = document.createTextNode(select.options[select.selectedIndex].text);
                    selection.appendChild(text);
                    // Regular drop down lists need a selector icon.
                    selection.classList.add('cselect-selector');
                }

                cselect.appendChild(selection);

                const itemContainer = document.createElement('div');
                itemContainer.setAttribute('class', 'cselect-item-container');
                itemContainer.setAttribute('id', 'cselect-item-container-' + cselectId);

                // Create and insert the search input into the item container.
                const search = document.createElement('input');
                search.setAttribute('class', 'cselect-search');
                search.setAttribute('id', 'cselect-search-' + cselectId);
                search.setAttribute('type', 'text');
                itemContainer.appendChild(search);

                const optionNb = select.options.length;

                // Loop through the options of the actual select and create the corresponding items.
                for (let j = 0; j < optionNb; j++) {

                    const optionItem = document.createElement('div');
                    optionItem.setAttribute('data-value', select.options[j].value);
                    optionItem.setAttribute('data-id-number', j);
                    optionItem.setAttribute('class', 'cselect-item');

                    // Check for selected options.
                    if (select.options[j].selected) {
                        optionItem.setAttribute('class', 'cselect-item-selected');
                        // Use 2 ids in case of multiple select.
                        optionItem.setAttribute('id', 'cselect-item-selected-' + cselectId + '-' + j);
                    }

                    const text = document.createTextNode(select.options[j].text);
                    optionItem.appendChild(text);
                    itemContainer.appendChild(optionItem);

                    // Set the selected value and close the dropdown when an option item is clicked
                    optionItem.addEventListener('click', function() {

                        // First clear the cuurent search (if any).
                        search.value = '';
                        const items = itemContainer.childNodes;

                        for (let i = 0; i < items.length; i++) {
                            // Display again the possible item options hidden during the search. 
                            items[i].removeAttribute('style');
                        }

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

                // Filter option items based on user input (search).
                search.addEventListener('input', function() {
                    const filter = this.value.toUpperCase();

                    // Get the option items in the item container.
                    const items = itemContainer.childNodes;

                    for (let i = 0; i < items.length; i++) {
                        // Skip the search input element which is the first item in the item container.
                        if (i == 0) {
                            continue;
                        }

                        const itemText = items[i].innerHTML.toUpperCase();

                        // Compare the text to the user input and hide the item accordingly.
                        if (itemText.indexOf(filter) > -1) {
                            items[i].style.display = '';
                        }
                        else {
                            items[i].style.display = 'none';
                        }
                    }
                });

                // Toggle the dropdown when the selection is clicked
                selection.addEventListener('click', function() {
                    if (itemContainer.style.display === 'block') {
                        itemContainer.style.display = 'none';
                    }
                    else {
                        itemContainer.style.display = 'block';
                    }
                });

                // Insert the newly created CSelect after the actual select.
                select.insertAdjacentElement('afterend', cselect);
            }
        }

        /*
         * Create a button for a given selected option. Use with multiple selection.
         */
        function createButtonItem(select, idNumber) {
            // Create a button for the selected item.
            const buttonItem = document.createElement('div');
            buttonItem.setAttribute('class', 'cselect-button');
            buttonItem.setAttribute('id', 'cselect-button-' + idNumber);

            // Create the button label.
            const label = document.createElement('span');
            label.setAttribute('class', 'cselect-button-label');
            let text = document.createTextNode(select.options[idNumber].text);
            label.appendChild(text);

            // Create the button closure.
            const close = document.createElement('span');
            close.setAttribute('class', 'cselect-button-close');
            close.setAttribute('data-id-number', idNumber);
            close.setAttribute('data-value', select.options[idNumber].value);
            text = document.createTextNode('x');
            close.appendChild(text);
            buttonItem.appendChild(close);
            buttonItem.appendChild(label);

            return buttonItem;
        }

        /*
         * Updates the selection in a regular drop down list.
         */
        function updateSelected(cselectId, newSelectedItem) {
            // Set the text of the newly selected option in the selection area.
            const selection = document.getElementById('cselect-selection-' + cselectId);
            selection.innerHTML = newSelectedItem.innerHTML;

            // Switch the class and attribute setting between the previously selected item to the newly selected one.

            const oldSelectedItem = document.querySelectorAll('[id^="cselect-item-selected-'+ cselectId +'"]')[0];
            oldSelectedItem.classList.remove('cselect-item-selected');
            oldSelectedItem.classList.add('cselect-item');
            oldSelectedItem.removeAttribute('id');
            newSelectedItem.classList.add('cselect-item-selected');
            newSelectedItem.setAttribute('id', 'cselect-item-selected-' + cselectId + '-' + newSelectedItem.dataset.idNumber);

            // Close the drop down list.
            const itemContainer = document.getElementById('cselect-item-container-' + cselectId);
            itemContainer.style.display = 'none';

            // Update the selected option in the actual select.
            const select = getSelect(newSelectedItem);
            select.options[select.selectedIndex].removeAttribute('selected');
            select.options[newSelectedItem.dataset.idNumber].setAttribute('selected', 'selected');
        }

        /*
         * Updates the selection in a multiple drop down list.
         */
        function updateSelectedMultiple(cselectId, newSelectedItem) {
            // Update the selection in the actual select multiple.
            const select = getSelect(newSelectedItem);
            select.options[newSelectedItem.dataset.idNumber].setAttribute('selected', 'selected');

            // Add the corresponding button item in the selection area.
            const selection = document.getElementById('cselect-selection-' + cselectId);
            const buttonItem = createButtonItem(select, newSelectedItem.dataset.idNumber);
            selection.appendChild(buttonItem);

            // Get the items in the item container.
            const items = document.getElementById('cselect-item-container-' + cselectId).childNodes;

            // Loop through the items
            for (let i = 0; i < items.length; i++) {
                // Set the attributes of the newly selected item.
                if (items[i].dataset.idNumber == newSelectedItem.dataset.idNumber) {
                    items[i].classList.remove('cselect-item');
                    items[i].classList.add('cselect-item-selected');
                    items[i].setAttribute('id', 'cselect-item-selected-' + cselectId + '-' + newSelectedItem.dataset.idNumber);
                }
            }
        }

        /*
         *  Returns the name of the actual select for a given element.
         */
        function getSelectName(elem) {
            if (elem.classList.contains('cselect-selection') || elem.classList.contains('cselect-item-container')) {
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
                const selection = document.getElementById('cselect-selection-' + idNb);
                const search = document.getElementById('cselect-search-' + idNb);
                const itemContainer = document.getElementById('cselect-item-container-' + idNb);

                if (elem != selection && elem != itemContainer && elem != search) {
                    itemContainer.style.display = 'none';
                }
            }
        }
    });

})();
