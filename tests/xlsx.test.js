const xlsx = require('xlsx');

function getMissingColumnHeaders(document) {
    const wb = xlsx.readFile(__dirname + '/../util/' + document, {
        sheetRows: 1,
    });
    const headersArray = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
        header: 1,
    })[0];
    const headersSet = new Set(headersArray);

    const requiredHeaders = [
        'CODE',
        'TITLE',
        'TYPE',
        'VENUE',
        'FACULTY',
        'CREDITS',
        'SLOT',
    ];
    const missingHeaders = [];

    for (let i = 0; i < requiredHeaders.length; ++i) {
        if (!headersSet.has(requiredHeaders[i])) {
            missingHeaders.push(requiredHeaders[i]);
        }
    }

    return missingHeaders;
}

describe('does xlsx have the right headers', () => {
    test('vellore', () => {
        const missingHeaders = getMissingColumnHeaders('report_vellore.xlsx');
        expect(missingHeaders).toStrictEqual([]);
    });

    test('chennai', () => {
        const missingHeaders = getMissingColumnHeaders('report_chennai.xlsx');
        expect(missingHeaders).toStrictEqual([]);
    });

    test('ap', () => {
        const missingHeaders = getMissingColumnHeaders('report_ap.xlsx');
        expect(missingHeaders).toStrictEqual([]);
    });
});

function getXlsxSlots(document) {
    const wb = xlsx.readFile(__dirname + '/../util/' + document);
    const ws = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    const slots = ws
        .map((r) => r.SLOT)
        .filter((s) => s != 'NIL')
        .flatMap((s) => s.split('+'))
        .map((s) => s.trim());

    return new Set(slots);
}

function getSchemaSlots(document) {
    const schema = require(__dirname + '/../src/schemas/' + document);
    const slots = Object.values(schema)
        .flatMap((r) => r)
        .filter((r) => r.days)
        .flatMap((r) => Object.values(r.days));

    return new Set(slots);
}

describe('are xlsx slots present in schema', () => {
    test('vellore', () => {
        const xlsxSlots = getXlsxSlots('report_vellore.xlsx');
        const schemaSlots = getSchemaSlots('vellore.json');
        const extraSlots = [...xlsxSlots].filter((x) => !schemaSlots.has(x));

        expect(extraSlots).toStrictEqual([]);
    });

    test.skip('chennai', () => {
        const xlsxSlots = getXlsxSlots('report_chennai.xlsx');
        const schemaSlots = getSchemaSlots('chennai.json');
        const extraSlots = [...xlsxSlots].filter((x) => !schemaSlots.has(x));

        expect(extraSlots).toStrictEqual([]);
    });

    test.skip('ap', () => {
        const xlsxSlots = getXlsxSlots('report_ap.xlsx');
        const schemaSlots = getSchemaSlots('ap.json');
        const extraSlots = [...xlsxSlots].filter((x) => !schemaSlots.has(x));

        expect(extraSlots).toStrictEqual([]);
    });
});
