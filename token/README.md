# This is a project created from `ls-ng-template-nodejs-koa-bullmq-cron` bootstrap project.

### Important files

- `docker-compose.yml` - basic Node development setup. Contains mongo and redis for development. Along with mongo
  express.
- `Makefile` - common shortcut commands to simplify development. Use with `make`.
- `Dockerfile` - PRODUCTION specific Docker build image.

### Default entry-point

The default entry point for `localstaffingllc/nodejs:*` images is `node /app/index.js` defined in `/etc/service/app`.
`localstaffingllc/nodejs:*` images use `runit` managed init system.

IMPORTANT: you DO NOT need to use PM2, systemd or similar programs when using standard node images.

See man-pages for `runit`. You can place additional services, such as multiprocess nodes in `/etc/service/` directory to
have them picked up by `runit`.
