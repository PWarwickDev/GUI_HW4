$(document).ready(function() {
    // Initialize sliders and bind to corresponding input fields
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
                input.val(ui.value); // Update input field value on slider slide
            },
            change: function(event, ui) {
                input.val(ui.value); // Update input field value on slider change
            }
        });

        // Update slider value on input change
        input.on('blur', function() {
            validateInput($(this), sliderId, minVal, maxVal); // Validate input after the user has finished typing
        });
    });

    // Function to validate input and update slider
    function validateInput(input, sliderId, minVal, maxVal) {
        let value = input.val().trim(); // Trim any leading/trailing whitespace
        if (value === '') {
            input.val(0); // Default to 0 if input is empty
        } else if (/^(-)?\d+$/.test(value)) {
            // Check if input is a valid integer (allowing optional negative sign)
            value = parseInt(value);
            value = Math.min(Math.max(value, minVal), maxVal); // Ensure value is within range
            input.val(value); // Update input with validated value
            $(sliderId).slider('value', value); // Update corresponding slider
        } else {
            // If input is invalid, reset to previous valid value or default to 0
            input.val(0); // Default to 0 if input is invalid
        }
    }

    // jQuery UI tabs initialization
    $('#tabs').tabs();

    // Form validation and table generation
    $('#table-form').validate({
        submitHandler: function(form) {
            $('#error-message').text('');
            generateTab(); // Generate table as a tab on form submit
            return false; // Prevent form submission
        }
    });

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

    function validateInputs(startMultiplier, endMultiplier, startMultiplicand, endMultiplicand) {
        if (isNaN(startMultiplier) || isNaN(endMultiplier) || isNaN(startMultiplicand) || isNaN(endMultiplicand)) {
            displayError("Enter only valid numbers into input boxes (-50 to 50).");
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

    function displayError(message) {
        $('#error-message').text(message);
    }

    function addTab(tabLabel, table) {
        const tabId = `tabs-${$('#tabs').children('ul').children('li').length + 1}`;
        const li = $('<li>').appendTo($('#tabs-list'));
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
});
