<template>
  <div class="dynamic-department-container">
    <el-popover :disabled="disabled" v-model="popoverVisible" ref="popover" placement="bottom-end"
                :visible-arrow="false"
                popper-class="department-select-department-popover" width="300"
                trigger="click">
      <template slot="reference">
        <div class="nothing-container" v-if="!value||value.length===0">
          <span>请选择</span>
        </div>
        <div class="department-something" v-else>
          <div class="department-tag-container" @click.stop="preventEvent">
            <div class="department-tag" v-for="(department,m) in value" :key="'department_tag_'+m">
              <div class="department_avatar"></div>
              <span class="department-name">{{department.name}}</span>
              <i class="fa fa-close" @click.stop="deleteUser($event,department)"></i>
            </div>
          </div>
          <div class="department-selector">
            <span>点击更改</span>
          </div>
        </div>
      </template>
      <div class="select-department-container">
        <div class="search-row">
          <el-input @input="onSearchContentChange" v-model="searchContent" placeholder="输入部门名称"
                    size="medium"></el-input>
        </div>
        <div class="department-list-container">
          <div class="group-wrapper">
            <el-checkbox-group v-model="checkedKeys">
              <el-checkbox v-for="department in showDepartments" :label="department.id" :key="department.id"
                           class="department-checkbox">
                <div class="checkbox-department-wrapper">
                  <div class="department-item"></div>
                  <div class="department-name">{{department.name}}</div>
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
  export default{
    name: 'DynamicDepartment',
    props: {
      departments: {
        type: Array,
        default: () => []
      },
      value: {
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
          const array = this.departments.filter((user) => data.indexOf(user.id) !== -1);
          this.$emit('input', array);
        }
      },
      showDepartments: {
        get(){
          let array = this.departments;
          if (this.searchContent) {
            array = array.filter((department) => department.name.indexOf(this.searchContent) !== -1);
          }
          return array;
        }
      }
    },
    data(){
      return {
        popoverVisible: false,
        // 搜索内容
        searchContent: ''
      }
    },
    created() {
      if (this.departments.length === 0) {
        // 若未选择部门，则带出所有
        services.getAllGroups().then((res) => {
          if (res.returnCode.startsWith('200')) {
            const trees = res.data || [];
            // this.departments = [];
            this.getAllDepartmentsByTree(trees);
          }
        })
      }
    },
    methods: {
      preventEvent(){
        this.popoverVisible = false;
      },
      // 获取所有的部门
      getAllDepartmentsByTree(trees){
        for (let i = 0; i < trees.length; i++) {
          const item = trees[i];
          this.showDepartments.push(item);
          if (item.children && item.children.length > 0) {
            this.getAllDepartmentsByTree(item.children);
          }
        }
      },
      // 删除用户
      deleteUser(event, data){
        if (!this.disabled) {
          this.popoverVisible = false;
          const keys = this.checkedKeys.filter((value) => value !== data.id);
          const array = this.departments.filter((department) => keys.indexOf(department.id) !== -1);
          this.$emit('input', array);
        }
      },
      // 搜索框的值变化
      onSearchContentChange(){

      }
    }
  }
</script>

<style scoped lang="scss">
  @import './dynamic-department.scss';
</style>
