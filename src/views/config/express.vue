<template>
  <div class="app-container">
    <el-form :inline="true" :model="listCondition" class="demo-form-inline">
      <el-form-item >
        <el-input v-model="listCondition.keyword" placeholder="请输入要搜索的申请人" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="正在查询中。。。"
            border
            fit
            highlight-current-row
    >


      <el-table-column
              align="center"
              min-width="100"
              label="编号"
              prop="applyId"
      />

      <el-table-column align="center" label="姓名" prop="name"  />

      <el-table-column align="center" label="手机号码" prop="phone" />

      <el-table-column align="center" label="加盟区域" prop="addArea"/>

      <el-table-column align="center" label="留言" prop="note"/>

      <el-table-column align="center" label="申请时间" prop="addTime" >
        <template slot-scope="scope">
          <span>{{
            new Date(Number(scope.row.addTime) * 1000).format()

          }}</span>
        </template>

      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { listJoin } from '@/api/config'

export default {
  name: 'ConfigExpress',
  data() {
    return {
      listLoading:true,
      list:[],
      listCondition: {
        currentPage: 1,
        pageSize: 10,
        keyword:''
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(){
      listJoin(this.listCondition).then(res=>{
        console.log(res)
        this.listLoading =false
        this.list = res.data.data.records
      })
    },
    onSubmit(){
      console.log(123)
      this.init()
    }

  }
}
</script>
