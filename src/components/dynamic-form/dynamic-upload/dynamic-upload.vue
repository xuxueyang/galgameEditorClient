<template>
  <div class="dynamic-upload-container">
    <p class="support-type" v-if="showSupportType">
      {{supportType}}</p>
    <el-upload
      v-if="!disabled"
      :disabled="disabled"
      :limit="config.limit_file_count?config.max_file_count:null"
      :file-list="config.value"
      :headers="uploadHeaders"
      :before-upload="beforeUpload"
      :on-success="onUploadSuccess"
      :on-error="onUploadError"
      :on-exceed="onExceed"
      :on-remove="onFileRemove"
      :action="uploadUrl">
      <div class="file-uploader-inner">
        <div class="inner-desc">
          <i class="fa fa-folder-open"></i>
          <div>上传附件</div>
        </div>
      </div>
    </el-upload>
    <template v-if="disabled">
      <div class="form-attach" v-for="(attach,index) in config.value" :key="'attach_'+index"
           @click="downloadFile(attach)">
        <div class="file-name">{{attach.name}}</div>
        <div class="download-wrapper">
          <i class="fa fa-download"></i>
          <span>下载附件</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  export default{
    name: 'DynamicUpload',
    props: {
      config: {
        type: Object,
        default: () => {
        }
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      // 支持的文件类型描述
      supportType(){
        let str = '支持';
        let supportArray = [];
        for (let i = 0; i < this.config.file_type.length; i++) {
          const type = this.config.file_type[i];
          if (this.types[type]) {
            supportArray.push(this.types[type]);
          }
        }
        if (supportArray.length > 0) {
          str = str + ' ' + supportArray.join(',');
        }
        if (this.config.file_type.indexOf('custom') !== -1 && this.config.custom_file_type) {
          const customArray = this.config.custom_file_type.split(',');
          for (let j = 0; j < customArray.length; j++) {
            customArray[j] = `.${customArray[j]}`;
          }
          str = str + (supportArray.length > 0 ? ',' : ' ') + customArray.join(',');
        }
        return str;
      },
      // 是否显示文件支持类型描述
      showSupportType(){
        if (!this.config.limit_file_type) {
          return false;
        } else if (!this.config.file_type || this.config.file_type.length === 0) {
          return false;
        } else if (this.config.file_type.length === 1 && this.config.file_type[0] === 'custom' && !this.config.custom_file_type) {
          return false;
        }
        return true;
      }
    },
    data(){
      return {
        uploadUrl: process.env.httpBaseUri + 'upload/api/file',
        uploadHeaders: {
          spaceUri: process.env.spaceUri,
          Authorization: 'Bearer ' + localStorage.getItem(`cube-${process.env.tenantCode}-access-token`),
        },
        types: {
          'document': '文档类型',
          'picture': '图片类型',
          'audio': '音频类型',
          'video': '视频类型',
          'zip_file': '压缩包类型'
        },
        fileName: ''
      }
    },
    methods: {
      // 文件大小字节转MB
      fileSizeToMB(value){
        return value / 1024 / 1024;
      },
      // 上传文件前
      beforeUpload(file){
        // 如果限制文件大小则验证文件大小
        if (this.config.limit_file_size && this.config.max_file_size) {
          if (this.config.max_file_size < this.fileSizeToMB(file.size)) {
            this.$message.error('超过最大上传文件大小');
            return false;
          }
        }
        // 如果限制文件类型则验证文件类型
        if (this.config.limit_file_type) {
          const fileNameArray = file.name.split('.');
          const fileType = fileNameArray[fileNameArray.length - 1];
          // 配置的自定义文件类型
          const customFileArray = this.config.custom_file_type ? this.config.custom_file_type.split(',') : [];
          // 判断上传的文件类型是否在标准文件类型中或者在自定义文件类型中
          if (this.config.file_real_type.indexOf(fileType) === -1 && customFileArray.indexOf(fileType) === -1) {
            this.$message.error('上传的文件格式不正确');
            return false;
          }
        }
        this.fileName = file.name;
      },
      // 上传成功
      onUploadSuccess(res, file, fileList){
        if (res.returnCode.startsWith('200')) {
          if (res.data && res.data.length > 0) {
            const fileInfo = res.data[0];
            this.config.value.push(Object.assign(file, {url: fileInfo.url}));
            this.$emit('change', this.config.value);
          }
        }
      },
      // 上传失败
      onUploadError(err, file, fileList){
        if (err.status === 401) {
          this.$emit('Unauthorized');
        }
      },
      // 文件超过个数
      onExceed(data){
        this.$message.error('超过最大上传文件数量');
      },
      // 文件被移除时
      onFileRemove(file, fileList){
        this.config.value = fileList || [];
        this.$emit('change', this.config.value);
      },
      // 下载文件
      downloadFile(attach){
        window.open(attach.url);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "./dynamic-upload.scss";
</style>
