<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container" style=" display: flex;align-content: center">
            <el-input v-model="listQuery.returnNo" clearable class="filter-item" style="width: 200px;"
                      placeholder="退货单号"/>&nbsp;
            <el-input v-model="listQuery.thirdId" clearable class="filter-item" style="width: 200px;"
                      placeholder="外部交易单号"/>&nbsp;
            <el-select v-model="listQuery.status" placeholder="请选择">
           <el-option v-for=" item in Data66" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>&nbsp;
            <el-button class="filter-item" type="primary"
                       icon="el-icon-search" @click="handleFilter">查找
            </el-button>
            <!--            <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"-->
            <!--                       @click="handleDownload">导出-->
            <!--            </el-button>-->
        </div>


        <!--    <el-tabs v-model="tab" @tab-click="handleClick">-->
        <!--      <el-tab-pane label="全部" name="all" />-->
        <!--      <el-tab-pane label="待审核" name="uncheck" />-->
        <!--      <el-tab-pane label="待退款" name="unrefund" />-->
        <!--    </el-tabs>-->

        <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"/>
            <el-table-column align="center" label="商品图" prop="productImage">
                <template slot-scope="scope">
                    <el-image
                            :src="scope.row.productImage"
                            style="width: 40px; height: 40px"
                    />
                </template>

            </el-table-column>
            <el-table-column align="center" min-width="120" label="退货单号" prop="returnNo"/>
            <el-table-column align="center" min-width="120" label="外部交易单号" prop="thirdId"/>
            <el-table-column align="center" min-width="120" label="订单号" prop="orderNo"/>
            <el-table-column align="center" min-width="120" label="退货类型" prop="type">
                <template slot-scope="scope">
                    <el-tag :type="typeTag[scope.row.type]">{{ typeDesc[scope.row.type] }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="退货状态" prop="status">
                <template slot-scope="scope">
                    {{ scope.row.status | statusType }}
                </template>

            </el-table-column>
            <el-table-column align="center" label="退货数量" prop="proNum"/>
            <el-table-column align="center" min-width="100" label="退货时间" prop="dateline">
                <template slot-scope="scope">
                    {{ new Date(Number(scope.row.dateline) * 1000).format()}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="买家" prop="userName"/>
            <el-table-column align="center" label="操作" min-width="120" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleRead(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="getList"/>

        <el-tooltip placement="top" content="返回顶部">
            <back-to-top :visibility-height="100"/>
        </el-tooltip>
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
    import {listReturn} from '@/api/aftersale'
    import BackToTop from '@/components/BackToTop'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

    export default {
        name: 'Aftersale',
        components: {BackToTop, Pagination},
        data() {
            return {
                list: [],
                total: 0,
                listLoading: true,
                tab: 'all',
                listQuery: {
                    currentPage: 1,
                    pageSize: 10,
                    returnNo: null,
                    thirdId: null,
                    status: null,
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
                Data66: [
                    {label: "申请中", value: 1},
                    {label: "商家审核不通过", value: 2},
                    {label: "商家审核通过", value: 3},
                    {label: "退货物流", value: 4},
                    {label: "退货完成", value: 5},
                    {label: "退货取消", value: 6}
                ],
                multipleSelection: [],
                contentDetail: '',
                contentDialogVisible: false,
                downloadLoading: false,
                aftersaleDialogVisible: false,
                aftersaleDetail: {}
            }
        },
        created() {
            this.getList()
        },
        filters:{
            statusType(value){
                if(value === 1){
                    return '申请中'
                }else  if(value === 2){
                    return '商家审核不通过'
                }else  if(value === 3){
                    return '商家审核通过'
                }else  if(value === 4){
                    return '退货物流'
                }else  if(value === 5){
                    return '退货完成'
                }else  if(value === 6){
                    return '退货取消'
                }
            },
        },
        methods: {
            getList() {
                this.listLoading = true
                listReturn(this.listQuery)
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
                    this.listQuery.status = '1'
                } else if (this.tab === 'unrefund') {
                    this.listQuery.status = '2'
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
