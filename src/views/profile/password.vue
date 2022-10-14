<template>
  <div class="app-container">
    <div class="filter-container">
      <p>温馨提示：</p>
      <p> 1、隐身券 - 不在前台展示，用户无法领取或通过购物获赠，需要由商家手动发券，赠送券无法设置为隐身券。</p>
      <p> 2、除 使用说明 外其它要必填</p>
    </div>

    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="券类型：">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">优惠券</el-radio>
          <el-radio :label="2">赠送券</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="券名称：" >
        <el-input v-model="form.name" style="width: 150px"></el-input>
      </el-form-item>

      <el-form-item label="面值：">
        <el-input v-model="form.faceMoney" style="width: 150px">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>

      <el-form-item label="订单金额：">
        <el-radio-group v-model="form.limitMoney">
          <el-radio :label="0">不限制</el-radio>
          <el-radio :label="1">限制</el-radio>
        </el-radio-group>
       <div style="display: inline-block;" v-show="form.limitMoney === 1"> 满<el-input v-model="form.faceMoney"  style="width: 150px"></el-input>元可用</div>
      </el-form-item>

      <el-form-item label="前台展示：" v-show="form.type === 2">
        <el-radio-group v-model="form.publicShow">
          <el-radio label="1">展示(赠送或用户领券)</el-radio>
          <el-radio label="0">隐藏(商家手动发券)</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="每人限领：" v-show="form.type === 2">
        <el-select v-model="mostHave" placeholder="请选择">
          <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="发放总量：">
        <el-input v-model="form.name" style="width: 150px">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>

      <el-form-item label="有效时间：">
        <el-radio-group v-model="form.limitMoney">
          <el-radio :label="1">固定区间</el-radio>
          <el-radio :label="0">固定时长</el-radio>
        </el-radio-group>

        <el-date-picker
                v-if="form.limitMoney===1"
                v-model="value1"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
        </el-date-picker>
        <div style="display: inline-block" v-else>
          <span>领取</span>
          <el-input v-model="form.name" style="display: inline-block;width:100px" placeholder="非负整数"></el-input>
          天后生效, 有效期 <el-input v-model="form.name" style="display: inline-block;width:100px" placeholder="正整数"></el-input> 天
        </div>
      </el-form-item>



      <el-form-item label="可用时段：">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="适用商品：">
        <el-radio-group v-model="form.limitMoney">
          <el-radio :label="0">全店通用 </el-radio>
          <el-radio :label="1">指定商品</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="使用说明：">
        <el-input
                style="width: 250px"
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                v-model="textarea">
        </el-input>
      </el-form-item>

      <el-form-item label="适用门店：">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
  .filter-container{
    margin: 10px;
    padding: 10px;
    border-radius: 5px;
    background-color: #f3f3f3;
    p{
      font-size:14px ;
    }
  }
</style>
<script>
import { Coupon } from '@/api/profile'
const cityOptions = ['周一', '周二', '周三', '周四','周五','周六','周日'];
export default {
  name: 'ChangePassword',
  data() {
    return {
      checkAll: false,
      checkedCities: [],
      cities: cityOptions,
      isIndeterminate: true,
      options:[
        {  value: '0', label: '不限张'},
        {  value: '1', label: '1张'},
        {  value: '2', label: '2张'},
        {  value: '3', label: '3张'},
        {  value: '4', label: '4张'},
        {  value: '5', label: '5张'},
        {  value: '10', label: '10张'},
      ],
      form:{
        type:1,
        limitMoney:0,
      }
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    }
  }
}
</script>
