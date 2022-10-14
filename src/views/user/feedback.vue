<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">

        <el-form-item >
          <el-input v-model="listQuery.username" placeholder="请输入搜索内容"></el-input>
        </el-form-item>




        <el-form-item  label="搜索类型">
          <el-select v-model="listQuery.region" placeholder="请选择要导出记录">
            <el-option label="订单ID" value="shanghai"></el-option>
            <el-option label="流水号" value="beijing"></el-option>
            <el-option label="用户ID" value="shanghai"></el-option>
            <el-option label="用户昵称" value="shanghai"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item  label="记录类型">
          <el-select v-model="listQuery.region" placeholder="请选择要导出记录">
            <el-option label="全部" value="1"></el-option>
            <el-option label="充值" value="2"></el-option>
            <el-option label="退款退还" value="3"></el-option>
            <el-option label="退款" value="4"></el-option>
          </el-select>
        </el-form-item>



        <el-form-item>
          <el-button type="primary" @click="handleFilter">筛选</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" label="反馈ID" prop="id"/>

      <el-table-column align="center" label="用户名" prop="username"/>

      <el-table-column align="center" label="手机号码" prop="mobile"/>

      <el-table-column align="center" label="反馈类型" prop="feedType"/>

      <el-table-column align="center" label="反馈内容" prop="content"/>

      <el-table-column align="center" label="反馈图片" prop="picUrls">
        <template slot-scope="scope">
          <el-image v-for="item in scope.row.picUrls" :key="item" :src="item" :preview-src-list="scope.row.picUrls" :lazy="true" style="width: 40px; height: 40px; margin-right: 5px;"/>
        </template>
      </el-table-column>

      <el-table-column align="center" label="时间" prop="addTime"/>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { listFeedback } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Feedback',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        username: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listFeedback(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['反馈ID', '用户名称', '反馈内容', '反馈图片列表', '反馈时间']
        const filterVal = ['id', 'username', 'content', 'picUrls', 'addTime']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '意见反馈信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
