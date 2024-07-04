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

### Additional Tools

- For converting a PDF file to Excel, use [ilovepdf.com](https://www.ilovepdf.com/pdf_to_excel).

### To-Do

-   [ ] Add a script to automate the PDF to XLSX conversion (note: this process might change depending on VIT's requirements).
