/* File: script.js
GUI Assignment: Using the jQuery Plugin/UI with Your Dynamic Table part 1
Paul Warwick, UMass Lowell Computer Science, paul_warwick@student.uml.edu
Copyright (c) 2024 by Paul Warwick. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by PW on 6/16/2024 at 8:45 pm.

Description: Js file using JQuery to validate inputs.
*/

$(document).ready(function() {
    // Initialize the sliders and bind them to corresponding input fields
    $('#table-form').validate({
        rules: {
            'start-multiplier': {
                required: true,
                number: true
            },
            'end-multiplier': {
                required: true,
                number: true
            },
            'start-multiplicand': {
                required: true,
                number: true
            },
            'end-multiplicand': {
                required: true,
                number: true
            }
        }, // error messages
        messages: {
            'start-multiplier': {
                required: "Please enter a start multiplier",
                number: "Please enter a valid number"
            },
            'end-multiplier': {
                required: "Please enter an end multiplier",
                number: "Please enter a valid number"
            },
            'start-multiplicand': {
                required: "Please enter a start multiplicand",
                number: "Please enter a valid number"
            },
            'end-multiplicand': {
                required: "Please enter an end multiplicand",
                number: "Please enter a valid number"
            }
        },
        submitHandler: function(form) {
            $('#error-message').text('');

            // Parsing data
            const startMultiplier = parseInt($('#start-multiplier').val(), 10);
            const endMultiplier = parseInt($('#end-multiplier').val(), 10);
            const startMultiplicand = parseInt($('#start-multiplicand').val(), 10);
            const endMultiplicand = parseInt($('#end-multiplicand').val(), 10);

            // Error cases
            if (startMultiplier > endMultiplier || startMultiplicand > endMultiplicand) {
                displayError("Start value must be less than or equal to end value.");
                return false; // Prevent form submission
            }

            if (Math.abs(startMultiplier) > 50 || Math.abs(endMultiplier) > 50 ||
                Math.abs(startMultiplicand) > 50 || Math.abs(endMultiplicand) > 50) {
                displayError("Numbers entered must be between -50 and 50.");
                return false; // Prevent form submission
            }

            const table = generateTable(startMultiplier, endMultiplier, startMultiplicand, endMultiplicand);

            $('#table-container').empty().append(table);

            return false; // Prevent form submission
        }
    });

    // Generation of tables
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

                // Decide cell color based on row and column
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

    // Dealing with errors
    function displayError(message) {
        $('#error-message').text(message);
    }
});