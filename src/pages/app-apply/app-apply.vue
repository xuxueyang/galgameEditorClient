<template>
  <form-apply
    :applicationId="$route.params.appId"
    @Unauthorized="onUnauthorized"
    @submitSuccess="submitSuccess"
    @onKnownClick="onKnownClick">
  </form-apply>
</template>

<script>
  import FormApply from "../../components/form-apply/form-apply"
  import {casLogin} from '../../util/util'
  export default{
    components: {FormApply},
    name: 'AppApply',
    methods: {
      // 提交成功
      submitSuccess(){
        this.$router.replace({name: 'app-list'})
      },
      // 出现错误点击我知道了
      onKnownClick(){
        this.$router.replace({name: 'app-list'})
      },
      // 上传附件401
      onUnauthorized(){
        casLogin()
      }
    }
  }
</script>

<style scoped></style>
