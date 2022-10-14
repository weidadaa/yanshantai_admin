<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <!--      <inquire></inquire>-->
    </div>



    <el-tabs v-model="activeName"   @tab-click="handleClick">
      <el-tab-pane label="全部" name="first"/>
      <el-tab-pane label="待发货" name="treatpaying"/>
      <el-tab-pane label="已发货" name="treatPickup"/>
      <el-tab-pane label="已收货" name="yifinish" />
      <el-tab-pane label="已完成" name="yiclosure" />
    </el-tabs>
    <!-- 查询结果 -->
    <!--    <el-form :inline="true"  class="demo-form-inline">-->

    <!--      <el-form-item >-->
    <!--        <el-select placeholder="活动区域">-->
    <!--          <el-option label="区域一" value="shanghai"></el-option>-->
    <!--          <el-option label="区域二" value="beijing"></el-option>-->
    <!--        </el-select>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item>-->
    <!--        <el-button type="success" @click="onSubmit">导出订单</el-button>-->
    <!--      </el-form-item>-->

    <!--      <el-form-item>-->
    <!--        <el-button type="success" @click="onSubmit">订单打印</el-button>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item>-->
    <!--        <el-button type="primary" @click="onSubmit">批量自提</el-button>-->
    <!--      </el-form-item>-->
    <!--    </el-form>-->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit
              highlight-current-row>

      <el-table-column
              type="selection"
              width="55">
      </el-table-column>

      <el-table-column align="center" min-width="120" label="订单编号" prop="orderNo"/>
      <el-table-column align="center" min-width="120" label="商户支付单号" prop="orderNo"/>
      <el-table-column align="center" min-width="120" label="外部交易单号" prop="tradeNo"/>
      <el-table-column align="center" label="单价/件/重" prop="proNum"/>
      <el-table-column align="center" label="买家/收货" prop="addressUser"/>
      <el-table-column align="center" label="下单时间" prop="addTime" min-width="100">
        <template slot-scope="scope">
          {{ new Date(Number(scope.row.addTime) * 1000).format() }}
        </template>
      </el-table-column>


      <el-table-column align="center" label="下单渠道" prop="sourcePlatform">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.sourcePlatform | Platform}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单状态" prop="status">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | statusType}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="实付金额" prop="total">
        <template slot-scope="scope">
          <p>{{ scope.row.total }} 元</p>
          <p>(含运费：{{ scope.row.postage}})</p>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200" class-name="oper">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
          <!--          <el-button type="primary" size="mini" @click="handleShip(scope.row)">发货</el-button>-->
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<style lang="scss" scoped>
  .el-table--medium th, .el-table--medium td {
    padding: 3px 0;
  }

  .el-input-number--medium {
    width: 100%;
  }

  .oper .el-button--mini {
    padding: 7px 4px;
    width: 40px;
    font-size: 10px;
    margin-left: 1px;
  }

  ::v-deep .el-table__expanded-cell {
    padding: 6px 80px;
  }

  .order-goods {
    display: flex;
    justify-content: space-around;
    justify-items: center;
    align-items:center;
    padding: 6px 0;
  }

  .name {
    width: 400px;
  }

  .spec {
    width: 180px;
  }

  .price {
    width: 120px;
  }

  .num {
    width: 120px;
  }
</style>

<script>
  import {arrivalList} from '@/api/pickup'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  // import checkPermission from '@/utils/permission' // 权限判断函数
  import Inquire from '@/views/mall/components/Inquire.vue'

  const statusMap = {
    101: '未付款',
    102: '用户取消',
    103: '系统取消',
    201: '已付款',
    202: '申请退款',
    203: '已退款',
    301: '已发货',
    401: '用户收货',
    402: '系统收货'
  }

  export default {
    name: 'pickup',
    components: { Pagination,Inquire},
    filters: {
      orderStatusFilter(status) {
        return statusMap[status]
      },
      statusType(value){
        //  订单状态 0临时订单 1未支付 2未发货 3已发货 4已完成 5已取消 6退款中
        if(value===1){
          return '未支付'
        } else if(value===2){
          return '未发货'
        } else if(value===3){
          return '已发货'
        } else if(value===4){
          return '已完成'
        } else if(value===5){
          return '已取消'
        } else if(value===6){
          return '退款中'
        }
      },
      Platform(value) {
        if (value === 0) {
          return 'h5'
        } else if (value === 1) {
          return 'app'
        } else if (value === 2) {
          return '小程序'
        } else if (value === 3) {
          return '收银台'
        }
      }

    },
    data() {
      return {
        list: [],
        total: 0,
        listLoading: true,
        activeName:'first',//tab栏首选
        listQuery: {
          currentPage: 1,
          pageSize: 10,
          status:null,
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        statusMap,
        orderDialogVisible: false,
        orderDetail: {
          order: {},
          user: {},
          orderGoods: []
        },
        shipForm: {
          orderId: undefined,
          shipChannel: undefined,
          shipSn: undefined
        },
        shipDialogVisible: false,
        payForm: {
          orderId: undefined,
          orderSn: '',
          oldMoney: 0,
          newMoney: 0,
          goodsList: []
        },
        payDialogVisible: false,
        refundForm: {
          orderId: undefined,
          refundMoney: undefined
        },
        refundDialogVisible: false,
        downloadLoading: false,
        channels: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      // checkPermission,
      getList() {
        this.listLoading = true
        arrivalList(this.listQuery).then(res =>{
          this.listLoading = false
          console.log(res)
          this.list =res.data.data.records
          this.total =res.data.data.total
        })

      },
      handleFilter(){
        this.listQuery.page = 1
        this.getList()
      },
      handleDetail(){
        console.log('xiangqing')
      },
      handleDelete(){
        console.log('删除')
      },
      //tab切换
      handleClick() {
        console.log(this.activeName)
        if (this.activeName === 'first'){
          this.listQuery.status = null
          this.getList()
        } else if(this.activeName === 'treatpaying'){
          this.listQuery.status = 1
          this.getList()
        } else if(this.activeName === 'treatPickup'){
          this.listQuery.status = 2
          this.getList()
        } else if(this.activeName === 'yifinish'){
          this.listQuery.status = 3
          this.getList()
        } else if(this.activeName === 'yiclosure'){
          this.listQuery.status = 4
          this.getList()
        }

      },
    }
  }
</script>
