#!/bin/sh
set -euo pipefail

if [ -z "${API_BASE_URL:-}" ]; then
    echo "Error: API_BASE_URL environment variable is not set." >&2
    exit 1
fi

API_BASE_URL_ESCAPED=$(printf '%s' "$API_BASE_URL" | sed -e 's/[|&\\]/\\&/g')
sed "s|@@API_BASE_URL@@|${API_BASE_URL_ESCAPED}|g" \
    /usr/share/nginx/html_template/config.json.template >/usr/share/nginx/html/config.json
unset API_BASE_URL_ESCAPED

exec nginx -c /etc/nginx/nginx.conf -g 'daemon off;'
