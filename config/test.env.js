'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"production"',
  ENV_CONFIG:'"test"',
  httpBaseUri: '"http://oa-op-test.fengyuntec.com/"',
  serverUrl: '"http://wow-dev.cnsaas.com:9205"',
  casUrl: '"http://oa-op-test.fengyuntec.com/cubeuaa/cas/urlnotice"',
  instanceCode: '"2e1c0c0d8ead4f549314e6b911e3e3c1"',
  tenantCode: '"073f0f5744c742f59f551a79c822fcdd"',
  spaceUri: '"WORKFLOW"'
})
