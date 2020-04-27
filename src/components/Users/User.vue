<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
       <el-row :gutter="20">
         <el-col :span="8">
         <el-input placeholder="请输入内容"  class="input-with-select" v-model="queryInfo.query"  clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
         </el-input>
         </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
       </el-row>
       <el-table :data="userList"  style="width:100%" stripe border>
         <el-table-column type="index" label="#"></el-table-column>
         <el-table-column prop="username" label="姓名"></el-table-column>
         <el-table-column prop="email" label="邮箱"></el-table-column>
         <el-table-column prop="mobile" label="电话"></el-table-column>
         <el-table-column prop="role_name" label="角色"></el-table-column>
         <el-table-column prop="" label="状态">
           <template v-slot="scope">
             <el-switch
               v-model="scope.row.mg_state"
               active-color="#13ce66"
               inactive-color="#ff4949" @change="saveStateMsg(scope.row)">
             </el-switch>
           </template>
         </el-table-column>
         <el-table-column prop="" label="操作">
           <template v-slot="scope">
             <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
             <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUserInfo(scope.row.id)"></el-button>
            <el-tooltip  effect="dark" content="角色操作" placement="top" :enterable="false">
             <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
             </el-tooltip>
           </template>
         </el-table-column>
       </el-table>
       <el-pagination
             @size-change="handleSizeChange"
             @current-change="handleCurrentChange"
             :current-page="queryInfo.pagenum"
             :page-sizes="[1, 2, 5, 10]"
             :page-size="queryInfo.pagesize"
             layout="total, sizes, prev, pager, next, jumper"
             :total="total">
           </el-pagination>
    </el-card>
    <el-dialog
      title="添加用户信息"
      :visible.sync="addDialogVisible"
      width="50%" @close="addDialogVisibleClose"
      >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
       </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改用户信息"
      :visible.sync="addEditDialogVisible"
      width="50%" @close="closeEditForm">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px" >
        <el-form-item label="姓名" >
          <el-input  v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input  v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="mobile">
          <el-input  v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%" @close="closeEdiltRoleDialog">
      <p>当前的用户：{{userInfo.username}}</p>
      <p>当前的角色：{{userInfo.role_name}} <span v-show="userInfo.id == 500">*admin用户系统不予删除</span></p>
      <p>分配新角色：<el-select v-model="roleId" placeholder="请选择">
      <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select></p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditRoleById">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, cb) => {
      const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (emailReg.test(value)) return cb()
      cb(new Error('请输入正确格式的邮箱'))
    }
    var checkMobile = (rule, value, cb) => {
      const mobileReg = /^1[3456789]\d{9}$/
      if (mobileReg.test(value)) return cb()
      cb(new Error('请输入正确格式的手机号码'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      userInfo: {},
      rolesList: [],
      setRoleDialogVisible: false,
      roleId: '',
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      addFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 10, message: '请输入2-10个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur'},
            { min: 8, max: 15, message: '请输入8-15位的密码', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入电话', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ]
        },
        editForm: {},
        addEditDialogVisible: false,
        editFormRules: {
          email: [
             { required: true, message: '请输入邮箱', trigger: 'blur'},
             { validator: checkEmail, trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            { validator: checkMobile, trigger: 'blur'}
          ]
        }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.$axios.get('users', { params: this.queryInfo }).then(res => {
        const { data: content} = res
        if (content.meta.status != 200 ) return this.$message.error('获取用户列表信息失败')
        this.userList = content.data.users
        this.total = content.data.total
      })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getUserList()
    },
    saveStateMsg(data) {
      this.$axios.put(`users/${data.id}/state/${data.mg_state}`).then(res => {
        const { data: content} = res
        if (content.meta.status != 200 ){
          data.msg_state = !data.msg_state
          return this.$message.error('更新用户状态信息失败')
        }
        this.$message.success('更新成功')
      })
    },
    addDialogVisibleClose() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        this.$axios.post('users', this.addForm).then(res => {
          if (res.data.meta.status != 201 ) return this.$message.error('添加数据失败')
          this.addDialogVisible = false
          this.getUserList()
        })
      })
    },
    showEditDialog(userId) {
      this.$axios.get('users/' + userId).then(res => {
        const { data: content } = res
        if (content.meta.status != 200) return this.$message.error('获取修改的用户信息失败')
        this.editForm = content.data
        this.addEditDialogVisible = true
      })
    },
    closeEditForm() {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        this.$axios.put('users/' + this.editForm.id , { email: this.editForm.email, mobile: this.editForm.mobile}).then(res => {
          const { data: content } = res
          if (content.meta.status != 200) return this.$message.error('修改数据失败')
          this.getUserList()
          this.addEditDialogVisible = false
        })
      })
    },
    delUserInfo(userId) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
      }).then(success => {
        this.$axios.delete('users/' + userId).then(res => {
          const { data: content } = res
          if (content.meta.status != 200) return this.$message.error('删除用户信息失败')
          this.$message.success('删除成功')
          this.getUserList()
        })

      }).catch(err =>{
         this.$message.info('已取消删除操作')
      })
    },
    setRole(user) {
      this.userInfo = user
      this.$axios.get('roles').then(res => {
        const { data: content } = res
        if (content.meta.status != 200) return this.$message.error('获取角色信息失败')
        this.rolesList = content.data

      })
      this.setRoleDialogVisible = true
    },
    saveEditRoleById() {
      console.log(this.userInfo)
      this.$axios.put(`users/${this.userInfo.id}/role`,{ rid: this.roleId}).then(res => {console.log(res)
        const { data: content } = res
        if (content.meta.status != 200) return this.$message.error('修改角色信息失败')
        this.$message.success('修改用户角色成功')
        this.getUserList()
        this.setRoleDialogVisible = false
      })
    },
    closeEdiltRoleDialog() {
      this.userInfo = {}
      this.roleId = ''
    }
  }
}
</script>

<style language="less" scoped>
.el-dialog {
  span {
    color: #BD2130;
  }
}
</style>
