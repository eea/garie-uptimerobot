# Garie uptimerobot plugin

<p align="center">
  <p align="center">Tool to gather Uptimerobot statistics, and supports CRON jobs.<p>
</p>

**Highlights**

-   Poll for [uptimerobot](https://uptimerobot.com/) statistics and stores the data into InfluxDB
-   View all historic reports.
-   Setup within minutes

## Overview of garie-uptimerobot

Garie-uptimerobot was developed as a plugin for the [Garie](https://github.com/boyney123/garie) Architecture.

[Garie](https://github.com/boyney123/garie) is an out the box web performance toolkit, and `garie-securityheaders` is a plugin that generates and stores securityheaders data into `InfluxDB`.

`Garie-uptimerobot` can also be run outside the `Garie` environment and run as standalone.

If your interested in an out the box solution that supports multiple performance tools like `securityheaders`, `google-speed-insight` and `lighthouse` then checkout [Garie](https://github.com/boyney123/garie).

If you want to run `garie-uptimerobot` standalone you can find out how below.

## Getting Started

### Prerequisites

-   Docker installed

### Running garie-uptimerobot

You can get setup with the basics in a few minutes.

First clone the repo.

```sh
git clone https://github.com/eea/garie-uptimerobot.git
```

Next setup you're config. Edit the `config.json` and add websites to the list.

```javascript
{
  "plugins":{
        "uptimerobot":{
            "cron": "*/2 * * * *"
        }
    },
  "urls": [
    {
      "url": "https://www.eea.europa.eu/"
    },
    {
      "url": "https://www.eionet.europa.eu/"
    }
  ]
}
```

Once you finished edited your config, lets setup our environment.

```sh
docker-compose up
```

This will build your copy of `garie-uptimerobot` and run the application.

On start garie-uptimerobot will start to gather statistics for the websites added to the `config.json`.

## config.json

| Property | Type                | Description                                                                          |
| -------- | ------------------- | ------------------------------------------------------------------------------------ |
| `plugins.uptimerobot.cron`   | `string` (optional) | Cron timer. Supports syntax can be found [here].(https://www.npmjs.com/package/cron) |
| `plugins.uptimerobot.retry`   | `object` (optional) | Configuration how to retry the failed tasks |
| `plugins.uptimerobot.retry.after`   | `number` (optional, default 30) | Minutes before we retry to execute the tasks |
| `plugins.uptimerobot.retry.times`   | `number` (optional, default 3) | How many time to retry to execute the failed tasks |
| `plugins.uptimerobot.retry.timeRange`   | `number` (optional, default 360) | Period in minutes to be checked in influx, to know if a task failed |
| `plugins.uptimerobot.max_age_of_report_files`   | `number` (optional, default 365) | Maximum age (in days) for all the files. Any older file will be deleted. |
| `plugins.uptimerobot.delete_files_by_type`   | `object` (optional, no default) | Configuration for deletion of custom files. (e.g. mp4 files)  |
| `plugins.uptimerobot.delete_files_by_type.type`   | `string` (required for 'delete_files_by_type') | The type / extension of the files we want to delete. (e.g. "mp4"). |
| `plugins.uptimerobot.delete_files_by_type.age`   | `number` (required for 'delete_files_by_type') | Maximum age (in days) of the custom files. Any older file will be deleted. |
| `urls`   | `object` (required) | Config for lighthouse. More detail below |

**urls object**

| Property | Type                | Description                         |
| -------- | ------------------- | ----------------------------------- |
| `url`    | `string` (required) | Url to get uptimerobot metrics for.   |

## Variables
Can have multiple accounts/keys. Will extract the uptime for the last number of days ( configured in environment ).

- UPTIME_ROBOT_KEYS - List of keys, separated by space 
- UPTIME_API_URL - Uptimerobot api url
- UPTIME_INTERVAL_DAYS - Interval to check the monitors on

## Usage

Use example.env as a template for .env file with the correct values.

cp example.env .env

For more information please go to the [garie-plugin](https://github.com/eea/garie-plugin) repo.


