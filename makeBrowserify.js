const fs = require('fs');
const browserify = require('browserify');
const babelify = require('babelify');

// Create a write stream for the pipe to output to
const bundleFs = fs.createWriteStream(__dirname + '/lib/ambrosusSDK.umd.min.js');

const bundler = browserify(['./lib/ambrosus.umd.min.js'], {standalone: 'AmbrosusSDK'});
bundler.transform(babelify.configure({presets: ["@babel/preset-env"]}));
bundler.transform('uglifyify', { global: true  });
bundler.bundle().pipe(bundleFs);

//now listen out for the finish event to know when things have finished
bundleFs.on('finish', function () {
  console.log('finished writing the browserify file');
});
