<template>
  <div class="file-type-wrapper">
    <el-checkbox-group
      v-model="config.file_type"
      size="medium"
      @change="onFileTypeChange">
      <template v-for="item in types">
        <el-checkbox
          :key="item.value"
          :label="item.value">
          {{item.label}}
          <label v-if="item.value==='custom'&&config.file_type&&config.file_type.indexOf('custom')!==-1"
                 class="custom-edit" @click.stop="customEdit">编辑</label>
        </el-checkbox>
        <div :key="'desc'+item.value" v-if="config.file_type&&config.file_type.indexOf(item.value)!==-1" class="file-type-desc">
          {{item.value === 'custom' && config.custom_file_type ? `自定义类型如下：${config.custom_file_type}` : item.description}}
        </div>
      </template>
    </el-checkbox-group>
    <el-dialog title="批量编辑" width="450px" :visible.sync="editFileTypeVisible">
      <div class="relate-data-header">
        <span>请输入自定义类型</span>
      </div>
      <el-input type="textarea" :rows="10" v-model="custom_file_type"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancelClick">取消</el-button>
        <el-button type="primary" @click="onConfirmClick">完成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  const fileType = {
    'document': ['txt', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'cvs', 'xml', 'ppt', 'pptx', 'wps', 'htm', 'html', 'rtf', 'hlp'],
    'picture': ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'psd', 'tif'],
    'audio': ['mp3', 'flac', 'ape', 'wma', 'wav', 'aac', 'm4a', 'au', 'ram', 'mmf', 'aif'],
    'video': ['mkv', 'mp4', 'avi', 'swf', 'wmv', 'rmvb', 'mov', 'mpg'],
    'zip_file': ['rar', 'zip', '7z', 'gz', 'arj', 'z']
  }
  export default{
    name: 'FileType',
    props: {
      config: {
        type: Object,
        default: () => {
        }
      }
    },
    data(){
      return {
        editFileTypeVisible: false,
        custom_file_type: null,
        types: [
          {
            label: '文档',
            value: 'document',
            description: '文档包括以下类型：txt、pdf、doc、docx、xls、xlsx、cvs、xml、ppt、pptx、wps、htm、html、rtf、hlp。如限制不满足需求，建议选择［自定义］设置文件上传类型'
          },
          {
            label: '图片',
            value: 'picture',
            description: '图片包括以下类型：jpg、jpeg、png、gif、bmp、psd、tif。如限制不满足需求，建议选择［自定义］设置文件上传类型'
          },
          {
            label: '音频',
            value: 'audio',
            description: '音频包括以下类型：mp3、flac、ape、wma、wav、aac、m4a、au、ram、mmf、aif。如限制不满足需求，建议选择［自定义］设置文件上传类型'
          },
          {
            label: '视频',
            value: 'video',
            description: '视频包括以下类型：mkv、mp4、avi、swf、wmv、rmvb、mov、mpg。如限制不满足需求，建议选择［自定义］设置文件上传类型'
          },
          {label: '压缩包', value: 'zip_file', description: '压缩包包括以下类型：rar、zip、7z、gz、arj、z。如限制不满足需求，建议选择［自定义］设置文件上传类型'},
          {
            label: '自定义',
            value: 'custom',
            description: '请输入自定义的文件扩展名，多个请用逗号隔开，如: txt, pdf, mp3等。 设置完毕后，填表者仅能上传你指定的文件类型。'
          },
        ]
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
      // 文件类型变更
      onFileTypeChange(data){
        const typeArray = [];
        for (let i = 0; i < data.length; i++) {
          const type = data[i];
          if (type !== 'custom') {
            typeArray.push(...fileType[type]);
          }
        }
        this.onPropertyChange('file_type', data);
        this.onPropertyChange('file_real_type', typeArray);
      },
      // 编辑自定义类型
      customEdit(){
        this.openDialog();
      },
      // 打开编辑文件类型弹框
      openDialog(){
        this.custom_file_type = this.config.custom_file_type;
        this.editFileTypeVisible = true;
      },
      // 关机编辑文件类型弹框
      closeDialog(){
        this.editFileTypeVisible = false;
      },
      // 点击取消
      onCancelClick(){
        this.closeDialog();
      },
      // 点击确认
      onConfirmClick(){
        // 将用户输入的中文逗号统一转成英文逗号
        this.custom_file_type = this.custom_file_type ? this.custom_file_type.replace(/，/g, ',') : '';
        this.onPropertyChange('custom_file_type', this.custom_file_type);
        this.closeDialog();
      }
    }
  }
</script>

<style scoped lang="scss">
  @import './file-type.scss';
</style>
