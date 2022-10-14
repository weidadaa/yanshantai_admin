<template>
  <div class="app-container">
    <el-card class="box-card">
      <h3>基本信息</h3>
      <el-form ref="goods" :model="goods" label-width="180px">
        <el-form-item label="商品类型" prop="goodsSn">
          <el-tag size="50"> 普通商品 </el-tag>
        </el-form-item>

        <el-form-item label="商品大类">
          <el-select v-model="goods.categoryName" clearable>
            <el-option

              :key="goods.categoryId"
              :label="goods.categoryName"
              :value="goods.categoryId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="商品分组">
          <el-select v-model="goods.childCategory" clearable>
            <el-option
              v-for="item in brandList"
              :key="item.groupId"
              :label="item.groupName"
              :value="item.groupId"
            />
          </el-select>

        </el-form-item>

        <el-form-item label="本店商品分类">
          <el-cascader
                  v-model="catId"
                  :options="listArr"
                  @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <h3>商品信息</h3>
      <el-form
        ref="ruleForm"
        v-model="goods"
        label-width="100px"
        class="demo-ruleForm"
        size="30"
      >
        <el-form-item label="商品名称" prop="name" style="width: 500px">
          <el-input v-model="goods.name"></el-input>
        </el-form-item>

        <el-form-item label="商品价格" prop="price" style="width: 500px">
          <el-input placeholder="请输入内容" v-model="goods.price">
            <template slot="prepend">￥</template>
          </el-input>
        </el-form-item>

        <el-form-item label="计量" prop="metering" style="width: 500px">
          <el-input placeholder="请输入内容" v-model="goods.metering">
            <template slot="append">斤/ML</template>
          </el-input>
        </el-form-item>

        <el-form-item
          label="兑换积分"
          prop="name"
          style="width: 500px"
          :required="false"
          v-if="this.$route.query.productId === ''"
        >
          <div class="demo-input-size">
            <el-input placeholder="兑换积分">
              <template slot="prepend">积分</template>
            </el-input>
            +
            <el-input placeholder="兑换价格">
              <template slot="prepend">价格</template>
            </el-input>
          </div>
        </el-form-item>

        <el-form-item label="商品主图" prop="image">
          <el-upload
            action="http://10.1.2.244:10111/yantaishan/file/upload"
            :limit="5"
            :headers="headers"
            :on-exceed="uploadOverrun"
            :on-success="handleGalleryUrl"
            multiple
            accept=".jpg,.jpeg,.png,.gif"
            list-type="picture-card"
          >
            <img v-if="goods.image" :src="goods.image" class="avatar" />
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>

        <el-form-item label="商品详细介绍">
          <editor :init="editorInit" v-model="goods.pcDesc"/>
        </el-form-item>

        <el-form-item label="商品库存" prop="quantity" style="width: 500px">
          <el-input v-model="goods.quantity"></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <h3>商品库存/规格</h3>
      <el-row :gutter="20" type="flex" align="middle" style="padding: 20px 0">
        <el-col :span="10">
          <el-radio-group v-model="multipleSpec" @change="specChanged">
            <el-radio-button :label="false">默认标准规格</el-radio-button>
            <el-radio-button :label="true">多规格支持</el-radio-button>
          </el-radio-group>
        </el-col>

        <el-col v-if="multipleSpec" :span="10">
          <el-button
            :plain="true"
            type="primary"
            @click="handleSpecificationShow"
            >添加</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="specifications">
        <el-table-column property="specification" label="规格名" />

        <el-table-column property="value" label="规格值">
          <template slot-scope="scope">
            <el-tag type="primary">
              {{ scope.row.value }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="picUrl" label="规格图片">
          <template slot-scope="scope">
            <img v-if="scope.row.picUrl" :src="scope.row.picUrl" width="40" />
          </template>
        </el-table-column>

        <el-table-column property="reserve" label="库存" />

        <el-table-column
          v-if="multipleSpec"
          align="center"
          label="操作"
          width="250"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="mini"
              @click="handleSpecificationDelete(scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="specVisiable" title="设置规格">
        <el-form
          ref="specForm"
          :model="specForm"
          status-icon
          label-position="left"
          label-width="100px"
          style="width: 400px; margin-left: 50px"
        >
          <el-form-item label="规格名" prop="specification">
            <el-input v-model="specForm.specification" />
          </el-form-item>
          <el-form-item label="规格值" prop="value">
            <el-input v-model="specForm.value" />
          </el-form-item>
<!--          <el-form-item label="规格图片" prop="picUrl">-->
<!--            <el-upload-->
<!--              :action="uploadPath"-->
<!--              :show-file-list="false"-->
<!--              :headers="headers"-->
<!--              :on-success="uploadSpecPicUrl"-->
<!--              class="avatar-uploader"-->
<!--              accept=".jpg,.jpeg,.png,.gif"-->
<!--            >-->
<!--              <img-->
<!--                v-if="specForm.picUrl"-->
<!--                :src="specForm.picUrl"-->
<!--                class="avatar"-->
<!--              />-->
<!--              <i v-else class="el-icon-plus avatar-uploader-icon" />-->
<!--            </el-upload>-->
<!--          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="specVisiable = false">取消</el-button>
          <el-button type="primary" @click="handleSpecificationAdd"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </el-card>

    <el-card class="box-card">
      <h3>快递物流/其他</h3>
      <el-form label-width="180px">
        <el-form-item label="是否为推荐商品">
          <el-radio v-model="goods.platformRecommend" :label="1">是</el-radio>
          <el-radio v-model="goods.platformRecommend" :label="0">否</el-radio>
        </el-form-item>

        <el-form-item label="描述" prop="goodsDesc">
          <el-input style="width: 300px" v-model="goods.goodsDesc"></el-input>
        </el-form-item>

        <el-form-item label="是否预约商品">
          <el-radio v-model="goods.isReservation" :label="1">是</el-radio>
          <el-radio v-model="goods.isReservation" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="要求留言:">
          <el-form-item
            v-for="(domain, index) in dynamicValidateForm.domains"
            :key="domain.key"
            :prop="'domains.' + index + '.value'"
          >
            <el-card class="box-card">
              <el-form :inline="true" class="demo-form-inline">
                <el-input style="width: 70px" value="留言"></el-input>

                <el-select v-model="value" placeholder="请选择活动区域">
                  <el-option
                    v-for="item in goodsLiuyan"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                  ></el-option>
                </el-select>
                <el-button @click.prevent="removeDomain(domain)" type="danger"
                  >删除</el-button
                >
              </el-form>
            </el-card>
          </el-form-item>
          <el-button type="primary" @click="addDomain">+添加字段</el-button>
        </el-form-item>

        <el-form-item label="开售时间">
          <el-radio v-model="goods.soldTime" :label="0">立即开售</el-radio>
          <el-radio v-model="goods.soldTime" label="">定时开售</el-radio>

          <el-date-picker
            v-model="goods.soldTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="有无保修">
          <el-radio v-model="goods.warranty" label="0">无</el-radio>
          <el-radio v-model="goods.warranty" label="1">有</el-radio>
        </el-form-item>
        <el-form-item label="仅到店自提">
          <template>
            <el-radio v-model="goods.isZiti" :label="1">是</el-radio>
            <el-radio v-model="goods.isZiti" :label="0">否</el-radio>
          </template>
        </el-form-item>

        <el-form-item label="是否自动上架">
          <template>
            <el-radio v-model="goods.isTimeChangeStatus" :label="1"
              >是</el-radio
            >
            <el-radio v-model="goods.isTimeChangeStatus" :label="0"
              >否</el-radio
            >
            <!--                        &lt;!&ndash; `checked` 为 true 或 false &ndash;&gt;-->
            <!--                        <el-checkbox v-model="goods.isTimeChangeStatus"-->
            <!--                                     :checked2="goods.isTimeChangeStatus === 1? 'true':'false' ">开启-->
            <!--                        </el-checkbox>-->
          </template>
          <el-date-picker
            v-if="goods.isTimeChangeStatus === 1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="是否包邮">
          <el-radio v-model="goods.freePostage" :label="0">不包邮</el-radio>
          <el-radio v-model="goods.freePostage" :label="1"> 包邮</el-radio>
        </el-form-item>

        <el-form-item label="发货地" >
          <span>{{ goods.setSendAddress }}</span>
          <el-button
            v-if="goods.setSendAddress == null"
            type="primary"
            v-model="goods.setSendAddress"
            @click="setSendAddress"
            >设置发货地</el-button
          >
          <el-button
            v-else
            type="primary"
            v-model="goods.setSendAddress"
            @click="setSendAddress"
            >修改</el-button
          >
        </el-form-item>

        <el-form-item label="发票">
          <el-radio v-model="goods.invoice" label="1">有</el-radio>
          <el-radio v-model="goods.invoice" label="2">无</el-radio>
        </el-form-item>
      </el-form>
    </el-card>
    <!--        设置发货地拟态框-->
    <el-dialog
      title="设置发货地"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-cascader
        style="min-width: 300px"
        size="large"
        :options="options"
        v-model="goods.setSendAddress"
        @change="handleChange"
      >
      </el-cascader>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handlePublish">上架</el-button>
    </div>
  </div>
</template>

<style>
.el-card {
  margin-bottom: 10px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.input-new-keyword {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.avatar-uploader .el-upload {
  width: 145px;
  height: 145px;
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

.demo-input-size {
  display: flex;
}
</style>

<script>
import { regionData, CodeToText } from "element-china-area-data";
import {
  publishGoods,
  editGoods,
  detailGoods,
  listCatAndBrand,
  listGrouping
} from "@/api/goods";
import { createStorage, uploadPath ,getImg} from "@/api/storage";
import Editor from "@tinymce/tinymce-vue";
import { MessageBox } from "element-ui";
import { getToken } from "@/utils/auth";

export default {
  name: "GoodsCreate",
  components: { Editor },

  data() {
    return {
      catId: undefined,
      options: regionData,
      uploadPath,//图片上传地址
      getImg,
      newKeywordVisible: false,
      newKeyword: "",
      keywords: [],
      categoryList: [],
      listArr:[],//商品分类列表
      brandList: [], //商品分组列表
      dialogVisible: false, //发货地你拟态框
      // 是否自动上架
      checked1: null,
      checked2: null,
      radio: "1",
      // 留言格式
      goodsLiuyan: [
        { label: "文本格式", value: "1" },
        { label: "单选", value: "2" },
        { label: "数字格式", value: "3" },
        { label: "邮件格式", value: "4" },
        { label: "日期", value: "5" },
        { label: "时间", value: "6" },
        { label: "身份证号码", value: "7" },
        { label: "图片", value: "8" },
      ],

      // 动态添加会员特权绑定对象
      dynamicValidateForm: {
        domains: [],
        email: "",
      },
      // goods: {picUrl: '', gallery: [], isHot: false, isNew: true, isOnSale: true},
      goods: {
        name: "",
        price: "",
        metering: "",
        quantity: "",
        categoryId:0,
        categoryName:"酒水",
        storeCategoryId: null,
        weight: "100",//重量
        isTimeChangeStatus: undefined, //是否自动上下架
        soldTime: undefined, //出售时间
        setSendAddress: null, //设置发货地址
        platformRecommend: undefined, //是否推荐商品
        isZiti: undefined, //是否自提
        isReservation: undefined, //是否是预约商品
        warranty: "", //是否保修
        freePostage: undefined, //是否包邮费
        invoice: "", //发票
      },
      specVisiable: false,
      specForm: { specification: "", value: "", picUrl: "" },
      multipleSpec: false,
      specifications: [
        { specification: "规格", value: "标准", picUrl: "", reserve: "" },
      ],
      productVisiable: false,
      productForm: {
        id: 0,
        specifications: [],
        price: 0.0,
        number: 0,
        url: "",
      },
      products: [
        { id: 0, specifications: ["标准"], price: 0.0, number: 0, url: "" },
      ],
      attributeVisiable: false,
      attributeForm: { attribute: "", value: "" },
      attributes: [],
      // rules: {
      //   // goodsSn: [
      //   //   { required: true, message: "商品编号不能为空", trigger: "blur" },
      //   // ],
      //   price: [
      //     { required: true, message: "商品价格不能为空", trigger: "blur" },
      //   ],
      //   metering: [
      //     { required: true, message: "商品计量不能为空", trigger: "blur" },
      //   ],
      //   name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
      //   quantity: [
      //     { required: true, message: "库存不能为空", trigger: "blur" },
      //   ],
      // },
      editorInit: {
        language: "zh_CN",
        height: 500,
        convert_urls: false,
        plugins: [
          "advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount",
        ],
        toolbar: [
          "searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample",
          "hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen",
        ],
        images_upload_handler: function (blobInfo, success, failure) {
          const formData = new FormData();
          formData.append("file", blobInfo.blob());
          createStorage(formData)
            .then((res) => {
              success(res.data.data.url);
            })
            .catch(() => {
              failure("上传失败，请重新上传");
            });
        },
      },
    };
  },
  computed: {
    headers() {
      return {
        'token': getToken(),
      };
    },
  },
  created() {
    this.init();
  },

  methods: {
    // 发货地址返回值
    handleChange(value) {
      if (value[1] != null && value[2] != null) {
        var dz =
          CodeToText[value[0]] +
          "/" +
          CodeToText[value[1]] +
          "/" +
          CodeToText[value[2]];
      } else {
        if (value[1] != null) {
          dz = CodeToText[value[0]] + "/" + CodeToText[value[1]];
        } else {
          dz = CodeToText[value[0]];
        }
      }
      this.goods.setSendAddress = dz;
      this.dialogVisible = false;
    },
    // 分类次级联动
    kindChange(){
      console.log(123);
    },
    // 设置发货地拟态框
    setSendAddress() {
      this.dialogVisible = true;
    },
    // 动态添加表单
    addDomain() {
      // this.itemType =true;
      this.dynamicValidateForm.domains.push({
        value: "",
        key: Date.now(),
      });
    },
    // 删除会员特权表格
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    // 获取数据函数
    init: function () {
        // 列表分类数据
        listCatAndBrand().then((res) => {
          console.log("列表分类", res);
          res.data.data.forEach((element) => {
            let option = {
              value: element.catId,
              label: element.catName,
            }
            if(element.childCategory.length !== 0){
              const children =  []
              element.childCategory.forEach(item =>{
                children.push({
                  value: item.catId,
                  label: item.catName,
                })
              })
              option.children = children
            }
            this.listArr.push(option)
            console.log( this.listArr)
          });
          // this.brandList = res.data.data;
        });
        listGrouping().then((res) =>{
          console.log("分组列表",res)
          this.brandList =res.data.data.records
        })
        // return;

    },
    handleCategoryChange(value) {
      this.goods.categoryId = value[value.length - 1];
    },
    handleCancel: function () {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/goods/list" });
    },

    // 发布商品
    handlePublish: function () {
      this.goods.storeCategoryId = this.catId[1]
      publishGoods(this.goods)
        .then((response) => {
          this.$notify.success({
            title: "成功",
            message: "创建成功",
          });
          this.$router.push({ path: "/goods/list" });
        })
        .catch((response) => {
          MessageBox.alert("业务错误：" + response.data.errmsg, "警告", {
            confirmButtonText: "确定",
            type: "error",
          });
        });
    },
    handleClose(tag) {
      this.keywords.splice(this.keywords.indexOf(tag), 1);
      this.goods.keywords = this.keywords.toString();
    },
    showInput() {
      this.newKeywordVisible = true;
      this.$nextTick((_) => {
        this.$refs.newKeywordInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      const newKeyword = this.newKeyword;
      if (newKeyword) {
        this.keywords.push(newKeyword);
        this.goods.keywords = this.keywords.toString();
      }
      this.newKeywordVisible = false;
      this.newKeyword = "";
    },
    uploadPicUrl: function (response) {

    },
    // 商品主图方法
    uploadOverrun: function () {
      this.$message({
        type: "error",
        message: "上传文件个数超出限制!最多上传5张图片!",
      });
    },
    handleGalleryUrl(response, file, fileList) {
      this.goods.image = response.data
    },
    specChanged: function (label) {
      if (label === false) {
        this.specifications = [
          { specification: "规格", value: "标准", picUrl: "" },
        ];
        this.products = [
          { id: 0, specifications: ["标准"], price: 0.0, number: 0, url: "" },
        ];
      } else {
        this.specifications = [];
        this.products = [];
      }
    },
    // 规格图片
    uploadSpecPicUrl: function (response) {
      this.specForm.picUrl = response.data.url;
    },
    handleSpecificationShow() {
      this.specForm = { specification: "", value: "", picUrl: "" };
      this.specVisiable = true;
    },
    handleSpecificationAdd() {
      var index = this.specifications.length - 1;
      for (var i = 0; i < this.specifications.length; i++) {
        const v = this.specifications[i];
        if (v.specification === this.specForm.specification) {
          if (v.value === this.specForm.value) {
            this.$message({
              type: "warning",
              message: "已经存在规格值:" + v.value,
            });
            this.specForm = {};
            this.specVisiable = false;
            return;
          } else {
            index = i;
          }
        }
      }

      this.specifications.splice(index + 1, 0, this.specForm);
      this.specVisiable = false;

      this.specToProduct();
    },
    handleSpecificationDelete(row) {
      const index = this.specifications.indexOf(row);
      this.specifications.splice(index, 1);
      this.specToProduct();
    },
    specToProduct() {
      if (this.specifications.length === 0) {
        return;
      }
      // 根据specifications创建临时规格列表
      var specValues = [];
      var spec = this.specifications[0].specification;
      var values = [];
      values.push(0);

      for (var i = 1; i < this.specifications.length; i++) {
        const aspec = this.specifications[i].specification;

        if (aspec === spec) {
          values.push(i);
        } else {
          specValues.push(values);
          spec = aspec;
          values = [];
          values.push(i);
        }
      }
      specValues.push(values);

      // 根据临时规格列表生产货品规格
      // 算法基于 https://blog.csdn.net/tyhj_sf/article/details/53893125
      var productsIndex = 0;
      var products = [];
      var combination = [];
      var n = specValues.length;
      for (var s = 0; s < n; s++) {
        combination[s] = 0;
      }
      var index = 0;
      var isContinue = false;
      do {
        var specifications = [];
        for (var x = 0; x < n; x++) {
          var z = specValues[x][combination[x]];
          specifications.push(this.specifications[z].value);
        }
        products[productsIndex] = {
          id: productsIndex,
          specifications: specifications,
          price: 0.0,
          number: 0,
          url: "",
        };
        productsIndex++;

        index++;
        combination[n - 1] = index;
        for (var j = n - 1; j >= 0; j--) {
          if (combination[j] >= specValues[j].length) {
            combination[j] = 0;
            index = 0;
            if (j - 1 >= 0) {
              combination[j - 1] = combination[j - 1] + 1;
            }
          }
        }
        isContinue = false;
        for (var p = 0; p < n; p++) {
          if (combination[p] !== 0) {
            isContinue = true;
          }
        }
      } while (isContinue);

      this.products = products;
    },
    handleProductShow(row) {
      this.productForm = Object.assign({}, row);
      this.productVisiable = true;
    },
    uploadProductUrl: function (response) {
      this.productForm.url = response.data.url;
    },
    handleProductEdit() {
      for (var i = 0; i < this.products.length; i++) {
        const v = this.products[i];
        if (v.id === this.productForm.id) {
          this.products.splice(i, 1, this.productForm);
          break;
        }
      }
      this.productVisiable = false;
    },
    handleAttributeShow() {
      this.attributeForm = {};
      this.attributeVisiable = true;
    },
    handleAttributeAdd() {
      this.attributes.unshift(this.attributeForm);
      this.attributeVisiable = false;
    },
    handleAttributeDelete(row) {
      const index = this.attributes.indexOf(row);
      this.attributes.splice(index, 1);
    },
  },
};
</script>
