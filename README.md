# DHIS2 translation remover

## Installation:
> npm install

## Usage:
> node translationRemove.js [mode] [metadata.json] [locales]

To remove or keep multiple locales at once, add as many locale codes as desired. E.g. > node translationRemove.js [-k] metadata.json pt fr es
Use [mode] = -k to specify which locale to keep, or [mode] = -r to specify locales to remove.
