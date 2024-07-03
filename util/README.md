## Convert Excel Sheet to JSON

### Overview

The `convert_xlsx_to_json.js` script converts an Excel file to JSON format. The `convert_json_to_data.js` script transforms the JSON data to adhere to the required format.

### Usage

-   The scripts modify `data/all_data.json` as per the new Excel data.

### Requirements

-   Ensure the Excel file is named in the format `report_<campus>.xlsx`.
-   The sheet name must be `Sheet 1`.
    The Excel sheet should contain the following column headers (case sensitive):

| CODE | TITLE | TYPE | CREDITS | SLOT | FACULTY | VENUE |
| ---- | ----- | ---- | ------- | ---- | ------- | ----- |

### Instructions

1. Use the `convert_xlsx_to_json.js` script to convert the Excel file to JSON.
2. Use the `convert_json_to_data.js` script to transform the JSON data into the required format.

> [!NOTE]
> Both of these scripts can be executed using the command `yarn run convert`.

### Additional Tools

For converting PDFs to Excel, use [SimplyPDF](https://simplypdf.com/Excel).

### To-Do

-   [ ] Add a script to automate the PDF to XLSX conversion (note: this process might change depending on VIT's requirements).
