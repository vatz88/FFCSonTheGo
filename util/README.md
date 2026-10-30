## Convert Excel Sheet to JSON

### Overview

The `convert_xlsx_to_json.js` script converts an Excel file to JSON format. The `convert_json_to_data.js` script transforms the JSON data to adhere to the required format.

### Requirements

-   Ensure the Excel file is named in the format `report_<campus>.xlsx`.
-   The sheet name must be `Sheet 1`.
-   The Excel sheet should contain the following column headers (case sensitive):

    | CODE | TITLE | TYPE | CREDITS | SLOT | FACULTY | VENUE |
    | ---- | ----- | ---- | ------- | ---- | ------- | ----- |

### Instructions

1. Use the `convert_xlsx_to_json.js` script to convert the Excel file to JSON.
2. Use the `convert_json_to_data.js` script to transform the JSON data into the required format.

> [!TIP]
> Both of these scripts can be executed using the command `yarn run convert`.

### Vellore third-year course allocations

The courses initially supplied in `3rd Year Course List_FINAL.xlsx` are enriched
with Winter Semester 2026-27 listings from [VTOP](https://vtop.vit.ac.in/vtop/content),
Academics → Course Registration Allocation, retrieved on 27 October 2026.
The 28 provisional slot entries are replaced with 108 verified faculty/venue
options across 10 courses. At that stage, all other existing entries were retained.

-   Each distinct faculty/venue/slot combination is retained, including multiple
    offerings sharing the same slot. No faculty or venue placeholders remain.
-   Integrated (`ETL`) courses use VTOP's separate `ETH` theory and `ELA` lab
    entries, with 2 and 1 credits respectively, totaling 3 credits.
-   `BSTS302P` uses the 52 VTOP allocations with type `SS` and slots `F1+TF1`
    or `F2+TF2`. Its 1.5 credits are verified in VTOP's My Curriculum → Open
    Elective table, replacing the original spreadsheet's 3-credit value.
-   VTOP displays classes according to the student's applicable class options.
    These records reflect the allocations visible in that view on the retrieval date.

### Vellore Winter Semester 2026-27 additions

The Winter Semester 2026-27 Vellore data also includes the user-provided
`BITE301L` (Computer Architecture and Organization) offering: `A1+TA1`,
`PRP426`, `KARPAGAM S`, theory (`TH`), 3 credits.

The user also supplied two 2-credit courses taught by `SUKANTA GHOSH`:

-   `BCSE102L` (Structured and Object-Oriented Programming), theory (`TH`):
    `D1` and `D2`, both in `PRP330`.
-   `BCSE102P` (Structured and Object-Oriented Programming Lab), lab (`LO`):
    `L39+L40+L55+L56` in `PRP347` and `L13+L14+L27+L28` in `PRP138`.

### Additional Vellore ECE and foundation allocations

An additional VTOP curriculum view was checked on 27 October 2026 for Winter
Semester 2026-27. It supplied 306 allocation records across 60 courses, covering
foundation, engineering sciences, ECE core/elective, project, and coding courses.
After excluding 52 already-present coding records, 254 new offerings were added.
At that stage, all 258 previously stored offerings were retained, giving 512
offerings across 86 searchable courses.

-   Faculty, venue, slot, and type come from Course Registration Allocation.
-   Credits are verified against My Curriculum. Integrated theory uses L + T
    credits and the lab receives the remaining course credits; the split varies
    by course rather than assuming every integrated course has the same split.
-   Project listings retain the source's `NIL` slot/venue and named administrative
    unit. Identical offerings are included once.

### Vellore VTOP refresh — 30 October 2026

Winter Semester 2026-27 allocations were checked again in
[VTOP](https://vtop.vit.ac.in/vtop/content), Academics → Course Registration
Allocation, using the IT curriculum view. All nine curriculum categories were
checked, yielding 193 offerings across 55 courses. These replace all previously
stored offerings for the same course codes, including changed faculty, venues,
slots, and course types. Credits were checked against My Curriculum, including
the separate theory/lab credit splits for integrated courses.

The refresh adds Database Systems and its lab, Web Technologies and its lab,
Discrete Mathematics and Graph Theory, four skills practice courses, and the IT
Project - II / Internship listing. The 145 offerings from before the Winter
2026-27 additions were removed. The 191 Winter offerings for 31 courses outside
this curriculum view are retained from the 27 October retrieval, including ECE.
The resulting workbook contains 384 offerings across 86 searchable courses.

VTOP limits listings to the student's applicable class options; this refresh
does not claim to cover every programme's allocations. Run `yarn convert` (or
`npm run convert`) after editing the workbook to regenerate the app's JSON data.

The Vellore course picker combines compatible same-faculty `ETH` and `ELA`
allocations into one `ETL` registration. Selecting it adds both theory and lab
slots, both venues, and the sum of the component credits. For example, Data
Mining with PRABHANANTHA KUMAR M uses `G1+L49+L50`, `SJT712 / SJTG20`, and
3 credits. The workbook and generated JSON retain the separate source rows.

### Additional Tools

-   For converting a PDF file to Excel, use [ilovepdf.com](https://www.ilovepdf.com/pdf_to_excel).

### To-Do

-   [ ] Add a script to automate the PDF to XLSX conversion (note: this process might change depending on VIT's requirements).
