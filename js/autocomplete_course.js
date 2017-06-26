function initAutocomplete(allData, uniqueData) {
    unique_courses = uniqueData;
    all_data = allData;
    // autocomplete options
    var courseCodeOption = {
        data: unique_courses,

        getValue: "CODE",

        list: {
            match: {
                enabled: true
            },

            maxNumberOfElements: 10,

            onSelectItemEvent: function () {
                var title = $("#inputCourseCode").getSelectedItemData().TITLE;
                $("#inputCourseTitle").val(title).trigger("change");
                var code = $("#inputCourseCode").getSelectedItemData().CODE;
                addSlotButtons(code);
            }
        },

        template: {
            type: "description",
            fields: {
                description: "TITLE"
            }
        },

        placeholder: "Search..."
    };

    var courseTitleOption = {
        data: unique_courses,

        getValue: "TITLE",

        list: {
            match: {
                enabled: true
            },

            onSelectItemEvent: function () {
                var code = $("#inputCourseTitle").getSelectedItemData().CODE;
                $("#inputCourseCode").val(code).trigger("change");
                addSlotButtons(code);
            }
        },

        template: {
            type: "description",
            fields: {
                description: "CODE"
            }
        },

        placeholder: "Search..."
    };

    $("#insertCourseSelectionOptions").on("click", "button", function () {
        var code = $(this).data('code');
        var title = $(this).data('title');
        var slot = $(this).data('slot');
        var faculty = $(this).data('faculty');
        // var type = $(this).data('type');
        var venue = $(this).data('venue');
        var credits = $(this).data('credits');

        $('#inputCourseCode').val(code);
        $('#inputCourseTitle').val(title);
        $('#inputSlotString').val(slot);
        $('#inputFaculty').val(faculty);
        $('#inputVenue').val(venue);
        $('#inputCourseCredits').val(credits);
    });

    $("#insertCourseSelectionOptions").on("dblclick", "button", function () {
        $('#slot-sel-area #addCourseBtn').click();
    });

    $("#inputCourseTitle").easyAutocomplete(courseTitleOption);
    $("#inputCourseCode").easyAutocomplete(courseCodeOption);
    $("div.easy-autocomplete").removeAttr("style"); // for dynamic width

    $('#slot-sel-area input[type="text"]').keyup(function (e) {
        if (e.which === 13) {
            $(this).blur();
        }
    });
}

// Add slot selection buttons from array of slots
function getSlotSelectionButton(code, title, type, slot, faculty, credits, venue) {
    var $slotButton = $('<button type="button" class="list-group-item"></button>');
    var $h5 = $('<h5 class="list-group-item-heading"></h5>');
    var $p = $('<p class="list-group-item-text"></p>');

    $h5.text(slot);
    $p.text([faculty, venue, type].join(' | '));
    $slotButton.append($h5);
    $slotButton.append($p);

    $slotButton.data('code', code);
    $slotButton.data('title', title);
    $slotButton.data('slot', slot);
    $slotButton.data('faculty', faculty);
    // $slotButton.data('type', type);
    $slotButton.data('venue', venue);
    $slotButton.data('credits', credits);

    return $slotButton;
}

function addSlotButtons(code) {
    var BUTTONS_PER_DIV = 4;

    $('#insertCourseSelectionOptions').html('');

    var buttonsPerDiv = BUTTONS_PER_DIV;
    var $buttonDiv = $('<div></div>');
    $('#insertCourseSelectionOptions').append($buttonDiv);

    $.each(all_data, function (key, value) {
        if (value.CODE === code) {

            var $slotButton = getSlotSelectionButton(value.CODE, value.TITLE, value.TYPE, value.SLOT, value.FACULTY, value.CREDITS.toString(), value.VENUE);
            $buttonDiv.append($slotButton);

            buttonsPerDiv--;

            if (buttonsPerDiv === 0) {
                $buttonDiv = $('<div></div>');
                $('#insertCourseSelectionOptions').append($buttonDiv);
                buttonsPerDiv = BUTTONS_PER_DIV;
            }
        }
    });
}