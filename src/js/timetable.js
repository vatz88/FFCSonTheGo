/*
 *  This file contains the events and functions applied to
 *  the timetable
 */

import localforage from 'localforage/dist/localforage';
import html2canvas from 'html2canvas/dist/html2canvas';
import { parse, isValid } from 'date-fns';

var timetableStorage = [
    {
        id: 0,
        name: 'Default Table',
        data: [],
        quick: [],
    },
];

window.activeTable = timetableStorage[0];

$(() => {
    /*
        Click event for the add table button
     */
    $('#tt-picker-add').on('click', function () {
        var newTableId = timetableStorage[timetableStorage.length - 1].id + 1;
        var newTableName = 'Table ' + newTableId;

        timetableStorage.push({
            id: newTableId,
            name: newTableName,
            data: [],
            quick: [],
        });

        addTableToPicker(newTableId, newTableName);
        switchTable(newTableId);
        updateLocalForage();
    });

    /*
        Click event for the timetable picker dropdown labels
     */
    $('#tt-picker-dropdown').on('click', '.tt-picker-label', function () {
        var selectedTableId = Number($(this).children('a').data('table-id'));
        switchTable(selectedTableId);
    });

    /*
        Click event to set the data attribute before opening the rename modal
     */
    $('#tt-picker-dropdown').on('click', '.tt-picker-rename', function () {
        var $a = $(this).closest('li').find('a:first');

        var tableId = Number($a.data('table-id'));
        var tableName = $a.text();

        $('#table-name').val(tableName).trigger('focus');
        $('#rename-tt-button').data('table-id', tableId);
    });

    /*
        Click event for the rename button in the rename modal
     */
    $('#rename-tt-button').on('click', function () {
        var tableId = $(this).data('table-id');
        var tableName = $('#table-name').val().trim();

        if (tableName == '') {
            tableName = 'Untitled Table';
        }

        renameTable(tableId, tableName);
    });

    /*
        Keydown event for the input table name field in the rename modal
     */
    $('#table-name').on('keydown', function (e) {
        if (e.key == 'Enter') {
            $('#rename-tt-button').trigger('click');
        }
    });

    /*
        Click event to set the data attribute before opening the delete modal
     */
    $('#tt-picker-dropdown').on('click', '.tt-picker-delete', function () {
        var tableId = Number(
            $(this).closest('li').find('a:first').data('table-id'),
        );

        $('#delete-tt-button').data('table-id', tableId);
    });

    /*
        Click event for the delete button in the delete modal
     */
    $('#delete-tt-button').on('click', function () {
        var tableId = $(this).data('table-id');
        deleteTable(tableId);

        if (timetableStorage.length == 1) {
            $('#tt-picker-dropdown .tt-picker-delete').first().remove();
        }
    });

    /*
        Click event for the download timetable button in the download modal
     */
    $('#download-tt-button').on('click', function () {
        var buttonText = $(this).html();
        $(this)
            .html(
                `<span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                ></span>&nbsp;&nbsp;Please Wait`,
            )
            .attr('disabled', true);

        const width = $('#timetable')[0].scrollWidth;
        var $layout = $('<div></div>').css({
            padding: '2rem',
            position: 'absolute',
            top: 0,
            left: `calc(-${width}px - 4rem)`,
        });

        $layout = appendHeader($layout, width);

        const $timetableClone = $('#timetable').clone().css({
            width: width,
        });
        $('table', $timetableClone).css({
            margin: 0,
        });
        $('tr', $timetableClone).css({
            border: 'none',
        });

        $layout.append($timetableClone);
        $('body').append($layout);

        html2canvas($layout[0], {
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
        }).then((canvas) => {
            $layout.remove();
            $(this).html(buttonText).attr('disabled', false);

            var $a = $('<a></a>')
                .css({
                    display: 'none',
                })
                .attr('href', canvas.toDataURL('image/jpeg'))
                .attr(
                    'download',
                    `FFCS On The Go ${activeTable.name} (Timetable).jpg`,
                );

            $('body').append($a);
            $a[0].click();
            $a.remove();
        });
    });

    /*
        Click event for the download course list button in the download modal
     */
    $('#download-course-list-button').on('click', function () {
        var buttonText = $(this).html();
        $(this)
            .html(
                `<span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                ></span>&nbsp;&nbsp;Please Wait`,
            )
            .attr('disabled', true);

        const width = $('#course-list')[0].scrollWidth;
        var $layout = $('<div></div>').css({
            padding: '2rem',
            position: 'absolute',
            top: 0,
            left: `calc(-${width}px - 4rem)`,
        });

        $layout = appendHeader($layout, width);

        const $courseListClone = $('#course-list').clone().css({
            width: width,
            border: '1px solid var(--table-border-color)',
            'border-bottom': 'none',
        });
        $('table', $courseListClone).css({
            margin: 0,
        });
        $('tr', $courseListClone)
            .css({
                border: 'none',
            })
            .each(function () {
                if ($(this).children().length == 1) {
                    return;
                }

                $('th:last-child', this).remove();
                $('td:last-child', this).remove();
            });

        $layout.append($courseListClone);
        $('body').append($layout);

        html2canvas($layout[0], {
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
        }).then((canvas) => {
            $layout.remove();
            $(this).html(buttonText).attr('disabled', false);

            var $a = $('<a></a>')
                .css({
                    display: 'none',
                })
                .attr('href', canvas.toDataURL('image/jpeg'))
                .attr(
                    'download',
                    `FFCS On The Go ${activeTable.name} (Course List).jpg`,
                );

            $('body').append($a);
            $a[0].click();
            $a.remove();
        });
    });

    /*
        Click event for the quick visualization button
     */
    $('#quick-toggle').on('click', function () {
        if ($(this).attr('data-state') == 'enabled') {
            $('i', this).prop('class', 'fas fa-eye');
            $('span', this).html('&nbsp;&nbsp;Enable Quick Visualization');
            $(this).attr('data-state', 'disabled');

            $('#timetable .highlight:not(:has(div))').removeClass('highlight');
        } else {
            $('i', this).prop('class', 'fas fa-eye-slash');
            $('span', this).html('&nbsp;&nbsp;Disable Quick Visualization');
            $(this).attr('data-state', 'enabled');

            activeTable.quick.forEach((el) =>
                $('#timetable')
                    .find('tr')
                    .eq(el[0])
                    .find('td')
                    .eq(el[1])
                    .addClass('highlight'),
            );
        }

        $('.quick-buttons').slideToggle();
    });

    /*
        Click event for the reset button in the reset modal
     */
    $('#reset-tt-button').on('click', function () {
        resetPage();
        activeTable.data = [];
        updateLocalForage();
    });
});

/*
    Function to add a header to the images
 */
function appendHeader($layout, width) {
    const $header = $('<div></div>')
        .css({
            width: width,
            'margin-bottom': '1rem',
        })
        .append(
            $('<h3>FFCS On The Go</h3>').css({
                margin: 0,
                display: 'inline',
                color: '#9c27b0',
                'font-weight': 'bold',
            }),
        )
        .append(
            $(`<h3>${campus} Campus</h3>`).css({
                margin: 0,
                display: 'inline',
                color: '#707070',
                float: 'right',
            }),
        )
        .append(
            $('<hr>').css({
                'border-color': '#000000',
                'border-width': '2px',
            }),
        );
    const $title = $(`<h4>${activeTable.name}</h4>`).css({
        'margin-bottom': '1rem',
        width: width,
        'text-align': 'center',
    });

    return $layout.append($header).append($title);
}

/*
    Function to update the saved data
 */
function updateLocalForage() {
    localforage
        .setItem('timetableStorage', timetableStorage)
        .catch(console.error);
}

/*
    Function to get the table index
 */
function getTableIndex(id) {
    return timetableStorage.findIndex((el) => el.id == id);
}

/*
    Function to fill the timetable and course list
 */
function fillPage() {
    $.each(activeTable.data, function (index, courseData) {
        addCourseToCourseList(courseData);
        addCourseToTimetable(courseData);
    });

    $.each(activeTable.quick, function (index, el) {
        var $el = $('#timetable').find('tr').eq(el[0]).find('td').eq(el[1]);
        var slot = $el.get(0).classList[1];

        $(`.quick-buttons .${slot}-tile`).addClass('highlight');

        if ($('#quick-toggle').attr('data-state') == 'enabled') {
            $el.addClass('highlight');
        }
    });
}

/*
    Function to change the active table
 */
function switchTable(tableId) {
    resetPage();

    activeTable = timetableStorage[getTableIndex(tableId)];
    updatePickerLabel(activeTable.name);
    fillPage();
}

/*
    Function to rename the timetable picker label
 */
function updatePickerLabel(tableName) {
    $('#tt-picker-button').text(tableName);
}

/*
    Function to delete a table
 */
function deleteTable(tableId) {
    var tableIndex = getTableIndex(tableId);
    timetableStorage.splice(tableIndex, 1);
    updateLocalForage();

    // Check if the active table is deleted
    if (activeTable.id == tableId) {
        if (tableIndex == 0) {
            switchTable(timetableStorage[0].id);
        } else {
            switchTable(timetableStorage[tableIndex - 1].id);
        }
    }

    // Removing the timetable picker item
    $('#tt-picker-dropdown .tt-picker-label')
        .find(`[data-table-id="${tableId}"]`)
        .closest('li')
        .remove();
}

/*
    Function to rename a table
 */
function renameTable(tableId, tableName) {
    var tableIndex = getTableIndex(tableId);
    timetableStorage[tableIndex].name = tableName;
    updateLocalForage();

    // Check if the active table is renamed
    if (activeTable.id == tableId) {
        updatePickerLabel(tableName);
    }

    // Renaming the timetable picker item
    $('#tt-picker-dropdown .tt-picker-label')
        .find(`[data-table-id="${tableId}"]`)
        .text(tableName);
}

/*
    Function to add a table to the timetable picker
 */
function addTableToPicker(tableId, tableName) {
    $('#tt-picker-dropdown').append(
        `<li>
            <table class="dropdown-item">
                <td class="tt-picker-label">
                    <a href="JavaScript:void(0);" data-table-id="${tableId}"
                        >${tableName}</a
                    >
                </td>
                <td>
                    <a
                        class="tt-picker-rename"
                        href="JavaScript:void(0);"
                        data-bs-toggle="modal"
                        data-bs-target="#rename-modal"
                        ><i class="fas fa-pencil-alt"></i
                    ></a
                    ><a
                        class="tt-picker-delete"
                        href="JavaScript:void(0);"
                        data-bs-toggle="modal"
                        data-bs-target="#delete-modal"
                        ><i class="fas fa-trash"></i
                    ></a>
                </td>
            </table>
        </li>`,
    );

    if (timetableStorage.length == 2) {
        $('#tt-picker-dropdown .tt-picker-rename')
            .first()
            .after(
                `<a
                    class="tt-picker-delete"
                    href="JavaScript:void(0);"
                    data-bs-toggle="modal"
                    data-bs-target="#delete-modal"
                    ><i class="fas fa-trash"></i
                ></a>`,
            );
    }
}

/*
    Function to check if slots are clashing
 */
function checkSlotClash() {
    $('#timetable tr td').removeClass('clash');
    $('#course-list tr').removeClass('table-danger');

    const $theoryHours = $('#theory td:not(.lunch)');
    const $labHours = $('#lab td:not(.lunch)');

    $('#timetable tr').each(function () {
        $('.highlight', this).each(function () {
            const index = $(this).index();
            var currentEnd, nextStart;

            if ($('div', this).data('is-lab')) {
                currentEnd = parse(
                    $labHours.eq(index).data('end'),
                    'h:mm aa',
                    new Date(),
                );

                if (!isValid(currentEnd)) {
                    currentEnd = parse(
                        $labHours.eq(index).data('end'),
                        'HH:mm',
                        new Date(),
                    );
                }
            } else if ($('div', this).data('is-theory')) {
                currentEnd = parse(
                    $theoryHours.eq(index).data('end'),
                    'h:mm aa',
                    new Date(),
                );

                if (!isValid(currentEnd)) {
                    currentEnd = parse(
                        $theoryHours.eq(index).data('end'),
                        'HH:mm',
                        new Date(),
                    );
                }
            }

            if ($('div', $(this).next()).data('is-lab')) {
                nextStart = parse(
                    $labHours.eq(index + 1).data('start'),
                    'h:mm aa',
                    new Date(),
                );

                if (!isValid(nextStart)) {
                    nextStart = parse(
                        $labHours.eq(index + 1).data('start'),
                        'HH:mm',
                        new Date(),
                    );
                }
            } else if ($('div', this).data('is-theory')) {
                nextStart = parse(
                    $theoryHours.eq(index + 1).data('start'),
                    'h:mm aa',
                    new Date(),
                );

                if (!isValid(nextStart)) {
                    nextStart = parse(
                        $theoryHours.eq(index + 1).data('start'),
                        'HH:mm',
                        new Date(),
                    );
                }
            }

            if ($('div', this).length > 1) {
                $(this).addClass('clash');

                $('div', this).each(function () {
                    const dataCourse = $(this).data('course');
                    $(`#course-list tr[data-course=${dataCourse}]`).addClass(
                        'table-danger',
                    );
                });
            }

            if (nextStart && nextStart < currentEnd) {
                $(this).addClass('clash');
                $(this).next().addClass('clash');

                const dataCourse = $('div', this).data('course');
                $(`#course-list tr[data-course=${dataCourse}]`).addClass(
                    'table-danger',
                );

                $('div', $(this).next()).each(function () {
                    const dataCourse = $(this).data('course');
                    $(`#course-list tr[data-course=${dataCourse}]`).addClass(
                        'table-danger',
                    );
                });
            }
        });
    });
}

/*
    Function to initialize quick visualization
 */
function initializeQuickVisualization() {
    /*
        Click event for the quick visualization buttons
     */
    $('.quick-buttons *[class*="-tile"]').on('click', function () {
        var slot = this.classList[0].split('-')[0];

        if (
            !$(`#timetable .${slot}`).hasClass('clash') &&
            $(`#timetable .${slot}`).children('div').length == 0
        ) {
            var slots = [];

            $(`#timetable .${slot}`).each((i, el) => {
                var row = $(el).parent().index();
                var column = $(el).index();

                slots.push([row, column]);
            });

            if ($(this).hasClass('highlight')) {
                $(`#timetable .${slot}`).removeClass('highlight');

                activeTable.quick = activeTable.quick.filter((el) => {
                    for (var i = 0; i < slots.length; ++i) {
                        if (el[0] == slots[i][0] && el[1] == slots[i][1]) {
                            return false;
                        }
                    }

                    return true;
                });
            } else {
                $(`#timetable .${slot}`).addClass('highlight');
                activeTable.quick.push(...slots);
            }

            $(this).toggleClass('highlight');
            updateLocalForage();
        }
    });

    /*
        Click event for the periods when quick visualization is enabled
     */
    $('#timetable .period:not([disabled])').on('click', function () {
        if (
            $('#quick-toggle').attr('data-state') == 'enabled' &&
            !$(this).hasClass('clash') &&
            $(this).children('div').length == 0
        ) {
            var slot = this.classList[1];
            var row = $(this).parent().index();
            var column = $(this).index();

            $(this).toggleClass('highlight');

            if (!$(this).hasClass('highlight')) {
                activeTable.quick = activeTable.quick.filter(
                    (el) => el[0] != row || el[1] != column,
                );
            } else {
                activeTable.quick.push([row, column]);
            }

            if ($(`#timetable .${slot}`).not('.highlight').length == 0) {
                $(`.quick-buttons .${slot}-tile`).addClass('highlight');
            } else {
                $(`.quick-buttons .${slot}-tile`).removeClass('highlight');
            }

            updateLocalForage();
        }
    });
}

/*
    Function to initialize the timetable
 */
window.initializeTimetable = () => {
    var timetable;
    $('#timetable tr').slice(2).hide();
    $('#timetable tr td:not(:first-child)').remove();

    if (window.campus == 'AP') {
        timetable = require('../schemas/ap.json');
    } else if (window.campus == 'Chennai') {
        timetable = require('../schemas/chennai.json');
    } else {
        timetable = require('../schemas/vellore.json');
    }

    var theory = timetable.theory,
        lab = timetable.lab;
    var theoryIndex = 0,
        labIndex = 0;
    var $quickButtons = $('.quick-buttons').eq(0); // Morning slot quick buttons

    while (theoryIndex < theory.length || labIndex < lab.length) {
        const theorySlots = theory[theoryIndex];
        const labSlots = lab[labIndex];

        if (theorySlots && labSlots && !theorySlots.days && !labSlots.days) {
            $('#timetable tr:first').append(
                '<td class="lunch" style="width: 8px;" rowspan="9">L<br />U<br />N<br />C<br />H</td>',
            );
            $quickButtons = $('.quick-buttons').eq(1); // Afternoon slot quick buttons
            ++theoryIndex;
            ++labIndex;

            continue;
        }

        const $theoryHour = $('<td class="theory-hour"></td>');
        const $labHour = $('<td class="lab-hour"></td>');

        if (theorySlots && theorySlots.start && theorySlots.end) {
            $theoryHour.html(
                `${theorySlots.start}<br />to<br />${theorySlots.end}`,
            );
            $theoryHour.data('start', theorySlots.start);
            $theoryHour.data('end', theorySlots.end);
        }

        if (labSlots && labSlots.start && labSlots.end) {
            $labHour.html(`${labSlots.start}<br />to<br />${labSlots.end}`);
            $labHour.data('start', labSlots.start);
            $labHour.data('end', labSlots.end);
        }

        $('#theory').append($theoryHour);
        $('#lab').append($labHour);

        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        for (var i = 0; i < days.length; ++i) {
            const $period = $('<td class="period"></td>');
            const day = days[i];

            if (theorySlots && theorySlots.days && day in theorySlots.days) {
                const slot = theorySlots.days[day];
                $period.text(slot);
                $period.addClass(slot);
                $(`#${day}`).show();

                // Add quick buttons for theory slots
                if (!$(`.${slot}-tile`).get(0)) {
                    var index = slot.replace(/[^A-Z]/gi, '').length - 1;

                    while (index >= $quickButtons.find('tr').length) {
                        $quickButtons.find('table').append('<tr></tr>');
                    }

                    $quickButtons
                        .find('tr')
                        .eq(index)
                        .append(
                            `<button class="${slot}-tile btn quick-button">${slot}</button>`,
                        );
                }
            }

            if (labSlots && labSlots.days && day in labSlots.days) {
                const slot = labSlots.days[day];
                $period.text(
                    ($period.text() != '' ? $period.text() + ' / ' : '') + slot,
                );
                $period.addClass(slot);
                $(`#${day}`).show();
            }

            if ($period.text() == '') {
                $period.attr('disabled', true);
            }

            $(`#${day}`).append($period);
        }

        if (theorySlots && !theorySlots.lunch) {
            ++theoryIndex;
        }

        if (labSlots && !labSlots.lunch) {
            ++labIndex;
        }
    }

    initializeQuickVisualization();

    /*
        Getting saved data from localforage
     */
    localforage
        .getItem('timetableStorage')
        .then(function (storedValue) {
            timetableStorage = storedValue || timetableStorage;
            activeTable = timetableStorage[0];

            updatePickerLabel(activeTable.name);
            fillPage();

            // Renaming the 'Default Table' option
            $('#tt-picker-dropdown .tt-picker-label a')
                .first()
                .attr('data-table-id', activeTable.id)
                .text(activeTable.name);

            timetableStorage.slice(1).forEach(function (table) {
                addTableToPicker(table.id, table.name);
            });
        })
        .catch(console.error);
};

/*
    Function to add a course to the timetable
 */
window.addCourseToTimetable = (courseData) => {
    courseData.slots.forEach(function (slot) {
        var $divElement = $(
            `<div 
                data-course="course${courseData.courseId}"
                >${courseData.courseCode}${
                courseData.venue != '' ? '-' + courseData.venue : ''
            }</div
            >`,
        );

        if (courseData.slots[0][0] == 'L') {
            $divElement.data('is-lab', true);
        } else {
            $divElement.data('is-theory', true);
        }

        $(`#timetable tr .${slot}`).addClass('highlight').append($divElement);

        $(`.quick-buttons .${slot}-tile`).addClass('highlight');
    });

    checkSlotClash();
    updateLocalForage();
};

/*
    Function to remove a course from the timetable
 */
window.removeCourseFromTimetable = (course) => {
    $(`#timetable tr td div[data-course="${course}"]`)
        .parent()
        .each(function () {
            if ($(this).children().length != 1) {
                return;
            }

            $(this).removeClass('highlight');
            var slot = this.classList[1];

            if (!$(`.quick-buttons .${slot}-tile`).hasClass('highlight')) {
                return;
            }

            var row = $(this).parent().index();
            var column = $(this).index();

            for (var i = 0; i < activeTable.quick.length; ++i) {
                var el = activeTable.quick[i];

                if (el[0] == row && el[1] == column) {
                    if ($('#quick-toggle').attr('data-state') == 'enabled') {
                        $(this).addClass('highlight');
                    }

                    return;
                }
            }

            $(`.quick-buttons .${slot}-tile`).removeClass('highlight');
        });

    $(`#timetable tr td div[data-course="${course}"]`).remove();
    checkSlotClash();
    updateLocalForage();
};

/*
    Function to clear the timetable from the body but not delete it's data
 */
window.clearTimetable = () => {
    $('#timetable .period').removeClass('highlight clash');
    $('.quick-buttons *[class*="-tile"]').removeClass('highlight');

    if ($('#timetable tr div[data-course]')) {
        $('#timetable tr div[data-course]').remove();
    }
};
