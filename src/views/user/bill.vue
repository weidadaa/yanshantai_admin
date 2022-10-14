<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form :inline="true"  class="demo-form-inline">
        <el-form-item label="会员昵称：">
          <el-input  placeholder="请输入会员昵称"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">筛选</el-button>
        </el-form-item>
      </el-form>

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
      <el-table-column
        align="center"
        width="100px"
        label="用户ID"
        prop="userId"
        sortable
      />

      <el-table-column align="center" label="用户名" prop="username" />

      <el-table-column align="center" label="操作类别" prop="status">
        <template slot-scope="scope">
          <el-tag>{{ statusDic[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="变更币种" prop="type">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.type }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="调整额度" prop="income" />
      <el-table-column
        align="center"
        min-width="300px"
        label="备注信息"
        prop="remarks"
      />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { fetchList } from "@/api/bill";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "Bill",
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        username: undefined,
        limitRangeMin: undefined,
        limitRangeMax: undefined,
        timveArray: [],
        sort: "add_time",
        order: "desc",
      },
      downloadLoading: false,
      statusDic: ["代币转换", "提现", "购物"],
      // zcmclist: ["FSP", "FST", "SUN", "SUND", "奖励金", "消费券"],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取数据
    getList() {
      this.listLoading = true;
      if (this.listQuery.timeArray && this.listQuery.timeArray.length === 2) {
        this.listQuery.start = this.listQuery.timeArray[0];
        this.listQuery.end = this.listQuery.timeArray[1];
      } else {
        this.listQuery.start = null;
        this.listQuery.end = null;
      }
      if (this.listQuery.userId) {
        userDetail(this.listQuery.userId)
          .then((response) => {
            this.list = [];
            if (response.data.data) {
              this.list.push(response.data.data);
              this.total = 1;
              this.listLoading = false;
            } else {
              this.list = [];
              this.total = 0;
              this.listLoading = false;
            }
          })
          .catch(() => {
            this.list = [];
            this.total = 0;
            this.listLoading = false;
          });
      } else {
        const { ...data } = this.listQuery;
        delete data["timeArray"];
        fetchList(data)
          .then((response) => {
            console.log(response)
            this.list = response.data.data.list;
            this.total = response.data.data.total;
            this.listLoading = false;
          })
          .catch(() => {
            this.list = [];
            this.total = 0;
            this.listLoading = false;
          });
      }
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "用户名",
          "操作类别",
          "变更币种",
          "调整额度",
          "备注信息",
        ];
        const filterVal = [
          "username",
          "mobile",
          "gender",
          "birthday",
          "status",
        ];
        excel.export_json_to_excel2(tHeader, this.list, filterVal, "资金账单");
        this.downloadLoading = false;
      });
    },
  },
};
</script>

<style>
</style>
