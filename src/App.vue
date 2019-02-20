<template>
  <router-view/>
</template>

<script>
  import axios from 'axios'
  import services from './service/back.service'
  import {casLogin} from './util/util'

  export default {
    name: 'App',
    methods: {
      getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
      }
    },
    beforeCreate(){
      const url = location.href;
      const urlArray = url.split('?');
      if (urlArray && urlArray.length > 1) {
        let params = urlArray[urlArray.length - 1];
        params = params.replace(/access_token=/g, '');
        localStorage.setItem(`cube-${process.env.tenantCode}-access-token`, params);
      }
      const token = localStorage.getItem(`cube-${process.env.tenantCode}-access-token`);
      if (!token) {
        // cas认证
        casLogin();
      } else {
        const userInfo = localStorage.getItem(`cube-${process.env.tenantCode}-user-info`);
        if (!userInfo) {
          services.getUserInfo().then((res) => {
            if (res.status === 1) {
              if (res.returnCode.startsWith('200')) {
                localStorage.setItem(`cube-${process.env.tenantCode}-user-info`,JSON.stringify(res.data.userInfo))
                localStorage.setItem(`cube-${process.env.tenantCode}-group-info`,JSON.stringify(res.data.groupDetails))
              }
            }
          })
        }
      }
    }
  }
</script>

<style>
  html, body {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-size: 13px;
    color: #2b3441;
    word-break: break-all;
    font-weight: 400;
    height: 100%;
  }

  .CodeMirror-hints {
    z-index: 3000;
    position: absolute;
  }
</style>
