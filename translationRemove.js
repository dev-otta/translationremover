/* jshint esversion:6 */
/* jshint node:true */

const fs = require('fs');
const path = require('path');

let mode;
let fileName;

if (process.argv.length < 4) {
    console.log('\nUsage: node translationRemove.js <mode> <metadata.json> <locales>\nTo remove multiple locales at once, add as many locale codes as desired. E.g. > node translationRemove.js [-k] metadata.json pt fr es\nUse <mode> = -k to specify which locale to keep, or <mode> = -r to specify locales to remove.');
    process.exit(-1);
}
if (process.argv[2].charAt(0) === '-') {
    mode = process.argv[2];
    fileName = process.argv[3];
} else if (process.argv[3].charAt(0) === '-') {
    mode = process.argv[3];
    fileName = process.argv[2];
} else {
    console.log('Error: No mode specified! First or second argument must be -k or -r.');
    process.exit(-1);
}

const procArgs = process.argv.slice(4);
let options = { localesToRemove: procArgs };
let count = 0;

console.log('procArgs:');
console.log(procArgs);
console.log(`Mode: ${mode}`);

main();

function main() {
    let metadata = JSON.parse(fs.readFileSync(fileName));

    if (metadata) {
        console.log(`Locale(s) to remove: ${options.localesToRemove}`);
        propertyWalker(metadata, options);
        console.log( (mode == '-r' ? `Translations removed: ${count}` : `Translations kept: ${count}`) );
    }

    // Save metadata
    let outFileName = newFileName(fileName);
    fs.writeFileSync(outFileName, JSON.stringify(metadata, null, 4));
    console.log(`New file saved as: ${outFileName}`);
}

function propertyWalker(obj, options) {

    if (obj.hasOwnProperty('translations')) {
        let indexToRemove = [];
        let translationsToKeep = [];
        for (index in obj.translations) {
            if (mode == '-r') {
                for (locale of options.localesToRemove) {
                    if (obj.translations[index].locale == locale) {
                        count++;
                        //console.log(`${obj.translations[index].locale} : ${obj.translations[index].value}`);
                        indexToRemove.push(index);
                    }
                }
            }
            if (mode == '-k') {
                for (locale of options.localesToRemove) {
                    if (obj.translations[index].locale == locale) {
                        count++;
                        //console.log(`${obj.translations[index].locale} : ${obj.translations[index].value}`);
                        translationsToKeep.push(obj.translations[index]);
                    }

                }

            }
        }
        while (indexToRemove.length) {
            obj.translations.splice(indexToRemove.pop(), 1);
        }
        if (mode == '-k') {
            obj.translations = translationsToKeep;
        }
    }

    for (let key in obj) {
        if (obj.hasOwnProperty(key) && (typeof obj[key] === 'object')) {
            propertyWalker(obj[key], options);
        }
    }
}

function newFileName(fileName) {
    let ext = path.extname(fileName);
    return ((path.basename(fileName).slice(0, -(ext.length))) + '_new' + ext);
}
