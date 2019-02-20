<template>
  <div class="choose-role-container">
    <el-select @change="onRoleChange" style="width: 100%" size="medium" v-model="config.roleId">
      <el-option
        v-for="role in roles"
        :label="role.description"
        :value="role.id"
        :key="role.id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import services from '../../../../service/back.service';
  export default{
    name: 'ChooseRole',
    props: {
      config: {
        type: Object,
        default: () => {
        }
      }
    },
    data(){
      return {
        roles: []
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
      // 获取所有角色
      async getAllRoles(){
        const res = await services.getAllRoles();
        if (res.returnCode.startsWith('200')) {
          this.roles = res.data || [];
        }
      },
      // 选择的角色变更
      onRoleChange(data){
        this.onPropertyChange('roleId', data)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "./choose-role.scss";
</style>
