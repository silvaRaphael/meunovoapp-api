#!/bin/sh

# Certbot entrypoint
certbot certonly --nginx -d meunovoapp.vps-kinghost.net

# Iniciar o contêiner Nginx
nginx -g "daemon off;"
