<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
<!--    <Inquire></Inquire>-->
<!--    <div class="filter-container" style=" display: flex;align-content: center">-->
<!--      <el-input v-model="listQuery.aftersaleSn" clearable class="filter-item" style="width: 200px;" placeholder="退货单号" />&nbsp;-->
<!--      <el-input v-model="listQuery.orderId" clearable class="filter-item" style="width: 200px;" placeholder="外部交易单号" />&nbsp;-->
<!--      <el-select v-model="value" placeholder="请选择">-->
<!--        <el-option-->
<!--                label="全部"-->
<!--                value="quanbu">-->
<!--        </el-option>-->
<!--      </el-select>&nbsp;-->
<!--      <el-button v-permission="['GET /admin/aftersale/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>-->
<!--      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>-->
<!--    </div>-->



    <el-tabs v-model="tab" @tab-click="handleClick">
      <el-tab-pane label="全部" name="all" />
      <el-tab-pane label="待发货" name="uncheck" />
      <el-tab-pane label="已发货" name="unrefund" />
      <el-tab-pane label="已完成" name="unre" />
    </el-tabs>

    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />

      <el-table-column align="center" label="订单号" prop="orderNo" />
      <el-table-column align="center" label="商户支付单号" prop="tradeNo" />
      <el-table-column align="center" label="买家/收货" prop="addressUser" />
      <el-table-column align="center" label="售后类型" prop="type">
        <template slot-scope="scope">
          <el-tag :type="typeTag[scope.row.type]">{{ typeDesc[scope.row.type] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下单时间" prop="addTime">
        <template slot-scope="scope">
          {{   new Date(Number(scope.row.addTime) * 1000).format()}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单状态 " prop="status" />
      <el-table-column align="center" label="实付金额" prop="total" >
          <template slot-scope="scope">
            <p>订单总额：{{scope.row.total}}</p>
            <span>(含邮费:{{scope.row.postage}})</span>
          </template>
      </el-table-column>
      <el-table-column align="center" label="星级"  prop="star"  >
        <template slot-scope="scope">
          <el-rate v-model="scope.row.star"></el-rate>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button  type="primary" size="mini" @click="handleRead(scope.row)">详情</el-button>
          <el-button  type="success" size="mini" @click="handleRecept(scope.row)">{{scope.row.bak ==='' ? '备注':'修改备注'}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>


    <el-dialog
            title="备注"
            :visible.sync="dialogVisible"
            width="30%"
            >
      <el-input placeholder="请输入内容" v-model="starData.bak" clearable>
      </el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updataDak">确 定</el-button>
  </span>
    </el-dialog>
    <!-- 详情对话框 -->
    <el-dialog :visible.sync="aftersaleDialogVisible" title="售后详情" width="800">
      <section ref="print">
        <el-form :data="aftersaleDetail" label-position="left">
          <el-form-item label="售后id">
            <el-tag>{{ aftersaleDetail.id }}</el-tag>
          </el-form-item>
          <el-form-item label="售后编号">
            <el-tag>{{ aftersaleDetail.aftersaleSn }}</el-tag>
          </el-form-item>
          <el-form-item label="订单号">
            <el-tag>{{ aftersaleDetail.orderId }}</el-tag>
          </el-form-item>
          <el-form-item label="订单金额">
            <el-tag>{{ aftersaleDetail.amount }}</el-tag>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-tag v-if="aftersaleDetail.status === 1">已申请,待审核</el-tag>
            <el-tag v-if="aftersaleDetail.status === 2">审核通过,待退款</el-tag>
            <el-tag v-if="aftersaleDetail.status === 3">退款成功</el-tag>
            <el-tag v-if="aftersaleDetail.status === 4">审核不通过,已拒绝</el-tag>
          </el-form-item>
          <el-form-item label="订单用户id">
            <el-tag>{{ aftersaleDetail.userId }}</el-tag>
          </el-form-item>
          <el-form-item label="售后类型">
            <el-tag v-if="aftersaleDetail.type === 0">未收货退款</el-tag>
            <el-tag v-if="aftersaleDetail.type === 1">不退货退款</el-tag>
            <el-tag v-if="aftersaleDetail.type === 2">退货退款</el-tag>
          </el-form-item>
          <el-form-item label="退款原因">
            <span>{{ aftersaleDetail.reason }}</span>
          </el-form-item>
          <el-form-item label="申请时间">
            <span>{{ aftersaleDetail.addTime }}</span>
          </el-form-item>
          <el-form-item label="更新时间">
            <span>{{ aftersaleDetail.updateTime }}</span>
          </el-form-item>
          <el-form-item label="处理时间">
            <span>{{ aftersaleDetail.handleTime }}</span>
          </el-form-item>
          <el-form-item label="售后图片">
            <el-table :data="aftersaleDetail.pictures" border fit highlight-current-row>
              <el-table-column align="center" label="售后图片">
                <template slot-scope="scope">
                  <a :href="scope.row" target="_blank">
                    <img :src="scope.row" width="40">
                  </a>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="aftersaleDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {listOrder } from '@/api/star'
import { editDak} from '@/api/order'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import  Inquire from  '@/views/mall/components/Inquire'

export default {
  name: 'star',
  components: { BackToTop, Pagination,Inquire },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      tab: 'all',
      dialogVisible:false,

      listQuery: {
        currentPage: 1,
        pageSize: 10,
        status: '',
      },
      typeTag: [
        '',
        'success',
        'warning'
      ],
      typeDesc: [
        '未收货退款',
        '不退货退款',
        '退货退款'
      ],
      starData:{
        bak:null,
        orderId:null
      },
      multipleSelection: [],
      contentDetail: '',
      contentDialogVisible: false,
      downloadLoading: false,
      aftersaleDialogVisible:false,
      aftersaleDetail:{}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    updataDak(){
      editDak(this.starData).then(res=>{
        this.$notify.success({
          title: "成功",
          message: "修改成功",
        });
        this.getList()
        this.dialogVisible =false
      })
    },
    handleRecept(row){
      this.dialogVisible =true
      this.starData.bak = row.bak
      this.starData.orderId = row.orderId
      console.log(row)
    },
    getList() {
      this.listLoading = true
      listOrder(this.listQuery)
        .then(response => {
          console.log(response)
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleClick() {
      if (this.tab === 'all') {
        this.listQuery.status = ''
      } else if (this.tab === 'uncheck') {
        this.listQuery.status = '2'
      } else if (this.tab === 'unrefund') {
        this.listQuery.status = '3'
      } else if(this.tab === 'unre'){
        this.listQuery.status = '4'
      }
      this.getList()
    },

    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '售后编号',
          '订单ID',
          '用户ID',
          '售后类型',
          '退款原因',
          '退款价格',
          '申请时间'
        ]
        const filterVal = [
          'aftersaleSn',
          'orderId',
          'userId',
          'type',
          'reason',
          'amount',
          'addTime'
        ]
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '售后信息')
        this.downloadLoading = false
      })
    },
    handleRead(row) {
      this.aftersaleDetail = row;
      console.log(this.aftersaleDetail);
      this.aftersaleDialogVisible = true
    },
  }
}
</script>
