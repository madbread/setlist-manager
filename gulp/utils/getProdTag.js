module.exports = function() {
  // Determine prod build by checking for '--prod' arg value
  var tag = '';
  var prodIdx = process.argv.indexOf('--prod');

  // The next arg after '--prod' is the github tag version
  if (prodIdx > -1) {
    tag = process.argv.length > (prodIdx+1) ? process.argv[prodIdx+1] : '';
  }

  return tag;
};
