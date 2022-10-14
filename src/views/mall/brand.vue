<template>
    <div class="app-container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="我的收入" name="first">
                <div class="text">
                    <div class="img">
                        <el-avatar shape="square" :size="120" :src="title.logo"></el-avatar>
                    </div>
                    <div class="right-text">
                        <p><span>店铺名称：</span><a>{{title.name}}</a></p>
                        <p><span>收款账户：</span><a>收款账户使用支付宝账号，提现时填写</a></p>
                        <p><span>累计提现：</span><i>0</i>元&nbsp;&nbsp;&nbsp; 独立小程序收款:<i>{{title.store_pay_income}}</i>元
                            &nbsp;&nbsp;亏损总额：<i
                                    style="color: #ff1f19">0.00</i></p>
                        <p><span>提现操作: </span>
                            <el-button type="primary" size="mini">我要提现</el-button>
                        </p>
                    </div>
                </div>
                <el-form :inline="true" class="demo-form-inline desc">
                    <el-form-item label="累计收款:">
                        <i>{{list.totalGetMoney}}</i><span>元</span>
                    </el-form-item>

                    <el-form-item label="退款金额:">
                        <i>{{list.totalReturnMoney}}</i><span>元</span>
                    </el-form-item>
                    <el-form-item label="可提现金额 :">
                        <i>{{list.totalBalance}}</i><span>元</span>
                    </el-form-item>
                    <el-form-item label="待结算金额:">
                        <i>{{list.totalIncome}}</i><span>元</span>
                    </el-form-item>
                </el-form>
                <div class="app-container">
                    <div class="echartext">
                        <div>
                            <p>7日统计(截止至今天)</p>
                        </div>
                        <div style="width: 320px;margin: auto;font-size: 12px">
                            <span style="color: #FF7F50">7日收入(元)：0.00</span> &nbsp;
                            <span style="color: #87CEFA">7日支出(元)：0.00</span>&nbsp;
                            <span style="color: #32CD32"> 7日提现(元)：0.00</span>
                        </div>
                    </div>
                    <ve-line :extend="chartExtend" :data="chartData" :settings="chartSettings"/>
                </div>
            </el-tab-pane>
            <el-tab-pane label="交易记录" name="second">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="时间：">
                        <el-date-picker
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <br>
                    <el-form-item label="订单号">
                        <el-input></el-input>
                    </el-form-item>

                    <el-form-item label="交易状态">
                        <el-select v-model="text" placeholder="请选择">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <br>
                    <el-button type="primary">筛选</el-button>
                </el-form>
                <el-tabs v-model="active" @tab-click="handleClicks">
                    <el-tab-pane label="全部" name="qb"/>
                    <el-tab-pane label="已付款未发货" name="yiwfh"/>
                    <el-tab-pane label="已付款已发货" name="yifyfh"/>
                    <el-tab-pane label="已收货未过退货期" name="tuihuoqi"/>
                    <el-tab-pane label="未点交易完成" name="wanc"/>
                </el-tabs>

                <el-table v-loading="listLoading" :data="activeNameData" element-loading-text="正在查询中。。。" border fit
                          highlight-current-row>

                    <el-table-column align="center" label="支付时间" prop="add_time">
                        <template slot-scope="scope">
                            {{ new Date(Number(scope.row.add_time) * 1000).format()}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" min-width="120" label="订单编号" prop="order_no"/>

                    <el-table-column align="center" min-width="120" label="支付单号" prop="trade_no"/>
                    <el-table-column align="center" label="流水(元)" prop="income"/>
                    <el-table-column align="center" label="收益(元)" prop="actualIncome"/>
                    <el-table-column align="center" label="订单状态" prop="order_status">
                        <template slot-scope="scope">
                            <el-tag>{{ scope.row.order_status | orderStatusFilter }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="150" class-name="oper">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>

            </el-tab-pane>
            <el-tab-pane label="收支明细" name="third">
                <el-form class="demo-form-inline" label-width="100px">
                    <el-form-item label="订单号:">
                        <el-input style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item label="时间：">
                        <el-date-picker

                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <br>


                    <el-form-item label="类型：">
                        <el-select v-model="text" placeholder="请选择">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="付款方式：">
                        <el-select v-model="text" placeholder="请选择">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-button type="primary">筛选</el-button>
                </el-form>
                <el-table v-loading="listLoading" :data="activeNameData" element-loading-text="正在查询中。。。" border fit
                          highlight-current-row>

                    <el-table-column align="center" label="时间" prop="add_time">
                        <template slot-scope="scope">
                            {{ new Date(Number(scope.row.add_time) * 1000).format()}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" min-width="120" label="类型 | 备注 | 收支流水号" prop="orderSn"/>
                    <el-table-column align="center" min-width="120" label="收入(元)" prop="orderSn"/>
                    <el-table-column align="center" label="支出(元)" prop="income"/>
                    <el-table-column align="center" label="利润(元)" prop="payTime"/>
                    <el-table-column align="center" label="累计收益(元)" prop="orderStatus"></el-table-column>
                    <el-table-column align="center" label="支付渠道 | 单号" prop="trade_no"/>
                    <el-table-column align="center" label="操作" width="150" class-name="oper">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="提现记录" name="fourth">
                <el-form class="demo-form-inline" :inline="true" label-width="100px">

                    <el-form-item label="时间：">
                        <el-date-picker

                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <br>
                    <el-form-item label="付款方式：">
                        <el-select v-model="text" placeholder="请选择">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-button type="primary">查询</el-button>
                </el-form>
                <el-table v-loading="listLoading" :data="activeNameData" element-loading-text="正在查询中。。。" border fit
                          highlight-current-row>

                    <el-table-column align="center" label="申请时间" prop="complate_time">
                        <template slot-scope="scope">
                            {{ new Date(Number(scope.row.complate_time) * 1000).format()}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" min-width="120" label="	提现类型 | 编号" prop="orderSn">
                        <template slot-scope="scope">
                            提现类型：<span> {{ scope.row.trade_no}}</span>
                            编号：<span> {{ scope.row.trade_no}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" min-width="120" label="提现金额(元)" prop="amount"/>
                    <el-table-column align="center" label="服务费" prop="payTime">
                        <template slot-scope="scope">
                            {{ scope.row.sales_ratio}}%
                        </template>

                    </el-table-column>
                    <el-table-column align="center" label="实际提现金额(元)" prop="actual"/>
                    <el-table-column align="center" label="处理完成时间" prop="orderStatus">
                        <template slot-scope="scope">

                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态" prop="status">
                        <template slot-scope="scope">
                            <el-tag>{{ scope.row.status ? '提现成功':'提现失败' }}</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="申请人">
                        <template slot-scope="scope">
                            申请人： <span> {{ scope.row.nickname}}</span><br>
                            号码：<span> {{ scope.row.phone}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="备注" width="150" class-name="oper">
                        <template slot-scope="scope">

                        </template>
                    </el-table-column>
                </el-table>

            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<style lang="scss" scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }

    .avatar {
        width: 145px;
        height: 145px;
        display: block;
    }

    .text {
        display: flex;
        border-bottom: 1px solid #999999;
        /*.img{*/
        /*  img{*/
        /*    width: 20%;*/
        /*  }*/
        /*}*/
        .right-text {
            margin-left: 10px;
            font-size: 12px;

            p {
                color: #999999;

                i {
                    font-size: 20px;
                    color: #008000;
                }
            }
        }
    }

    .desc {
        padding: 20px;
        display: flex;
        justify-content: space-around;
        border-bottom: 1px solid #999999;

        span {
            font-size: 12px;
        }

        i {
            font-size: 25px;
            color: #ff6600;
        }


    }

    .demo-form-inline {
        padding: 10px;
        background-color: #f8f8f8;
    }
</style>

<script>
    import {listRegion, listSubRegion, laedList, withdrawList} from '@/api/region'
    import VeLine from 'v-charts/lib/line'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

    export default {
        name: 'Brand',
        components: {Pagination, VeLine},
        data() {
            return {
                list: [],
                listLoading: true,
                downloadLoading: false,
                title: {},
                chartData: {
                    columns: ['date', 'nowWithdrawMoney', 'nowSubMoney', 'nowReturnMoney'],
                    rows: [],
                },//返回天数
                chartSettings: {
                    labelMap: {
                        'nowWithdrawMoney': '收入(元)',
                        'nowSubMoney': '支出(元)',
                        'nowReturnMoney': '提现(元)'
                    }
                },
                chartExtend: {},
                activeName: 'first',
                active: 'qb',
                text: '',
                activeNameData: [],
                listQuery: {
                    currentPage: 1,
                    pageSize: 10,
                },
                listlaedList: {
                    currentPage: 1,
                    pageSize: 10,
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            }
        },
        computed: {},
        created() {
            this.getList();
        },
        methods: {
            getList() {
                this.listLoading = true
                listRegion().then(response => {   //day7List
                    this.list = response.data.data
                    this.title = response.data.data.store
                    this.chartData.rows = response.data.data.day7List
                    this.listLoading = false
                }).catch(() => {
                    this.list = []
                    this.listLoading = false
                })
                this.chartExtend = {
                    xAxis: {boundaryGap: true}
                }
            },
            handleClick() {
                if (this.activeName === 'second') {
                    listSubRegion(this.listQuery).then(res => {
                        this.activeNameData = res.data.data.list
                    })
                } else if (this.activeName === 'third') {
                    laedList(this.listlaedList).then(res => {
                        this.activeNameData = res.data.data.list
                    })
                } else if (this.activeName === 'fourth') {
                    withdrawList(this.listlaedList).then(res => {
                        this.activeNameData = res.data.data.list
                    })
                }
            },
            handleClicks() {
                console.log(123)
            }
        }
    }
</script>
