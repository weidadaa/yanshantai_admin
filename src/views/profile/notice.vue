<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
     <p>温馨提示：</p>
      <p> 1、隐身券 - 不在前台展示，用户无法领取或通过购物获赠，需要由商家手动发券，赠送券无法设置为隐身券。</p>
    </div>
<div>
  <el-button type="danger" size="mini" @click="addCoupon">新建优惠卷</el-button>
</div>
    <el-tabs v-model="activeName" @tab-click="handleFilter">
      <el-tab-pane label="所有优惠卷" name="all" />
      <el-tab-pane label="未开始" name="noStarted" />
      <el-tab-pane label="进行中" name="haveHand" />
      <el-tab-pane label="已结束" name="Finished" />
    </el-tabs>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" fit highlight-current-row  border @selection-change="handleSelectionChange">
      <el-table-column align="center" label="券名称" prop="name" />

      <el-table-column align="center" label="限制门店" prop="isAllProduct">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.isAllProduct === 0 ? '全店通用' : '指定商品使用' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="有效时间"  >
        <template slot-scope="scope">
          {{ new Date(Number(scope.row.startTime) * 1000).format()}}<br>至{{ new Date(Number(scope.row.endTime) * 1000).format()}}
        </template>

<!--          <el-tag :type="scope.row.readTime ? 'success' : 'error' ">{{ scope.row.readTime ? '已读' : '未读' }}</el-tag>-->
      </el-table-column>

      <el-table-column align="center" label="领取限制">
        <template slot-scope="scope">
        <p></p>
          <p>库存：{{scope.row.totalAmount}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="券类型" prop="type">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type === 1 ? '' : 'success'">{{ scope.row.type === 1 ? '优惠券' : '赠送券' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="活动状态" prop="status">
        <template slot-scope="scope">
                {{ scope.row.status === 0? '已失效':'进行中' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="已领取/总数" >
        <template slot-scope="scope">
          {{ scope.row.number}}/{{ scope.row.totalAmount}}
        </template>

      </el-table-column>
      <el-table-column align="center" label="已使用" >
        <template slot-scope="scope">
          {{ scope.row.usedNumber}}份
        </template>

      </el-table-column>
      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleRead(scope.row)">查看</el-button>
          <el-button type="info" size="mini" @click="handleStatus(scope.row)"  :disabled="scope.row.status === 0">使失效</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>
<style lang="scss" scoped>
  .filter-container{
    padding: 10px;
    border-radius: 5px;
    background-color: #f3f3f3;
    p{
      font-size:14px ;
    }
  }
</style>
<script>
import {listCoupon} from '@/api/profile'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'AdminNotice',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      activeName: 'all',
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        status:null
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleDelete(){
      console.log('删除')
    },
    handleStatus(){
      console.log('失效')
    },
    handleRead(){
      console.log('查看')
    },
    handleSelectionChange(){
      console.log(1)
    },
    addCoupon(){
      this.$router.push({
        path:'/profile/password'
      });
    },
    handleFilter(){
     if(this.activeName ==='all' ){
       console.log(1)
     }else if(this.activeName ==='noStarted'){
       console.log(2)
     }else if(this.activeName ==='haveHand'){
       console.log(3)
     }else if(this.activeName ==='Finished'){
       console.log(4)
     }
    },
    getList() {
      this.listLoading = true
      listCoupon(this.listQuery)
        .then(response => {
          this.list = response.data.data.records
          this.total = response.data.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },

  }
}
</script>
