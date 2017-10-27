$(function () {
    // Disclaimer modal config.
    $("#disclaimer-modal").modal();

    removeTouchHoverCSSRule();

    $(".alert-dismissible .close").click(function () {
        $(this).parent().toggleClass("hide");
    });

    $('.quick-selection .btn').click(function () {
        $(this).blur();
    });
    $('.btn,#timetable').contextmenu(function () {
        return false;
    });

    // $('#CourseAllocationReport-btn').click(function () {
    //     $('#ExcelSheet').html('<iframe width="100%" height="100%" frameborder="0" scrolling="no" src="https://onedrive.live.com/embed?cid=D67270317C4D2130&resid=D67270317C4D2130%211971&authkey=AOBukor57oPwDlU&em=2&ActiveCell=\'WINSEM2016-17_CourseAllotted_Re\'!A1&Item=\'WINSEM2016-17_CourseAllotted_Re\'!A%3AN&wdHideGridlines=True&wdDownloadButton=True"></iframe>');
    //     $('#ExcelSheet').css('height', '35vh');
    // });

    // Timetable screenshot
    $('#takeScreenshotBtn').click(function () {
        var timetable_img_src;
        var courseListTable_img_src;
        var newWindow_data = "";
        var original_width = $('body').width();
        $('body').width('1500');
        $('.screenshot_msg').show();
        var newWindow = window.open();
        // timetable screenshot
        html2canvas(document.getElementById('timetable'), {
            onrendered: function (canvas) {
                timetable_img_src = canvas.toDataURL("image/jpeg");
                newWindow_data =
                    '<html><head><title>FFCS on The Go</title></head><body><a href="' + timetable_img_src + '" download="FFCSOTG_MyTimeTable"><img width="100%" src="' + timetable_img_src + '" alt="FFCSonTheGo"/></a>' +
                    '<h1>Click on the image to download.</h1>';
                html2canvas(document.getElementById('courseListTable'), {
                    onrendered: function (canvas) {
                        courseListTable_img_src = canvas.toDataURL("image/jpeg");
                        newWindow_data = newWindow_data +
                            '<a href="' + courseListTable_img_src + '" download="FFCSOTG_MyCourses"><img width="100%" src="' + courseListTable_img_src + '" alt="FFCSonTheGo"/></a>' +
                            '<h1>Click on the image to download.</h1>' +
                            '</body></html>';
                        newWindow.document.write(newWindow_data);
                        $('.screenshot_msg').hide();
                        $('body').width(original_width);
                    }
                });
            }
        });
        ga('send', {
            hitType: 'event',
            eventCategory: 'Timetable',
            eventAction: 'click',
            eventLabel: 'Screenshot'
        });
    });

    $("header .alert-dismissible a").click(function () {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Promotion',
            eventAction: 'click',
            eventLabel: 'GitHub'
        });
    });

    $("#shareWhatsApp a").click(function () {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Share',
            eventAction: 'click',
            eventLabel: 'WhatsApp'
        });
    });

    $("footer a").click(function () {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Promotion',
            eventAction: 'click',
            eventLabel: 'VES'
        });
    });
});

// disable hover for touch screen devices
function removeTouchHoverCSSRule() {
    if ('createTouch' in document) {
        try {
            var ignore = /:hover/;
            for (var i = 0; i < document.styleSheets.length; i++) {
                var sheet = document.styleSheets[i];
                if (!sheet.cssRules) {
                    continue;
                }
                for (var j = sheet.cssRules.length - 1; j >= 0; j--) {
                    var rule = sheet.cssRules[j];
                    if (rule.type === CSSRule.STYLE_RULE && ignore.test(rule.selectorText)) {
                        sheet.deleteRule(j);
                    }
                }
            }
        } catch (e) {}
    }
}

// open github repo on ctrl+u
document.onkeydown = function (e) {
    if (e.ctrlKey && ((e.keyCode === 117 || e.keyCode === 85))) {
        window.open("https://github.com/vatz88/FFCSonTheGo");
        return false;
    } else {
        return true;
    }
};