<template>
  <div class="overall-config-container">
    <div class="block-container">
      <div class="block-title">申请提交量限制</div>
      <div class="block-content">
        <div class="form-check">
          <el-checkbox v-model="info.canApplyLimitTotal">限制提交总量</el-checkbox>
        </div>
        <div class="limit-setting-container" v-if="info.canApplyLimitTotal">
          <el-row>
            <el-col :span="6">
                <div class="circle-warp">
                  <div class="circle-warp-p">
                        <p class="warp-one">
                            {{ info.applyLimitTotal }}
                        </p>
                        <p  class="warp-two">
                          已有0份
                        </p>
                  </div>
                </div>
            </el-col>
             <el-col :span="6">
                   <el-input-number :controls="false" @blur="saveConfig" v-model="info.applyLimitTotal" style="width: 200px;margin-top: 20px;"></el-input-number>
             </el-col>
          </el-row>
        </div>
        <div class="form-check">
          <el-checkbox v-model="info.canApplyLimitMonthly">限制每月提交上限</el-checkbox>
        </div>
        <div class="limit-setting-container" v-if="info.canApplyLimitMonthly">
           <el-row>
            <el-col :span="6">
                <div class="circle-warp">
                  <div class="circle-warp-p">
                        <p class="warp-one">
                            {{ info.applyLimitMonthly }}
                        </p>
                        <p  class="warp-two">
                          已有0份
                        </p>
                  </div>
                </div>
            </el-col>
             <el-col :span="6">
                   <el-input-number :controls="false"  @blur="saveConfig"  v-model="info.applyLimitMonthly" style="width: 200px;margin-top: 20px;"></el-input-number>
             </el-col>
          </el-row>
        </div>
      </div>
      <div class="block-container">
        <div class="block-title">申请人填写表单后显示</div>
        <div class="block-content">
          <el-select @change="onContentTypeChange" v-model="info.applyCallback" style="width: 290px;">
            <el-option label="默认文案" value=1></el-option>
            <el-option label="显示指定内容" value=2></el-option>
            <el-option label="跳转指定链接" value=3></el-option>
          </el-select>
          <el-input @input="onContentTypeChange" v-if="info.applyCallback==2" v-model="info.applyCallbackContent" style="width: 505px;"
                    placeholder="输入指定内容，不超过50字"></el-input>
          <el-input @input="onUrlChange" v-if="info.applyCallback==3" v-model="info.applyCallbackLink" style="width: 505px;"
                    placeholder="输入跳转链接，以http://或https://开头"></el-input>
          <div v-if="info.applyCallback!==1 &&contentError" class="error-container">{{contentError}}</div>
        </div>
      </div>
      <div class="block-container">
        <div class="block-title">应用提醒推送</div>
        <div class="block-content">
          <ul class="set-list">
            <li class="set-list-title">推送方式</li>
            <li>
              <div class="form-check">
                <el-checkbox v-model="info.realTimePush" @change="saveConfig">实时推送</el-checkbox>
                <span class="label-desc">数据有动态时第一时间推送</span>
              </div>
            </li>
            <li>
              <div class="form-check">
                <el-checkbox v-model="info.regularPush" @change="saveConfig">定期推送</el-checkbox>
                <span class="label-desc">数据动态将会定期推送</span>
               </div>
               <div v-if="info.regularPush">
                    <el-checkbox-group  @change="saveConfig" v-model="info.regularPushPeriods">
                      <el-checkbox label="1">早晨9点</el-checkbox>
                      <el-checkbox label="2">下午1点</el-checkbox>
                      <el-checkbox label="3">下午5点</el-checkbox>
                    </el-checkbox-group>
               </div>
            </li>
          </ul>
          <ul class="set-list">
            <li class="set-list-title">推送</li>
            <li>
              <div class="form-check">
                <el-checkbox @change="saveConfig" v-model="info.pushTypes.ccData">抄送的数据</el-checkbox>
              </div>
            </li>
            <li>
              <div class="form-check">
                <el-checkbox @change="saveConfig" v-model="info.pushTypes.dealData">待处理数据</el-checkbox>
              </div>
            </li>
            <li>
              <div class="form-check">
                <el-checkbox @change="saveConfig" v-model="info.pushTypes.applyResult">申请结果</el-checkbox>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import services from '../../service/back.service';
  export default{
    name: 'OverallConfig',
    data(){
      return {
        contentError: '',
        info:{
           appId: '',
           canApplyLimitTotal : false,
           canApplyLimitMonthly:false,
           applyCallback:'1',
           applyCallbackContent:'',
           applyCallbackLink:'',
           canApplyTotal:'',
           applyLimitMonthly:0,
           applyLimitTotal:0,
           id:'',
           pushTypes:{
             ccData:false,
             applyResult:false,
             dealData:false
           },
           realTimePush:false,
           regularPush:false,
           regularPushPeriods:[]
          }
      }
    },
    created(){
      this.info.appId = this.$route.params.appId;
      this.getSetting();
    },
    methods: {
      onCustomContentChange(data){
        if (data.length > 50) {
          this.contentError = '指定内容不得超过50个字';
        }
      },
      onUrlChange(data){
        const reg = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!data || !reg.test(data)) {
          this.contentError = '跳转链接必须以http://或https:// 开头';
        }
      },
      // 填写表单后显示内容类型变更
      onContentTypeChange(data){

      },
      async  saveConfig(){
        const res = await services.putSetting(this.info);
        if (res.returnCode.startsWith('200')) {
        }
      },
      async  getSetting(){
        const res = await services.getSetting(this.info.appId);
        if (res.returnCode.startsWith('200')) {
          this.info = res.data;
        }
      }
    },
  }
</script>

<style scoped lang="scss">
  @import './overall-config.scss';
  .circle-warp{
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-color: #f5f5f7;
    position: relative;
     .circle-warp-p{
       width: 104px;
       height: 104px;
       position: absolute;
       top: 8px;
       left: 8px;
       border-radius: 50%;
       background-color: #ffffff;
       p{
         padding: 0;
         margin: 0;
         text-align: center;
         white-space: nowrap;
         text-overflow:ellipsis;
         overflow:hidden;
       }
       .warp-one{
         margin-top: 26px;
         font-size: 22px;
         font-weight: 400;
       }
       .warp-two{
         margin-top: 6px;
       }
     }
  }
</style>
