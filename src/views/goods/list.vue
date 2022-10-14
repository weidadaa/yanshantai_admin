<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-button class="filter-item" type="success" @click="handleCreate"
          >发布商品</el-button
        >
<!--        <el-button class="filter-item" type="primary" @click="changePlatform"-->
<!--          >改平台分类</el-button-->
<!--        >-->
<!--        <el-button class="filter-item" type="primary" @click="changeShop"-->
<!--          >改本店分类</el-button-->
<!--        >-->
<!--        <el-button class="filter-item" type="primary" @click="changeGrouping"-->
<!--          >改分组</el-button-->
<!--        >-->
<!--        <el-button class="filter-item" type="warning" @click="changeDown"-->
<!--          >下架</el-button-->
<!--        >-->

        <!--    <el-button class="filter-item" type="danger" @click="handleCreate">删除</el-button>-->
      </div>

      <div>
        <el-input
          v-model="listQuery.name"
          clearable
          class="filter-item"
          style="width: 160px"
          placeholder="请输入商品名称"
        />
        &nbsp;
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
          >查找</el-button
        >
        &nbsp;

        <el-select v-model="listQuery.region" placeholder="请选择要导出记录">
          <el-option label="导出当前筛选出的记录" value="shanghai"></el-option>
          <el-option label="导出的已勾选的记录" value="beijing"></el-option>
          <el-option
            label="导出全部记录"
            value="shanghai"
          ></el-option> </el-select
        >&nbsp;

        <el-button
          :loading="downloadLoading"
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          @click="handleDownload"
          >导出
        </el-button>
      </div>
    </div>

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column type="selection" width="55"> </el-table-column>

      <el-table-column align="center" property="iconUrl" label="图片">
        <template slot-scope="scope">
          <el-image
            :src="thumbnail(scope.row.image)"
            :preview-src-list="toPreview(scope.row, scope.row.image)"
            style="width: 40px; height: 40px"
          />
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        min-width="100"
        label="名称"
        prop="name"
      />

      <el-table-column align="center" label="当前价格" prop="price" sortable />

      <el-table-column align="center" label="商品ID" prop="productId" />

      <el-table-column align="center" label="平台分类" prop="categoryName" />

      <el-table-column
        align="center"
        label="本店分类"
        prop="productCategory.catName"
      />

      <el-table-column align="center" label="规格数量" prop="skuNum" />

      <el-table-column align="center" label="所属分组">
        <template slot-scope="scope">
          <span v-if="scope.row.groupName === null">暂无分组</span>
          <span v-else>{{ scope.row.groupName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="库存" prop="quantity" sortable />

      <el-table-column align="center" label="总销量" prop="sales" sortable />

      <el-table-column
        align="center"
        min-width="150"
        label="创建时间"
        prop="dateAdded"
        sortable
      >
        <template slot-scope="scope">
          <span>{{
            new Date(Number(scope.row.dateAdded) * 1000).format()

          }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="序号" prop="sort" sortable />

      <el-table-column
        align="center"
        label="操作"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)"
            >删除</el-button
          >
          <el-button
            type="success"
            size="mini"
            @click="handleTuiguang(scope.row)"
            >推广商品</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.currentPage"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>

    <!--        改平台拟态框-->

    <el-dialog title="该平台分类" :visible.sync="Platform" width="30%">
      <span>该平台分类</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Platform = false">取 消</el-button>
        <el-button type="primary" @click="Platform = false">确 定</el-button>
      </span>
    </el-dialog>
    <!--        改本店分类拟态框-->

    <el-dialog title="改本店分类" :visible.sync="Shop" width="30%">
      <span>改本店分类</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Shop = false">取 消</el-button>
        <el-button type="primary" @click="Shop = false">确 定</el-button>
      </span>
    </el-dialog>

    <!--        改分组拟态框-->

    <el-dialog title="改分组" :visible.sync="Grouping" width="30%">
      <el-select v-model="groupingArr" multiple placeholder="请选择">
        <el-option
                v-for="item in groupingArr"
                :key="item.groupId"
                :label="item.groupName"
                :value="item.groupId">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Grouping = false">取 消</el-button>
        <el-button type="primary" @click="Grouping = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style>
.table-expand {
  font-size: 0;
  padding-left: 60px;
}

.table-expand label {
  width: 100px;
  color: #99a9bf;
}

.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
}

.gallery {
  width: 80px;
  margin-right: 10px;
}

.goods-detail-box img {
  width: 100%;
}

.filter-container {
  display: flex;
  justify-content: space-between;
}

.filter-container div:nth-child(2) {
  display: flex;
  align-content: center;
}
</style>

<script>
import { listGoods, deleteGoods,listGrouping,listCatAndBrand,detailGoods } from "@/api/goods";
import BackToTop from "@/components/BackToTop";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { thumbnail, toPreview } from "@/utils/index";

export default {
  name: "GoodsList",
  components: { BackToTop, Pagination },
  data() {
    return {
      groupingArr:[],//分组列表
      Platform: false, //改平台拟态框
      Shop: false, //改本店拟态框
      Grouping: false, //改分组拟态框
      thumbnail,
      toPreview,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        goodsSn: undefined,
        name: undefined,
      },
      goodsDetail: "",
      detailDialogVisible: false,
      downloadLoading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    changeDown() {
      console.log("下架");
    },
    // 改本店分类
    changeGrouping() {
      this.Grouping = true;
      listGrouping().then(res =>{
        console.log('分组列表', res);
        this.groupingArr = res.data.data.records
      })
      console.log("改分组");
    },
    // 改本店分类
    changeShop() {
      this.Shop = true;
      console.log("改本店分类");
    },

    // 改平台分类
    changePlatform() {
      this.Platform = true;
      console.log("改发布平台");
    },

    getList() {
      this.listLoading = true;
      listGoods(this.listQuery)
        .then((response) => {
          this.list = response.data.data.records;
          console.log(this.list, "出售列表");
          //   console.log(this.list);
          this.total = response.data.data.total;
          this.listLoading = false;
        })
        .catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleCreate() {
      this.$router.push({ path: "/goods/create" });
    },
    // 编辑按钮
    handleUpdate(row) {
      this.$router.push({
        path: "/goods/release",
        query: { productId: row.productId },
      });
    },

    handleTuiguang() {
      console.log("推广");
    },
    showDetail(detail) {
      this.goodsDetail = detail;
      this.detailDialogVisible = true;
    },
    handleDelete(row) {
    
      this.$confirm("确定删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.$router.push({
            query: { productId: row.productId },
          });
          const productId = this.$route.query.productId;
          deleteGoods(productId)
            .then((response) => {
              this.$notify.success({
                title: "成功",
                message: "删除成功",
              });
              this.getList();
            })
            .catch((response) => {
              this.$notify.error({
                title: "失败",
                message: response.data.errmsg,
              });
            });
        })
        .catch(() => {});
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "商品ID",
          "商品编号",
          "名称",
          "专柜价格",
          "当前价格",
          "是否新品",
          "是否热品",
          "是否在售",
          "首页主图",
          "宣传图片列表",
          "商品介绍",
          "详细介绍",
          "商品图片",
          "商品单位",
          "关键字",
          "类目ID",
          "品牌商ID",
        ];
        const filterVal = [
          "id",
          "goodsSn",
          "name",
          "counterPrice",
          "retailPrice",
          "isNew",
          "isHot",
          "isOnSale",
          "listPicUrl",
          "gallery",
          "brief",
          "detail",
          "picUrl",
          "goodsUnit",
          "keywords",
          "categoryId",
          "brandId",
        ];
        excel.export_json_to_excel2(tHeader, this.list, filterVal, "商品信息");
        this.downloadLoading = false;
      });
    },
  },
};
</script>
