FROM dhi.io/nginx:1.31.1-alpine3.23@sha256:902e3e97f6e505b45cb31e77a83c4ee00247ba343081c2b837de23e8a654124a

COPY --chown=root:root --chmod=a=r docker/nginx.conf /etc/nginx/
COPY --chown=root:root --chmod=a=rx docker/entrypoint.sh /

COPY --chown=root:root --chmod=a=rX dist/contenttree/browser /usr/share/nginx/html
COPY --chown=root:root --chmod=a=r dist/contenttree/3rdpartylicenses.txt /usr/share/nginx/html/
COPY --chown=root:root --chmod=a=r docker/config.json.template /usr/share/nginx/html_template/
# Allow write permission for the entrypoint script to evaluate the template
COPY --chown=nginx:nginx --chmod=ug=wr,o=r docker/config.json.template /usr/share/nginx/html/config.json

USER nginx

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
