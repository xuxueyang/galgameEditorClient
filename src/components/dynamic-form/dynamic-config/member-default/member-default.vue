<template>
  <div class="member-default-container">
    <div class="hint">默认内容</div>
    <select-user
      :is-tree="false"
      :users="users"
      :checkedUsers="config.defaultUsers"
      :currentUserChecked="config.defaultCurrentUser"
      @onCurrentUserChange="onCurrentUserChange"
      @onCheckedUsersChange="onCheckedUsersChange"
      @deleteCurrentUser="deleteCurrentUser"
      @deleteUser="deleteUser"
      :showCurrentUser="true">
    </select-user>
  </div>
</template>

<script>
  import services from '../../../../service/back.service'
  import SelectUser from '../../../select-user/select-user.vue'
  export default{
    name: 'MemberDefault',
    components: {
      SelectUser
    },
    props: {
      config: {
        type: Object,
        default: () => {
        }
      }
    },
    computed: {
      users(){
        return this.config.optionalUsers
      }
    },
    data(){
      return {
        loaded: false,
        defaultProps: {
          label: 'name'
        },
        trees: [],
        allUsers: [
          {name: '全部成员', id: 'all', children: []}
        ],
        // 默认选中的成员数组
        defaultCheckedKeys: []
      }
    },
    methods: {
      // 属性变更
      onPropertyChange(key, value){
        this.$store.dispatch('setFormItemValue', {
          index: this.config.index,
          rowIndex: this.config.rowIndex,
          colIndex: this.config.colIndex,
          key: key,
          value: value
        });
      },
      onCheckedUsersChange(data){
        this.onPropertyChange('defaultUsers', data);
      },
      onCurrentUserChange(data){
        this.onPropertyChange('defaultCurrentUser', data);
      },
      // 删除当前用户
      deleteCurrentUser(){
        this.onPropertyChange('defaultCurrentUser', false);
      },
      // 删除用户
      deleteUser(id){
        this.$store.dispatch('deleteDefaultUsersById', {
          id: id,
          index: this.config.index,
          rowIndex: this.config.rowIndex,
          colIndex: this.config.colIndex
        });
      }
    }
  }
</script>

<style lang="scss">
  @import 'member-default.scss';
</style>
