# Convert Excel sheet to JSON

## Usage

`convert_xlsx_to_json.js` is used to convert excel to JSON.
`convert_json_to_data.js` has the transformation code to adhere to the required JSON format.

_`data/all_data.json` and `data/all_data.json` will be modified as per the new excel_

### Note

-   Make sure excel file name is `report_<campus>.xlsx`

-   The sheet name in the file MUST be `Sheet 1`

-   Excel sheet should ONLY have the following columns headers (case sensitive):

    **CODE**

    **TITLE**

    **TYPE**

    **VENUE**

    **FACULTY**

    **CREDITS**

    **SLOT**

-   The scipt may need to be modified depending upon the data in `report`.

-   Use https://simplypdf.com/Excel to convert PDF to Excel.

## TODO

[ ] Add script to automate PDF -> XLSX conversion (could change cos, VIT ¯\\\_(ツ)\_/¯)
