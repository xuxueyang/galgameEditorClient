<template>
  <div class="member-area">
    <el-tooltip
      content="当前用户"
      v-if="showCurrentUser&&mCurrentUserChecked">
      <div class="member-item current-user">
        <i class="fa fa-user"></i>
        <div class="delete-member" @click="deleteCurrentUser">
          <i class="fa fa-close"></i>
        </div>
      </div>
    </el-tooltip>
    <el-tooltip
      :content="showTooltip(member)"
      v-for="member in mCheckedUsers"
      :key="member.id">
      <div class="member-item" v-if="member.email">
        <div class="delete-member" @click="deleteUser(member.id)">
          <i class="fa fa-close"></i>
        </div>
      </div>
      <div class="member-item applyer" v-if="member.needApplyUser">
        <i class="fa fa-paper-plane"></i>
        <div class="delete-member" @click="deleteDynamic('applyer')">
          <i class="fa fa-close"></i>
        </div>
      </div>
      <div class="member-item leader" v-if="member.createIdForLeader">
        <i class="fa fa-thumb-tack"></i>
        <div class="delete-member" @click="deleteDynamic('leader')">
          <i class="fa fa-close"></i>
        </div>
      </div>
      <div class="member-item superior" v-if="member.groupSuperior">
        <i class="fa fa-rocket"></i>
        <div class="delete-member" @click="deleteDynamic('superior')">
          <i class="fa fa-close"></i>
        </div>
      </div>
      <div class="member-item form-member" v-if="member.memQueId">
        <i class="fa fa-grav"></i>
        <div class="delete-member" @click="deleteDynamic('formMember')">
          <i class="fa fa-close"></i>
        </div>
      </div>
    </el-tooltip>
    <el-popover ref="userPopover" :visible-arrow="false" @show="onPopoverShow" popper-class="select-user-popover"
                width="300"
                trigger="click">
      <div slot="reference" class="member-item add-btn" @click.stop="clickAdd">
        <i class="fa fa-plus"></i>
      </div>

      <div class="select-response-container">
        <div class="tab-container" v-if="showDynamic">
          <div class="tab" :class="{'active':tabIndex===1}" @click="tabIndex=1">通讯录</div>
          <div class="tab" :class="{'active':tabIndex===2}" @click="tabIndex=2">动态负责人</div>
        </div>
        <div class="select-user-container" v-show="tabIndex===1">
          <div class="search-row">
            <el-input v-model="searchContent" placeholder="输入用户名/邮箱进行搜索" size="medium"
                      @input="onSearchChange"></el-input>
          </div>
          <ul class="user-list-container" v-show="isTree&&!inSearch">
            <li class="user-row current-user" v-if="showCurrentUser">
              <el-checkbox class="user-checkbox" v-model="mCurrentUserChecked" @change="onCurrentUserChange">
                <div class="user-info-area">
                  <div class="avatar">
                    <i class="fa fa-user"></i>
                  </div>
                  <div class="user-name">当前用户</div>
                </div>
              </el-checkbox>
            </li>
            <li class="user-row" v-show="loaded">
              <el-tree
                ref="departmentTree"
                @check="onCheckedUsersChange"
                :default-checked-keys="defaultCheckedKeys"
                :data="trees"
                :props="defaultProps"
                show-checkbox
                node-key="id">
              </el-tree>
            </li>
          </ul>

          <ul class="user-list-container" v-show="isTree&&inSearch">
            <div class="group-wrapper">
              <el-checkbox-group v-model="defaultCheckedKeys" @change="onCheckedUsersChange">
                <el-checkbox v-for="user in showUserList" v-if="user.email" :label="user.id" :key="user.id"
                             class="user-checkbox">
                  <div class="checkbox-user-wrapper">
                    <div class="member-item"></div>
                    <div class="user-name">{{user.email}}</div>
                  </div>
                </el-checkbox>
                <div style="clear: both;"></div>
              </el-checkbox-group>
            </div>
          </ul>

          <ul class="user-list-container" v-show="!isTree">
            <li class="user-row current-user">
              <el-checkbox class="user-checkbox" v-model="mCurrentUserChecked" @change="onCurrentUserChange">
                <div class="user-info-area">
                  <div class="avatar">
                    <i class="fa fa-user"></i>
                  </div>
                  <div class="user-name">当前用户</div>
                </div>
              </el-checkbox>
            </li>
            <div class="group-wrapper">
              <el-checkbox-group v-model="defaultCheckedKeys" @change="onCheckedUsersChange">
                <el-checkbox v-for="user in showUsers" v-if="user.email" :label="user.id" :key="user.id"
                             class="user-checkbox">
                  <div class="checkbox-user-wrapper">
                    <div class="member-item"></div>
                    <div class="user-name">{{user.email}}</div>
                  </div>
                </el-checkbox>
                <div style="clear: both;"></div>
              </el-checkbox-group>
            </div>
          </ul>
        </div>

        <div class="dynamic-select-container" v-show="tabIndex===2">
          <div class="select-dynamic-user-container" v-show="loaded&&!selectFormMember">
            <!-- 申请人 -->
            <div class="dynamic-type-container">
              <div class="main-container" @click.stop="applyer=!applyer">
                <div class="icon-container green-container">
                  <i class="fa fa-paper-plane"></i>
                </div>
                <div class="desc-container">
                  <div class="title">申请人</div>
                  <div class="desc">可将申请人设置为节点负责人</div>
                </div>
              </div>
              <div class="checkbox-container">
                <el-checkbox v-model="applyer"></el-checkbox>
              </div>
            </div>
            <!-- 部门负责人 -->
            <div class="dynamic-type-container">
              <div class="main-container" @click.stop="leader=!leader">
                <div class="icon-container red-container">
                  <i class="fa fa-thumb-tack"></i>
                </div>
                <div class="desc-container">
                  <div class="title">部门负责人</div>
                  <div class="desc">由该申请人的部门主管直接处理</div>
                </div>
              </div>
              <div class="checkbox-container">
                <el-checkbox v-model="leader"></el-checkbox>
              </div>
            </div>
            <!-- 上级领导 -->
            <div class="dynamic-type-container" v-show="showSuperior">
              <div class="main-container" @click.stop="superior=!superior">
                <div class="icon-container red-container">
                  <i class="fa fa-thumb-tack"></i>
                </div>
                <div class="desc-container">
                  <div class="title">上级领导</div>
                  <div class="desc">由该申请人的上级领导直接处理</div>
                </div>
              </div>
              <div class="checkbox-container">
                <el-checkbox v-model="superior"></el-checkbox>
              </div>
            </div>
            <!-- 表单中的成员组件 -->
            <div class="dynamic-type-container" v-show="showFormMember&&formMembers&&formMembers.length>0"
                 @click.stop="chooseFormMember">
              <div class="main-container">
                <div class="icon-container purple-container">
                  <i class="fa fa-grav"></i>
                </div>
                <div class="desc-container">
                  <div class="title">表单成员</div>
                  <div class="desc">由表单中的成员直接处理</div>
                </div>
              </div>
              <div class="checkbox-container">
                <el-checkbox v-model="formMember"></el-checkbox>
              </div>
            </div>
          </div>
          <div class="select-member-container" v-show="selectFormMember">
            <div class="header">
              <i class="fa fa-angle-left" @click="backtoMain"></i>
              <span>选择表单中的一个成员组件</span>
            </div>
            <div class="form-member-container">
              <el-select size="medium" clearable v-model="selectedFormMember">
                <el-option v-for="member in formMembers" :key="member.queId" :value="member.queId"
                           :label="member.title">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </el-popover>
    <div style="clear: both;"></div>
  </div>
</template>

<script>
  import services from '../../service/back.service'
  export default{
    name: 'SelectUser',
    props: {
      checkedUsers: {
        type: Array,
        default: () => []
      },
      currentUserChecked: {
        type: Boolean,
        default: false
      },
      // 是否需要显示当前用户
      showCurrentUser: {
        type: Boolean,
        default: false
      },
      // 是否展示树结构
      isTree: {
        type: Boolean,
        default: true
      },
      // 默认的用户列表
      users: {
        type: Array,
        default: () => []
      },
      // 是否显示动态负责人
      showDynamic: {
        type: Boolean,
        default: false
      },
      // 动态负责人中是否显示表单中的成员组件
      showFormMember: {
        type: Boolean,
        default: false
      },
      // 表单中的成员组件
      formMembers: {
        type: Array,
        default: () => []
      },
      // 动态负责人中是否显示上级领导
      showSuperior: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      mCurrentUserChecked: {
        get(){
          return this.currentUserChecked
        },
        set(){

        }
      },
      // 非树结构显示的用户列表
      showUsers: {
        get(){
          let array = this.users;
          if (this.searchContent) {
            return array.filter((user) => user.email && user.email.indexOf(this.searchContent) !== -1);
          } else {
            return array;
          }
        }
      },
      mCheckedUsers: {
        get(){
          return this.checkedUsers || [];
        }
      },
      // 是否选中申请人
      applyer: {
        get(){
          return this.mCheckedUsers.filter((user) => user.needApplyUser).length > 0 ? true : false;
        },
        set(value){
          if (value) {
            this.mCheckedUsers.push({needApplyUser: true});
          } else {
            for (let i = 0; i < this.mCheckedUsers.length; i++) {
              if (this.mCheckedUsers[i].needApplyUser) {
                this.mCheckedUsers.splice(i, 1);
                break;
              }
            }
          }
          this.getTreeData();
        }
      },
      // 是否选中部门负责人
      leader: {
        get(){
          return this.mCheckedUsers.filter((user) => user.createIdForLeader).length > 0 ? true : false;
        },
        set(value){
          if (value) {
            this.mCheckedUsers.push({createIdForLeader: true});
          } else {
            for (let i = 0; i < this.mCheckedUsers.length; i++) {
              if (this.mCheckedUsers[i].createIdForLeader) {
                this.mCheckedUsers.splice(i, 1);
                break;
              }
            }
          }
          this.getTreeData();
        }
      },
      // 是否选中表单中的成员
      formMember: {
        get(){
          return this.mCheckedUsers.filter((user) => user.memQueId).length > 0 ? true : false;
        }
      },
      // 选中的表单成员组件
      selectedFormMember: {
        get(){
          const array = this.mCheckedUsers.filter((user) => user.memQueId)
          return array.length > 0 ? array[0].memQueId : null
        },
        set(value){
          if (value) {
            if (this.mCheckedUsers.filter((user) => user.memQueId).length > 0) {
              this.mCheckedUsers.forEach((v) => {
                if (v.memQueId) {
                  v.memQueId = value
                }
              })
            } else {
              this.mCheckedUsers.push({memQueId: value});
            }
          } else {
            for (let i = 0; i < this.mCheckedUsers.length; i++) {
              if (this.mCheckedUsers[i].memQueId) {
                this.mCheckedUsers.splice(i, 1);
                break;
              }
            }
          }
          this.getTreeData();
        }
      },
      // 是否选中上级领导
      superior: {
        get(){
          return this.mCheckedUsers.filter((user) => user.groupSuperior).length > 0 ? true : false;
        },
        set(value){
          if (value) {
            this.mCheckedUsers.push({groupSuperior: true});
          } else {
            for (let i = 0; i < this.mCheckedUsers.length; i++) {
              if (this.mCheckedUsers[i].groupSuperior) {
                this.mCheckedUsers.splice(i, 1);
                break;
              }
            }
          }
          this.getTreeData();
        }
      }
    },
    data(){
      return {
        loaded: false,
        // 是否正在筛选用户
        inSearch: false,
        // 输入框内容
        searchContent: '',
        defaultProps: {
          label: 'name'
        },
        trees: [],
        allUsers: [
          {name: '全部成员', id: 'all', children: []}
        ],
        // 用户筛选时的用户列表
        userList: [],
        // 匹配条件的用户列表
        showUserList: [],
        // 默认选中的成员数组
        defaultCheckedKeys: [],
        // 选中的tab
        tabIndex: 1,
        // 是否正在选择表单成员
        selectFormMember: false
      }
    },
    methods: {
      // popover显示时触发事件
      async onPopoverShow(){
        if (this.isTree) {
          this.userList = [];
          // 获取默认选中的节点
          this.getDefaultCheckedKeys();
          // 获取组织架构及成员
          const res = await services.getAllGroupsAndUsers();
          if (res.returnCode.startsWith('200')) {
            const array = res.data || [];
            this.dealUsers(array);
            this.trees = array;
            this.loaded = true;
          }
        } else {
          this.getDefaultCheckedKeys();
        }
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
              this.userList.push(user)
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
      // 根据配置中的optionalUsers获取树中默认选中的节点数组
      getDefaultCheckedKeys(){
        const array = [];
        if (this.mCheckedUsers) {
          const realUsers = this.mCheckedUsers.filter((user) => user.email);
          for (let item of realUsers) {
            array.push(item.acctId);
          }
        }
        ;
        this.defaultCheckedKeys = Object.assign([], array);
      },
      // 树结构时当前选中的值
      getTreeData(){
        // 获取动态负责人
        const dynamicArray = this.mCheckedUsers.filter((user) => user.needApplyUser || user.createIdForLeader || user.memQueId || user.groupSuperior);
        let userArray = [];
        if (!this.inSearch) {
          this.defaultCheckedKeys = this.$refs.departmentTree.getCheckedKeys(true);
          // 获取用户
          userArray = this.$refs.departmentTree.getCheckedNodes(true);
        } else {
          userArray = this.userList.filter((user) => this.defaultCheckedKeys.indexOf(user.id) !== -1);
        }
        const result = userArray.concat(dynamicArray);
        this.$emit('onCheckedUsersChange', result);
      },
      onCheckedUsersChange(data){
        if (this.isTree) {
          this.getTreeData();
        } else {
          const checkedArray = this.users.filter((user) => this.defaultCheckedKeys.indexOf(user.id) !== -1);
          this.$emit('onCheckedUsersChange', checkedArray);
        }
      },
      onCurrentUserChange(data){
        this.$emit('onCurrentUserChange', data);
      },
      // 删除当前用户
      deleteCurrentUser(){
        this.$emit('deleteCurrentUser');
      },
      // 删除用户
      deleteUser(id){
        this.$emit('deleteUser', id);
      },
      // 删除动态负责人
      deleteDynamic(type){
        this.$emit('deleteDynamic', type);
      },
      // 输入框中的值发生变化
      onSearchChange(data){
        if (this.isTree) {
          if (data) {
            this.inSearch = true;
            this.showUserList = this.userList.filter((user) => user.email.indexOf(data) !== -1);
          } else {
            this.inSearch = false;
            this.$refs.departmentTree.setCheckedKeys(this.defaultCheckedKeys);
          }
        }
      },
      // 关闭popover
      hidePopover(){
        if (this.$refs.userPopover.showPopper) {
          this.$refs.userPopover.doClose();
        }
      },
      clickAdd(){
        // 阻止冒泡
      },
      // 选择表单成员
      chooseFormMember(){
        this.selectFormMember = true
      },
      // 返回
      backtoMain(){
        this.selectFormMember = false
      },
      // 根据queId返回表单成员组件的title
      showMemberTitile(queId){
        let title = null
        const configs = this.$store.state.flow.formConfigs
        if (configs && configs.length > 0) {
          for (let i in configs) {
            const row = configs[i]
            for (let j in row) {
              const item = row[j]
              if (item.queId === queId) {
                title = item.title
                break
              }
            }
          }
        }
        return title
      },
      // 显示提示内容
      showTooltip(member){
        if (member.needApplyUser) {
          return '申请人'
        }
        if (member.createIdForLeader) {
          return '部门负责人'
        }
        if (member.groupSuperior) {
          return '上级领导'
        }
        if (member.memQueId) {
          return this.showMemberTitile(member.memQueId)
        }
        return member.email
      }
    }
  }
</script>

<style lang="scss">
  @import './select-user.scss';
</style>
