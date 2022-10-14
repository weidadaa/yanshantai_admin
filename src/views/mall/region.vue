<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="7天下单数:">

      </el-form-item>
      <el-form-item label="待付款:">
        <el-link type="primary">{{list.orderNoPayNumber }}</el-link>
      </el-form-item>

      <el-form-item  label="待发货:">
        <el-link type="primary">{{list.orderNoShipNumber  }}</el-link>
      </el-form-item>
      <el-form-item  label="已发货:">
        <el-link type="primary">{{list.orderShipNumber  }}</el-link>

      </el-form-item>
      <el-form-item  label="7天收入:">
        <el-link type="primary">{{list.order7DayPay }}</el-link>
      </el-form-item>
      <el-form-item  label="总销售额:">
        <el-link type="primary">{{list.totalPayMoney   }}</el-link>
      </el-form-item>
    </el-form>

    <div class="app-container">
    <div class="echartext" style="display: flex; justify-content: space-around; text-align: center">
      <div>
        <p>{{list.yesterdayOrderNumber}}</p>
        <p>昨日下单笔数</p>
      </div>
      <div>
        <p>{{list.nowDayPayNumber}}</p>
        <p>昨日付款订单</p>
      </div>
      <div>
        <p>{{list.nowDayShipNumber}}</p>
        <p>昨日发货订单</p>
      </div>
    </div>
        <ve-line :data="chartData" :settings="chartSettings"></ve-line>

    </div>
  </div>
</template>

<script>
// import { listRegion } from '@/api/region'
import { statGoods } from '@/api/stat'
import VeLine from 'v-charts/lib/line'
export default {
  name: 'Region',
  components: { VeLine },
  data() {
    return {
      list: [],
      listLoading: true,
      downloadLoading: false,
      chartData: {
        columns: ['date', 'nowDayShipNumber', 'nowDayPayNumber', 'nowDayOrderNumber'],
        rows: []
      },
      chartSettings: {
            labelMap: {
              'nowDayShipNumber': '下单笔数',
              'nowDayPayNumber': '付款订单',
              'nowDayOrderNumber': '发货订单'
            }
      },
      chartExtend: {}
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true
      statGoods().then(response => {
        this.list = response.data.data
        this.chartData.rows = this.list.order7Trend
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.listLoading = false
      })
    }
  }
}
</script>
