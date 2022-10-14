<template>
    <div class="app-container">
        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <div class="text">
                <div class="right-text">
                    <p style="font-size: 14px; color: #000; margin-bottom: 10px">
                        <span>可提现金额：</span>
                    </p>
                    <p style="font-size: 12px; color: #666">
                        <span style="font-size: 25px; color: #f60">0.00</span>元
                        <el-button type="primary" size="mini">我要提现</el-button>
                        <el-button type="text">提现记录</el-button>
                    </p>
                    <p style="font-size: 12px; color: #000">
            <span>待分出利润：</span
            ><i style="color: red; font-weight: bold; font-size: 12px">0.00</i
                    >元
                    </p>
                </div>
            </div>
        </div>

        <!-- 查询结果 -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="订单交易" name="first">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="支付流水：">
                        <el-input placeholder="支付流水"></el-input>
                    </el-form-item>
                    <el-form-item label="订单号：">
                        <el-input placeholder="订单号"></el-input>
                    </el-form-item>
                    <el-form-item label="支付时间：">
                        <el-date-picker
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="订单状态：">
                        <el-select placeholder="请选择">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>

                <el-table
                        v-loading="listLoading"
                        :data="a"
                        element-loading-text="正在查询中。。。"
                        border
                        fit
                        highlight-current-row
                        row-key="id"
                >
                    <el-table-column align="center" label="订单ID" prop="id" />

                    <el-table-column align="center" label="订单号：" prop="name" />

                    <!--                    <el-table-column align="center" property="iconUrl" label="类目图标">-->
                    <!--                        <template slot-scope="scope">-->
                    <!--                            <img v-if="scope.row.iconUrl" :src="scope.row.iconUrl" width="40">-->
                    <!--                        </template>-->
                    <!--                    </el-table-column>-->

                    <!--                    <el-table-column align="center" property="picUrl" label="类目图片">-->
                    <!--                        <template slot-scope="scope">-->
                    <!--                            <el-image :src="thumbnail(scope.row.picUrl)"-->
                    <!--                                      :preview-src-list="toPreview(scope.row, scope.row.picUrl)"-->
                    <!--                                      style="width: 80px; height: 40px"/>-->
                    <!--                        </template>-->
                    <!--                    </el-table-column>-->

                    <el-table-column align="center" label="支付流水号" prop="keywords" />

                    <el-table-column align="center" label="订单金额" prop="desc" />
                    <el-table-column align="center" label="收益(元)" prop="name" />
                    <el-table-column align="center" label="分润(元)" prop="name" />
                    <el-table-column align="center" label="退货(元)" prop="name" />
                    <el-table-column align="center" label="订单状态" prop="name" />
                    <el-table-column align="center" label="下单时间">
                        <template slot-scope="scope"> </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="操作"
                            width="200"
                            class-name="small-padding fixed-width"
                    >
                        <template slot-scope="scope">
                            <el-button
                                    v-permission="['POST /admin/category/update']"
                                    type="primary"
                                    size="mini"
                                    @click="handleUpdate(scope.row)"
                            >编辑
                            </el-button>
                            <el-button
                                    v-permission="['POST /admin/category/delete']"
                                    type="danger"
                                    size="mini"
                                    @click="handleDelete(scope.row)"
                            >删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="二维码收款" name="second">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="支付流水：">
                        <el-input placeholder="支付流水"></el-input>
                    </el-form-item>
                    <el-form-item label="订单号：">
                        <el-input placeholder="订单号"></el-input>
                    </el-form-item>
                    <el-form-item label="支付时间：">
                        <el-date-picker
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>

                <el-table
                        v-loading="listLoading"
                        :data="a"
                        element-loading-text="正在查询中。。。"
                        border
                        fit
                        highlight-current-row
                        row-key="id"
                >
                    <el-table-column align="center" label="类目ID" prop="id" />

                    <el-table-column align="center" label="类目名" prop="name" />

                    <el-table-column align="center" property="iconUrl" label="类目图标">
                        <template slot-scope="scope">
                            <img
                                    v-if="scope.row.iconUrl"
                                    :src="scope.row.iconUrl"
                                    width="40"
                            />
                        </template>
                    </el-table-column>

                    <el-table-column align="center" property="picUrl" label="类目图片">
                        <template slot-scope="scope">
                            <el-image
                                    :src="thumbnail(scope.row.picUrl)"
                                    :preview-src-list="toPreview(scope.row, scope.row.picUrl)"
                                    style="width: 80px; height: 40px"
                            />
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="关键字" prop="keywords" />

                    <el-table-column
                            align="center"
                            min-width="100"
                            label="简介"
                            prop="desc"
                    />

                    <el-table-column align="center" label="级别" prop="level">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.level === 'L1' ? 'primary' : 'info' "
                            >{{ scope.row.level === 'L1' ? '一级类目' : '二级类目' }}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column
                            align="center"
                            label="操作"
                            width="200"
                            class-name="small-padding fixed-width"
                    >
                        <template slot-scope="scope">
                            <el-button
                                    v-permission="['POST /admin/category/update']"
                                    type="primary"
                                    size="mini"
                                    @click="handleUpdate(scope.row)"
                            >编辑
                            </el-button>
                            <el-button
                                    v-permission="['POST /admin/category/delete']"
                                    type="danger"
                                    size="mini"
                                    @click="handleDelete(scope.row)"
                            >删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style scoped>
    .filter-item {
        margin-left: 100px;
    }

    .avatar-uploader .el-upload {
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
</style>

<script>
    import {
        listCategory,
        listCatL1,
        createCategory,
        updateCategory,
        deleteCategory
    } from "@/api/category";
    import { uploadPath } from "@/api/storage";
    import { getToken } from "@/utils/auth";
    import { thumbnail, toPreview } from "@/utils/index";

    export default {
        name: "Category",
        data() {
            return {
                thumbnail,
                toPreview,
                uploadPath,
                activeName: "first",
                list: [],
                listLoading: true,
                catL1: {},
                dataForm: {
                    id: undefined,
                    name: "",
                    keywords: "",
                    level: "L2",
                    pid: 0,
                    desc: "",
                    iconUrl: "",
                    picUrl: ""
                },
                dialogFormVisible: false,
                dialogStatus: "",
                textMap: {
                    update: "编辑",
                    create: "创建"
                },
                rules: {
                    name: [{ required: true, message: "类目名不能为空", trigger: "blur" }]
                }
            };
        },
        computed: {
            headers() {
                return {
                    "X-Litemall-Admin-Token": getToken()
                };
            }
        },
        created() {
            this.getList();
            this.getCatL1();
        },
        methods: {
            handleClick() {
                console.log("tab栏切换");
            },
            getList() {
                this.listLoading = true;
                listCategory()
                    .then((response) => {
                        this.list = response.data.data.list;
                        this.listLoading = false;
                    })
                    .catch(() => {
                        this.list = [];
                        this.listLoading = false;
                    });
            },
            getCatL1() {
                listCatL1().then((response) => {
                    this.catL1 = response.data.data.list;
                });
            },
            resetForm() {
                this.dataForm = {
                    id: undefined,
                    name: "",
                    keywords: "",
                    level: "L2",
                    pid: 0,
                    desc: "",
                    iconUrl: "",
                    picUrl: ""
                };
            },
            onLevelChange: function (value) {
                if (value === "L1") {
                    this.dataForm.pid = 0;
                }
            },
            handleCreate() {
                this.resetForm();
                this.dialogStatus = "create";
                this.dialogFormVisible = true;
                this.$nextTick(() => {
                    this.$refs["dataForm"].clearValidate();
                });
            },
            uploadIconUrl: function (response) {
                this.dataForm.iconUrl = response.data.url;
            },
            uploadPicUrl: function (response) {
                this.dataForm.picUrl = response.data.url;
            },
            createData() {
                this.$refs["dataForm"].validate((valid) => {
                    if (valid) {
                        createCategory(this.dataForm)
                            .then((response) => {
                                this.getList();
                                // 更新L1目录
                                this.getCatL1();
                                this.dialogFormVisible = false;
                                this.$notify.success({
                                    title: "成功",
                                    message: "创建成功"
                                });
                            })
                            .catch((response) => {
                                this.$notify.error({
                                    title: "失败",
                                    message: response.data.errmsg
                                });
                            });
                    }
                });
            },
            handleUpdate(row) {
                this.dataForm = Object.assign({}, row);
                this.dialogStatus = "update";
                this.dialogFormVisible = true;
                this.$nextTick(() => {
                    this.$refs["dataForm"].clearValidate();
                });
            },
            updateData() {
                this.$refs["dataForm"].validate((valid) => {
                    if (valid) {
                        updateCategory(this.dataForm)
                            .then(() => {
                                this.getList();
                                // 更新L1目录
                                this.getCatL1();
                                this.dialogFormVisible = false;
                                this.$notify.success({
                                    title: "成功",
                                    message: "更新成功"
                                });
                            })
                            .catch((response) => {
                                this.$notify.error({
                                    title: "失败",
                                    message: response.data.errmsg
                                });
                            });
                    }
                });
            },
            handleDelete(row) {
                deleteCategory(row)
                    .then((response) => {
                        this.getList();
                        // 更新L1目录
                        this.getCatL1();
                        this.$notify.success({
                            title: "成功",
                            message: "删除成功"
                        });
                    })
                    .catch((response) => {
                        this.$notify.error({
                            title: "失败",
                            message: response.data.errmsg
                        });
                    });
            }
        }
    };
</script>
