<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <!--            <inquire></inquire>-->
            <!--      <el-input v-model="listQuery.nickname" clearable class="filter-item" style="width: 160px;" placeholder="请输入用户昵称" />-->
            <!--      <el-input v-model="listQuery.consignee" clearable class="filter-item" style="width: 160px;" placeholder="请输入收货人名称" />-->
            <!--      <el-input v-model="listQuery.orderSn" clearable class="filter-item" style="width: 160px;" placeholder="请输入订单编号" />-->
            <!--      <el-date-picker v-model="listQuery.timeArray" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" class="filter-item" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" />-->
            <!--      <el-select v-model="listQuery.orderStatusArray" multiple style="width: 200px" class="filter-item" placeholder="请选择订单状态">-->
            <!--        <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value" />-->
            <!--      </el-select>-->
            <!--      <el-button v-permission="['GET /admin/order/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>-->
            <!--      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>-->
        </div>


        <!-- 查询结果 -->
        <template>

            <!--      <el-form :inline="true"  class="demo-form-inline">-->

            <!--        <el-form-item >-->
            <!--          <el-select placeholder="活动区域">-->
            <!--            <el-option label="区域一" value="shanghai"></el-option>-->
            <!--            <el-option label="区域二" value="beijing"></el-option>-->
            <!--          </el-select>-->
            <!--        </el-form-item>-->
            <!--        <el-form-item>-->
            <!--          <el-button type="success" @click="onSubmit">导出订单</el-button>-->
            <!--        </el-form-item>-->
            <!--        <el-form-item>-->
            <!--          <el-button type="primary" @click="onSubmit">批量发货</el-button>-->
            <!--        </el-form-item>-->
            <!--        <el-form-item>-->
            <!--          <el-button type="success" @click="onSubmit">订单打印</el-button>-->
            <!--        </el-form-item>-->
            <!--        <el-form-item>-->
            <!--          <el-button type="primary" @click="onSubmit">批量自提</el-button>-->
            <!--        </el-form-item>-->
            <!--      </el-form>-->
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部(不包含临时单)" name="first"/>
                <el-tab-pane label="待付款" name="treatpaying"/>
                <el-tab-pane label="待发货" name="treatship"/>
                <el-tab-pane label="已发货" name="yiship"/>
                <el-tab-pane label="已完成" name="yifinish"/>
                <!--                <el-tab-pane label="已收货" name="yireceipt"/>-->
                <el-tab-pane label="已取消" name="cancelled"/>
                <el-tab-pane label="退款中" name="refunding"/>
                <el-tab-pane label="临时单" name="temporary"/>
            </el-tabs>
            <!--            <el-form :inline="true" class="demo-form-inline">-->

            <!--                <el-form-item>-->
            <!--                                    <el-select placeholder="活动区域">-->
            <!--                                      <el-option label="区域一" value="shanghai"></el-option>-->
            <!--                                      <el-option label="区域二" value="beijing"></el-option>-->
            <!--                                    </el-select>-->
            <!--                </el-form-item>-->
            <!--                <el-form-item>-->
            <!--                    <el-button type="success" @click="onSubmit">导出订单</el-button>-->
            <!--                </el-form-item>-->
            <!--                <el-form-item>-->
            <!--                    <el-button type="primary" @click="onSubmit">批量发货</el-button>-->
            <!--                </el-form-item>-->
            <!--                <el-form-item>-->
            <!--                    <el-button type="success" @click="onSubmit">订单打印</el-button>-->
            <!--                </el-form-item>-->
            <!--                <el-form-item>-->
            <!--                    <el-button type="primary" @click="onSubmit">批量自提</el-button>-->
            <!--                </el-form-item>-->
            <!--            </el-form>-->
            <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit
                      highlight-current-row>

                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>

                <el-table-column align="center" min-width="120" label="订单编号" prop="orderNo"/>
                <el-table-column align="center" min-width="120" label="商户支付单号" prop="orderNo"/>
                <el-table-column align="center" min-width="120" label="外部交易单号" prop="tradeNo"/>
                <el-table-column align="center" label="单价/件/重" prop="proCount"/>
                <el-table-column align="center" label="买家/收货" prop="addressUser"/>
                <el-table-column align="center" label="下单时间" prop="addTime" min-width="100">
                    <template slot-scope="scope">
                        {{ new Date(Number(scope.row.addTime) * 1000).format() }}
                    </template>
                </el-table-column>


                <el-table-column align="center" label="下单渠道" prop="sourcePlatform">
                    <template slot-scope="scope">
                        <el-tag>{{ scope.row.sourcePlatform | source}}</el-tag>
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
                        <el-button type="primary" size="mini" @click="handleShip(scope.row)"
                                   :disabled=" scope.row.status === 3 || scope.row.status === 4 ||  scope.row.status === 5 || scope.row.status === 6">
                            发货
                        </el-button>
                        <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="getList"/>

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
        align-items: center;
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
    import {listOrder} from '@/api/order'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import checkPermission from '@/utils/permission' // 权限判断函数
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
        name: 'Order',
        components: {Pagination, Inquire,},
        filters: {
            statusType(value) {
                //  订单状态 0临时订单 1未支付 2未发货 3已发货 4已完成 5已取消 6退款中
                if (value === 1) {
                    return '未支付'
                } else if (value === 2) {
                    return '未发货'
                } else if (value === 3) {
                    return '已发货'
                } else if (value === 4) {
                    return '已完成'
                } else if (value === 5) {
                    return '已取消'
                } else if (value === 6) {
                    return '退款中'
                }
            },
            source(value) {
                if (value === 0) {
                    return 'H5'
                } else if (value === 1) {
                    return 'App'
                } else if (value === 2) {
                    return '小程序'
                } else if (value === 3) {
                    return '收银台'
                }
            }

        },
        data() {
            return {
                aa: "a:1:{i:0;a:3:{i:0;s:5:\"03:00\";i:1;s:5:\"05:07\";i:2;a:1:{i:0;a:2:{s:5:\"value\";s:1:\"2\";s:4:\"text\";s:6:\"周二\";}}}}",
                list: [],
                total: 0,
                listLoading: true,
                activeName: 'first',//tab栏首选
                listQuery: {
                    currentPage: 1,
                    status: null,
                    pageSize: 10,
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
            checkPermission,
            //tab切换
            handleClick() {
                console.log(this.activeName)
                if (this.activeName === 'first') {
                    this.listQuery.status = null
                    this.getList()
                } else if (this.activeName === 'treatpaying') {
                    this.listQuery.status = 1
                    this.getList()
                } else if (this.activeName === 'treatship') {
                    this.listQuery.status = 2
                    this.getList()
                } else if (this.activeName === 'yiship') {
                    this.listQuery.status = 3
                    this.getList()
                } else if (this.activeName === 'yifinish') {
                    this.listQuery.status = 4
                    this.getList()
                } else if (this.activeName === 'cancelled') {
                    this.listQuery.status = 5
                    this.getList()
                } else if (this.activeName === 'refunding') {
                    this.listQuery.status = 6
                    this.getList()
                } else if (this.activeName === 'temporary') {
                    this.listQuery.status = 0
                    this.getList()
                }

            },
            // 查询点击
            onSubmit() {
                console.log(123)
            },
            // 详情
            handleDetail(row) {
                this.$router.push({
                    path: "/mall/details",
                    query: {orderId: row.orderId},
                });
            },
            // 点击删除
            handleDelete() {
                console.log('删除点击了', ggg)
            },
            // 点击发货
            handleShip() {
                console.log('发货了')
            },
            getList() {
                listOrder(this.listQuery).then(res => {
                    console.log('订单列表', res)
                    this.listLoading = false
                    this.list = res.data.data.records
                    this.total = res.data.data.total
                })
            },
            handleFilter() {
                this.listQuery.currentPage = 1
                this.getList()
            },

            // confirmRefund() {
            //   this.$refs['refundForm'].validate((valid) => {
            //     if (valid) {
            //       refundOrder(this.refundForm).then(response => {
            //         this.refundDialogVisible = false
            //         this.$notify.success({
            //           title: '成功',
            //           message: '确认退款成功'
            //         })
            //         this.getList()
            //       }).catch(response => {
            //         this.$notify.error({
            //           title: '失败',
            //           message: response.data.errmsg
            //         })
            //       })
            //     }
            //   })
            // },
            handleDownload() {
                this.downloadLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['订单ID', '订单编号', '用户ID', '订单状态', '是否删除', '收货人', '收货联系电话', '收货地址']
                    const filterVal = ['id', 'orderSn', 'userId', 'orderStatus', 'isDelete', 'consignee', 'mobile', 'address']
                    excel.export_json_to_excel2(tHeader, this.list, filterVal, '订单信息')
                    this.downloadLoading = false
                })
            },
            printOrder() {
                this.$print(this.$refs.print)
                this.orderDialogVisible = false
            }
        }
    }
</script>
