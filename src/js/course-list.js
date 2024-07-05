/*
 *  This file contains the events and functions applied to
 *  the course list
 */

$(() => {
    /*
        Click event to sort the course list
     */
    $('#course-list th:not(:last)').on('click', function () {
        var isAscending = false,
            isDescending = false;
        var $items = retrieveColumnItems($(this));

        if ($(this).hasClass('ascending')) {
            isAscending = true;
        } else if ($(this).hasClass('descending')) {
            isDescending = true;
        }

        $('#course-list th').removeClass('ascending descending');

        // Sort the course list in ascending, descending or the default order
        if (!isAscending && !isDescending) {
            $items.sort(function (a, b) {
                return $(a).text() > $(b).text() ? 1 : -1;
            });

            $(this).addClass('ascending');
        } else if (isAscending && !isDescending) {
            $items.sort(function (a, b) {
                return $(a).text() < $(b).text() ? 1 : -1;
            });

            $(this).addClass('descending');
        } else {
            $items.sort(function (a, b) {
                return $(a).parent().data('course') >
                    $(b).parent().data('course')
                    ? 1
                    : -1;
            });
        }

        var sortedRows = $items.map(function (i, item) {
            return $(item).parent()[0];
        });

        $('#course-list tbody tr').remove();
        $('#course-list tbody').append(sortedRows);
    });

    /*
        Click event to delete a course from the course list
     */
    $('#course-list').on('click', '.close', function () {
        var course = $(this).closest('tr').attr('data-course');

        removeCourseFromCourseList(course);
        removeCourseFromTimetable(course);

        var courseId = Number(course.split(/(\d+)/)[1]);
        for (var i = 0; i < activeTable.data.length; ++i) {
            if (activeTable.data[i].courseId == courseId) {
                activeTable.data.splice(i, 1);
                break;
            }
        }
    });

    /*
        Double click event to add a course beck to the panel
     */
    $('#course-list').on('dblclick', 'tbody tr', function (e) {
        var slotString = $(this)
            .find('td')
            .not('[colspan]')
            .eq(getColumnIndex('Slot'))
            .text();
        var courseCode = $(this)
            .find('td')
            .eq(getColumnIndex('Course Code'))
            .text();
        var courseTitle = $(this)
            .find('td')
            .eq(getColumnIndex('Course Title'))
            .text();
        var faculty = $(this).find('td').eq(getColumnIndex('Faculty')).text();
        var venue = $(this).find('td').eq(getColumnIndex('Venue')).text();
        var credits = $(this).find('td').eq(getColumnIndex('Credits')).text();

        $('#course-input').val(courseCode + ' - ' + courseTitle);
        $('#faculty-input').val(faculty);
        $('#slot-input').val(slotString);
        $('#venue-input').val(venue);
        $('#credits-input').val(credits);

        addSlotButtons(courseCode);

        // Scroll back to the course panel and delete the course
        $('html, body')
            .animate({
                scrollTop: 0,
            })
            .promise()
            .done(() => {
                $(this).find('.close').trigger('click');
            });
    });
});

/*
    Function to get a columns index from the course list
 */
function getColumnIndex(column) {
    var columns = Array.from($('#course-list th'), function (el) {
        return el.innerText;
    });

    return columns.indexOf(column.innerText || column);
}

/*
    Function to retrive items from a column in the course list
 */
function retrieveColumnItems($column) {
    var index = getColumnIndex($column.text());

    var $rows = $('#course-list tbody tr');

    var items = $rows.map(function (i, row) {
        return $(row).find('td')[index];
    });

    return items;
}

/*
    Function to update the total credits
 */
function updateCredits() {
    var totalCredits = 0;

    $('#course-list tbody tr').each(function () {
        totalCredits += Number(
            $(this).children('td').eq(getColumnIndex('Credits')).text(),
        );
    });

    $('#total-credits').text(totalCredits);
}

/*
    Function to insert a course into the course list
 */
window.addCourseToCourseList = (courseData) => {
    var $courseListItem = $(
        `<tr
            data-course="course${courseData.courseId}"
            data-is-project="${courseData.isProject}"
        >
            <td>${courseData.slots.join('+')}</td>
            <td>${courseData.courseCode}</td>
            <td>${courseData.courseTitle}</td>
            <td>${courseData.faculty}</td>
            <td>${courseData.venue}</td>
            <td>${courseData.credits}</td>
            <td><i class="fas fa-times close"></i></td>
        </tr>`,
    );

    var nextRow = null;
    var sortedColumn =
        $('#course-list th.ascending')[0] || $('#course-list th.descending')[0];
    var isAscending = $('#course-list th.ascending')[0] != undefined;

    /*
        If the course list is sorted, the course should be
        inserted at the appropriate position
     */
    if (sortedColumn != undefined) {
        var index = getColumnIndex(sortedColumn);
        var $items = retrieveColumnItems($(sortedColumn));
        var currentItem = $courseListItem.find('td')[index];

        for (var i = 0; i < $items.length; i++) {
            var item = $items[i];

            if (isAscending) {
                if ($(currentItem).text() <= $(item).text()) {
                    nextRow = $(item).parent();
                    break;
                }
            } else {
                if ($(currentItem).text() >= $(item).text()) {
                    nextRow = $(item).parent();
                    break;
                }
            }
        }
    }

    if (nextRow === null) {
        $('#course-list tbody').append($courseListItem);
    } else {
        nextRow.before($courseListItem);
    }

    updateCredits();
};

/*
    Function to remove a course
 */
function removeCourseFromCourseList(course) {
    $(`#course-list tbody tr[data-course="${course}"]`).remove();
    updateCredits();
}

/*
    Function to clear the course list from the body but not delete it's data
 */
window.clearCourseList = () => {
    if ($('#course-list tbody tr[data-course]')) {
        $('#course-list tbody tr[data-course]').remove();
    }

    updateCredits();
};
