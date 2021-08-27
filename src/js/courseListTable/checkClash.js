export function checkSlotClash() {
    // Remove table-danger class (shows clashing) form tr in course list table.
    $('#courseListTable tbody tr').removeClass('table-danger');
    $('#timetable tr .hidden').removeClass('hidden');

    // Check clash from timetable in each slot area
    $('#timetable tr .highlight').each(function() {
        var $highlightedCell = $(this);
        var $highlightedCellDivs = $(this).children('div[data-course]');

        var noPostLabFlag =
            $(this).hasClass('noPostLab') &&
            $(this).children('div[data-is-lab="false"]').length > 0 &&
            $(this)
                .next()
                .children('div[data-is-lab="true"]').length > 0;
        var noPreTheoryFlag =
            $(this).hasClass('noPreTheory') &&
            $(this).children('div[data-is-lab="true"]').length > 0 &&
            $(this)
                .prev()
                .children('div[data-is-lab="false"]').length > 0;

        if (
            $highlightedCellDivs.length > 1 ||
            noPostLabFlag ||
            noPreTheoryFlag
        ) {
            var isClashing = true;

            // Check if there are two dissimilar courses or if there is a J
            // component course and a sibling in this cell.
            if ($highlightedCellDivs.length === 2) {
                var $firstCellDiv = $highlightedCellDivs.eq(0),
                    $secondCellDiv = $highlightedCellDivs.eq(1);

                var isFirstCourseJComp = $firstCellDiv.data('is-project'),
                    isSecondCourseJComp = $secondCellDiv.data('is-project');

                if (isFirstCourseJComp && isSecondCourseJComp) {
                } // Two J components in the same slot is a clash.
                else if (isFirstCourseJComp || isSecondCourseJComp) {
                    // Otherwise, check for similarity.
                    var firstCourseId = +$firstCellDiv
                        .data('course')
                        .split(/(\d+)/)[1];
                    var secondCourseId = +$secondCellDiv
                        .data('course')
                        .split(/(\d+)/)[1];

                    var firstCourseIdx = getIndexByCourseId(firstCourseId);
                    var secondCourseIdx = getIndexByCourseId(secondCourseId);

                    var firstCourse = activeTable.data[firstCourseIdx];
                    var secondCourse = activeTable.data[secondCourseIdx];

                    // Check to see if two courses are similar.
                    if (
                        firstCourse[1] === secondCourse[1] && // Course Code
                        firstCourse[2] === secondCourse[2] // Course Title
                    ) {
                        $highlightedCell.removeClass('clash');
                        var $projectDiv = isFirstCourseJComp
                            ? $firstCellDiv
                            : $secondCellDiv;
                        $projectDiv.addClass('hidden');
                        isClashing = false;
                    }
                }
            }

            if (isClashing) {
                // clash
                // remove, add clash in timetable
                $(this).addClass('clash');
                // show clash in course list table
                $(this)
                    .children('div[data-course]')
                    .each(function() {
                        var dataCourse = $(this).attr('data-course');
                        // Add table-danger class to tr of clashing course list table.
                        $(
                            '#courseListTable tbody tr[data-course="' +
                                dataCourse +
                                '"]',
                        ).addClass('table-danger');
                    });
            }
        } else if ($highlightedCellDivs.length === 1) {
            // no clash
            $(this)
                .removeClass('clash')
                .addClass('highlight');
        } else {
            // no course present
            $(this).removeClass('clash highlight');
            $('.quick-selection .' + this.classList[1] + '-tile').removeClass(
                'highlight',
            );
        }
    });
}