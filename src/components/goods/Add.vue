<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert center title="添加商品" show-icon :closable="false">

      </el-alert>
    <el-steps :span="200" align-center :active="activeIndex - 0" finish-status="success" >
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
      <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="getCateParam">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price" ></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight" >
            <el-input v-model="addForm.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateListProp"
                @change="handleChange"></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1" >
          <el-form-item :label="item.attr_name" v-for="item in manyParamsList" :key="item.attr_id">
            <el-checkbox-group
                v-model="item.attr_vals" @change="attrValsChange">
                <el-checkbox border v-for="(item1,i) in item.attr_vals" :label="item1" :key="i">{{item1}}</el-checkbox>
              </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="item in onlyParamsList" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            :action="upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture" :headers="headerObj" :on-success="handleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor v-model="addForm.goods_introduce"></quill-editor>
          <div><el-button type="primary" @click="addFormData">添加商品</el-button></div>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="图片预览"
      :visible.sync="picturePreviewDialogVisible"
      width="30%">
      <img :src="pictureUrl" alt="" style="width:100%">
    </el-dialog>
  </div>

</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称' , trigger: 'blur'}
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur'}
        ],
        goods_number: [
          {required: true, message: '请输入商品数量', trigger: 'blur'}
        ],
        goods_weight: [
           {required: true, message: '请输入商品重量', trigger: 'blur'}
        ]
      },
      cateList: [],
      cateListProp: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manyParamsList: [],
      onlyParamsList: [],
      upload: 'http://timemeetyou.com:8889/api/private/v1/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      pictureUrl: '',
      picturePreviewDialogVisible: false
    }
  },
  created() {
    this.getCate()
  },
  methods: {
    getCate() {
      this.$axios.get('categories').then(res => {
        const { data: content } = res
        if (content.meta.status != 200) return
        this.cateList = content.data
      })
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        return
      }
    },
    beforeTabLeave(activeName,oldActiveName) {
      if (activeName == 1 && this.addForm.goods_cat.length != 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    getCateParam() {
      if (this.activeIndex == '1') {
          this.$axios.get(`categories/${this.cateId}/attributes`, {params: {sel: 'many'}}).then(res => {
            const { data: content } = res
            if (content.meta.status != 200) return this.$message.error('获取分类动态参数失败')
            content.data.forEach(item =>　{
              item.attr_vals = item.attr_vals ?　item.attr_vals.split(',')　: []
            })
            console.log(content.data)
            this.manyParamsList = content.data
            })
      }else if (this.activeIndex == '2') {
          this.$axios.get(`categories/${this.cateId}/attributes`,{params: {sel: 'only'}}).then(res => {
            const { data: content} = res
            if (content.meta.status != 200) return this.$message.error('获取静态属性失败')
            this.onlyParamsList = content.data
            console.log(this.onlyParamsList)
          }
          )
      }
      },
    attrValsChange() {
      console.log(this.manyParamsList[2].attr_vals)
    },
    handlePreview(file) {
      this.pictureUrl = file.response.data.url
      this.picturePreviewDialogVisible = true
    },
    handleSuccess(response) {
      this.addForm.pics.push({ pic: response.data.tmp_path})
      console.log(this.addForm)
    },
    handleRemove(file) {
      console.log(file)
      const index = this.addForm.pics.findIndex(x => x.pic === file.response.data.tmp_path)
      this.addForm.pics.splice(index,1)
      console.log(this.addForm)
    },
    addFormData() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return this.$message.error('请填写齐全所有表单信息')
        const form =_.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        this.onlyParamsList.forEach(item => {
          this.addForm.attrs.push({attr_id: item.attr_id, attr_vals: item.attr_vals})
        })
        this.manyParamsList.forEach(item => {
          this.addForm.attrs.push({attr_id: item.attr_id, attr_vals: item.attr_vals.join(',')})
        })
        form.attrs = this.addForm.attrs
        console.log(form.pics)
        // this.$axios.post('goods',form).then(res => {
        //   console.log(res)
        // })
      })
      }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length == 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style language="less" scoped>
.el-checkbox {
  margin: 0 0 0 10px;
}
.el-alert--info.is-light {
  margin-bottom: 15px;
}
.el-button {
  margin: 15px;
}
</style>
