<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
     <el-row>
       <el-col>
         <el-button type="primary" @click="showaddCateDialog">添加分类</el-button>
       </el-col>
     </el-row>
     <zk-table :data="goodsCatesList" :columns="columns" index-text="#" show-index border show-row-hover :selection-type="false" :expand-type="false">
       <template v-slot:isTure="scope">
         <i class="el-icon-success" style="color:green" v-if="!scope.row.cat_deleted"></i>
         <i class="el-icon-error" style="color:red" v-else></i>
       </template>
       <template v-slot:order="scope">
         <el-tag  v-if="scope.row.cat_level === 0">一级</el-tag>
         <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
        <el-tag type="warning" v-else>三级</el-tag>
       </template>
       <template v-slot:opt="scope">
         <el-button type="primary" size="mini" class="el-icon-edit">编辑</el-button>
         <el-button type="danger" size="mini" class="el-icon-delete">删除</el-button>
       </template>
     </zk-table>
      <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[2, 5, 8, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
    </el-card>

    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%" @closed="closeAddCateDialog">
      <el-form ref="addCateFormRef" :model="addCateForm" label-width="80px" :rules="addCateFormRules" >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
            <el-cascader
                v-model="selectKeysList"
                :options="parentCateList"
                :props="selectParentCate"
                @change="changeDefKeyIdList" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsCatesList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [{
        label: '分类数据',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        type: 'template',
        template: 'isTure'
      },
      {
        label: '排序',
        type: 'template',
        template: 'order'
      },
      {
        label: '操作',
        type: 'template',
        template: 'opt'
      }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur'}
        ]
      },
      parentCateList: [],
      selectKeysList: [],
      selectParentCate: {
        expandTrigger: 'hover',
        label: 'cat_name',
        children: 'children',
        value: 'cat_id',
        checkStrictly: true
      },
    }
  },
  created() {
    this.getGoodsCatesList()
  },
  methods: {
    getGoodsCatesList() {
      this.$axios.get('categories',{params: this.queryInfo}).then(res => {
        const { data: content } = res
        if (content.meta.status != 200) return this.$message.error('获取商品分类数据失败')
        this.goodsCatesList = content.data.result
        this.total = content.data.total
      })
    },
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getGoodsCatesList()
    },
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getGoodsCatesList()
    },
    showaddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    getParentCateList() {
      this.$axios.get('categories', {params: { type: 2 }}).then(res => {
        const { data: content } = res
        if (content.meta.status != 200) return this.$message.error('获取父级分类信息失败')
        this.parentCateList = content.data
      })
    },
    changeDefKeyIdList() {
      if (this.selectKeysList.length > 0) {
        this.addCateForm.cat_level = this.selectKeysList.length
        this.addCateForm.cat_pid = this.selectKeysList[this.selectKeysList.length - 1]

      } else {
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }
    },
    addCate() {
      this.$axios.post('categories', this.addCateForm).then(res => {
        const { data: content } = res
        if (content.meta.status != 201 ) return this.$message.error('添加分类失败')
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
        this.addCateDialogVisible = false
        this.getGoodsCatesList()
      })
    },
    closeAddCateDialog() {
      this.$refs.addCateFormRef.resetFields()
      this.selectKeysList = []
    }

  }
}
</script>

<style language="less" scoped>
  .el-row {
    margin-bottom: 15px;
  }
  .el-cascader {
    width: 100%;
  }
</style>
