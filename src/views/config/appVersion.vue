<template>
  <div class="app-container">
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
        label="版本ID"
        prop="baseid"
        sortable
      />

      <el-table-column align="center" label="版本号" prop="basenumber" />
      <el-table-column align="center" label="网址" prop="basetext" />

      <el-table-column align="center" label="更新类型" prop="basetype">
        <template slot-scope="scope" v-if="scope.row.basetype == '是'">
          <el-tag>强制</el-tag>
        </template>
        <template slot-scope="scope" else>
          <el-tag>非强制</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        min-width="300px"
        label="更新信息"
        prop="basedetail"
      />

      <!-- 比例编辑 -->
      <el-table-column
        align="center"
        label="比例编辑"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handeleBaseEdit(scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 比例编辑对话框 -->
    <el-dialog :visible.sync="editTyep" title="版本编辑">
      <el-form
        ref="baseDetail"
        :model="baseDetail"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="版本ID" prop="baseid">
          <el-input v-model="baseDetail.baseid" />
        </el-form-item>
        <el-form-item label="版本号" prop="basenumber">
          <el-input v-model="baseDetail.basenumber" />
        </el-form-item>
        <el-form-item label="网址" prop="basetext">
          <el-input v-model.number="baseDetail.basetext" />
        </el-form-item>

        <el-form-item label="更新类型" prop="basetype">
          <el-radio-group v-model.number="baseDetail.basetype">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item size="30" label="更新信息">
          <el-input
            type="textarea"
            v-model="baseDetail.basedetail"
            size="30px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editTyep = false">取消</el-button>
        <el-button type="primary" @click="updateBase">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBase, updateBase } from "@/api/appVersion";

export default {
  name: "Base",
  data() {
    return {
      list: [],
      gteArr: null,
      listLoading: true,
      downloadLoading: false,
      editTyep: false,
      baseDetail: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取数据
    getList() {
      this.listLoading = true;
      listBase()
        .then((response) => {
          console.log(1, response);
          this.gteArr = response.data.data;
          this.list.push(this.gteArr);
          this.listLoading = false;
        })
        .catch(() => {
          this.list = [];
          this.listLoading = false;
        });
    },
    // 版本编辑模态框
    handeleBaseEdit(row) {
      this.baseDetail = row;
      this.editTyep = true;
    },
    // 版本更新
    updateBase() {
      // const { ...data } = this.baseDetail;
      console.log(this.baseDetail);
      updateBase(this.baseDetail)
        .then((response) => {
          this.editTyep = false;
          this.getList();
          this.$notify.success({
            title: "成功",
            message: "更新成功",
          });
        })
        .catch((response) => {
          this.$notify.error({
            title: "失败",
            message: response.data.errmsg,
          });
        });
    },
  },
};
</script>

<style>
</style>
