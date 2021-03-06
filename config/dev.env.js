'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PORT: 8090,
  API_BASE_URL: '"http://localhost:3000/api/v1"',
  ROUTER_BASE: '"/"',
});
