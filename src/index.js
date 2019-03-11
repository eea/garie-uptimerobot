const garie_plugin = require('garie-plugin');
const path = require('path');
const fs = require('fs-extra');
const dateFormat = require('dateformat');
const config = require('../config');
const request = require('request-promise');
const express = require('express');
const serveIndex = require('serve-index');

const getMonitors = async (reportDir, check) => {
  return new Promise(async (resolve, reject) => {
    try {
      var date = new Date();
      date.setHours(0, 0, 0, 0);
      var end_interval = date.getTime() / 1000 | 0;
      var start_interval = end_interval - 86400 * parseInt(check || 30);


      const keys = process.env.UPTIME_ROBOT_KEYS;
      const uptime_monitor_url = process.env.UPTIME_API_URL;


      const resultsLocation = path.join(reportDir, `/monitors_${check}.json`);

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
      fs.outputJson(resultsLocation, monitors, {spaces: 2})
        .then(() => console.log(`Saved uptimerobot monitors json for ${check} days  to ${resultsLocation}`))
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
    for (var i = 0; i < global.monitors_1day.length; i++) {

      var monitor = global.monitors_1day[i];
      if (monitor['url'] == url) {

        result['uptime'] = parseFloat(monitor['custom_uptime_ranges']);
        console.log(`Got result ${result['uptime']} for ${url} for yesterday`);
      }

    }


    for (var i = 0; i < global.monitors_longer.length; i++) {

      var monitor = global.monitors_longer[i];
      if (monitor['url'] == url) {

        result['uptime_score'] = parseFloat(monitor['custom_uptime_ranges']);
        console.log(`Got result ${result['uptime_score']} for ${url} for ${process.env.UPTIME_INTERVAL_DAYS} days`);
      }

    }

    resolve(result);

  });
};


console.log("Start");

const getMonitorsPrep = async (reportDir, check) => {
  return new Promise(async (resolve, reject) => {
    try {
      date = new Date();
      var reportDir = garie_plugin.utils.helpers.reportDir({report_folder_name:'uptimerobot-results', url:".", app_root:path.join(__dirname, '..')});
      reportDir = path.join(reportDir, dateFormat(date, "isoUtcDateTime"));
      global.monitors_1day = await getMonitors(reportDir, 1);
      global.monitors_longer = await getMonitors(reportDir, parseInt(process.env.UPTIME_INTERVAL_DAYS));
      resolve("processed");
    } catch (err) {
      console.log(err);
      reject("reject");
    }

  });

}


const app = express();
app.use('/reports', express.static('reports'), serveIndex('reports', { icons: true }));

const main = async () => {
  return new Promise(async (resolve, reject) => {
    try{
      await garie_plugin.init({
        db_name: "uptimerobot",
        getData: getData,
        prepDataForAllUrls: getMonitorsPrep,
        report_folder_name: 'uptimerobot-results',
        plugin_name: "uptimerobot",
        app_root: path.join(__dirname, '..'),
        config: config
      });
    }
    catch(err){
      reject(err);
    }
  });
}

if (process.env.ENV !== 'test') {
  const server = app.listen(3000, async () => {
    console.log('Application listening on port 3000');
    try{
      await main();
    }
    catch(err){
      console.log(err);
      server.close();
    }
  });
}
