export function addCourseToTimetable(
    courseId,
    courseCode,
    venue,
    slotArray,
    isProject,
) {
    slotArray.forEach(function(slot) {
        var $divElement = $(
            '<div data-course="' +
                'course' +
                courseId +
                '" data-is-lab="' +
                (slot[0] === 'L') +
                '" data-is-project="' +
                isProject +
                '">' +
                courseCode +
                '-' +
                venue +
                '</div>',
        );
        $('#timetable tr .' + slot)
            .addClass('highlight')
            .append($divElement);
        if ($('.quick-selection .' + slot + '-tile')) {
            $('.quick-selection .' + slot + '-tile').addClass('highlight');
        }
    });
}
