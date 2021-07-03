import $ from 'jquery';

export let filterSlotArr = [];
export function resetFilterSlotArr() {
    filterSlotArr = [];
}

export let filterVenueArr = [];
export function resetFilterVenueArr() {
    filterVenueArr = [];
}

const courses_data = {
    unique_courses: [],
    all_data: [],
};

var multiselectSlotConfig = {
    enableCaseInsensitiveFiltering: true,
    delimiterText: '; ',
    enableClickableOptGroups: true,
    disableIfEmpty: true,
    disabledText: 'Apply Slot Filter',
    buttonWidth: '100%',
    maxHeight: 200,
    onChange: function(option, checked) {
        if (checked) {
            for (var key = 0; key < option.length; key++) {
                if (option[key.toString()].value) {
                    filterSlotArr.indexOf(option[key.toString()].value) ===
                        -1 && filterSlotArr.push(option[key.toString()].value);
                } else {
                    var allSelectOption = option[key.toString()];
                    for (
                        var innerkey = 0;
                        innerkey < allSelectOption.length;
                        innerkey++
                    ) {
                        if (allSelectOption[innerkey.toString()].value) {
                            filterSlotArr.indexOf(
                                allSelectOption[innerkey.toString()].value,
                            ) === -1 &&
                                filterSlotArr.push(
                                    allSelectOption[innerkey.toString()].value,
                                );
                        }
                    }
                }
            }
        } else {
            for (var key = 0; key < option.length; key++) {
                if (option[key.toString()].value) {
                    var filterSlotIndex = filterSlotArr.indexOf(
                        option[key.toString()].value,
                    );
                    filterSlotArr.splice(filterSlotIndex, 1);
                } else {
                    var allSelectOption = option[key.toString()];
                    for (
                        var innerkey = 0;
                        innerkey < allSelectOption.length;
                        innerkey++
                    ) {
                        if (allSelectOption[innerkey.toString()].value) {
                            var filterSlotIndex = filterSlotArr.indexOf(
                                allSelectOption[innerkey.toString()].value,
                            );
                            filterSlotArr.splice(filterSlotIndex, 1);
                        }
                    }
                }
            }
        }
        $('#insertCourseSelectionOptions button').show();
        if (filterSlotArr.length) {
            $('#insertCourseSelectionOptions button')
                .not(function(i, el) {
                    var elSlot = $(el).data('slot');
                    if (filterSlotArr.indexOf(elSlot) > -1) {
                        return true;
                    } else {
                        return false;
                    }
                })
                .hide();
        }
    },
};

var multiselectVenueConfig = {
    enableCaseInsensitiveFiltering: true,
    delimiterText: '; ',
    enableClickableOptGroups: true,
    disableIfEmpty: true,
    disabledText: 'Apply Venue Filter',
    buttonWidth: '100%',
    maxHeight: 200,
    onChange: function(option, checked) {
        if (checked) {
            for (var key = 0; key < option.length; key++) {
                if (option[key.toString()].value) {
                    filterVenueArr.indexOf(option[key.toString()].value) ===
                        -1 && filterVenueArr.push(option[key.toString()].value);
                } else {
                    var allSelectOption = option[key.toString()];
                    for (
                        var innerkey = 0;
                        innerkey < allSelectOption.length;
                        innerkey++
                    ) {
                        if (allSelectOption[innerkey.toString()].value) {
                            filterVenueArr.indexOf(
                                allSelectOption[innerkey.toString()].value,
                            ) === -1 &&
                                filterVenueArr.push(
                                    allSelectOption[innerkey.toString()].value,
                                );
                        }
                    }
                }
            }
        } else {
            for (var key = 0; key < option.length; key++) {
                if (option[key.toString()].value) {
                    var filterSlotIndex = filterVenueArr.indexOf(
                        option[key.toString()].value,
                    );
                    filterVenueArr.splice(filterSlotIndex, 1);
                } else {
                    var allSelectOption = option[key.toString()];
                    for (
                        var innerkey = 0;
                        innerkey < allSelectOption.length;
                        innerkey++
                    ) {
                        if (allSelectOption[innerkey.toString()].value) {
                            var filterSlotIndex = filterVenueArr.indexOf(
                                allSelectOption[innerkey.toString()].value,
                            );
                            filterVenueArr.splice(filterSlotIndex, 1);
                        }
                    }
                }
            }
        }
        $('#insertCourseSelectionOptions button').show();
        if (filterVenueArr.length) {
            $('#insertCourseSelectionOptions button')
                .not(function(i, el) {
                    var elVenue = $(el).data('venue');
                    if (filterVenueArr.indexOf(elVenue) > -1) {
                        return true;
                    } else {
                        return false;
                    }
                })
                .hide();
        }
    },
};

export function initAutocomplete(isChennai) {
    if (isChennai) {
        courses_data.all_data = require('../data/all_data_chennai.json');
        courses_data.unique_courses = require('../data/unique_courses_chennai.json');
    } else {
        courses_data.all_data = require('../data/all_data.json');
        courses_data.unique_courses = require('../data/unique_courses.json');
    }

    // autocomplete options
    var courseOptions = {
        data: courses_data.unique_courses,

        getValue: function(el) {
            return el.CODE + ' - ' + el.TITLE;
        },

        list: {
            match: {
                enabled: true,
            },

            maxNumberOfElements: 10,

            onSelectItemEvent: function() {
                var title = $('#inputCourse').getSelectedItemData().TITLE;
                var code = $('#inputCourse').getSelectedItemData().CODE;
                $('#inputCourse')
                    .val(code + ' - ' + title)
                    .trigger('change');
                addFilterButtons(code);
            },
        },
    };

    $('#inputCourse').easyAutocomplete(courseOptions);
    $('div.easy-autocomplete').removeAttr('style'); // for dynamic width
}

export function postInitAutocomplete() {
    $('#slot-sel-area input[type="text"]').keyup(function(e) {
        if (e.which === 13) {
            $(this).blur();
        }
    });

    $('#insertCourseSelectionOptions').on('click', 'button', function() {
        var slot = $(this).data('slot');
        var faculty = $(this).data('faculty');
        var type = $(this).data('type');
        var venue = $(this).data('venue');
        var credits = $(this).data('credits');

        $('#inputSlotString').val(slot);
        $('#inputFaculty').val(faculty);
        $('#inputVenue').val(venue);
        $('#inputCourseCredits').val(credits);
        $('#inputIsProject').val(type === 'EPJ' ? 'true' : 'false');
    });

    $('#insertCourseSelectionOptions').on('dblclick', 'button', function() {
        $('#slot-sel-area #addCourseBtn').click();
        $(this).blur();
    });

    // Init Multiselect
    $('#filter-by-slot').multiselect(multiselectSlotConfig);
    $('#filter-by-venue').multiselect(multiselectVenueConfig);
}

// Add slot selection buttons from array of slots
function getSlotSelectionButton(
    code,
    title,
    type,
    slot,
    faculty,
    credits,
    venue,
) {
    var $slotButton = $(
        '<button type="button" class="list-group-item"></button>',
    );
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
    $slotButton.data('type', type);
    $slotButton.data('venue', venue);
    $slotButton.data('credits', credits);

    return $slotButton;
}

function addFilterButtons(code) {
    var BUTTONS_PER_DIV = 4;

    var buttonsPerDiv = BUTTONS_PER_DIV;
    var $buttonDiv = $('<div></div>');
    $('#insertCourseSelectionOptions').html('');
    $('#insertCourseSelectionOptions').append($buttonDiv);

    $('#filter-by-slot').html('');
    $('#filter-by-venue').html('');

    resetFilterSlotArr();
    resetFilterVenueArr();

    var theorySlotGroupSelect = [];
    var labSlotGroupSelect = [];
    var venueGroupSelect = [];

    $.each(courses_data.all_data, function(key, value) {
        if (value.CODE === code) {
            var $slotButton = getSlotSelectionButton(
                value.CODE,
                value.TITLE,
                value.TYPE,
                value.SLOT,
                value.FACULTY,
                (value.CREDITS || '').toString(),
                value.VENUE,
            );
            $buttonDiv.append($slotButton);

            // Build Multiselect group list
            if (value.SLOT[0] === 'L') {
                if (
                    typeof value.SLOT != 'undefined' &&
                    labSlotGroupSelect.indexOf(value.SLOT) === -1
                ) {
                    labSlotGroupSelect.push(value.SLOT);
                }
            } else {
                if (
                    typeof value.SLOT != 'undefined' &&
                    theorySlotGroupSelect.indexOf(value.SLOT) === -1
                ) {
                    theorySlotGroupSelect.push(value.SLOT);
                }
            }

            if (
                typeof value.VENUE != 'undefined' &&
                venueGroupSelect.indexOf(value.VENUE) === -1
            ) {
                venueGroupSelect.push(value.VENUE);
            }

            buttonsPerDiv--;

            if (buttonsPerDiv === 0) {
                $buttonDiv = $('<div></div>');
                $('#insertCourseSelectionOptions').append($buttonDiv);
                buttonsPerDiv = BUTTONS_PER_DIV;
            }
        }
    });

    // Multiselect Theory
    if (theorySlotGroupSelect.length) {
        var $theorySlotGroupSelect = $('<optgroup label="Theory"></optgroup>');
        theorySlotGroupSelect.forEach(function(el) {
            var $option = $('<option value="' + el + '">' + el + '</option>');
            $theorySlotGroupSelect.append($option);
        });
        $('#filter-by-slot').append($theorySlotGroupSelect);
    }

    // Multiselect Lab
    if (labSlotGroupSelect.length) {
        var $labSlotGroupSelect = $('<optgroup label="Lab"></optgroup>');
        labSlotGroupSelect.forEach(function(el) {
            var $option = $('<option value="' + el + '">' + el + '</option>');
            $labSlotGroupSelect.append($option);
        });
        $('#filter-by-slot').append($labSlotGroupSelect);
    }

    // Multiselect Venue
    if (venueGroupSelect.length) {
        var $venueGroupSelect = $('#filter-by-venue');
        venueGroupSelect.forEach(function(el) {
            var $option = $('<option value="' + el + '">' + el + '</option>');
            $venueGroupSelect.append($option);
        });
    }

    $('#filter-by-slot').multiselect('rebuild');
    $('#filter-by-venue').multiselect('rebuild');
}
