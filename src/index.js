const garie_plugin = require('garie-plugin');
const path = require('path');
const fs = require('fs-extra');
const dateFormat = require('dateformat');
const config = require('../config');
const request = require('request-promise');

function getResults(file) {

  var regex = RegExp("That's it. ([0-9]+) link[s]? in ([0-9]+) URL[s]? checked. ([0-9]+) warning[s]? found. ([0-9]+) error[s]? found.", 'g');

  var values = regex.exec(file);

  var links = parseInt(values[1]);
  var errors = parseInt(values[4]);
  var result = {};

  result['uptimerobot'] = 100 - (100 * errors / links);
  return result;
}

const getFile = async (options) => {
  options.fileName = 'uptimerobot.txt';
  const file = await garie_plugin.utils.helpers.getNewestFile(options);
  return getResults(file);
}


const getMonitors = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      var date = new Date();
      date.setHours(0, 0, 0, 0);
      var end_interval = date.getTime() / 1000 | 0;
      var start_interval = end_interval - 86400 * parseInt(process.env.UPTIME_INTERVAL_DAYS || 30);


      const keys = process.env.UPTIME_ROBOT_KEYS;
      const uptime_monitor_url = process.env.UPTIME_API_URL;

      date = new Date();
      const resultsLocation = path.join(__dirname, '../reports/', dateFormat(date, "isoUtcDateTime"), '/monitors.json');


      var monitors = {};

      var tmp_keys = keys.split(' ');
      for (var i = 0; i < tmp_keys.length; i++) {
        var key = tmp_keys[i];
        data = await request({
          method: 'POST',
          uri: uptime_monitor_url,
          body: {
            'api_key': `${key}`,
            'format': 'json',
            'custom_uptime_ranges': `${start_interval}_${end_interval}`
          },
          json: true,
          resolveWithFullResponse: true,
          headers: {
            'Cache-Control': 'no-cache'
          }
        });

        monitors = data['body']['monitors'].concat(monitors);
      }
      fs.outputJson(resultsLocation, monitors)
        .then(() => console.log(`Saved uptimerobot monitors json to ${resultsLocation}`))
        .catch(err => {
          console.log(err)
        })



      resolve(monitors);
    } catch (err) {
      console.log(err);
      reject("reject");
    }

  });
}



const getData = async (options) => {
  const {
    url
  } = options.url_settings;

  var result = {}

  return new Promise(async (resolve, reject) => {

    for (var i = 0; i < global.monitors.length; i++) {

      var monitor = global.monitors[i];
      if (monitor['url'] == url) {

        result['uptime'] = parseFloat(monitor['custom_uptime_ranges']);
        console.log(`Got result ${result['uptime']} for ${url}`);
      }

    }

    resolve(result);

  });
};


console.log("Start");



const main = async () => {

  global.monitors = await getMonitors();
  garie_plugin.init({
    database: "uptimerobot",
    getData: getData,
    app_name: 'uptimerobot',
    app_root: path.join(__dirname, '..'),
    config: config
  });

}

main();