<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border striped>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row v-for="(item,i) in scope.row.children" :key="item.id"
             :class="['bgbot',i == 0 ? 'bgtop' : '','vcenter']">
              <el-col :span="5">
                <el-tag closable @close="removeRightByID(scope.row,item.id)"> {{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19" >
                <el-row v-for="(item1, i1) in item.children" :key="item1.id" :class="[i1 == item.children.length -1 ? '' : 'bgbot','vcenter']" >
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightByID(scope.row,item1.id)" >{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                     <el-tag type="warning" v-for="(item2, i2) in item1.children" :key="item2.id" closable @close="removeRightByID(scope.row,item2.id)">{{item2.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名字"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" style="width: 200px">
          <template v-slot="scope"  >
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-删除">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="setShowRightsDialog(scope.row,defKey)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="分配权限"
      :visible.sync="addRightDialogVisible"
      width="50%" @close="setRightsDialogClose">
      <el-tree :data="rightsList" :props="treeProps" ref="rightsRef" node-key="id" default-expand-all show-checkbox  :default-checked-keys="defKey"></el-tree>
      <span slot="footer" class="dialog-footer" >
        <el-button @click="addRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
   data() {
     return {
       rolesList: [],
       rightsList: [],
       addRightDialogVisible: false,
       treeProps: {
         label: 'authName',
         children: 'children'
       },
       defKey: [],
       roleId: '',
       
     }
   },
   created() {
     this.getRolesList()
   },
   methods: {
     getRolesList() {
       this.$axios.get('roles').then(res => {
        const { data: content } = res
        if (content.meta.status != 200) return this.$message.error('获取角色权限列表信息失败')
        this.rolesList = content.data
       })
     },
     removeRightByID(role,rightId) {
        this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                 confirmButtonText: '确定',
                 cancelButtonText: '取消',
                 type: 'warning'
         }).then(success => {
          this.$axios.delete(`roles/${role.id}/rights/${rightId}`).then(res => {
            const { data: content} = res
            if (content.meta.status != 200) return this.$message.info('删除操作失败')
            role.children = content.data
          })
          }).catch(err => {
            this.$message.error('已取消删除操作')
          })
     },
     setShowRightsDialog(node,arr) {
       this.$axios.get('rights/tree').then(res => {
         const { data: content } = res
         if (content.meta.status != 200) return this.$message('获取权限列表失败')
         this.getToSetDefKey(node,arr)
         this.roleId = node.id
         this.rightsList = content.data
         this.addRightDialogVisible = true
       })
     },
     getToSetDefKey(node,arr) {
       if (!node.children) return arr.push(node.id)
       node.children.forEach(item => {
           this.getToSetDefKey(item,arr)
       })
     },
     setRightsDialogClose() {
       this.defKey = []
     },
     allotRight() {
       const checkRights = [
         ...this.$refs.rightsRef.getHalfCheckedKeys(),
         ...this.$refs.rightsRef.getCheckedKeys()
       ]
       const editRightId = checkRights.join(',')
      this.$axios.post(`roles/${this.roleId}/rights`, {rids: editRightId }).then(res => {
        console.log(res)
        const { data: content } = res
        if (content.meta.status != 200) return this.$message.error('获取信息错误')
        this.$message.success('更新成功')
        this.addRightDialogVisible = false
        this.getRolesList()
      })
     },
   }
}
</script>

<style language="less" scoped>
.el-tag {
  margin: 5px;
}
.bgbot {
  border-bottom: 1px solid rgba(0,0,0,.1);
}
.bgtop {
  border-top: 1px solid rgba(0,0,0,.1);
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
