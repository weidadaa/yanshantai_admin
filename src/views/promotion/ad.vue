<template>
    <div class="app-container">
        <el-card shadow="hover">
            <div class="clearfix clea">
                <el-avatar shape="square" :size="80" fit="cover" :src="survey.logo"></el-avatar>
                <div class="title">
                    <span>{{ survey.name }}</span>
                    <el-tag type="success">旗舰版 有效期2022-11-27</el-tag>
                    <br>
                    <el-button class="title-btn" type="text">查看线下门店</el-button>
                </div>
                <!--        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
            </div>
            <div class="num-data">
                <div>
                    <p>0</p>
                    <p>昨日新增会员</p>
                </div>
                <div>
                    <p>0</p>
                    <p>昨日订单数</p>
                </div>
                <div>
                    <p>0</p>
                    <p>昨日收益（已结算）</p>
                </div>
                <div>
                    <p>0</p>
                    <p>待处理订单</p>
                </div>
                <div>
                    <p>0</p>
                    <p>微页面</p>
                </div>
                <div>
                    <p>0</p>
                    <p>商品</p>
                </div>
            </div>
        </el-card>

        <el-card shadow="hover" style="margin-top: 30px">
            <div slot="header" class="clearfix">
                <span>流量趋势</span>
            </div>
            <ve-line :data="chartData1" :settings="chartSettings1"/>
        </el-card>

        <el-card shadow="hover" style="margin-top: 30px">
            <div slot="header" class="clearfix">
                <span>商品销量统计（前十）</span>
            </div>
            <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;margin-left:42%" @change="handleChange" >
                <el-radio-button label="1"  >昨日</el-radio-button>
                <el-radio-button label="2" >这周</el-radio-button>
                <el-radio-button label="3" >一个月</el-radio-button>
            </el-radio-group>

            <ve-histogram  :legend="legend" :data="chartData2" :settings="chartSettings2" :extend="chartExtend2" :data-empty="dataEmpty"/>
        </el-card>

        <el-card shadow="hover" style="margin-top: 30px">
            <div slot="header" class="clearfix">
                <span>购买率（月）<span style="color: #99a9bf">每月所有用户中有过交易行为的用户比例</span></span>
            </div>
            <ve-line :data="chartData3" :settings="chartSettings3" :extend="chartExtend"></ve-line>
        </el-card>
    </div>
</template>

<style lang="scss" scoped>


    .clea {
        display: flex;

        .title {
            margin-left: 20px;
            margin-top: 5px;

            .title-btn {
                margin-top: 20px;
            }
        }

    }

    .num-data {
        margin-top: 30px;
        display: flex;
        justify-content: space-around;

        p {
            text-align: center;
        }
    }
</style>

<script>
    import {listSurvey} from '@/api/ad'
    import {getToken} from '@/utils/auth'
    import VeLine from 'v-charts/lib/line'
    import VeHistogram from 'v-charts/lib/histogram'
    import 'v-charts/lib/style.css'
    export default {
        name: 'Ad',
        components: {VeLine, VeHistogram},
        data() {
            this.legend = {  show: false,
            };
            return {
                dataEmpty:false,
                survey: '',
                tabPosition: '1',
                statistics:[],//接收商品销量统计
                chartData1: {
                    columns: ['date', 'nowDayFlowNumber', 'nowDayNewMember', 'nowDayReturnOrderNumber', 'nowDayPayMoney'],
                    rows: []
                },
                chartSettings1: {
                    labelMap: {
                        nowDayFlowNumber: '店铺浏览次数',
                        nowDayNewMember: '会员数',
                        nowDayReturnOrderNumber: '退款订单额',
                        nowDayPayMoney: '订单交易额'
                    }
                },
                chartData2: {
                    columns: ['name', 'sale'],
                    rows: []
                },
                chartSettings2: {
                    labelMap: {
                        sale: '销量'
                    }
                },
                chartExtend2: {
                  // const  color =
                    series(v) {
                        console.log('每个柱子', v)
                        v.forEach(i => {
                            console.log('每个柱子里面的数据', i)
                            i.itemStyle = {
                                normal: {
                                    color: function(params) {
                                        var colorList = [
                                            "#65d186",
                                            "#f67287",
                                            "#f29e3c",
                                            "#c05bdd",
                                            "#f29e3c",
                                            "#7a65f2",
                                            "#65d186",
                                            "#f67287"
                                        ]; //每根柱子的颜色
                                        return colorList[params.dataIndex];
                                    }
                                },
                            }
                        })
                        return v
                    }
                },
                chartData3: {
                    columns: ['date', 'payMount'],
                    rows: []
                },
                chartSettings3: {
                    labelMap: {
                        payMount: '下单率'
                    },
                    yAxisName: ['百分比']
                },
                chartExtend: {
                    series: {
                        smooth: false,  // 将曲线变为直线
                        type: 'line'
                    },
                },
            }
        },
        computed: {
            headers() {
                return {
                    'token': getToken()
                }
            }
        },
        created() {
            this.getList()
        },
        methods: {
            handleChange(v){
                    if(v === '1'){
                        this.chartData2.rows = this.statistics.yesterdaySaleProductList
                    } else if(v === '2'){
                        this.chartData2.rows = this.statistics.weekSaleProductList
                    } else {
                        this.chartData2.rows = this.statistics.mountSaleProductList
                    }
                    if(this.chartData2.rows.length === 0){
                        this.dataEmpty =true
                    } else {
                        this.dataEmpty =false
                    }
            },
            getList() {
                listSurvey().then(res => {
                    console.log(res)
                    this.survey = res.data.data.storeMap
                    this.chartData1.rows = res.data.data.flowMapList
                    this.statistics = res.data.data.sale10Product
                    this.chartData3.rows = res.data.data.pay
                })
            }
        }
    }
</script>
