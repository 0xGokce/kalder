#!/bin/sh

. .env;
cd hasura || exit;

npx hasura metadata apply  --endpoint "$HASURA_URL" --admin-secret "$HASURA_ADMIN_SECRET";
npx hasura migrate apply --endpoint "$HASURA_URL" --admin-secret "$HASURA_ADMIN_SECRET";

cd ../