<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width:900px;height: 500px;"></div>
    </el-card>
  </div>
</template>

<script>
 import echarts from 'echarts'
 import _ from 'lodash'

 export default {
   data() {
     return {
        reportData: {},
        options: {
                title: {
                  text: '用户来源'
                },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'cross',
                    label: {
                      backgroundColor: '#E9EEF3'
                    }
                  }
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: [
                  {
                    boundaryGap: false
                  }
                ],
                yAxis: [
                  {
                    type: 'value'
                  }
                ]
              }
     }
   },
   mounted() {
      this.$axios.get('reports/type/1').then(res => {
        console.log(res)
        const { data: content} = res
        if (content.meta.status != 200 ) return
        this.reportData = content.data
        var myCharts = echarts.init(document.getElementById('main'))
        const result = _.merge(content.data,this.options)
        myCharts.setOption(result)
      })
   },
   methods: {

   },
   created() {
     this.getReportData()

   }
 }
</script>

<style>
</style>
