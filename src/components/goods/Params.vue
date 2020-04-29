<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>参数管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert  type="warning" title="只有三级分类才可以添加属性" :closable="false" show-icon></el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
              v-model="selectKeysList"
              :options="cateList"
              :props="cateProp"
              @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
       <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="动态参数" name="many" >
            <el-button type="primary" size="mini" @click="showAddParamsFormDialog" :disabled="isBtnDisable">添加属性</el-button>
            <el-table border stripe :data="manyParamsDataList" >
              <el-table-column type="expand">
                <template v-slot="scope">
                  <el-tag type="primary" v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="removeAttrVal(scope.row,i)">
                    {{item}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column prop="attr_name" label="属性名字">
              </el-table-column>
              <el-table-column label="操作">
                <template v-slot="scope">
                  <el-button icon="el-icon-edit" type="warning" size="mini" @click="showEditParamsDialog(scope.row.attr_id)">编辑</el-button>
                  <el-button icon="el-icon-delete" type="danger" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                </template>

              </el-table-column>
              <!-- <template v-slot="scope">
                {{scope.row}}
              </template> -->
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only" >
            <el-button type="primary" size="mini"  @click="showAddParamsFormDialog" :disabled="isBtnDisable">添加属性</el-button>
            <el-table border stripe :data="onlyParamsDataList">
              <el-table-column type="expand">
                <template v-slot="scope">
                  <el-tag type="primary" v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="removeAttrVal(scope.row,i)">
                    {{item}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column prop="attr_name" label="属性名字">
              </el-table-column>
              <el-table-column label="操作">
                <template v-slot="scope">
                  <el-button icon="el-icon-edit" type="warning" size="mini" @click="showEditParamsDialog(scope.row.attr_id)">编辑</el-button>
                  <el-button icon="el-icon-delete" type="danger" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
             </el-table>
          </el-tab-pane>

        </el-tabs>
    </el-card>
    <el-dialog
      :title="activeName === 'many' ? '添加动态参数' : '添加静态参数' "
      :visible.sync="addParamsFormDialogVisible"
      width="50%" @closed="closeParamsFormDialog">
      <el-form ref="addParamsFormRef" label-width="80px" :model="addParamsForm" :rules="addParamsFormRules">
        <el-form-item :label="activeName === 'many' ? '动态参数' : '静态参数'"  prop="attr_name">
          <el-input v-model="addParamsForm.attr_name" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsFormDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendParamsForm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="activeName === 'many' ? '修改动态参数' : '修改静态参数' "
      :visible.sync="editParamsFormDialogVisible"
      width="50%" @closed="closeEditParamsFormDialog">
      <el-form ref="editParamsFormRef" label-width="80px" :model="editParamsForm" :rules="editParamsFormRules">
        <el-form-item :label="activeName === 'many' ? '动态参数' : '静态参数'"  prop="attr_name">
          <el-input v-model="editParamsForm.attr_name" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsFormDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendEditParamsForm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      selectKeysList: [],
      cateProp: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      activeName: 'many',
      onlyParamsDataList: [],
      manyParamsDataList: [],
      addParamsFormDialogVisible: false,
      addParamsForm: {
        attr_name: '',
      },
      addParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入参数' , trigger:'blur'}
        ]
      },
      editParamsForm: {
        attr_name: ''
      },
      editParamsFormDialogVisible: false,
      editParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入参数' , trigger:'blur'}
        ]
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    getCateList() {
      this.$axios.get('categories').then(res => {
        const { data: content } = res
        if (content.meta.status != 200) return this.$message.error('获取分类数据失败')
        this.cateList = content.data
        console.log(this.cateList)
      })
    },
    handleChange() {
      if (this.selectKeysList.length < 3) {
        this.selectKeysList = []
        this.onlyParamsDataList = []
        this.manyParamsDataList = []
        return
      }
      this.getCateParamsData()
    },
    handleTabClick() {
      if (this.selectKeysList.length == 0) return
      this.getCateParamsData()

    },
    getCateParamsData() {
      this.$axios.get(`categories/${this.cateId}/attributes`,{params: {sel: this.activeName}}).then(res => {
        const { data: content } = res
        if (content.meta.status != 200) return this.$message.error('获取属性数据错误')
        content.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        if (this.activeName == 'only') {
          this.onlyParamsDataList = content.data
        } else {
          this.manyParamsDataList = content.data
        }
      })
    },
    showAddParamsFormDialog() {
      this.addParamsFormDialogVisible = true
      console.log(this.activeName)
    },
    closeParamsFormDialog() {
      this.$refs.addParamsFormRef.resetFields()
    },
    sendParamsForm() {
      console.log(this.activeName)
      this.$refs.addParamsFormRef.validate(valid => {
        if (!valid) return
        this.$axios.post(`categories/${this.cateId}/attributes`, { attr_name: this.addParamsForm.attr_name, attr_sel: this.activeName}).then(res => {
          const { data: content } = res
          if (content.meta.status != 201) return this.$message.error('添加参数失败')
          this.getCateParamsData()
          this.addParamsFormDialogVisible = false
         })
      })
    },
    closeEditParamsFormDialog() {
      this.$refs.editParamsFormRef.resetFields()
    },
    showEditParamsDialog(attrId) {
      this.$axios.get(`categories/${this.cateId}/attributes/${attrId}`, { params: {attr_sel : this.activeName}}).then(res => {
        const { data: content } = res
        if (content.meta.status != 200) return
        this.editParamsForm = content.data
        this.editParamsFormDialogVisible = true
      })
    },
    sendEditParamsForm() {
      this.$refs.editParamsFormRef.validate(valid => {
        if (!valid) return
        this.$axios.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,{attr_name: this.editParamsForm.attr_name , attr_sel: this.activeName})
        .then(res => {
          const { data: content } = res
          if ( content.meta.status != 200 ) return this.$message.error('修改参数失败')
          this.$message.success('修改参数成功')
          this.getCateParamsData()
          this.editParamsFormDialogVisible = false
        })
      })
    },
    removeParams(attrId) {
      this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                }).then(confirm => {
                  this.$axios.delete(`categories/${this.cateId}/attributes/${attrId}`).then(res => {
                    const { data: content } = res
                    if ( content.meta.status != 200) return this.$message.error('删除参数失败')
                    this.$message.success('删除该属性成功')
                    this.getCateParamsData()
                    })
                }).catch(err => {
                  this.$message.info('已取消删除该属性')
                })
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length == 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.setAttrVal(row)
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ =>　{
        this.$refs.saveTagInput.$refs.input.focus();
      })
    },
    setAttrVal(row) {
      this.$axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
      { attr_name: row.attr_name , attr_sel: this.activeName , attr_vals: row.attr_vals.join(',')}).then(res => {
        const { data: content } = res
        if (content.meta.status != 200 ) return this.$message.error('处理参数项失败')
        this.$message.success(' 处理参数项成功')
      })
    },
    removeAttrVal(row,i) {
      row.attr_vals.splice(i,1)
      this.setAttrVal(row)
    }
  },
  computed: {
    isBtnDisable() {
      return this.selectKeysList.length !== 3
    },
    cateId() {
      return this.selectKeysList.length === 3 ? this.selectKeysList[2] : null
    }
   }
}
</script>

<style language="less" scoped>
  .el-row {
    margin: 15px 0;
  }
  .el-tag {
    margin: 10px;
  }
  .input-new-tag {
    width: 150px;
  }
</style>
