document.addEventListener('DOMContentLoaded', () => {
    /*
     * Sets and manages a main item in a drop down list with multiple selections. 
     */

    // Get the current value of the main item .
    let mainItem = document.getElementById('mainItem').value;
    // Retrieve the cselect id set as data attribute in the actual select.
    const cselectId = document.getElementById('shakes').dataset.cselectId;

    // Get the selection area which is the first child of the CSelect item container.
    const selection = document.getElementById(cselectId).firstChild;

    // Loop through the buttons, if any (ie: the selected option items).
    for (const button of selection.children) {
        // Set the corresponding button as the main item.
        if (button.dataset.value == mainItem) {
            button.classList.add('cselect-main-item');
        }
    }

    document.addEventListener('click', function(evt) {

        // A label button has been clicked.
        if (evt.target.tagName == 'SPAN' && evt.target.classList.contains('cselect-button-label')) {
            const clickedButton = evt.target.parentElement;
            const cselect = document.getElementById(clickedButton.dataset.cselectId);

            // Make sure the option item is part of the CSelect shake drop down list.
            if (cselect.dataset.selectName == 'shakes[]') {
                const selection = cselect.firstChild;

                // Loop through the selected items (buttons) in the selection area.
                for (const button of selection.children) {
                    // Set the clicked button as the main item.
                    if (button.dataset.value == clickedButton.dataset.value) {
                        button.classList.add('cselect-main-item');
                        document.getElementById('mainItem').value = clickedButton.dataset.value;
                    }
                    else {
                        // Reset the button previously set as main item. 
                        button.classList.remove('cselect-main-item');
                    }
                }
            }
        }

        // A button has been closed.
        if (evt.target.tagName == 'SPAN' && evt.target.classList.contains('cselect-button-close')) {
            const closedButton = evt.target.parentElement;
            const cselect = document.getElementById(closedButton.dataset.cselectId);

            // Make sure the option item is part of the CSelect shake drop down list.
            if (cselect.dataset.selectName == 'shakes[]') {
                const selection = cselect.firstChild;

                // There is no more button in the selection area.
                if (selection.children.length == 0) {
                    // Set the main item value as empty.
                    document.getElementById('mainItem').value = '';
                    return;
                }

                // The closed button was set as main item.
                if (closedButton.classList.contains('cselect-main-item')) {
                    // Set the next button in the selection area as main item.
                    const newMainShakeButton = selection.firstChild;
                    document.getElementById('mainItem').value = newMainShakeButton.dataset.value;
                    newMainShakeButton.classList.add('cselect-main-item');
                }
            }
        }

        // A new option item has been selected.
        if (evt.target.tagName == 'DIV' && evt.target.classList.contains('cselect-item')) {
            const optionItem = evt.target;
            // Get the CSelect dropdownlist (ie: the parent's parent of the option item).
            const cselect = optionItem.parentElement.parentElement;

            // Make sure the option item is part of the CSelect shake drop down list.
            if (cselect.dataset.selectName == 'shakes[]') {
                const selection = cselect.firstChild;

                // The newly selected option item is the only one in the selection area.
                if (selection.children.length == 1) {
                    // Set the selected option as the main item.
                    const button = selection.firstChild;
                    button.classList.add('cselect-main-item');
                    document.getElementById('mainItem').value = button.dataset.value;
                }
            }
        }

    }, false);
});
