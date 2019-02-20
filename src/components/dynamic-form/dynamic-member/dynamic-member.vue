<template>
  <div class="dynamic-member-container">
    <el-popover :disabled="disabled" v-model="popoverVisible" ref="popover" placement="bottom-end" :visible-arrow="false"
                popper-class="member-select-user-popover" width="300"
                trigger="click">
      <template slot="reference">
        <div class="nothing-container" v-if="!value||value.length===0">
          <span>请选择</span>
        </div>
        <div class="member-something" v-else>
          <div class="member-tag-container" @click.stop="preventEvent">
            <div class="member-tag" v-for="(user,m) in value" :key="'member-tag_'+m">
              <div class="user_avatar"></div>
              <span class="user-name">{{user.email}}</span>
              <i class="fa fa-close" @click.stop="deleteUser($event,user)"></i>
            </div>
          </div>
          <div class="member-selector">
            <span>点击更改</span>
          </div>
        </div>
      </template>
      <div class="select-user-container">
        <div class="search-row">
          <el-input @input="onSearchContentChange" v-model="searchContent" placeholder="输入用户名/邮箱进行搜索"
                    size="medium"></el-input>
        </div>

        <div class="user-list-container">
          <div class="group-wrapper">
            <el-checkbox-group v-model="checkedKeys">
              <el-checkbox v-for="user in showUsers" v-if="user.email" :label="user.id" :key="user.id"
                           class="user-checkbox">
                <div class="checkbox-user-wrapper">
                  <div class="member-item"></div>
                  <div class="user-name">{{user.email}}</div>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
  import services from '../../../service/back.service'
  import { userInfo } from '@cube-vue-pc/prod-http';
  export default{
    name: 'DynamicMember',
    props: {
      value: {
        type: Array,
        default: () => []
      },
      users: {
        type: Array,
        default: () => []
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      checkedKeys: {
        get(){
          const array = [];
          if (this.value) {
            for (let item of this.value) {
              array.push(item.id);
            }
          }
          return array;
        },
        set(data){
          const array = this.users.filter((user) => data.indexOf(user.id) !== -1);
          this.$emit('input', array);
        }
      },
      showUsers: {
        get(){
          let array = this.users;
          if (this.searchContent) {
            array = array.filter((user) => user.email.indexOf(this.searchContent) !== -1);
          }
          return array;
        }
      }
    },
    data(){
      return {
        popoverVisible: false,
        searchContent: ''
      }
    },
    /*created() {
      console.log(this.users);
      if (this.users.length === 0) {
        console.log(123)
        // 若成员未选择，则带出所有
        services.getAllGroupsAndUsers().then((res) => {
          if (res.returnCode.startsWith('200')) {
            const array = res.data || [];
            this.dealUsers(array);
          }
        })
      }
    },*/
    methods: {
      preventEvent(){
        this.popoverVisible = false;
      },
      // 递归处理后台返回的树结构，将users中的内容加入children中并且增加树结构需要的相应的key
      dealUsers(array){
        for (let i = 0; i < array.length; i++) {
          const item = array[i];
          if (item.users && item.users.length > 0) {
            if (!item.children) {
              item.children = [];
            }
            for (let j = 0; j < item.users.length; j++) {
              const user = item.users[j];
              user.id = user.acctId;
              user.name = user.fullName;
              item.children.unshift(user);
              // this.allUsers[0].children.push(user);
              // 用户筛选时显示的列表
              this.showUsers.push(user)
            }
          }
          if (item.children && item.children.length > 0) {
            // 删除叶子节点下没有人的部门
            for (let m = 0; m < item.children.length; m++) {
              const child = item.children[m];
              if ((!child.children || child.children.length === 0) && (!child.users || child.users.length === 0) && !child.email) {
                item.children.splice(m, 1);
              }
            }
            this.dealUsers(item.children);
          }
        }
      },
      // 删除用户
      deleteUser(event, data){
        if(!this.disabled){
          this.popoverVisible = false;
          const keys = this.checkedKeys.filter((value) => value !== data.id);
          const array = this.users.filter((user) => keys.indexOf(user.id) !== -1);
          this.$emit('input', array);
        }
      },
      // 搜索框的值变化
      onSearchContentChange(){

      }
    }
  }
</script>

<style lang="scss">
  @import './dynamic-member.scss';
</style>
