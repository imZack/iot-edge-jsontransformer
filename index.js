const Protocol = require('azure-iot-device-mqtt').Mqtt;
const { ModuleClient } = require('azure-iot-device');
const { Message } = require('azure-iot-device');
const debug = require('debug')('iot-edge-jsontransformer');
const Handlebars = require('handlebars');
const fs = require('fs');

const templates = {};

Handlebars.registerHelper('json', (content) => new Handlebars.SafeString(JSON.stringify(content)));
Handlebars.registerHelper('scale',
  (value, n1, n2, m1, m2) => parseFloat(n2)
    + (parseFloat(value) - parseFloat(n1))
    * (
      (parseFloat(m2) - parseFloat(n2))
      / ((parseFloat(m1) - parseFloat(n1)))
    ));

const onInput = (client) => (inputName, msg) => {
  client.complete(msg);

  if (!templates[inputName]) {
    const templateFilename = `./templates/${inputName}.hbs`;
    if (fs.existsSync(templateFilename)) {
      templates[inputName] = Handlebars.compile(fs.readFileSync(templateFilename, 'utf8'));
    } else {
      templates[inputName] = Handlebars.compile(fs.readFileSync('./templates/default.hbs', 'utf8'));
    }
  }

  try {
    const payload = JSON.parse(msg.getData());
    debug(`Before: ${payload}`);
    const transformedPayload = templates[inputName]({ payload }, { noEscape: true });
    debug(`After: ${transformedPayload}`);
    client.sendOutputEvent(inputName, new Message(transformedPayload));
  } catch (e) {
    debug(`${e.message}`);
  }
};

ModuleClient.fromEnvironment(Protocol, (err, client) => {
  if (err) {
    debug(`Can't create module: ${err.toString()}`);
    process.exit(-1);
  }

  debug('IoT Edge module has been created');

  client.open((openErr) => {
    if (openErr) {
      debug(`Could not connect: ${openErr.message}`);
      process.exit(-1);
    }

    debug('IoT Edge module connected');

    client.on('inputMessage', onInput(client));
  });

  client.on('error', (onErrMsg) => {
    debug(onErrMsg.message);
  });
});
