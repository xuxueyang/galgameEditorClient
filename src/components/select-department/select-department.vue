<template>
  <div class="department-area">
    <el-tooltip
      v-if="currentDepartment"
      content="当前部门">
      <div class="department-item current-department">
        <i class="fa fa-user"></i>
        <div class="delete-department" @click="deleteCurrentUser">
          <i class="fa fa-close"></i>
        </div>
      </div>
    </el-tooltip>
    <el-tooltip
      :content="department.name"
      v-for="department in checkedDepartments"
      :key="department.id">
      <div class="department-item" v-if="department.name">
        <div class="delete-department" @click="deleteDepartment(department.id)">
          <i class="fa fa-close"></i>
        </div>
      </div>
    </el-tooltip>
    <el-popover ref="departmentPopover" :visible-arrow="false" @show="onPopoverShow"
                popper-class="select-department-popover"
                width="300"
                trigger="click">
      <div slot="reference" class="department-item add-btn" @click.stop="clickAdd">
        <i class="fa fa-plus"></i>
      </div>
      <div class="select-user-container">
        <div class="search-row">
          <el-input v-model="searchContent" placeholder="部门名称" size="medium"
                    @input="onSearchChange"></el-input>
        </div>
        <ul class="department-list-container" v-show="isTree&&!inSearch">
          <li class="department-row current-department">
            <el-checkbox class="department-checkbox" v-model="currentDepartment">
              <div class="department-info-area">
                <div class="avatar">
                  <i class="fa fa-user"></i>
                </div>
                <div class="department-name">当前部门</div>
              </div>
            </el-checkbox>
          </li>
          <li class="department-row" v-show="loaded">
            <el-tree
              ref="departmentTree"
              :check-strictly="true"
              @check-change="onTreeCheckedChange"
              :default-checked-keys="defaultCheckedKeys"
              :data="trees"
              :props="defaultProps"
              show-checkbox
              node-key="id">
            </el-tree>
          </li>
        </ul>

        <ul class="department-list-container" v-show="isTree&&inSearch">
          <div class="group-wrapper">
            <el-checkbox-group v-model="defaultCheckedKeys" @change="onCheckedChange">
              <el-checkbox v-for="sDepartment in showDepartments" v-if="sDepartment.id" :label="sDepartment.id"
                           :key="sDepartment.id"
                           class="department-checkbox">
                <div class="checkbox-department-wrapper">
                  <div class="department-item"></div>
                  <div class="department-name">{{sDepartment.name}}</div>
                </div>
              </el-checkbox>
              <div style="clear: both;"></div>
            </el-checkbox-group>
          </div>
        </ul>

        <ul class="department-list-container" v-show="!isTree">
          <li class="department-row current-department">
            <el-checkbox class="department-checkbox" v-model="currentDepartment">
              <div class="department-info-area">
                <div class="avatar">
                  <i class="fa fa-user"></i>
                </div>
                <div class="department-name">当前部门</div>
              </div>
            </el-checkbox>
          </li>
          <div class="group-wrapper">
            <el-checkbox-group v-model="defaultCheckedKeys" @change="onCheckedChange">
              <el-checkbox v-for="item in showList" v-if="item.name" :label="item.id" :key="item.id"
                           class="department-checkbox">
                <div class="checkbox-department-wrapper">
                  <div class="department-item"></div>
                  <div class="department-name">{{item.name}}</div>
                </div>
              </el-checkbox>
              <div style="clear: both;"></div>
            </el-checkbox-group>
          </div>
        </ul>
      </div>
    </el-popover>
    <div style="clear: both;"></div>
  </div>
</template>

<script>
  import services from '../../service/back.service';
  export default{
    name: 'SelectDepartment',
    props: {
      // 是否展示树结构
      isTree: {
        type: Boolean,
        default: true
      },
      // 默认选中的部门
      checkedDepartments: {
        type: Array,
        default: () => []
      },
      // 非树部门列表
      departmentList: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      currentDepartment: {
        get(){
          return this.checkedDepartments.filter((department) => department.type === 'currentDepartment').length > 0 ? true : false
        },
        set(value){
          let array = [];
          if (this.isTree) {
            if (this.inSearch) {
              array = this.departments.filter((department) => this.defaultCheckedKeys.indexOf(department.id) !== -1);
            } else {
              array = this.$refs.departmentTree.getCheckedNodes();
            }
          } else {
            array = this.departmentList.filter((department) => department.name && this.defaultCheckedKeys.indexOf(department.id) !== -1);
          }
          if (value) {
            array.push({type: 'currentDepartment'});
          }
          this.$emit('checkedDepartmentChange', Object.assign([], array));
        }
      },
      // 显示的部门列表
      showDepartments: {
        get(){
          if (this.searchContent) {
            return this.departments.filter((department) => department.name && department.name.indexOf(this.searchContent) !== -1);
          } else {
            return this.departments;
          }
        }
      },
      // 非树结构显示的部门列表
      showList: {
        get(){
          let array = this.departmentList;
          if (this.searchContent) {
            return array.filter((department) => department.name && department.name.indexOf(this.searchContent) !== -1);
          } else {
            return array.filter((department) => department.name);
          }
        }
      }
    },
    data(){
      return {
        loaded: false,
        defaultProps: {
          label: 'name'
        },
        defaultCheckedKeys: null,
        // 所有部门列表
        departments: [],
        trees: [],
        childArray: [],
        childKeys: [],
        // 搜索输入框内容
        searchContent: '',
        // 是否处于搜索状态
        inSearch: false
      }
    },
    methods: {
      // popover显示事件
      async onPopoverShow(){
        // 获取默认选中项
        this.getDefaultCheckedKeys();
        if (this.isTree) {
          const res = await services.getAllGroups();
          if (res.returnCode.startsWith('200')) {
            this.trees = res.data || [];
            this.departments = [];
            this.getAllDepartmentsByTree(this.trees);
            this.loaded = true;
          }
        }
      },
      // 获取默认选中的
      getDefaultCheckedKeys(){
        const array = [];
        if (this.checkedDepartments && this.checkedDepartments.length > 0) {
          for (let i = 0; i < this.checkedDepartments.length; i++) {
            const department = this.checkedDepartments[i];
            if (department.id) {
              array.push(department.id);
            }
          }
        }
        this.defaultCheckedKeys = Object.assign([], array);
      },
      // 获取所有的部门
      getAllDepartmentsByTree(trees){
        for (let i = 0; i < trees.length; i++) {
          const item = trees[i];
          this.departments.push(item);
          if (item.children && item.children.length > 0) {
            this.getAllDepartmentsByTree(item.children);
          }
        }
      },
      // 点击添加
      clickAdd(){

      },
      onCurrentChange(){

      },
      // 树选中变化
      onTreeCheckedChange(node, state, childState){
        let array = this.$refs.departmentTree.getCheckedNodes();
        const keys = this.$refs.departmentTree.getCheckedKeys();
        if (node.children && node.children.length > 0) {
          this.childArray = [];
          this.childKeys = [];
          this.getChildKeys(node.children);
          // 如果当前节点被选中则选中该节点下的所有子节点
          if (state) {
            for (let i = 0; i < this.childArray.length; i++) {
              const item = this.childArray[i];
              if (keys.indexOf(item.id) === -1) {
                array.push(item);
              }
            }
          } else {
            // 将所有子节点取消选中
            array = array.filter((node) => this.childKeys.indexOf(node.id) === -1);
          }
        }
        this.$refs.departmentTree.setCheckedNodes(array);
        // 如果当前部门被选中则添加一条数据
        if (this.currentDepartment) {
          array.push({type: 'currentDepartment'});
        }
        this.$emit('checkedDepartmentChange', array);
      },
      getChildKeys(nodes){
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          this.childArray.push(node);
          this.childKeys.push(node.id);
          if (node.children && node.children.length > 0) {
            this.getChildKeys(node.children);
          }
        }
      },
      onCheckedChange(){
        let array = [];
        if (this.isTree) {
          array = this.departments.filter((department) => this.defaultCheckedKeys.indexOf(department.id) !== -1);
        } else {
          array = this.departmentList.filter((department) => this.defaultCheckedKeys.indexOf(department.id) !== -1);
        }
        if (this.currentDepartment) {
          array.push({type: 'currentDepartment'});
        }
        this.$emit('checkedDepartmentChange', Object.assign([], array));
      },
      // 删除部门
      deleteDepartment(id){
        this.$emit('deleteDepartment', id);
      },
      // 输入框变化
      onSearchChange(data){
        if (this.isTree) {
          if (data) {
            this.inSearch = true;
          } else {
            this.inSearch = false;
            this.$refs.departmentTree.setCheckedKeys(this.defaultCheckedKeys);
          }
        }
      },
      // 删除当前部门
      deleteCurrentUser(){
        this.$emit('deleteDepartment', null);
      }
    }
  }
</script>

<style lang="scss">
  @import './select-department.scss';
</style>
