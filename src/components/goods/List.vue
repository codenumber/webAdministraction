<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="15">
        <el-col :span="7" >
          <el-input placeholder="请输入内容" v-model='queryInfo.query' clearable @clear="getGoodsList">
              <el-button slot="append" icon="el-icon-search" @click="handleCurrentChange(1)"></el-button>
            </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="goAddGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe>
         <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="85px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="95px"></el-table-column>
        <el-table-column  label="创建时间" width="150px">
          <template v-slot="scope">
            {{scope.row.add_time | datefmt}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template v-slot="scope">
            <el-button icon="el-icon-edit" type="primary" size="mini"></el-button>
            <el-button icon="el-icon-delete" type="danger" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagesize: 10,
        pagenum: 1
      },
      total: 0,
      goodsList: []
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    getGoodsList() {
      this.$axios.get('goods', { params: this.queryInfo}).then(res => {
        const { data: content } = res
        if (content.meta.status != 200) return this.$message.error('获取商品列表失败')
        this.goodsList = content.data.goods
        this.total = content.data.total
      })
    },
    handleSizeChange(pageSize) {
      this.queryInfo.pagesize = pageSize
      this.getGoodsList()
    },
    handleCurrentChange(pageNum) {
      this.queryInfo.pagenum = pageNum
      this.getGoodsList()
    },
    removeById(id) {
      this.$confirm('此操作将永久删除该商品信息, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
       }).then(confirm => {
           this.$axios.delete(`goods/${id}`).then(res => {
             const { data: content } = res
             console.log(res)
             if (content.meta.status != 200) return this.$message.error('删除商品信息失败')
             this.getGoodsList()
             this.$message.success('删除商品信息成功')
            })
      }).catch(err => {
       this.$message.info('已取消删除该商品信息')
      })
    },
    goAddGoods() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style language="less" scoped>

</style>
