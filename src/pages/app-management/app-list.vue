<template>
  <div>
    <application
      @onEditeApplication="onEditeApplication"
      @onCreateApplicationSuccess="onCreateApplicationSuccess"
      @onApply="onApply"
      @onToDo="onToDo">
    </application>
    <div class="myf-flex myf-flex-align-center myf-flex-justify-center">
      <div class="myf-flex-item"></div>
    </div>
  </div>

</template>

<script>
  import Application from '../../components/application/application'

  export default {
    name: 'AppList',
    components: {
      Application
    },
    methods: {
      // 编辑应用
      onEditeApplication(data) {
        this.$router.push({name: 'app-form-design', params: {appId: data.id}})
      },
      // 新建应用成功
      onCreateApplicationSuccess(data) {
        this.$router.push({name: 'app-form-design', params: {appId: data.id}})
      },
      // 申请
      onApply(data) {
        this.$router.push({name: 'app-apply', params: {appId: data.id}})
      },
      onToDo(data) {
        this.$router.push({name: 'app-affair', params: {appId: data.id, status: "1"}})
      },
      setApplication(data){
        this.$store.dispatch('setAppId', data.id);
//        this.$store.dispatch('setAppName', data.name);
//        this.$store.dispatch('setAppStatus', data.status);
      }
    }
  }
</script>

<style scoped lang="scss">
  .myf-flex {
    display: flex;
  }

  .myf-flex-item {
    flex: 1;
  }
  .myf-flex-align-center{
    align-items: center;
    flex-direction: column;
  }
  .myf-flex-justify-center{
    justify-content: center;
  }
</style>
