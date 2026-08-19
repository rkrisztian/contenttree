#!/bin/sh
VARS="API_BASE_URL COMPANY_NAME COMPANY_ADDRESS COMPANY_PRIVACY_EMAIL COMPANY_DATA_RETENTION_DAYS"

(
  TEMPLATE=/usr/share/nginx/html_template/config.json.template
  OUTPUT=/usr/share/nginx/html/config.json

  config=$(cat "$TEMPLATE")

  for v in $VARS; do
    eval "val=\${$v}"
    [ -n "$val" ] || { printf 'Error: %s is not set or empty.\n' "$v" >&2; exit 1; }

    json_escaped=$(printf '%s' "$val" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e 's/[|&\\]/\\&/g')
    config=$(printf '%s' "$config" | sed "s|@@${v}@@|${json_escaped}|g")
  done

  printf '%s\n' "$config" > "$OUTPUT"
)

unset $VARS VARS

exec nginx -c /etc/nginx/nginx.conf -g 'daemon off;'
