<template>
    <div>


        <el-form ref="form" :model="form" label-width="150px" :inline="true" class="demo-form-inline">
            <el-form-item label="外部交易单号：">
                <el-input placeholder="外部交易单号"></el-input>
            </el-form-item>
            <el-form-item label="时间">
                <el-select placeholder="选择时间"  style="width: 165px">
                    <el-option
                            v-for=" i in timeText"
                            :label="i.label"
                            :value="i.value"
                            :key="i.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-date-picker
                    v-model="value2"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
            </el-date-picker>
            <br>
            <el-form-item label="商户支付单号：">
                <el-input placeholder="商户支付单号"></el-input>
            </el-form-item>
            <el-form-item label="收货人姓名：">
                <el-input placeholder="收货人姓名"></el-input>
            </el-form-item>
            <el-form-item label="收货人号码：">
                <el-input placeholder="收货人号码"></el-input>
            </el-form-item>
            <br>

            <el-form-item label="订单号：">
                <el-input placeholder="订单号"></el-input>
            </el-form-item>

            <el-form-item label="付款方式">
                <el-select placeholder="付款方式"  style="width: 165px">
                    <el-option
                            v-for=" i in timeText"
                            :label="i.label"
                            :value="i.value"
                            :key="i.value"
                    ></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="快递物流方式方式">
                <el-select placeholder="快递物流方式方式"  style="width: 165px">
                    <el-option
                            v-for=" i in timeText"
                            :label="i.label"
                            :value="i.value"
                            :key="i.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <br>
            <el-form-item label="订单类型:">
                <el-select placeholder="订单类型"  style="width: 165px">
                    <el-option label="全部" value="quanbu"></el-option>
                    <el-option label="普通订单" value="putong"></el-option>
                    <el-option label="分销订单" value="fenxiao"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="下单渠道:">
                <el-select placeholder="下单渠道"  style="width: 165px">
                    <el-option label="全部" value="quanbu"></el-option>
                    <el-option label="平台小程序" value="pingtai"></el-option>
                    <el-option label="独立版小程序" value="duli"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="核销人员:">
                <el-select placeholder="核销人员"  style="width: 165px">
                    <el-option label="全部" value="quanbu"></el-option>
                </el-select>
            </el-form-item>
            <br>
            <el-form-item label="所属活动:" >
                <el-select placeholder="所属活动"  style="width: 165px">
                    <el-option
                            v-for=" i in activity"
                            :label="i.label"
                            :value="i.value"
                            :key="i.value"
                    ></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="优先处理:">
                <el-checkbox v-model="checked"></el-checkbox>
            </el-form-item>
            <br>
            <el-form-item label="商品名称：">
                <el-input placeholder="商品名称"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="门店:">
                <el-select  style="width: 165px">
                    <el-option label="全部" value="quanbu"></el-option>
                    <el-option label="总店-燕台山酒庄" value="zongdian"></el-option>
                    <el-option label="门店-燕台山酒庄-广州" value="guangzhou"></el-option>
                    <el-option label="门店-崇左大新店" value="congzuo"></el-option>
                </el-select>
            </el-form-item>
            <el-button type="primary" @click="onSubmit" style="margin-left: 200px">查询</el-button>
        </el-form>

    </div>
</template>

<script>
    export default {
        name: "Inquire",
        data() {
            return {
                timeText: [
                    {label: '下单时间', value: '1'},
                    {label: '付款时间', value: '2'},
                    {label: '发货时间', value: '3'},
                    {label: '签收时间', value: '4'},
                    {label: '取消时间', value: '5'},
                    {label: '退款时间', value: '6'},
                    {label: '预约核销时间', value: '7'},
                    {label: '自提核销时间', value: '8'},
                    {label: '配送日期', value: '9'},
                    {label: '周期配送时间', value: '10'},
                ],
                activity: [
                    {label: '全部', value: '1'},
                    {label: '拼团', value: '2'},
                    {label: '砍价', value: '3'},
                    {label: '秒杀', value: '4'},
                    {label: '单位团购', value: '5'},

                ],
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
        methods: {
            onSubmit() {
                console.log('查询')
            },
        }
    }
</script>