<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">

        <el-form-item label="会员昵称：">
          <el-input v-model="listQuery.username" placeholder="请输入会员昵称"></el-input>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="handleFilter">筛选</el-button>
        </el-form-item>

        <el-form-item >
          <el-select v-model="listQuery.region" placeholder="请选择要导出记录">
            <el-option label="导出当前筛选出的记录" value="shanghai"></el-option>
            <el-option label="导出的已勾选的记录" value="beijing"></el-option>
            <el-option label="导出全部记录" value="shanghai"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
                  :loading="downloadLoading"
                  class="filter-item"
                  type="success"
                  icon="el-icon-download"
                  @click="handleDownload">
            导出会员
          </el-button>
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
              type="selection"
              width="55">
      </el-table-column>
      <el-table-column
              label="会员ID"
              width="120" prop="id">

      </el-table-column>
      <el-table-column
              prop="name"
              label="会员信息"
              width="120">
      </el-table-column>
      <el-table-column align="center" label="用户头像" width="80">
        <template slot-scope="scope">
          <el-avatar :src="scope.row.avatar"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="积分余额" prop="fspt"/>

      <el-table-column align="center" label="账户余额" prop="fspt"/>
      <el-table-column
              align="center"
              width="150"
              label="手机号码"
              prop="mobile"
      />
      <el-table-column
              align="center"
              width="150"
              label="直属店铺(来源)"
              prop="mobile"
      />
      <el-table-column
              label="日期"
              width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>

      <!-- 消费卷编辑 -->
<!--      <el-table-column-->
<!--              align="center"-->
<!--              label="操作"-->
<!--              class-name="small-padding fixed-width"-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="primary" size="mini" @click="handleDetail(scope.row)"-->
<!--          >编辑-->
<!--          </el-button-->
<!--          >-->
<!--          <el-button-->
<!--                  type="primary"-->
<!--                  size="mini"-->
<!--                  @click="handeleXiaoFeiQuan(scope.row)"-->
<!--          >充值-->
<!--          </el-button>-->
<!--        </template>-->


<!--      </el-table-column>-->

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
import {fetchList, userDetail} from "@/api/user";
import {numAdd} from "@/utils/operation";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "Performance",
  components: {Pagination},
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        username: undefined,
        recommender: undefined,
        mobile: undefined,
        userId: undefined,
        timeArray: [],
        sort: "add_time",
        order: "desc",
      },
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
      downloadLoading: false,
      levelDic: ["T0", "T1", "T2", "T3", "T4", "T5"],
      statusDic: ["可用", "禁用", "注销"]
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
        const {...data} = this.listQuery;
        delete data["timeArray"];
        fetchList(data)
            .then((response) => {
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
        const tHeader = ["用户名", "团队总数", "总业绩", "个人业绩"];
        const filterVal = ["username", "mobile", "gender", "birthday"];
        excel.export_json_to_excel2(tHeader, this.list, filterVal, "业绩查询");
        this.downloadLoading = false;
      });
    },
    // 总和统计
    getSummaries(param) {
      // 需求计算总和的字段
      const sumArr = ['fsp', 'sun', 'fspt']
      // 空占位符
      const emptyText = 'N/A'

      const {columns, data} = param;
      const sums = [];

      if (data !== null) {
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总和';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value)) && sumArr.includes(columns[index].property)) {
            // console.log(sums)
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return Math.floor(numAdd(prev, curr) * 100) / 100;
              } else {
                return prev;
              }
            }, 0);
          } else {
            sums[index] = emptyText;
          }
        });
      }

      return sums;
    },
  },
};
</script>

<style>
.serveCheckBox {
  zoom: 200%;
}
</style>
