<template>
    <div class="app-container">

        <el-card class="box-card caliang">
            <div slot="header" class="clearfix">
                <span>订单概况</span>
                <el-rate v-model="dataIled.star" v-show="jiaXing"
                         style="display: inline-block;float: right;margin-left: 10px"></el-rate>
                <el-button style="float: right; padding: 3px 0" type="text" @click="jiaXing = true">加星</el-button>
            </div>
            <el-descriptions class="margin-top" :column="1" size="10" :border="true">
                <el-descriptions-item label="订单状态：">
                    <el-tag size="small">{{dataIled.status | statusType}}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="应付金额：" label-class-name="my-label">
                    {{dataIled.total}}(含邮费：{{dataIled.postage}})
                </el-descriptions-item>
                <el-descriptions-item label="消费者：">{{dataIled.addressUser}}</el-descriptions-item>
                <el-descriptions-item label="手机号：">{{dataIled.addressTel}}</el-descriptions-item>
                <el-descriptions-item label="订单来源：">
                    <el-tag size="small">{{dataIled.sourcePlatform | Platform}}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="付款方式：">{{dataIled.paymentMethod}}</el-descriptions-item>
                <el-descriptions-item label="快递物流方式：">{{dataIled.shippingMethod | Method}}</el-descriptions-item>
                <el-descriptions-item label="收货地址：">{{dataIled.address}} &nbsp;<el-button type="primary" @click="updataAddress">
                    修改收货地址
                </el-button>
                </el-descriptions-item>
                <el-descriptions-item label="收货人：">{{dataIled.addressUser}}</el-descriptions-item>
                <el-descriptions-item label="联系方式：">{{dataIled.addressTel}}</el-descriptions-item>
                <el-descriptions-item label="买家留言：">{{dataIled.comment}}</el-descriptions-item>
                <el-descriptions-item label="发货/自提操作人：">{{dataIled.operaterId}}</el-descriptions-item>
                <el-descriptions-item label="卖家备注：">
                    <el-input v-model="dataIled.bak" placeholder="请输入内容"></el-input>
                </el-descriptions-item>
            </el-descriptions>


            <el-table border style="width: 100%;margin-top: 20px" :data="detailsData" >
                <el-table-column
                        prop="proPic"
                        label="图片"
                        width="180"
                        align="center" >
                    <el-image
                            style="width: 50px; height: 50px"
                            :src="detailsData.proPic"
                            fit="cover"></el-image>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="productName"
                        label="商品名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="proPrice"
                        label="单价(元)">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="proNum"
                        label="件/重">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="proPrice"
                        label="小计(元)">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="inPackageStatus"
                        label="状态">
                    <template slot-scope="scope">
                        {{scope.row.inPackageStatus === 0 ? '未打包':'打包中'}}
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="运费(元)">
               <span> {{dataIled.postage}}.00</span>
                </el-table-column>
            </el-table>
        </el-card>



        <el-card class="box-card caliang">
            <div slot="header" class="clearfix">
                <span>退货商品详情</span>
            </div>
            <el-table
                    :data="returnGoods"
                    border
                    style="width: 100%;margin-top: 20px">
                <el-table-column
                        prop="product_image"
                        label="图片"
                        width="180"
                        align="center" >
                    <el-image
                            style="width:50px; height: 50px"
                            :src="returnGoods.product_image"
                            fit="cover"></el-image>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="product_name"
                        label="商品名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="type"
                        label="退货类型">
                    <template slot-scope="scope">
                        {{scope.row.type ? '买/卖双方协商一致':'未退货' }}
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="return_status"
                        label="退货状态">
                    <template slot-scope="scope">
                       {{scope.row.return_status ? '退货完成':'未退货' }}
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="pro_num"
                        label="退货数量">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="dateline"
                        label="退货时间">
                    <template slot-scope="scope">
                        {{new Date(Number(scope.row.dateline) * 1000).format()}}
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="买家">
                    <template slot-scope="scope">
                        <span>{{scope.row.nickname}}</span><br>
                        <span>{{scope.row.phone}}</span>
                    </template>

                </el-table-column>
            </el-table>
        </el-card>
        <el-card class="box-card caliang">
            <div slot="header" class="clearfix">
                <span>费用详情</span>
            </div>
            <div class="clearfix">
                <span style="font-size: 14px; font-weight: bold;display: inline-block;width: 70px">商品小计：</span><span>￥{{dataIled.subTotal}}</span>
            </div>
            <div class="clearfix">
                <span style="font-size: 14px; font-weight: bold;display: inline-block;width: 70px">运费：</span><span>￥{{dataIled.postage}}</span>
            </div>
            <div class="clearfix">
                <span style="font-size: 14px; font-weight: bold;display: inline-block;width: 70px">应收款：</span><span>￥{{dataIled.total}}</span>
            </div>
            <div style="margin: auto; width: 220px">

                <el-button type="primary" style="width: 100px;"
                           :disabled=" dataIled.status === 3 || dataIled.status === 4 ||  dataIled.status === 5 || dataIled.status === 6">
                    发货
                </el-button>
                <el-button type="primary" style="width: 100px;" @click="updata">修改</el-button>


            </div>
        </el-card>
    </div>
</template>
<style>
    .my-label {
        width: 150px;
    }

    .caliang {
        margin-bottom: 20px;
    }
</style>
<script>
    import {orderDetails, editDak, editStar} from '@/api/order'

    export default {
        name: 'orderedtails',

        data() {
            return {
                dataIled: {},
                jiaXing: false,
                detailsData:[],
                returnGoods:[],
                addressCopy:null
            }
        },
        created() {
            this.getOrder()
        },
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
            Method(value) {
                // 物流方式 express快递发货 selffetch 上门自提 self_choice 自选物流
                if (value === 'express') {
                    return '快递发货'
                } else if (value === 'selffetch') {
                    return '上门自提'
                } else if (value === 'self_choice') {
                    return '自选物流'
                }
            },
            // 0 h5, 1 app, 2 小程序, 3 收银台
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
        methods: {
            updataAddress(){
                const  data = this.addressCopy.replace(/[^\u4E00-\u9FA5]/g,'')
                console.log(data)
            },
            updata() {
                const data = {
                    bak: this.dataIled.bak,
                    orderId: this.$route.query.orderId,
                    star: this.dataIled.star
                }
                if (data.bak === '' || data.star > 0) {
                    editStar(data).then(res => {
                        this.$notify.success({
                            title: "成功",
                            message: "修改成功",
                        });
                        this.getOrder()
                    })
                } else if (data.star === 0 || data.bak !== '') {
                    editDak(data).then(res => {
                        this.$notify.success({
                            title: "成功",
                            message: "修改成功",
                        });
                        this.getOrder()
                    })
                } else {
                    editStar(data).then(res => {})
                    editDak(data).then(res => {
                        this.$notify.success({
                            title: "成功",
                            message: "修改成功",
                        });
                        this.getOrder()
                    })
                }
            },
            getOrder() {
                const orderId = this.$route.query.orderId;
                // console.log(orderId)
                orderDetails(orderId).then(res => {
                    console.log('订单详情', res)
                    this.dataIled = res.data.data
                    this.addressCopy = res.data.data.address
                    this.detailsData = res.data.data.orderProductVos
                    this.returnGoods = res.data.data.returnProductList

                })

            },
        }
    }
</script>
