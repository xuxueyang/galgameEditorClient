<template>
  <div class="member-range-container">
    <div class="hint">可选范围</div>
    <select-user
      :checkedUsers="config.optionalUsers"
      :currentUserChecked="config.optionalCurrentUser"
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
    name: 'MemberRange',
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
        this.onPropertyChange('optionalUsers', data);
      },
      onCurrentUserChange(data){
        this.onPropertyChange('optionalCurrentUser', data);
      },
      // 删除当前用户
      deleteCurrentUser(){
        this.onPropertyChange('optionalCurrentUser', false);
        // 如果默认用户中存在当前用户也将它删除
        if(this.$store.state.dynamicForm.formConfigs[this.config.rowIndex][this.config.colIndex].defaultCurrentUser){
          this.onPropertyChange('defaultCurrentUser', false);
        }
      },
      // 删除用户
      deleteUser(id){
        this.$store.dispatch('deleteOptionalUsersById', {
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
  @import './member-range.scss';
</style>
