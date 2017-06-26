timeTableStorage = [{
	"id": 0,
	"name": "Table Default",
	"data": [],
}];

activeTable = timeTableStorage[0];

var highlighted = {
	0: [],
	"highlight": function (id) {
		if (highlighted[id]) {
			highlighted[id].forEach(function (slot) {
				$("#timetable ." + slot).addClass("highlight");
				if ($(".quick-selection ." + slot + "-tile")) {
					$(".quick-selection ." + slot + "-tile").addClass("highlight");
				}
			});
			$(".quick-selection button").not("[disabled]").each(function () {
				if ($("#timetable ." + this.classList[0].split('-')[0]).not(".highlight").length === 0) {
					$(this).addClass("highlight");
				}
			});
		} else {
			highlighted[id] = [];
		}
	}
};

function loadCourseData() {
	var isDataAvailable = false;

	function createScript() {
		var scriptTag = document.createElement("script");
		scriptTag.async = false;
		document.body.appendChild(scriptTag);
		return scriptTag;
	}
	
	function loadAssets(callback) {
		var scripts = [
			"https://cdnjs.cloudflare.com/ajax/libs/easy-autocomplete/1.3.5/jquery.easy-autocomplete.min.js",
			"js/autocomplete_course.js"
		];

		var stylesheets = [
			"https://cdnjs.cloudflare.com/ajax/libs/easy-autocomplete/1.3.5/easy-autocomplete.min.css"			
		];

		stylesheets.forEach(function(link) {
			$('<link rel="stylesheet" href="' + link + '">').appendTo("head");
		});

		scripts.slice(0, -1).forEach(function(src) {
			var scriptTag = createScript();
			scriptTag.src = src;
		});

		var scriptTag = createScript();
		scriptTag.addEventListener("load", callback);		
		scriptTag.src = scripts[scripts.length - 1];				
	}

    if(isDataAvailable) {
		function prepareGetRequest(url) {
			return $.get(url, {
				dataType: "json"
			});
		}

		var $getRequests = [
				"data/all_data.json",
				"data/unique_courses.json"
			].map(function(url) {
				return prepareGetRequest(url);
			});

        $.when.apply($, $getRequests)
			.done(function(args1, args2) {
				all_data = args1[0];
				unique_courses = args2[0];

				loadAssets(function loadAssetsHandler() {
					initAutocomplete(all_data, unique_courses);
				});
			})
			.fail(function() {
				console.error("Failed to load course data.");
			});
    }
}

$(function () {
	// load localForage data
	// (function () {
	// 	localforage.getItem('timeTableStorage').then(function (storedValue) {
	// 		timeTableStorage = storedValue || timeTableStorage;
	// 		activeTable = timeTableStorage[0];

	// 		fillPage(activeTable.data);
	// 		updateTableDropdownLabel(activeTable.name);

	// 		timeTableStorage.slice(1).forEach(function (table) {
	// 			addTableDropdownButton(table.id, table.name);
	// 		});
	// 	});
	// })();

	loadCourseData();

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
		if (activeTable.data.length === 0) {
			courseId = 0;
		} else {
			var lastAddedCourse = activeTable.data[activeTable.data.length - 1];
			courseId = lastAddedCourse[0] + 1;
		}

		activeTable.data.push([courseId, courseCode, courseTile, faculty, slotArray, venue, credits]);

		addCourseToTimetable(courseId, courseCode, venue, slotArray);
		insertCourseToCourseListTable(courseId, courseCode, courseTile, faculty, slotArray, venue, credits);
		checkSlotClash();
		updateLocalForage();
	});

	// Load course again in the panel
	$("#courseListTable table").on("dblclick", "tr", function () {
		var slotString = $(this).find("td").not("[colspan]").eq(0).text();
		var courseCode = $(this).find("td").eq(1).text();
		var courseTile = $(this).find("td").eq(2).text();
		var faculty = $(this).find("td").eq(3).text();
		var venue = $(this).find("td").eq(4).text();
		var credits = $(this).find("td").eq(5).text();

		$('#inputCourseCode').val(courseCode).trigger("change");
		$('#inputCourseTitle').val(courseTile).trigger("change");
		$('#inputFaculty').val(faculty).trigger("change");
		$('#inputSlotString').val(slotString).trigger("change");
		$('#inputVenue').val(venue).trigger("change");
		$('#inputCourseCredits').val(credits).trigger("change");

		try {
			// Function may not work if autocomplete file is commented.
			addSlotButtons(courseCode);
		} catch (error) {

		}

		$(this).find(".close").click();
	});

	// delete course from table
	$("#courseListTable table").on("click", ".close", removeCourse);

	// Reset current table not all tables
	$('#resetButton').click(function () {
		clearPage();
		activeTable.data = [];
		updateLocalForage();
		highlighted[activeTable.id] = [];
	});

	// switch table menu option on click
	$("#saved-tt-picker").on("click", "a", function () {
		var selectedTableId = Number($(this).data("table-id"));
		switchTable(selectedTableId);
	});

	// Remove table
	$("#saved-tt-picker").on("click", ".tt-picker-remove", function (e) {
		e.preventDefault();
		e.stopPropagation();
		var tableId = Number($(this).closest("a").data("table-id"));
		$(this).closest("li").remove();
		removeTable(tableId);
	});

	// Rename table button
	$("#saved-tt-picker").on("click", ".tt-picker-edit-button", function (e) {
		e.preventDefault();
		e.stopPropagation();
		var tableName = $(this).closest("a").children(".tt-table-name").text().trim();
		$(this).closest("a").siblings("input").val(tableName);
		$(this).closest("a").siblings("input").show().focus();
		$(this).closest("a").siblings(".tt-picker-edit-ok").show();
		$(this).closest("a").hide();
	});

	// Rename input focus out
	$("#saved-tt-picker").on("focusout", ".tt-picker-edit-input", function (e) {
		e.preventDefault();
		e.stopPropagation();
		var tableId = Number($(this).siblings("a").data("table-id"));
		var tableName = $(this).val();
		$(this).siblings("a").children(".tt-table-name").text(tableName);
		$(this).siblings("a").show();
		$(this).hide();
		$(this).siblings(".tt-picker-edit-ok").hide();
		renameTable(tableId, tableName);
	});

	$("#saved-tt-picker").on("keydown", ".tt-picker-edit-input", function (e) {
		// enter or Esc key
		if (e.which === 13 || e.which === 27) {
			$(this).blur();
		}
	});

	// Add table button
	$("#saved-tt-picker-add").click(function () {
		var newTableId = timeTableStorage[timeTableStorage.length - 1].id + 1;
		var newTableName = "Table " + newTableId;
		timeTableStorage.push({
			"id": newTableId,
			"name": newTableName,
			"data": []
		});
		addTableDropdownButton(newTableId, newTableName);
		switchTable(newTableId);
		updateLocalForage();
		highlighted[newTableId] = [];
	});

});

function addColorChangeEvents() {
	$("#timetable .TimetableContent:not([disabled])").click(function () {
		if ((!$(this).hasClass("clash")) && $(this).children("div").length === 0) {
			$(this).toggleClass("highlight");
			if (!$(this).hasClass("highlight")) {
				$(".quick-selection ." + this.classList[1] + "-tile").removeClass("highlight");
				// remove slots from highlighted
				var index = highlighted[activeTable.id].indexOf(this.classList[2]);
				highlighted[activeTable.id].splice(index, 1);
				return;
			} else {
				// add slots to highlighted
				if (this.classList.length === 3) {
					// some course may only have lab slot
					highlighted[activeTable.id].push(this.classList[1]);
				} else {
					highlighted[activeTable.id].push(this.classList[2]);
				}

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
				// remove slots from highlighted
				var index = highlighted[activeTable.id].indexOf(this.classList[0].split('-')[0]);
				highlighted[activeTable.id].splice(index, 1);
			} else {
				$("#timetable ." + this.classList[0].split('-')[0]).addClass("highlight");
				// add slots to highlighted
				highlighted[activeTable.id].push(this.classList[0].split('-')[0]);
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

	$('#courseListTable tbody #totalCreditsTr').before($trElement);

	// update credits
	updateCredits();
}

function updateCredits() {
	var totalCredits = 0;
	$('#courseListTable tbody tr').not('#totalCreditsTr').each(function () {
		// 6th column is credits column
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

function removeCourse(e) {
	e.stopPropagation();
	var dataCourse = $(this).closest('tr').attr('data-course');

	$('#timetable tr td div[data-course="' + dataCourse + '"]').remove();
	$('#courseListTable tbody tr[data-course="' + dataCourse + '"]').remove();

	checkSlotClash();
	updateCredits();

	var courseId = Number(dataCourse.substr(-1));
	for (var i = 0; i < activeTable.data.length; ++i) {
		if (activeTable.data[i][0] == courseId) {
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

	for (var i = 0; i < timeTableStorage.length; i++) {
		if (tableId == timeTableStorage[i].id) {
			activeTable = timeTableStorage[i];
			updateTableDropdownLabel(activeTable.name);
			fillPage(activeTable.data);
			// return;
			break;
		}
	}
	highlighted.highlight(tableId);
}

function updateTableDropdownLabel(tableName) {
	$("#saved-tt-picker-label .btn-text").text(tableName);
}

function removeTable(tableId) {
	for (var i = 0; i < timeTableStorage.length; ++i) {
		if (timeTableStorage[i].id == tableId) {
			// If it is the active table, change activeTable.
			if (activeTable.id == tableId) {
				switchTable(timeTableStorage[i - 1].id);
			}
			timeTableStorage.splice(i, 1);
			updateLocalForage();
			return;
		}
	}
}

function renameTable(tableId, tableName) {
	for (var i = 0; i < timeTableStorage.length; i++) {
		if (timeTableStorage[i].id == tableId) {
			timeTableStorage[i].name = tableName;
			updateLocalForage();
			// If active table is renamed
			if (activeTable.id == tableId) {
				updateTableDropdownLabel(tableName);
			}
			return;
		}
	}
}

function addTableDropdownButton(tableId, tableName) {
	$("#saved-tt-picker").append(
		'<li>' +
		'<input class="tt-picker-edit-input" style="display:none;" type="text">' +
		'<button title="Ok" type="button" class="close tt-picker-edit-ok" style="display:none;" aria-label="Ok"><span aria-hidden="true">&#10004;</span></button>' +
		'<a href="JavaScript:void(0);" data-table-id="' + tableId + '">' +
		'<span class="tt-table-name">' + tableName + '</span>' +
		'<button title="Remove" type="button" class="close tt-picker-remove" aria-label="Remove"><span aria-hidden="true">&#10008;</span></button>' +
		'<button title="Rename" type="button" class="close tt-picker-edit-button" aria-label="Rename"><span aria-hidden="true">&#9998;</span></button>' +
		'</a>' +
		'</li>'
	);
}

// save data through localForage
function updateLocalForage() {
	// localforage.setItem('timeTableStorage', timeTableStorage);
	return;
}