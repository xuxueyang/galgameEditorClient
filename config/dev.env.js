'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  httpBaseUri: '"http://workflow-gateway.cnsaas.com/"',
  serverUrl: '"http://wow-dev.cnsaas.com:9205"',
  casUrl: '"http://workflow-gateway.cnsaas.com/cubeuaa/cas/urlnotice"',
  instanceCode: '"2e1c0c0d8ead4f549314e6b911e3e3c1"',
  tenantCode: '"073f0f5744c742f59f551a79c822fcdd"',
  spaceUri: '"WORKFLOW"'
})
