<template>
  <div class="login-container">
    <div class="login-modal">
      <div class="form-container">
        <div class="hint">登录</div>
        <div class="form-group">
          <el-input
            placeholder="邮箱"
            prefix-icon="fa fa-envelope-o"
            v-model="username">
          </el-input>
        </div>
        <div class="form-group">
          <el-input
            type="password"
            placeholder="密码"
            prefix-icon="fa fa-key"
            v-model="password">
          </el-input>
        </div>
        <el-button @click="login" type="primary" style="width: 100%;">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {login} from '@cube-vue-pc/prod-http'
  export default{
    name: 'Login',
    data(){
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      async login () {
        if (!this.username) {
          this.$message.error('请输入邮箱');
          return;
        }
        if (!this.password) {
          this.$message.error('请输入密码');
          return;
        }
        const {status, data} = await login({
          username: this.username,
          password: this.password,
          rememberMe: true,
          graphCaptchaCodeId: '123',
          graphCaptchaCode: ''
        })
        if (status === 1) {
          if (data.groupDetails) {
            localStorage.setItem(`cube-${process.env.tenantCode}-group-info`, JSON.stringify(data.groupDetails));
          }
          this.$router.replace({name: 'app-list'})
        } else {
          this.$message.error(data);
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  .login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background: linear-gradient(90deg, #798088, #3b4451);
    overflow: auto;
    .login-modal {
      position: relative;
      width: 390px;
      height: 550px;
      border-radius: 4px;
      padding-top: 190px;
      box-shadow: 0 30px 40px rgba(0, 0, 0, .4);
      background-color: #fff;
      background-image: url('./assets/images/login.png');
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: 0 0;
      box-sizing: border-box;
      .form-container {
        padding: 0 20px 0 20px;
        .hint {
          color: #293341;
          font-size: 15px;
          text-align: center;
          margin-bottom: 18px;
        }
        .form-group {
          position: relative;
          margin-bottom: 15px;
        }
      }
    }
    @media screen and(max-width: 768px) {
      .login-modal {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
