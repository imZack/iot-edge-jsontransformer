const Handlebars = require('handlebars');

Handlebars.registerHelper('scale', (value, n1, n2, m1, m2) => {
  return parseFloat(n2)
    +(parseFloat(value) - parseFloat(n1))
    *
        (
          (parseFloat(m2) - parseFloat(n2))
         /((parseFloat(m1) - parseFloat(n1)))
        );
});

Handlebars.registerHelper('json', (content) => {
  console.log('content', content);
  return new Handlebars.SafeString(JSON.stringify(content));
});

const compiled = Handlebars.compile(`{
  "iodb": {
    "deviceUpTime": {{scale 50 0 50 100 100}}
  },
  "deviceId": "{{ payload.deviceId }}"
}
`);
console.log(compiled({ payload: {
  "ioLogikE1242": {
    "deviceUpTime": 460721
  },
  "deviceId": "TAICB1046750",
  "time": "2019-10-17T06:21:51Z"
} }, { noEscape: true }));
