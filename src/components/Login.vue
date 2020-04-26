<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avator_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <div class="form_box">
        <el-form label-width="0px" :model="FormData" :rules="LoginRules" ref="LoginFormRef">
          <el-form-item prop="username">
            <el-input prefix-icon="el-icon-user-solid" v-model="FormData.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input prefix-icon="el-icon-lock" v-model="FormData.password" show-password></el-input>
          </el-form-item>
          <el-form-item class='btn'>
            <el-button type="primary" @click="submit">登录</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      let checkUserName = (rule, value, callback) => {
        if (value.length == 0) {
          return callback(new Error('请输入用户名'))
        }
        if (value.length > 15 || value.length < 2) {
          return callback(new Error('输入的用户名的长度要在2-15之间'))
        }
        callback()
      }
      let checkPassword = (rule, value, callback) => {
        if (value.length == 0) {
          return callback(new Error('请输入密码噢'))
        }
        if (value.length < 2 || value.length > 15) {
          return callback(new Error('输入的密码的长度要在2-15之间'))
        }
        callback()
      }
      return {
        FormData: {
          username: 'admin',
          password: '123456'
        },
        LoginRules: {
          username: [{
            validator: checkUserName,
            trigger: 'blur'
          }, ],
          password: [{
            validator: checkPassword,
            trigger: 'blur'
          }, ]
        }
      }
    },
    methods: {
      submit() {
        this.$refs.LoginFormRef.validate((valid) => {
          if (valid) {
            this.$axios.get('login?username=' + this.FormData.username + '&password=' + this.FormData.password).then(res => {
              const {data : content} = res //es6 解构练习
              if (content.meta.status != 200) return  this.$message.error('登录失败')
              this.$message.success(content.meta.msg)
              window.sessionStorage.setItem('token',content.data.token)
              this.$router.push('/home')
            })
          } else {
            alert('error submit!!')
          }
        })
      },
      resetForm(formName) {
        this.$refs.LoginFormRef.resetFields()

      }

    },
  }
</script>

<style language="less" scoped>
  .login_container {
    height: 100%;
    background-color: #2b4b6b;
    padding: 1px;
    ;
  }

  .login_box {
    height: 300px;
    width: 450px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 5px;
    transform: translate(-50%, -50%);
  }

  .avator_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    overflow: hidden;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);

    img {
      display: block;
      width: 100%;
      height: auto;
      border-radius: 50%;
      border: 1px solid #001E00;
      background-color: #EEEEEE;

      :after {
        content: '';
        clear: both;
      }
    }
  }

  .form_box {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;

    .btn {
      display: flex;
      justify-content: flex-end;
      padding-bottom: 5px;
    }
  }
</style>
