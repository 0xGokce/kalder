#!/bin/sh

. .env
cd hasura || exit;
npx hasura migrate apply --endpoint "$STAGING_HASURA_URL" --admin-secret secret;
npx hasura metadata apply  --endpoint "$STAGING_HASURA_URL" --admin-secret secret
cd ../