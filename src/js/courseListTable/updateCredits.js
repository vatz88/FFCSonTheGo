export function updateCredits() {
    var totalCredits = 0;
    $('#courseListTable tbody tr')
        .not('#totalCreditsTr')
        .each(function() {
            // 6th column is credits column
            totalCredits += Number(
                $(this)
                    .children('td')
                    .eq(5)
                    .text(),
            );
        });
    $('#totalCredits').text(totalCredits);
}