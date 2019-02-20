<template>
  <div class="option-content-wrapper">
    <!-- 单选选项 -->
    <el-radio-group
      v-if="singleItem.indexOf(config.type)!==-1"
      class="editable"
      @change="onOptionsValueChange"
      v-model="config.value"
      size="medium">
      <el-radio
        v-for="(option,index) in config.options"
        :key="'option_custom_'+option.value"
        :style="{width:'100%',marginBottom:'10px'}"
        :label="option.value"
        border>
        <div class="option-radio-wrapper">
          <el-input @input="onOptionInputChange($event,index)" v-model="option.label" size="medium"></el-input>
          <i class="fa fa-trash" @click.stop="deleteOption(index)"></i>
        </div>
      </el-radio>
    </el-radio-group>
    <!-- 多选选项 -->
    <el-checkbox-group
      v-if="multipleItem.indexOf(config.type)!==-1"
      class="editable"
      @change="onOptionsValueChange"
      v-model="config.value"
      size="medium">
      <el-checkbox
        v-for="(option,index) in config.options"
        :key="'option_custom_'+option.value"
        :style="{width:'100%',marginBottom:'10px'}"
        :label="option.value"
        border>
        <div class="option-radio-wrapper">
          <el-input @input="onOptionInputChange($event,index)" v-model="option.label" size="medium"></el-input>
          <i class="fa fa-trash" @click.stop="deleteOption(index)"></i>
        </div>
      </el-checkbox>
    </el-checkbox-group>

    <div class="add-option-wrapper" @click="addNewOption">
      <i class="fa fa-plus-circle"></i>
      <span>添加新选项</span>
    </div>
  </div>
</template>

<script>
  export default{
    name: 'OptionContent',
    data(){
      return {
        dictionaries: [],
        dictOptionLists: [],
        singleItem: ['radio', 'select'],
        multipleItem: ['checkbox', 'multiple_select']
      }
    },
    props: {
      config: {
        type: Object,
        default: () => {
        }
      }
    },
    methods: {
      // 属性变更
      onPropertyChange(key, value){
        this.$store.dispatch('setFormItemValue', {
          index: this.$store.state.dynamicForm.currentFormItem.index,
          rowIndex: this.$store.state.dynamicForm.currentFormItem.rowIndex,
          colIndex: this.$store.state.dynamicForm.currentFormItem.colIndex,
          key: key,
          value: value
        });
      },
      // 默认选项变更
      onOptionsValueChange(data){
        this.onPropertyChange('value', data);
      },
      // 清空选中状态
      clearCheckedOptions(){
        if (this.singleItem.indexOf(this.config.type) !== -1) {
          // 将默认选中值清空
          this.onPropertyChange('value', null);
        }
        if (this.multipleItem.indexOf(this.config.type) !== -1) {
          // 将默认选中值清空
          this.onPropertyChange('value', []);
        }
      },
      // 选项内容文字变更
      onOptionInputChange(data, index){
        this.$store.dispatch('editOptionLabel', Object.assign(this.$store.state.dynamicForm.currentFormItem, {
          optionIndex: index,
          optionLabel: data
        }));
      },
      // 添加新选项
      addNewOption(){
        this.$store.dispatch('addNewOption', this.$store.state.dynamicForm.currentFormItem);
      },
      // 删除选项
      deleteOption(index){
        this.$store.dispatch('deleteOption', Object.assign(this.$store.state.dynamicForm.currentFormItem, {optionIndex: index}));
      }
    }
  }
</script>

<style scoped lang="scss">
  @import './option-content.scss';
</style>
