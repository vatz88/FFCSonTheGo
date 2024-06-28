const fs = require('fs');
const path = require('path');

if (!fs.existsSync(path.resolve(__dirname + '/../src/data'))) {
    fs.mkdirSync(path.resolve(__dirname + '/../src/data'));
}

const outputVellore = fs.readFileSync(
    path.resolve(__dirname + '/output_vellore.json'),
);
const outputObjectVellore = JSON.parse(outputVellore);

fs.writeFile(
    __dirname + '/../src/data/all_data_vellore.json',
    JSON.stringify(outputObjectVellore),
    () => console.log('Updated all_data_vellore.json'),
);

const outputChennai = fs.readFileSync(
    path.resolve(__dirname + '/output_chennai.json'),
);
const outputObjectChennai = JSON.parse(outputChennai);

fs.writeFile(
    path.resolve(__dirname + '/../src/data/all_data_chennai.json'),
    JSON.stringify(outputObjectChennai),
    () => console.log('Updated all_data_chennai.json'),
);

const outputAP = fs.readFileSync(path.resolve(__dirname + '/output_ap.json'));
const outputObjectAP = JSON.parse(outputAP);

fs.writeFile(
    __dirname + '/../src/data/all_data_ap.json',
    JSON.stringify(outputObjectAP),
    () => console.log('Updated all_data_ap.json'),
);

// Remove repetitive courses
const uniqueCourses = (outputObject) =>
    outputObject.filter(
        (element, index, self) =>
            self.findIndex(
                (t) => t.CODE === element.CODE && t.TITLE === element.TITLE,
            ) === index,
    );

fs.writeFile(
    path.resolve(__dirname + '/../src/data/courses_vellore.json'),
    JSON.stringify(uniqueCourses(outputObjectVellore)),
    () => console.log('Updated courses_vellore.json'),
);

fs.writeFile(
    path.resolve(__dirname + '/../src/data/courses_chennai.json'),
    JSON.stringify(uniqueCourses(outputObjectChennai)),
    () => console.log('Updated courses_chennai.json'),
);

fs.writeFile(
    path.resolve(__dirname + '/../src/data/courses_ap.json'),
    JSON.stringify(uniqueCourses(outputObjectAP)),
    () => console.log('Updated courses_ap.json'),
);
