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
        label="比例ID"
        prop="baseid"
        sortable
      />

      <el-table-column align="center" label="比例号码" prop="basenumber" />
      <el-table-column align="center" label="比例值" prop="basetext" />

      <el-table-column align="center" label="比例类型" prop="basetype">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.basetype }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        min-width="300px"
        label="比例信息"
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
    <el-dialog :visible.sync="editBase" title="比例编辑">
      <el-form
        ref="baseDetail"
        :model="baseDetail"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="比例ID" prop="baseid">
          <el-input v-model="baseDetail.baseid" :disabled="true" />
        </el-form-item>
        <el-form-item label="比例号码" prop="basenumber">
          <el-input v-model="baseDetail.basenumber" :disabled="true" />
        </el-form-item>
        <el-form-item label="比例值" prop="basetext">
          <el-input v-model.number="baseDetail.basetext" />
        </el-form-item>
        <el-form-item label="比例类型" prop="basetype">
          <el-tag>{{ baseDetail.basetype }}</el-tag>
        </el-form-item>
        <el-form-item size="30" label="比例信息">
          <el-input
            type="textarea"
            v-model="baseDetail.basedetail"
            size="30px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editBase = false">取消</el-button>
        <el-button type="primary" @click="updateBase">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWx, updateWx } from "@/api/config";

export default {
  name: "Base",
  data() {
    return {
      list: null,
      listLoading: true,
      downloadLoading: false,
      editBase: false,
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
      listWx()
        .then((response) => {
          console.log(123, response);
          this.list = response.data.data;
          this.listLoading = false;
        })
        .catch(() => {
          this.list = [];
          this.listLoading = false;
        });
    },
    // 比例编辑模态框
    handeleBaseEdit(row) {
      this.baseDetail = row;
      this.editBase = true;
    },
    // 比例更新
    updateBase() {
      updateWx(this.baseDetail)
        .then((response) => {
          this.$notify.success({
            title: "成功",
            message: "更新用户成功",
          });
          this.editbase = false;
          this.getList();
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
