<template>
  <div class="data-table-container">
    <table>
      <thead>
      <tr>
        <th>编号</th>
        <th>当前流程状态</th>
        <th>申请人</th>
        <th>申请时间</th>
        <th>更新时间</th>
        <!--<th v-for="(headCell,m) in dataSource[0].result" :key="'headCell_'+m">{{headCell.title}}</th>-->
      </tr>
      </thead>
      <tbody>
      <tr @click="openDialog(row)" v-for="(row,index) in dataSource" :key="'row_'+index">
        <td>{{getDefaultValue(row.result, '1')}}</td>
        <td>
          <span class="node-name" v-if="type==='7'">已通过</span>
          <span class="node-name" v-else-if="type==='8'">已拒绝</span>
          <span class="node-name" v-else-if="type==='4'">草稿</span>
          <span class="node-name" v-else-if="row.aduitNodeName">{{row.aduitNodeName}}</span>
          <template v-else>
            <span class="node-name" v-for="(nodeName,n) in row.currentWorkflowNode"
                  :key="'nodetag_'+n">{{nodeName.auditNodeName}}</span>
          </template>
        </td>
        <td>{{getDefaultValue(row.result, '2')}}</td>
        <td>{{getDefaultValue(row.result, '3')}}</td>
        <td>{{getDefaultValue(row.result, '4')}}</td>
        <!--<td v-for="(element,j) in row.result" :key="'data_'+index+'_'+j">-->
        <!--<span v-if="element.type==='date'||element.queId==='3'||element.queId==='4'">{{element.value | date}}</span>-->
        <!--<span v-else-if="element.type==='start_stop_time'&&element.value&&element.value.length>0">-->
        <!--{{element.value[0] | date}}~{{element.value[1] | date}}-->
        <!--</span>-->
        <!--<span v-else-if="element.type==='radio'||element.type==='select'">{{getSigleLabel(element)}}</span>-->
        <!--<span class="node-name" v-else-if="element.type==='checkbox'" v-for="(tag,index) in getMultiLabels(element)"-->
        <!--:key="'tag_'+index">{{tag.label}}</span>-->
        <!--<span-->
        <!--v-else-if="element.type==='upload'||element.type==='editor'||element.type==='table'">{{getOtherLabel(element)}}</span>-->
        <!--<span class="node-name" v-else-if="element.type==='member'"-->
        <!--v-for="(member,index) in getMemberLabels(element)" :key="'member_'+index">{{member.email}}</span>-->
        <!--<span v-else>{{element.value}}</span>-->
        <!--</td>-->
      </tr>
      </tbody>
    </table>

    <el-dialog
      :visible.sync="modalVisible"
      @open="onDialogOpen"
      @close="onDialogClose"
      width="995px"
      custom-class="affair-dialog"
      :show-close="false">
      <div class="header">
        <span class="node-name">审批</span>
      </div>
      <div class="body">
        <div class="app-info-box">
          <div class="app-info-content">
            <div class="form-content" id="print-content">
              <div class="app-info-row">
                <div class="info-detail" v-for="(data,index) in defaultData" v-if="data.queId==='1'||data.queId==='2'"
                     :key="'default_'+index">
                <span class="detail-title">
                  <i class="fa fa-list" v-if="data.queId==='1'"></i>
                  <i class="fa fa-user-circle" v-else></i>
                  {{data.title}}
                </span>
                  <span
                    class="detail-content" v-if="data.queId==='1'">{{data.canHide ? '无权查看' : data.value}}</span>
                  <span
                    class="detail-content" v-else>{{data.canHide ? '无权查看' : data.email}}</span>
                </div>
              </div>
              <div class="app-info-row">
                <div class="info-detail" v-if="data.queId==='3'||data.queId==='4'" v-for="(data,index) in defaultData"
                     :key="'default_'+index">
                <span class="detail-title">
                  <i class="fa fa-clock-o" v-if="data.queId==='3'"></i>
                  <i class="fa fa-refresh" v-else></i>
                  {{data.title}}
                </span>
                  <span
                    class="detail-content"
                    v-if="data.queId==='3'||data.queId==='4'">
                  <span v-if="!data.canHide">{{data.value | date}}</span>
                  <span v-else>无权查看</span>
                </span>
                </div>
              </div>
              <div class="flow-info">
                <cube-dynamic-form ref="dynamicForm" :config="formData"></cube-dynamic-form>
              </div>
            </div>

            <div id="button-content">
              <!-- 待办 -->
              <div class="footer" v-if="type==='1'">
                <div class="action-button-container">
                  <el-button @click="approve" size="medium" type="success">通过</el-button>
                  <el-button @click="reject" size="medium" type="danger">拒绝</el-button>
                </div>
              </div>
              <!-- 草稿 -->
              <div class="footer" v-if="type==='4'">
                <div class="action-button-container">
                  <el-button @click="submitDraft" size="medium" type="primary">提交</el-button>
                </div>
              </div>
              <!-- 已通过 -->
              <div class="footer" v-if="type==='7'">
                <div class="action-button-container">
                  <el-button @click="print" size="medium" type="success">打印</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="log-info-box" id="log-content">
          <div class="log-content">
            <log-timeline :dataSource="logs"></log-timeline>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import LogTimeline from './log-timeline/log-timeline'
  import services from '../../../service/back.service'
  import CubeDynamicForm from '../../dynamic-form/dynamic-form'
  import {dealFormData} from '../../../util/util';
  import printjs from 'print-js'
  import html2canvas from 'html2canvas'
  export default{
    components: {
      CubeDynamicForm,
      LogTimeline
    },
    name: 'DataTable',
    props: {
      dataSource: {
        type: Array,
        default: () => []
      },
      // 列表类型
      type: {
        type: String,
        default: null
      }
    },
    data(){
      return {
        modalVisible: false,
        // 当前操作的单据
        currentData: {},
        // 表单信息
        formData: [],
        // 默认字段
        defaultData: [],
        // 日志信息
        logs: []
      }
    },
    filters: {
      date(value){
        if (value) {
          return (new Date(value.replace(/\[.*?\]/g, ''))).toLocaleString()
        } else {
          return null;
        }
      }
    },
    methods: {
      // 返回单选下拉框的显示值
      getSigleLabel(element){
        const values = element.options.filter((option) => option.value === element.value);
        if (values.length > 0) {
          return values[0].label;
        } else {
          return null;
        }
      },
      // 返回多选的显示值
      getMultiLabels(element){
        if (element.value && element.value.length > 0) {
          const values = element.options.filter((option) => element.value.indexOf(option.value) !== -1);
          return values;
        } else {
          return [];
        }
      },
      // 返回成员的显示值
      getMemberLabels(element){
        if (element.value && element.value.length > 0) {
          return element.value;
        } else {
          return [];
        }
      },
      // 获取一些其他复杂元素的显示值
      getOtherLabel(element){
        if (element.value) {
          return '点击查看详情';
        } else {
          return null;
        }
      },
      // 获取默认字段的值
      getDefaultValue(array, queId){
        const resultArr = array.filter((item) => item.queId === queId);
        if (resultArr && resultArr.length > 0) {
          if (queId === '3' || queId === '4') {
            return this.dealDate(resultArr[0].value);
          } else if (queId === '2') {
            return resultArr[0].email;
          } else {
            return resultArr[0].value;
          }
        } else {
          return '无权查看'
        }
      },
      dealDate(value){
        if (value) {
          return (new Date(value.replace(/\[.*?\]/g, ''))).toLocaleString()
        } else {
          return null;
        }
      },
      openDialog(data){
        this.currentData = data;
        this.modalVisible = true;
      },
      async onDialogOpen(){
        // 查询单据信息
        services.getFormData(this.currentData.dataId, {
          processInstanceId: this.currentData.result[0].processInstanceId,
          appId: this.currentData.appId,
          workflowNodeId: this.currentData.auditNodeId
        }).then((res) => {
          if (res.returnCode.startsWith('200')) {
            let array = res.data || [];
            this.defaultData = array.filter((item) => ['1', '2', '3', '4'].indexOf(item.queId) !== -1).reverse();
            array = array.filter((item) => ['1', '2', '3', '4'].indexOf(item.queId) === -1);
            const formArray = [];
            if (array && array.length > 0) {
              const temp = [];
              for (let i = 0; i < array.length; i++) {
                const formItem = array[i];
                if (temp.indexOf(formItem.rowIndex) === -1) {
                  temp.push(formItem.rowIndex);
                  formArray.push([]);
                }
                formArray[temp.indexOf(formItem.rowIndex)].push(formItem);
              }
            }
            this.formData = formArray;
          }
        })
        // 查询日志信息
        services.getLog(this.currentData.dataId).then((res) => {
          if (res.returnCode.startsWith('200')) {
            this.logs = res.data.result || [];
          }
        })
      },
      onDialogClose(){
        this.currenData = {};
        this.formData = [];
        this.defaultData = [];
      },
      getFormData(){
        const array = [];
        for (let i = 0; i < this.formData.length; i++) {
          const row = this.formData[i];
          for (let j = 0; j < row.length; j++) {
            const item = row[j];
            if (item.canEdit) {
              // 针对特殊表单元素处理表单数据
              dealFormData(item);
              array.push({queId: item.queId, value: item.value});
            }
          }
        }
        return array.length > 0 ? array : null;
      },
      // 通过
      async approve(){
        const formData = this.getFormData();
        const res = await services.taskApprove({
          appId: this.currentData.appId,
          taskId: this.currentData.taskId,
          updateValueMaps: formData
        })
        if (res.returnCode.startsWith('200')) {
          this.$message.success('操作成功');
          // 关闭dialog
          this.modalVisible = false;
          // 重新查询列表
          this.$emit('getList');
        }
      },
      // 拒绝
      async reject(){
        const formData = this.getFormData();
        const res = await services.taskReject({
          appId: this.currentData.appId,
          taskId: this.currentData.taskId,
          updateValueMaps: formData
        })
        if (res.returnCode.startsWith('200')) {
          this.$message.success('操作成功');
          // 关闭dialog
          this.modalVisible = false;
          // 重新查询列表
          this.$emit('getList');
        }
      },
      // 提交草稿
      submitDraft(){
        this.$refs.dynamicForm.checkValidate(async (res) => {
          if (res) {
            const response = await services.submitDraft(this.currentData.appId, {
              formdataJson: JSON.stringify(res),
              dataId: this.currentData.dataId
            });
            if (response.returnCode.startsWith('200')) {
              this.$message.success('申请成功');
              this.$emit('submitSuccess');
              // 关闭dialog
              this.modalVisible = false;
              // 重新查询列表
              this.$emit('getList');
            }
          }
        });
      },
      // 打印
      print(){
        html2canvas(document.querySelector('#print-content')).then((canvas) => {
          const imgSrc = canvas.toDataURL()
          let image = null
          if (!document.querySelector('#print-image')) {
            image = document.createElement('img')
            image.src = imgSrc
            image.id = 'print-image'
            document.body.appendChild(image)
          } else {
            image = document.querySelector('#print-image')
            image.style.display = 'block'
            image.src = imgSrc
          }
          setTimeout(() => {
            printjs({
              printable: 'print-image',
              type: 'html',
              maxWidth: 2000,
              documentTitle: this.currentData.appName || '申请单',
              onLoadingEnd: () => {
                if (document.querySelector('#print-image')) {
                  // 将image元素删除
                  const printImage=document.getElementById('print-image')
                  if(printImage){
                    printImage.parentNode.removeChild(printImage)
                  }
                }
              }
            })
          },1000)
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  @import './data-table.scss';
</style>
