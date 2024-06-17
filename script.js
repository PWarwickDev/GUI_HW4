/* File: script.js
GUI Assignment: Using the jQuery Plugin/UI with Your Dynamic Table
Paul Warwick, UMass Lowell Computer Science, paul_warwick@student.uml.edu
Copyright (c) 2024 by Paul Warwick. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by PW on 6/16/2024 at 10:04 pm.

Description: Js file using JQuery to validate inputs. Has slider or input box option
for number inputs. 
*/

$(document).ready(function() {
    // Initialize the sliders and bind them to corresponding input fields
    $('.slider-input').each(function() {
        const input = $(this);
        const sliderId = '#slider-' + input.attr('id');
        const minVal = parseInt(input.attr('min')) || -50;
        const maxVal = parseInt(input.attr('max')) || 50;
        let initialValue = parseInt(input.val()) || 0;

        // Initialize slider
        $(sliderId).slider({
            range: 'min',
            value: initialValue,
            min: minVal,
            max: maxVal,
            slide: function(event, ui) {
                input.val(ui.value); // Update on slider slide
            },
            change: function(event, ui) {
                input.val(ui.value); // Update on slider change
            }
        });

        // Update slider value on input change
        input.on('blur', function() {
            validateInput($(this), sliderId, minVal, maxVal); // after user has typed, then validation
        });
    });

    // Validates input and updates slider
    function validateInput(input, sliderId, minVal, maxVal) {
        let value = input.val().trim(); // Trim any whitespace
        if (value === '') {
            input.val(0); 
        } else if (/^(-)?\d+$/.test(value)) {
            // Check if input is a valid integer
            value = parseInt(value);
            value = Math.min(Math.max(value, minVal), maxVal);
            input.val(value);
            $(sliderId).slider('value', value); // Update corresponding slider
        }
    }

    // jQuery tabs initialization
    $('#tabs').tabs();

    // Form validating and table generation
    $('#table-form').validate({
        submitHandler: function(form) {
            $('#error-message').text('');
            generateTab(); // Generate table as a tab on form submit
            return false; // Prevent form submission
        }
    });

    // Add Delete Selected button
    const deleteSelectedButton = $('<button>').attr({
        id: 'delete-selected',
        type: 'button'
    }).text('Delete Selected').appendTo($('#tabs-list'));

    deleteSelectedButton.on('click', function() {
        deleteSelectedTabs();
    });

    // Add Delete All button
    const deleteAllButton = $('<button>').attr({
        id: 'delete-all',
        type: 'button'
    }).text('Delete All').appendTo($('#tabs-list'));

    deleteAllButton.on('click', function() {
        deleteAllTabs();
    });

    // Tab creation
    function generateTab() {
        
        const startMultiplier = parseInt($('#start-multiplier').val());
        const endMultiplier = parseInt($('#end-multiplier').val());
        const startMultiplicand = parseInt($('#start-multiplicand').val());
        const endMultiplicand = parseInt($('#end-multiplicand').val());

        if (!validateInputs(startMultiplier, endMultiplier, startMultiplicand, endMultiplicand)) {
            return;
        }

        const tabLabel = `(${startMultiplier}, ${endMultiplier}), (${startMultiplicand}, ${endMultiplicand})`;
        addTab(tabLabel, generateTable(startMultiplier, endMultiplier, startMultiplicand, endMultiplicand));
    }

    // Checking inputs 
    function validateInputs(startMultiplier, endMultiplier, startMultiplicand, endMultiplicand) {
        if (isNaN(startMultiplier)) {
            displayError("Enter only valid numbers into Start Multiplier form (-50 to 50).");
            return false;
        }

        if (isNaN(endMultiplier)) {
            displayError("Enter only valid numbers into End Multiplier form (-50 to 50).");
            return false;
        }

        if (isNaN(startMultiplicand)) {
            displayError("Enter only valid numbers into Start Multiplicand form (-50 to 50).");
            return false;
        }

        if (isNaN(endMultiplicand)) {
            displayError("Enter only valid numbers into End Multiplicand form (-50 to 50).");
            return false;
        }

        if (startMultiplier > endMultiplier || startMultiplicand > endMultiplicand) {
            displayError("Start value must be less than or equal to end value.");
            return false;
        }

        if (Math.abs(startMultiplier) > 50 || Math.abs(endMultiplier) > 50 ||
            Math.abs(startMultiplicand) > 50 || Math.abs(endMultiplicand) > 50) {
            displayError("Numbers entered must be between -50 and 50.");
            return false;
        }

        return true;
    }

    // Creation of table
    function generateTable(startMultiplier, endMultiplier, startMultiplicand, endMultiplicand) {
        const table = document.createElement('table');

        const headerRow = document.createElement('tr');
        const headerCell = document.createElement('th');
        headerCell.textContent = '×';
        headerCell.classList.add('multiply-symbol');
        headerRow.appendChild(headerCell);

        for (let i = startMultiplier; i <= endMultiplier; i++) {
            const th = document.createElement('th');
            th.textContent = i;
            headerRow.appendChild(th);
        }

        table.appendChild(headerRow);

        for (let i = startMultiplicand; i <= endMultiplicand; i++) {
            const row = document.createElement('tr');
            const headerCell = document.createElement('th');
            headerCell.textContent = i;
            row.appendChild(headerCell);

            for (let j = startMultiplier; j <= endMultiplier; j++) {
                const cell = document.createElement('td');
                const product = i * j;
                cell.textContent = product;

                const rowHue = ((i - startMultiplicand) / (endMultiplicand - startMultiplicand)) * 360;
                const colHue = ((j - startMultiplier) / (endMultiplier - startMultiplier)) * 360;
                const hue = (rowHue + colHue) / 2;

                cell.style.backgroundColor = `hsl(${hue}, 100%, 70%)`;

                row.appendChild(cell);
            }

            table.appendChild(row);
        }

        return table;
    }

    // Errors output
    function displayError(message) {
        $('#error-message').text(message);
    }

    // Adding the tabs
    function addTab(tabLabel, table) {
        const tabId = `tabs-${$('#tabs').children('ul').children('li').length + 1}`;
        const li = $('<li>').appendTo($('#tabs-list'));
        const checkbox = $('<input>').attr({
            type: 'checkbox',
            id: `checkbox-${tabId}`
        }).appendTo(li);
        $('<a>').attr('href', `#${tabId}`).text(tabLabel).appendTo(li);

        const tabContent = $('<div>').attr('id', tabId).addClass('tab-content').append(table);
        $('#tabs').append(tabContent).tabs('refresh').tabs('option', 'active', -1);

        // Add close button to tab
        $('<span>').addClass('ui-icon ui-icon-close').appendTo(li).on('click', function() {
            const panelId = $(this).closest('li').remove().attr('aria-controls');
            $(`#${panelId}`).remove();
            $('#tabs').tabs('refresh');
        });
    }

    // Deletes all selected tabs
    function deleteSelectedTabs() {
        const checkboxes = $('#tabs-list').find('input[type="checkbox"]:checked');
        checkboxes.each(function() {
            const panelId = $(this).closest('li').remove().attr('aria-controls');
            $(`#${panelId}`).remove();
        });
    }

    // Deletes all the tabs 
    function deleteAllTabs() {
        const checkboxes = $('#tabs-list').find('input');
        checkboxes.each(function() {
            const panelId = $(this).closest('li').remove().attr('aria-controls');
            $(`#${panelId}`).remove();
        });
    }

});
