'use strict';

var should = require('chai').should();

describe('Index Exports', function() {
  it('will export ravencore-lib', function() {
    var ravencore = require('../');
    should.exist(ravencore.lib);
    should.exist(ravencore.lib.Transaction);
    should.exist(ravencore.lib.Block);
  });
});
