#!/bin/bash -e
REDIS_URL=`podman inspect redis | jq -r '.[0].NetworkSettings.IPAddress'`
podman run --rm --name=phasmo_collab_journal -p 80:80 -e REDIS_URL=$REDIS_URL localhost/celeo/phasmo_collab_journal
