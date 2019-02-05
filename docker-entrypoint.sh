#!/bin/sh
set -e


if [ -z "$UPTIME_ROBOT_KEYS" ]; then
        echo "Please provide the uptimerobot keys in the UPTIME_ROBOT_KEYS variable"
        exit 1
fi


if [ -z "$UPTIME_ROBOT_KEYS" ]; then
        echo "UPTIME_API_URL not found, setting it to default: https://api.uptimerobot.com/v2/getMonitors"
	UPTIME_API_URL=https://api.uptimerobot.com/v2/getMonitors
fi



if [ -n "$CONFIG" ]; then
	echo "Found configuration variable, will write it to the /usr/src/garie-uptimerobot/config.json"
	echo "$CONFIG" > /usr/src/garie-uptimerobot/config.json
fi

exec "$@"
