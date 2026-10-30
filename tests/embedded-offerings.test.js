const XLSX = require('xlsx');
const { combineEmbeddedOfferings } = require('../src/js/embedded-offerings');
const schema = require('../src/schemas/vellore.json');
const workbook = XLSX.readFile(__dirname + '/../util/report_vellore.xlsx');
const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
const options = (code) =>
    combineEmbeddedOfferings(
        rows.filter((row) => row.CODE === code),
        schema,
    );

test('Data Mining reserves the screenshot theory and lab together with three credits', () => {
    const mining = options('BITE312E');
    expect(mining).toHaveLength(4);
    expect(
        mining.find((row) => row.FACULTY === 'PRABHANANTHA KUMAR M'),
    ).toMatchObject({
        SLOT: 'G1+L49+L50',
        VENUE: 'SJT712 / SJTG20',
        TYPE: 'ETL',
        CREDITS: 3,
    });
    expect(
        mining.every((row) => row.TYPE === 'ETL' && row.SLOT.includes('+L')),
    ).toBe(true);
});

test('OOAD offers only complete same-faculty theory and lab combinations', () => {
    const ooad = options('BITE404E');
    expect(ooad).toHaveLength(6);
    expect(
        ooad.every(
            (row) =>
                row.TYPE === 'ETL' &&
                row.CREDITS === 3 &&
                row.SLOT.includes('+L'),
        ),
    ).toBe(true);
    expect(ooad.find((row) => row.FACULTY === 'SUGANYA A')).toMatchObject({
        SLOT: 'G1+L55+L56',
        VENUE: 'SJT711 / SJT122',
    });
});

test('embedded pairing rejects faculty mismatches and overlapping teaching hours', () => {
    const theory = {
        CODE: 'TEST101E',
        TYPE: 'ETH',
        SLOT: 'A1',
        FACULTY: 'Teacher',
        VENUE: 'Theory',
        CREDITS: 2,
    };
    const lab = {
        ...theory,
        TYPE: 'ELA',
        SLOT: 'L1+L2',
        VENUE: 'Lab',
        CREDITS: 1,
    };
    expect(combineEmbeddedOfferings([theory, lab], schema)).toEqual([
        theory,
        lab,
    ]);
    expect(
        combineEmbeddedOfferings(
            [theory, { ...lab, SLOT: 'L49+L50', FACULTY: 'Other' }],
            schema,
        ).some((row) => row.TYPE === 'ETL'),
    ).toBe(false);
});

test('ordinary courses and original allocation records stay unchanged', () => {
    const ordinary = rows.filter((row) => row.CODE === 'BITE302L');
    expect(combineEmbeddedOfferings(ordinary, schema)).toEqual(ordinary);
    const mining = rows.filter((row) => row.CODE === 'BITE312E');
    const original = JSON.parse(JSON.stringify(mining));
    combineEmbeddedOfferings(mining, schema);
    expect(mining).toEqual(original);
});
