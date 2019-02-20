<template>
  <div class="dynamic-role-member-container">
    <el-select
      filterable
      @change="onChange"
      :disabled="disabled"
      v-model="mValue"
      :multiple="multiple"
      style="width: 100%"
      size="medium">
      <el-option
        v-for="member in options"
        :label="member.email"
        :value="member.id"
        :key="member.id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  export default{
    name: 'DynamicRoleMember',
    props: {
      value: {
        type: [String, Array],
        default: null
      },
      disabled: {
        type: Boolean,
        default: false
      },
      options: {
        type: Array,
        default: () => []
      },
      multiple: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      mValue: {
        get(){
          return this.value || (this.multiple ? [] : null);
        },
        set(){
        }
      }
    },
    methods: {
      // 选择的成员变更
      onChange(data){
        this.$emit('input', data)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import './dynamic-role-member.scss';
</style>
