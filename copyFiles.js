const copy = require('copy-files');
copy({
  files: {
    'ambrosusSDK.umd.min.js': __dirname + '/lib/ambrosusSDK.umd.min.js'
  },
  dest: __dirname + '/examples/react-example',
}, function (err) {
  if (err) {
    console.log('Copy Failed', err);
  } else {
    console.log('Files has been copied', err);
  }

});
