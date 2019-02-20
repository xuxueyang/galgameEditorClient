<template>
  <div class="dynamic-table-container">
    <div class="table-container">
      <table class="mf-table">
        <thead class="mf-thead">
        <tr>
          <th v-for="(child,index) in config.children" :key="'th_'+index">{{child.title}}<span
            v-if="child.required"
            class="required-mark">*</span></th>
          <th>移除</th>
        </tr>
        </thead>
        <tbody class="mf-tbody">
        <tr v-for="(row,i) in value" :key="'row_'+i">
          <td v-for="(child,j) in config.children" :key="'td_'+i+'_'+j"
              :class="{'has-error':!configable&&!authable&&row[j].error}">
            <!--单行文字-->
            <template v-if="child.type==='input'">
              <div v-if="disabled">{{row[j].value}}</div>
              <el-input
                v-else
                @input="onTableContentChange"
                @blur="onBlur(child,i,j)"
                :disabled="disabled"
                placeholder="请输入内容"
                size="medium"
                v-model="row[j].value"></el-input>
            </template>
            <!--日期-->
            <el-date-picker
              @input="onTableDateContentChange($event,row[j]);onBlur(child,i,j)"
              :disabled="disabled"
              v-model="row[j].displayValue"
              size="medium"
              :style="{width:'100%'}"
              v-if="child.type==='date'"
              :type="child.exact_time?'datetime':'date'"
              placeholder="选择日期">
            </el-date-picker>
            <!--数字-->
            <template v-if="child.type==='number'">
              <div v-if="disabled">{{row[j].value}}</div>
              <el-input
                @input="onTableContentChange"
                @blur="onBlur(child,i,j)"
                :disabled="disabled"
                v-model="row[j].value"
                size="medium"
                prefix-icon="fa fa-superscript">
              </el-input>
            </template>
            <!--下拉选择-->
            <el-select
              @change="onTableContentChange();onBlur(child,i,j)"
              size="medium"
              :clearable="true"
              :disabled="disabled"
              :style="{width:'100%'}"
              placeholder="请输入内容"
              v-if="child.type==='select'"
              v-model="row[j].value">
              <el-option
                v-for="item in child.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <!--多项选择-->
            <el-checkbox-group
              @change="onTableContentChange();onBlur(child,i,j)"
              :disabled="disabled"
              size="medium"
              v-if="child.type==='checkbox'"
              v-model="row[j].value">
              <el-checkbox
                v-for="item in child.options"
                :key="item.value"
                :label="item.value">
                {{item.value}}
              </el-checkbox>
            </el-checkbox-group>
            <!--数据关联-->
            <el-select
              @change="onTableContentChange();onBlur(child,i,j)"
              :disabled="disabled"
              size="medium"
              filterable
              placeholder="输入并搜索"
              :clearable="true"
              :style="{width:'100%'}"
              v-if="child.type==='data_association'"
              v-model="row[j].value">
              <el-option
                v-for="(item,index) in child.association_options"
                :key="item+'_'+index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <div class="form-item-error" v-if="!configable&&!authable&&row[j].error">{{row[j].error}}</div>
          </td>
          <td><i @click="deleteRow(i)" class="fa fa-trash delete-i"></i></td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="add-row" @click="addRow">
      <i class="fa fa-plus-circle"></i>
      <span>添加新行</span>
    </div>
  </div>
</template>

<script>
  export default{
    name: 'DynamicTable',
    props: {
      config: {
        type: Object,
        default: () => {
        }
      },
      disabled: {
        type: Boolean,
        default: false
      },
      value: {
        type: Array,
        default: () => []
      },
      configable: {
        type: Boolean,
        default: false
      },
      authable: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      defaultConfig(){
        return FORM_ITEM_CONFIG;
      }
    },
    methods: {
      // 添加新行
      addRow(){
        if (!this.disabled) {
          const array = Object.assign([], this.value);
          const col = [];
          for (let i = 0; i < this.config.children.length; i++) {
            col.push({
              queId: null,
              value: this.config.children[i].value || null,
              displayValue: this.config.children[i].displayValue || null
            });
          }
          array.push(col);
          this.$emit('input', array);
        }
      },
      // 删除行
      deleteRow(i){
        if (!this.disabled) {
          const array = Object.assign([], this.value);
          array.splice(i, 1);
          this.$emit('input', array);
        }
      },
      // 表格字段的值发生变化
      onTableContentChange(){
        this.$emit('input', this.value);
      },
      // 表格中日期发生变化特殊处理
      onTableDateContentChange(data, col){
        col.value = Number((new Date(data)).getTime());
        this.$emit('input', this.value);
      },
      onBlur(child, i, j){
        this.$emit('onBlur', Object.assign({}, child, {parentTempQueId: this.config.tempQueId, childRowIndex: i}))
      }
    }
  }
</script>

<style scoped lang="scss">
  @import './dynamic-table.scss';
</style>
