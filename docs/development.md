# Setting up Development Environment

## Install Node.js

Install Node.js by your favorite method, or use Node Version Manager by following directions at https://github.com/creationix/nvm

```bash
nvm install v4
```

## Fork and Download Repositories

To develop ravencore-node:

```bash
cd ~
git clone git@github.com:<yourusername>/ravencore-node.git
git clone git@github.com:<yourusername>/ravencore-lib.git
```

To develop ravencoin or to compile from source:

```bash
git clone git@github.com:<yourusername>/ravencoin.git
git fetch origin <branchname>:<branchname>
git checkout <branchname>
```
**Note**: See ravencoin documentation for building ravencoin on your platform.


## Install Development Dependencies

For Ubuntu:
```bash
sudo apt-get install libzmq3-dev
sudo apt-get install build-essential
```
**Note**: Make sure that libzmq-dev is not installed, it should be removed when installing libzmq3-dev.


For Mac OS X:
```bash
brew install zeromq
```

## Install and Symlink

```bash
cd ravencore-lib
npm install
cd ../ravencore-node
npm install
```
**Note**: If you get a message about not being able to download ravencoin distribution, you'll need to compile ravend from source, and setup your configuration to use that version.


We now will setup symlinks in `ravencore-node` *(repeat this for any other modules you're planning on developing)*:
```bash
cd node_modules
rm -rf ravencore-lib
ln -s ~/ravencore-lib
rm -rf ravend-rpc
ln -s ~/ravend-rpc
```

And if you're compiling or developing ravencoin:
```bash
cd ../bin
ln -sf ~/ravencoin/src/ravend
```

## Run Tests

If you do not already have mocha installed:
```bash
npm install mocha -g
```

To run all test suites:
```bash
cd ravencore-node
npm run regtest
npm run test
```

To run a specific unit test in watch mode:
```bash
mocha -w -R spec test/services/ravend.unit.js
```

To run a specific regtest:
```bash
mocha -R spec regtest/ravend.js
```

## Running a Development Node

To test running the node, you can setup a configuration that will specify development versions of all of the services:

```bash
cd ~
mkdir devnode
cd devnode
mkdir node_modules
touch ravencore-node.json
touch package.json
```

Edit `ravencore-node.json` with something similar to:
```json
{
  "network": "livenet",
  "port": 3001,
  "services": [
    "ravend",
    "web",
    "insight-api",
    "insight-ui",
    "<additional_service>"
  ],
  "servicesConfig": {
    "ravend": {
      "spawn": {
        "datadir": "/home/<youruser>/.ravend",
        "exec": "/home/<youruser>/ravencoin/src/ravend"
      }
    }
  }
}
```

**Note**: To install services [insight-api](https://github.com/underdarkskies/insight-api) and [insight-ui](https://github.com/underdarkskies/insight-ui) you'll need to clone the repositories locally.

Setup symlinks for all of the services and dependencies:

```bash
cd node_modules
ln -s ~/ravencore-lib
ln -s ~/ravencore-node
ln -s ~/insight-api
ln -s ~/insight-ui
```

Make sure that the `<datadir>/raven.conf` has the necessary settings, for example:
```
server=1
whitelist=127.0.0.1
txindex=1
addressindex=1
timestampindex=1
spentindex=1
zmqpubrawtx=tcp://127.0.0.1:28332
zmqpubhashblock=tcp://127.0.0.1:28332
rpcallowip=127.0.0.1
rpcuser=ravencoin
rpcpassword=local321
```

From within the `devnode` directory with the configuration file, start the node:
```bash
../ravencore-node/bin/ravencore-node start
```
