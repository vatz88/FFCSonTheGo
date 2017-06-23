var timeTableStorage,
	activeTable;

timeTableStorage = [{
	"id": 0,
	data: []
}];

activeTable = timeTableStorage[0];

$(function () {
	addColorChangeEvents();

	// Disable On Click Selection
	$("#toggleClickToSelect").click(function () {
		if ($(this).attr("data-state") === "enabled") {
			$(this).text("Enable Quick Visualization");
			$(this).attr("data-state", "disabled");
			$('.quick-selection *[class*="-tile"]').off();
			$("#timetable .TimetableContent").off();
			$('.quick-selection').hide(500);
		} else {
			$(this).text("Disable Quick Visualization");
			addColorChangeEvents();
			$(this).attr("data-state", "enabled");
			$('.quick-selection').show(500);
		}
	});

	$('#slot-sel-area #addCourseBtn').click(function () {
		var courseCode = $('#inputCourseCode').val().trim();
		var courseTile = $('#inputCourseTitle').val().trim();
		var faculty = $('#inputFaculty').val().trim();
		var slotString = $('#inputSlotString').val().toUpperCase().trim();
		var venue = $('#inputVenue').val().trim();
		var credits = $('#inputCourseCredits').val().trim();

		if (slotString === '') {
			$('#inputSlotString').focus();
			return;
		}

		var slotArray = (function () {
			var arr = [];
			slotString.split(/\s*\+\s*/).forEach(function (el) {
				if (el && $('.' + el)) {
					arr.push(el);
				}
			});
			return arr;
		})();

		// Add new course to the end of the array.
		var courseId;
		if(!activeTable.data.length)
			courseId = 0;
		else {
			var lastAddedCourse = activeTable.data[activeTable.data.length - 1];
			courseId = lastAddedCourse[0] + 1;
		}

		activeTable.data.push([courseId, courseCode, courseTile, faculty, slotArray, venue, credits]);

		addCourseToTimetable(courseId, courseCode, venue, slotArray);
		insertCourseToCourseListTable(courseId, courseCode, courseTile, faculty, slotArray, venue, credits);
		checkSlotClash();
		updateLocalForage();
	});

	$('#resetButton').click(function () {
		clearPage();

		activeTable.data = [];
		updateLocalForage();
	});

	$("#saved-tt-picker").on("click", "a", function (e) {
		e.preventDefault();
		var selectedTableId = Number.parseInt($(this).data("table-id"));
		switchTable(selectedTableId);
	});

	$("#saved-tt-picker-add").click(function (e) {
		// TODO: Fix possible delete bug.
		var newTableId = timeTableStorage.length;
		timeTableStorage.push({
			"id": newTableId,
			data: []
		});
		
		switchTable(newTableId);
		
		addTableDropdownButton(newTableId);
		updateTableDropdownLabel(newTableId);
	});

	// TODO: Add an option to remove a table.
});

function addColorChangeEvents() {
	$("#timetable .TimetableContent:not([disabled])").click(function () {
		if ((!$(this).hasClass("clash")) && $(this).children("div").length === 0) {
			$(this).toggleClass("highlight");
			if (!$(this).hasClass("highlight")) {
				$(".quick-selection ." + this.classList[1] + "-tile").removeClass("highlight");
				return;
			}
			if ($("#timetable ." + this.classList[1]).not(".highlight").length === 0) {
				$(".quick-selection ." + this.classList[1] + "-tile").addClass("highlight");
			}
		}
	});

	$('.quick-selection *[class*="-tile"]').click(function () {
		if ((!$("#timetable ." + this.classList[0].split('-')[0]).hasClass("clash")) && ($("#timetable ." + this.classList[0].split('-')[0]).children("div").length === 0)) {
			if ($(this).hasClass("highlight")) {
				$("#timetable ." + this.classList[0].split('-')[0]).removeClass("highlight");
			} else {
				$("#timetable ." + this.classList[0].split('-')[0]).addClass("highlight");
			}
			$(this).toggleClass("highlight");
		}
	});
}

function addCourseToTimetable(courseId, courseCode, venue, slotArray) {
	slotArray.forEach(function (slot) {
		var $divElement = $('<div data-course="' + 'course' + courseId + '">' + courseCode + '-' + venue + '</div>');
		$('#timetable tr .' + slot).addClass('highlight').append($divElement);
		if ($(".quick-selection ." + slot + "-tile")) {
			$(".quick-selection ." + slot + "-tile").addClass("highlight");
		}
	});
}

function insertCourseToCourseListTable(courseId, courseCode, courseTile, faculty, slotArray, venue, credits) {
	var $trElement = $('<tr data-course="' + 'course' + courseId + '">' +
		'<td>' + slotArray.join('+') + '</td>' +
		'<td>' + courseCode + '</td>' +
		'<td>' + courseTile + '</td>' +
		'<td>' + faculty + '</td>' +
		'<td>' + venue + '</td>' +
		'<td>' + credits + '</td>' +
		'<td><span class="close">&times;</span></td>' +
		'</tr>');

	// attach course removal listener
	$trElement.find('.close').click(removeCourse);

	$('#courseListTable tbody #totalCreditsTr').before($trElement);

	// update credits
	updateCredits();
}

function updateCredits() {
	var totalCredits = 0;
	$('#courseListTable tbody tr').not('#totalCreditsTr').each(function () {
		// 6th column in credits column
		totalCredits += Number($(this).children('td').eq(5).text());
	});
	$('#totalCredits').text(totalCredits);
}

function checkSlotClash() {
	// Remove danger class (shows clashing) form tr in course list table.
	$('#courseListTable tbody tr').removeClass('danger');

	// Check clash from timetable in each slot area
	$('#timetable tr .highlight').each(function () {
		if ($(this).children('div[data-course]').length > 1) {
			// clash
			// remove, add clash in timetable
			$(this).addClass('clash');
			// show clash in course list table
			$(this).children('div[data-course]').each(function () {
				var dataCourse = $(this).attr("data-course");
				// Add danger class to tr of clashing course list table.
				$('#courseListTable tbody tr[data-course="' + dataCourse + '"]').addClass('danger');
			});
		} else if ($(this).children('div[data-course]').length === 1) {
			// no clash
			$(this).removeClass('clash').addClass("highlight");
		} else {
			// no course present
			$(this).removeClass("clash highlight");
			$(".quick-selection ." + this.classList[1] + "-tile").removeClass("highlight");
		}
	});
}

function removeCourse() {
	var dataCourse = $(this).closest('tr').attr('data-course');

	$('#timetable tr td div[data-course="' + dataCourse + '"]').remove();
	$('#courseListTable tbody tr[data-course="' + dataCourse + '"]').remove();

	checkSlotClash();
	updateCredits();

	var courseId = Number.parseInt(dataCourse.substr(-1));
	for(var i = 0; i < activeTable.data.length; ++i) {
		if(activeTable.data[i][0] == courseId) {
			activeTable.data.splice(i, 1);
			break;
		}
	}

	updateLocalForage();
}

// Simply clears all the added content in the page but doesn't reset the data in memory.
function clearPage() {
	$('#timetable .TimetableContent').removeClass("highlight clash");
	$('.quick-selection *[class*="-tile"]').removeClass("highlight");
	$('#slot-sel-area input').val("");
	if ($('#timetable tr div[data-course]')) {
		$('#timetable tr div[data-course]').remove();
	}
	if ($('#courseListTable tbody tr[data-course]')) {
		$('#courseListTable tbody tr[data-course]').remove();
	}

	$('#insertCourseSelectionOptions').html("");
	updateCredits();
}

// Fills the page with the courses (array) passed.
function fillPage(data) {
	$.each(data, function (index, arr) {
		var courseId = arr[0];
		var courseCode = arr[1];
		var courseTile = arr[2];
		var faculty = arr[3];
		var slotArray = arr[4];
		var venue = arr[5];
		var credits = arr[6];

		// index is basically courseId
		addCourseToTimetable(courseId, courseCode, venue, slotArray);
		insertCourseToCourseListTable(courseId, courseCode, courseTile, faculty, slotArray, venue, credits);
	});
	checkSlotClash();
}

function switchTable(tableId) {
	clearPage();
	activeTable = timeTableStorage[tableId];
	fillPage(activeTable.data);
	updateTableDropdownLabel(tableId);	
}

function addTableDropdownButton(tableId) {
	$("#saved-tt-picker").append('<li><a href="#" data-table-id="' + tableId + '">Table ' + (tableId) + '</a></li>');	
}

function updateTableDropdownLabel(tableId) {
	var labelText = tableId ? "Table " + tableId : "Default";
	$("#saved-tt-picker-label .btn-text").text(labelText);		
}