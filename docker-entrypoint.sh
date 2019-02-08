#!/bin/sh
set -e


if [ -z "$UPTIME_ROBOT_KEYS" ]; then
        echo "Please provide the uptimerobot keys in the UPTIME_ROBOT_KEYS variable"
        exit 1
fi


if [ -z "$UPTIME_API_URL" ]; then
        echo "UPTIME_API_URL not found, setting it to default: https://api.uptimerobot.com/v2/getMonitors"
	export UPTIME_API_URL=https://api.uptimerobot.com/v2/getMonitors
fi



if [ -z "$UPTIME_INTERVAL_DAYS" ]; then
        echo "UPTIME_INTERVAL_DAYS not found, setting it to default: 30"
        export UPTIME_INTERVAL_DAYS=30
fi


if [ -n "$CONFIG" ]; then
	echo "Found configuration variable, will write it to the /usr/src/garie-plugin/config.json"
	echo "$CONFIG" > /usr/src/garie-plugin/config.json
fi

exec "$@"
