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

### Vellore third-year course additions

`report_vellore.xlsx` includes the courses from `3rd Year Course List_FINAL.xlsx`.
The 56 source rows produce 28 distinct slot options across 10 courses, including
new slots for the existing Human Computer Interaction course. Existing entries
are retained. Repeated rows with identical available details are included once.

-   Integrated (`ETL`) courses use separate `ETH` theory and `ELA` lab entries,
    with 2 and 1 credits respectively, totaling the source's 3 credits.
-   `F1/F2` represents two alternative slots and is stored as separate options.
-   Faculty and venue are marked `Not announced` because the source omits them.
    Theory/lab pairings in the source are represented as separate components,
    following the app's existing course data format.

### Vellore Winter Semester 2026-27 additions

The Winter Semester 2026-27 Vellore data also includes the user-provided
`BITE301L` (Computer Architecture and Organization) offering: `A1+TA1`,
`PRP426`, `KARPAGAM S`, theory (`TH`), 3 credits.

The user also supplied two 2-credit courses taught by `SUKANTA GHOSH`:

-   `BCSE102L` (Structured and Object-Oriented Programming), theory (`TH`):
    `D1` and `D2`, both in `PRP330`.
-   `BCSE102P` (Structured and Object-Oriented Programming Lab), lab (`LO`):
    `L39+L40+L55+L56` in `PRP347` and `L13+L14+L27+L28` in `PRP138`.

### Additional Tools

-   For converting a PDF file to Excel, use [ilovepdf.com](https://www.ilovepdf.com/pdf_to_excel).

### To-Do

-   [ ] Add a script to automate the PDF to XLSX conversion (note: this process might change depending on VIT's requirements).
