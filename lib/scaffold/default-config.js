'use strict';

var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');

/**
 * Will return the path and default ravencore-node configuration. It will search for the
 * configuration file in the "~/.ravencore" directory, and if it doesn't exist, it will create one
 * based on default settings.
 * @param {Object} [options]
 * @param {Array} [options.additionalServices] - An optional array of services.
 */
function getDefaultConfig(options) {
  /* jshint maxstatements: 40 */
  if (!options) {
    options = {};
  }

  var defaultPath = path.resolve(process.env.HOME, './.ravencore');
  var defaultConfigFile = path.resolve(defaultPath, './ravencore-node.json');

  if (!fs.existsSync(defaultPath)) {
    mkdirp.sync(defaultPath);
  }

  var defaultServices = ['ravend', 'web'];
  if (options.additionalServices) {
    defaultServices = defaultServices.concat(options.additionalServices);
  }

  if (!fs.existsSync(defaultConfigFile)) {
    var defaultConfig = {
      network: 'testnet',
      port: 3001,
      services: defaultServices,
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
		  db: {
			host: '127.0.0.1',
			port: '27017',
			database: 'raven-api-testnet',
			user: 'ravencore',
			password: 'password123'
		  }
		},
		ravend: {
		  sendTxLog: path.resolve(defaultPath, './pushtx.log'),
          spawn: {
            datadir: path.resolve(defaultPath, './data'),
            exec: path.resolve(__dirname, '../../bin/ravend'),
			rpcqueue: 1000,
			rpcport: 18766,
			zmqpubrawtx: 'tcp://127.0.0.1:28332',
			zmqpubhashblock: 'tcp://127.0.0.1:28332'
          }
        }
      }
    };
    fs.writeFileSync(defaultConfigFile, JSON.stringify(defaultConfig, null, 2));
  }

  var defaultDataDir = path.resolve(defaultPath, './data');

  if (!fs.existsSync(defaultDataDir)) {
    mkdirp.sync(defaultDataDir);
  }

  var config = JSON.parse(fs.readFileSync(defaultConfigFile, 'utf-8'));

  return {
    path: defaultPath,
    config: config
  };

}

module.exports = getDefaultConfig;
