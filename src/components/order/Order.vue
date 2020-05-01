<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
     <el-row>
       <el-col :span="8">
        <el-input placeholder="请输入内容" >
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
       </el-col>
     </el-row>
     <el-table :data="ordsList" border stripe>
       <el-table-column type="index" label="#"></el-table-column>
       <el-table-column prop="order_number" label="订单编号"></el-table-column>
       <el-table-column prop="order_price" label="订单价格"></el-table-column>
       <el-table-column  label="是否付款">
         <template v-slot="scope">
           <el-tag type="danger" v-if="scope.row.pay_status === '0'">否</el-tag>
           <el-tag type="success" v-else>是</el-tag>
         </template>
       </el-table-column>
       <el-table-column prop="is_send" label="是否发货"></el-table-column>
       <el-table-column label="下单时间">
          <template v-slot="scope">
            {{scope.row.update_time | datefmt}}
          </template>
       </el-table-column>
       <el-table-column label="操作">
         <template v-slot="scope">
           <el-button icon="el-icon-edit" type="primary" size="min" @click="addAddressDialog"></el-button>
            <el-button icon="el-icon-location" type="success" size="min" @click="addLogisticsDialog"></el-button>
         </template>
       </el-table-column>
     </el-table>
     <el-pagination
           @size-change="handleSizeChange"
           @current-change="handleCurrentChange"
           :current-page="queryInfo.pagenum"
           :page-sizes="[5,10,20]"
           :page-size="queryInfo.pagesize"
           layout="total, sizes, prev, pager, next, jumper"
           :total="total" background>
         </el-pagination>

    </el-card>
    <el-dialog
      title="修改地址"
      :visible.sync="addressDialogVisible"
      width="50%"  @closed="clearFrom"
      >
      <el-form :rules="addressFormRules" ref="addressFormRef" label-width="100px" :model="addressForm" >
        <el-form-item prop="address1" label="所在省市/区">
         <div class="block">
           <el-cascader
             v-model="cityList"
             :options="cityData"
             :props="{ expandTrigger: 'hover' }"
             @change="handleChange"></el-cascader>
         </div>
        </el-form-item>
        <el-form-item prop="address2" label="新地址">
          <el-input v-model="addressForm.address2" prop="address2" label="详细地址">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="查看物流"
      :visible.sync="logisticsDialogVisible"
      width="30%">
      <el-timeline >
          <el-timeline-item
            v-for="(activity, index) in wuliuInfoList"
            :key="index"
            :timestamp="activity.timestamp">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="logisticsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="logisticsDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '../../plugins/citydata.js'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagesize: 10,
        pagenum: 1
      },
      ordsList: [],
      total: 0,
      addressDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1 : [
          { required: true, message: '请选择省市区' , trigger: 'blur' },
        ],
        address2 : [
          { required: true, message: '请填写地址' , trigger: 'blur' },
        ]
      },
      cityData,
      cityList: [],
      logisticsDialogVisible: false,
      wuliuInfoList: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    getOrderList() {
      this.$axios.get('orders',{ params: this.queryInfo}).then(res => {
        const { data: content } = res
        if (content.meta.status != 200 ) return this.$message.error('获取订单数据失败')
        this.ordsList = content.data.goods
        this.total = content.data.total
      })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getOrderList()
    },
    addAddressDialog() {
      this.addressDialogVisible = true
    },
    handleChange() {
      if (this.cityList.length < 2) this.cityList = []
    },
    clearFrom() {
      this.$refs.addressFormRef.resetFields()
      this.cityList = []
    },
    addLogisticsDialog() {
      this.logisticsDialogVisible = true
      this.$axios.get('/kuaidi/1106975712662').then(res => {
        console.log(res)
        const { data: content } = res
        if (content.meta.status != 200) return this.$message.error('获取物流信息失败')
        this.wuliuInfoList = content.data
      })
    }
  }
}
</script>

<style language="less" scoped>

</style>
