global.XMLHttpRequest = require('xhr2');

const program = require('commander');
// eslint-disable-next-line no-unused-vars
const AmbrosusSDK = require('../../lib/ambrosus.cjs.js');

program
    .version('0.0.1')
    .description(
        'A command-line tool to import and create assets and events on the Ambrosus Network'
    );

program
    .command('load_asset')
    .alias('load')
    .description('Load Asset')
    .action(() => {
        if (process.argv.length > 3) {
            loadAsset(process.argv[3]);
        } else {
            console.log('Usage: node cli-importer.js create <asset filename>');
        }        
    });

program
    .command('load_raw')
    .alias('raw')
    .description('Load Raw Asset')
    .action(() => {
      if (process.argv.length > 4) {
            loadRaw(process.argv[3], process.argv[4]);
        } else {
            console.log('Usage: node cli-importer.js raw <asset template> <raw data file>');
        }
    });

loadAsset = async (fileName) => {
    global.ambrosus = new AmbrosusSDK({
        apiEndpoint: 'https://test-nop.ambrosus-test.io',
        secret: '0x2cf5e631b91b3f8c57c6a0205a22c06a4c073c24528bd0d6fc5b4da49612d26b'
    });
    
    if (readExtension(fileName)) {
        data = await ambrosus.utils.readFile(process.cwd() + '/' + fileName);

        assetInfo = JSON.parse(data);

        var resAsset = await ambrosus.assets.createAsset(assetInfo);

        console.log(`createAsset.assetId: ${resAsset.data.data.assetId}`);

        await createEvents(assetInfo, resAsset.data.data.assetId);

        await verifyEvents(resAsset.data.data.assetId);
    }
};

loadRaw = async (assetFile, rawFile) => {
    global.ambrosus = new AmbrosusSDK({
        apiEndpoint: 'http://127.0.0.1:3000',
        secret: '0x2cf5e631b91b3f8c57c6a0205a22c06a4c073c24528bd0d6fc5b4da49612d26b'
    });
    
    if (readExtension(assetFile)) {
        assetJSON = await ambrosus.utils.readFile(process.cwd() + '/' + assetFile);

        assetInfo = JSON.parse(assetJSON);

        rawData = await ambrosus.utils.readFile(process.cwd() + '/' + rawFile);

        rawBase64 = new Buffer(rawData).toString('base64');
        
        assetInfo[0].content.data[1].raws = {
            raw01: {
             data: rawBase64
            },
            raw02: {
             data: rawBase64
            },
            raw03: {
             data: rawBase64
            },
            raw04: {
             data: rawBase64
            }
        }
        
        var resAsset = await ambrosus.assets.createAsset(assetInfo);

        console.log(`createAsset.assetId: ${resAsset.data.data.assetId}`);

        await createEvents(assetInfo, resAsset.data.data.assetId);

        await verifyEvents(resAsset.data.data.assetId);
    }
};

createEvents = async (assetInfo, assetId) => {
    for (let i = 0; i < assetInfo.length; i++) {
        resEvent = await ambrosus.events.createEvent(assetId, assetInfo[i]);
    }
};

readExtension = fileName => {
    if (fileName.split('.').pop() === 'json') {
        return true;
    } else {
        console.log('Please upload a json file');
        return false;
    }
};

verifyEvents = (assetId) => {
    ambrosus.service.verifyEvents(assetId).then(verified => {
        console.log(verified);
    });
};

program.parse(process.argv);
