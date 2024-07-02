## Convert Excel Sheet to JSON

### Overview

The `convert_xlsx_to_json.js` script converts an Excel file to JSON format. The `convert_json_to_data.js` script transforms the JSON data to adhere to the required format.

### Usage

-   The scripts modify `data/all_data.json` as per the new Excel data.
-   Ensure the Excel file is named in the format `report_<campus>.xlsx`.
-   The sheet name must be `Sheet 1`.

### Requirements

The Excel sheet should contain the following column headers (case sensitive):
Certainly! Here's a table format for the specified columns:

Sure, here's the table formatted as requested:

| CODE | TITLE | TYPE | CREDITS | SLOT | FACULTY | VENUE |
| ---- | ----- | ---- | ------- | ---- | ------- | ----- |

You can fill in the rows with the relevant data. If you need the table in a specific format or file type, please let me know!

### Instructions

1. Use the `convert_xlsx_to_json.js` script to convert the Excel file to JSON.
2. Use the `convert_json_to_data.js` script to transform the JSON data into the required format.

### Note

The scripts may need modifications based on the data in the report.

### Additional Tools

For converting PDFs to Excel, use [SimplyPDF](https://simplypdf.com/Excel).

### To-Do

-   [ ] Add a script to automate the PDF to XLSX conversion (note: this process might change depending on VIT's requirements).
