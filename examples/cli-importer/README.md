# Create Asset and corresponding events on the Ambrosus Network with a JSON file using the Command Line Interface

This is a command line interface to add asset and their events to the [Ambrosus API](https://ambrosus.docs.apiary.i)

## Usage 

Run `npm install`

Change the values in the `cli-importer.js` file by entering your secret key and account address

The `json` file is a template on how the asset and events are supposed to be added to the Ambrosus Network

You can create your own json file or simply test the example - chocolate.json in the demo-assets folder. 

Make sure you have your secret key and account address to use the CLI tool

run `node cli-importer.js create ./../demo-assets/chocolate.json`
