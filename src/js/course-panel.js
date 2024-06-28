/*
 *  This file contains the events and functions applied to
 *  the course panel
 */

import 'easy-autocomplete/dist/easy-autocomplete.min.css';
import 'bootstrap-select/dist/css/bootstrap-select.min.css';

/*
 *  The package bootstrap-select is not compatable with bootstrap 5 at the
 *  time of writing this. Once bootstrap-select has been upgraded to a stable
 *  version with bootstrap 5 support, the bootstrap 4 javascript import &
 *  it's dependency (bootstrap4) can be removed.
 */
import 'easy-autocomplete/dist/jquery.easy-autocomplete';
import 'bootstrap4/dist/js/bootstrap.bundle';
import 'bootstrap-select/dist/js/bootstrap-select';

$(() => {
    /*
        Event to listen to changes in the slot filter
     */
    $('#slot-filter').on(
        'changed.bs.select',
        function (e, clickedIndex, isSelected, previousValue) {
            /*
            If Select All / Deselect All is clicked, isSelected will be null
         */
            if (isSelected === null) {
                $('#slot-buttons button').show();
                return;
            }

            // If the current state has no selected items, show everything
            if (previousValue.length === 1 && !isSelected) {
                $('#slot-buttons button').show();
                return;
            }

            // If the previous state had nothing selected, hide everything
            // and display the selected option
            if (previousValue.length === 0) {
                $('#slot-buttons button').hide();
            }

            var option = $('option', this)[clickedIndex].value;

            if (isSelected) {
                $('#slot-buttons button:not(:visible)').each(function () {
                    if ($(this).data('slot') === option) {
                        $(this).show();
                    }
                });
            } else {
                $('#slot-buttons button:visible').each(function () {
                    if ($(this).data('slot') === option) {
                        $(this).hide();
                    }
                });
            }

            if ($('#slot-buttons button.selected:not(:visible)').length > 0) {
                $('#slot-buttons button.selected').removeClass('selected');
                $('#advanced-options input').val('');
            }
        },
    );

    // Hack to turn off auto focus, should be removed when
    // the bug in bootstrap-select is fixed
    $('#filter-by-slot').on('change', function () {
        $(this)
            .siblings('.dropdown-menu')
            .children('.bs-searchbox')
            .children('input[type="search"]')
            .trigger('blur');
    });

    /*
        Click event for the slot buttons
     */
    $('#slot-buttons').on('click', 'button', function () {
        $('.slot-button.selected').removeClass('selected');

        $(this).attr('class', 'slot-button selected');

        var slot = $(this).data('slot');
        var faculty = $(this).data('faculty');
        var type = $(this).data('type');
        var venue = $(this).data('venue');
        var credits = $(this).data('credits');

        $('#slot-input').val(slot);
        $('#faculty-input').val(faculty);
        $('#venue-input').val(venue);
        $('#credits-input').val(credits);
        $('#is-project-input').val(type === 'EPJ' ? 'true' : 'false');
    });

    /*
        Double click event to quickly add a course
     */
    $('#slot-buttons').on('dblclick', 'button', function () {
        $('#add-course-button').trigger('click');
        $(this).trigger('blur');
    });

    /*
        Click event to toggle advanced options
     */
    $('#advanced-toggle').on('click', function () {
        if ($(this).attr('data-state') === 'enabled') {
            $(this).text('Show Advanced Options');
            $(this).attr('class', 'btn btn-outline-secondary');
            $(this).attr('data-state', 'disabled');
        } else {
            $(this).text('Hide Advanced Options');
            $(this).attr('class', 'btn btn-secondary');
            $(this).attr('data-state', 'enabled');
        }

        $('#advanced-options').slideToggle();
    });

    /*
        Click event to clear the panel
     */
    $('#clear-panel-button').on('click', function () {
        clearPanel();
    });

    /*
        Click event to add a course
     */
    $('#add-course-button').on('click', function () {
        var course = $('#course-input').val().trim().split('-');
        var faculty = $('#faculty-input').val().trim();
        var slotString = $('#slot-input').val().toUpperCase().trim();
        var venue = $('#venue-input').val().trim();
        var credits = $('#credits-input').val().trim();
        var isProject = $('#is-project-input').val();

        // Reset is-project-input once read
        $('#is-project-input').val('false');

        if (course[0] == '') {
            $('#course-input').trigger('focus');
            return;
        }

        if (slotString == '') {
            if ($('#advanced-toggle').attr('data-state') != 'enabled') {
                $('#advanced-toggle').trigger('click');
            }

            $('#slot-input').trigger('focus');
            return;
        }

        var slots = (function () {
            var arr = [];

            try {
                slotString.split(/\s*\+\s*/).forEach(function (el) {
                    if (el && $('.' + el)) {
                        arr.push(el);
                    }
                });
            } catch (error) {
                arr = [];
            }

            return arr;
        })();

        var courseId = 0;
        if (activeTable.data.length != 0) {
            var lastAddedCourse = activeTable.data[activeTable.data.length - 1];
            courseId = lastAddedCourse.courseId + 1;
        }

        var courseCode = course[0].trim();
        var courseTitle = course.slice(1).join('-').trim();

        var courseData = {
            courseId: courseId,
            courseCode: courseCode,
            courseTitle: courseTitle,
            faculty: faculty,
            slots: slots,
            venue: venue,
            credits: credits,
            isProject: isProject,
        };

        activeTable.data.push(courseData);
        addCourseToCourseList(courseData);
        addCourseToTimetable(courseData);
    });
});

const courses_data = {
    courses: [],
    all_data: [],
};

/*
    Function to get the courses based on the selected campus
 */
window.getCourses = () => {
    if (window.campus == 'AP') {
        courses_data.all_data = require('../data/all_data_ap.json');
        courses_data.courses = require('../data/courses_ap.json');
    } else if (window.campus == 'Chennai') {
        courses_data.all_data = require('../data/all_data_chennai.json');
        courses_data.courses = require('../data/courses_chennai.json');
    } else {
        courses_data.all_data = require('../data/all_data_vellore.json');
        courses_data.courses = require('../data/courses_vellore.json');
    }

    initializeAutocomplete();
};

/*
    Function to fill the course input with unique courses
 */
function initializeAutocomplete() {
    const courseOptions = {
        data: courses_data.courses,
        getValue: function (el) {
            return el.CODE + ' - ' + el.TITLE;
        },
        list: {
            match: {
                enabled: true,
            },
            maxNumberOfElements: 10,
            onSelectItemEvent: function () {
                var title = $('#course-input').getSelectedItemData().TITLE;
                var code = $('#course-input').getSelectedItemData().CODE;

                $('#course-input').val(code + ' - ' + title);
                addSlotButtons(code);
            },
        },
    };

    $('#course-input').easyAutocomplete(courseOptions);
    $('div .easy-autocomplete').removeAttr('style');
}

/*
    Function to build a slot button
 */
function buildSlotButton(courseData) {
    var $slotButton = $('<button class="slot-button" type="button"></button>');
    var $h6 = $('<h6 class="slot-button-heading"></h6>');
    var $p = $('<p class="slot-button-text"></p>');

    $h6.text(courseData.SLOT);
    $p.text(
        [courseData.FACULTY, courseData.VENUE, courseData.TYPE]
            .filter(function (el) {
                if (el != '') {
                    return el;
                }
            })
            .join(' | '),
    );

    $slotButton.append($h6);
    $slotButton.append($p);

    $slotButton.data('code', courseData.CODE);
    $slotButton.data('title', courseData.TITLE);
    $slotButton.data('slot', courseData.SLOT);
    $slotButton.data('faculty', courseData.FACULTY);
    $slotButton.data('type', courseData.TYPE);
    $slotButton.data('venue', courseData.VENUE);
    $slotButton.data('credits', courseData.CREDITS);

    return $slotButton;
}

/*
    Function to add slot buttons and filter options
 */
window.addSlotButtons = (courseCode) => {
    $('#slot-buttons').html('');
    resetFilters();

    var theorySlotGroup = [];
    var labSlotGroup = [];

    $.each(courses_data.all_data, function (key, value) {
        if (value.CODE === courseCode) {
            var $slotButton = buildSlotButton(value);

            // Checking if the slot belongs to lab or theory
            if (value.SLOT[0] === 'L') {
                if (labSlotGroup.indexOf(value.SLOT) === -1) {
                    labSlotGroup.push(value.SLOT);
                }
            } else {
                if (theorySlotGroup.indexOf(value.SLOT) === -1) {
                    theorySlotGroup.push(value.SLOT);
                }
            }

            // Injecting the slot button to the document body
            $('#slot-buttons').append($slotButton);
        }
    });

    /*
        Adding the theory slots to the filter
     */
    if (theorySlotGroup.length) {
        var $theorySlotGroup = $('<optgroup label="Theory"></optgroup>');

        theorySlotGroup.forEach(function (el) {
            var $option = $(`<option value="${el}">${el}</option>`);
            $theorySlotGroup.append($option);
        });

        $('#slot-filter').append($theorySlotGroup);
    }

    /*
        Adding the lab slots to the filter
     */
    if (labSlotGroup.length) {
        var $labSlotGroup = $('<optgroup label="Lab"></optgroup>');

        labSlotGroup.forEach(function (el) {
            var $option = $(`<option value="${el}">${el}</option>`);
            $labSlotGroup.append($option);
        });

        $('#slot-filter').append($labSlotGroup);
    }

    if ($('#slot-filter option').length) {
        $('#slot-filter').prop('disabled', false);
    } else {
        $('#slot-filter').prop('disabled', true);
    }

    $('#slot-filter').selectpicker('refresh');
};

/*
    Function to reset all filters, deletes all filter options
 */
function resetFilters() {
    // Resetting the slot filter
    $('#slot-filter').html('');
    $('#slot-filter').prop('disabled', true);
    $('#slot-filter').selectpicker('refresh');
}

/*
    Function to clear the course panel
 */
window.clearPanel = () => {
    $('#course-panel input').val('');
    $('#slot-buttons').html('');
    resetFilters();
};
