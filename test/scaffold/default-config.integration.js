'use strict';

var path = require('path');
var should = require('chai').should();
var sinon = require('sinon');
var proxyquire = require('proxyquire');

describe('#defaultConfig', function() {
  var expectedExecPath = path.resolve(__dirname, '../../bin/ravend');

  it('will return expected configuration', function() {
    var config = JSON.stringify({
      network: 'livenet',
      port: 3001,
      services: [
        'ravend',
        'web'
      ],
	  messageLog: '',
	  servicesConfig: {
        web: {
          disablePolling: true,
	      enableSocketRPC: false
		},
		'insight-ui': {
		  routePrefix: '',
          apiPrefix: 'api'
		},
		'insight-api': {
		  routePrefix: 'api',
		  coinTicker: 'https://api.coinmarketcap.com/v1/ticker/ravencoin/?convert=USD',
		  coinShort: 'RVN',
		},
		ravend: {
		  sendTxLog: process.env.HOME + '/.ravencore/pushtx.log',
          spawn: {
            datadir: process.env.HOME + '/.ravencore/data',
            exec: expectedExecPath,
		    rpcqueue: 1000,
		    rpcport: 8766,
		    zmqpubrawtx: 'tcp://127.0.0.1:28332',
		    zmqpubhashblock: 'tcp://127.0.0.1:28332'
          }
        }
      }
    }, null, 2);
    var defaultConfig = proxyquire('../../lib/scaffold/default-config', {
      fs: {
        existsSync: sinon.stub().returns(false),
        writeFileSync: function(path, data) {
          path.should.equal(process.env.HOME + '/.ravencore/ravencore-node.json');
          data.should.equal(config);
        },
        readFileSync: function() {
          return config;
        }
      },
      mkdirp: {
        sync: sinon.stub()
      }
    });
    var home = process.env.HOME;
    var info = defaultConfig();
    info.path.should.equal(home + '/.ravencore');
    info.config.network.should.equal('livenet');
    info.config.port.should.equal(3001);
    info.config.services.should.deep.equal(['ravend', 'web']);
    var ravend = info.config.servicesConfig.ravend;
    should.exist(ravend);
    ravend.spawn.datadir.should.equal(home + '/.ravencore/data');
    ravend.spawn.exec.should.equal(expectedExecPath);
  });
  it('will include additional services', function() {
    var config = JSON.stringify({
      network: 'livenet',
      port: 3001,
      services: [
        'ravend',
        'web',
        'insight-api',
        'insight-ui'
      ],
	  messageLog: '',	  
	  servicesConfig: {
        web: {
          disablePolling: true,
	      enableSocketRPC: false
		},
		'insight-ui': {
		  routePrefix: '',
          apiPrefix: 'api'
		},
		'insight-api': {
		  routePrefix: 'api',
		  coinTicker: 'https://api.coinmarketcap.com/v1/ticker/ravencoin/?convert=USD',
		  coinShort: 'RVN',
		},
		ravend: {
		  sendTxLog: process.env.HOME + '/.ravencore/pushtx.log',
          spawn: {
            datadir: process.env.HOME + '/.ravencore/data',
            exec: expectedExecPath,
		    rpcqueue: 1000,
		    rpcport: 8766,
		    zmqpubrawtx: 'tcp://127.0.0.1:28332',
		    zmqpubhashblock: 'tcp://127.0.0.1:28332'
          }
        }
      }
    }, null, 2);
    var defaultConfig = proxyquire('../../lib/scaffold/default-config', {
      fs: {
        existsSync: sinon.stub().returns(false),
        writeFileSync: function(path, data) {
          path.should.equal(process.env.HOME + '/.ravencore/ravencore-node.json');
          data.should.equal(config);
        },
        readFileSync: function() {
          return config;
        }
      },
      mkdirp: {
        sync: sinon.stub()
      }
    });
    var home = process.env.HOME;
    var info = defaultConfig({
      additionalServices: ['insight-api', 'insight-ui']
    });
    info.path.should.equal(home + '/.ravencore');
    info.config.network.should.equal('livenet');
    info.config.port.should.equal(3001);
    info.config.services.should.deep.equal([
      'ravend',
      'web',
      'insight-api',
      'insight-ui'
    ]);
    var ravend = info.config.servicesConfig.ravend;
    should.exist(ravend);
    ravend.spawn.datadir.should.equal(home + '/.ravencore/data');
    ravend.spawn.exec.should.equal(expectedExecPath);
  });
});
