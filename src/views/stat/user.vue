<template>
    <div class="app-container">
        <el-button type="primary" @click="addClassify" style="margin-bottom: 15px">新建分组</el-button>
        <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
            <el-table-column
                    align="center"
                    width="100"
                    label="编号"
                    prop="id"
            />

            <el-table-column align="center" label="分类名称" prop="name"/>

            <el-table-column align="center" label="新闻数量" prop="newsNumByCategory"/>

            <el-table-column align="center" label="排序" prop="sort"/>

            <el-table-column align="center" label="创建时间" prop="addTime">
                <template slot-scope="scope">
          <span>{{
            new Date(Number(scope.row.addTime) * 1000).format()

          }}</span>
                </template>

            </el-table-column>

            <el-table-column align="center" label="操作" prop="addTime" min-width="150">
                <template slot-scope="scope">
                    <el-button type="success" @click="newsList(scope.row)">新闻列表</el-button>
                    <el-button type="primary" @click="editClassify(scope.row)">编辑</el-button>
                    <el-button type="danger" @click="delClassify(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>


        <el-dialog
                title="新建分类"
                :visible.sync="dialogVisible"
                width="30%"
        >
            <el-form :model="dataClassify" :rules="rules" ref="dataClassify" label-width="100px" class="demo-ruleForm">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="dataClassify.name"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input v-model="dataClassify.sort"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitDataClassify">立即创建</el-button>
                </el-form-item>
            </el-form>

        </el-dialog>

        <el-dialog
                title="编辑分类"
                :visible.sync="upData"
                width="30%"
        >
            <el-form :model="upClassify" :rules="rules" ref="upClassify" label-width="100px" class="demo-ruleForm">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="upClassify.name"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input v-model="upClassify.sort"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitUpData">修改</el-button>
                </el-form-item>
            </el-form>

        </el-dialog>

    </div>
</template>

<script>
    import {listStoreNewsCategory, StoreNewsCategory, delNewsCategory, upDataNewsCategory} from '@/api/stat'

    export default {

        data() {
            return {
                list: [],
                listLoading: true,
                dialogVisible: false,
                upData: false,
                listCondition: {
                    currentPage: 1,
                    pageSize: 10,
                },
                dataClassify: {
                    storeId: 1,
                    name: '',
                    sort: null
                },
                upClassify: {},
                rules: {
                    name: [
                        {required: true, message: '请输入分类名称', trigger: 'blur'},
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                },
            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                listStoreNewsCategory(this.listCondition).then(res => {
                    console.log(res)
                    this.listLoading = false
                    this.list = res.data.data.records
                })
            },
            // 点击新建新闻分类
            addClassify() {
                console.log('新建分类')
                this.dialogVisible = true
            },
            // 新建新闻分类
            submitDataClassify() {
                StoreNewsCategory(this.dataClassify).then(res => {
                    this.$notify.success({
                        title: "成功",
                        message: "创建成功",
                    });
                })
                this.dialogVisible = false
                this.getList()
            },
            //跳转新闻列表页
            newsList(row) {
                this.$router.push({
                    path: "/stat/order",
                    query: { categoryId: row.id },
                });
            },
            //编辑
            editClassify(row) {
                this.upClassify = row
                this.upData = true
            },
            //修改按钮
            submitUpData() {
                upDataNewsCategory(this.upClassify).then(res => {
                    this.$notify.success({
                        title: "成功",
                        message: "修改成功",
                    });
                    this.getList();
                    this.upData = false
                }).catch((response) => {
                    this.$notify.error({
                        title: "失败",
                        message: response.msg,
                    });
                });
            },
            //删除
            delClassify(row) {

                this.$confirm("确定删除?", "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    center: true,
                })
                    .then(() => {
                        this.$router.push({
                            query: {newsCategoryId: row.id},
                        });
                        const newsCategoryId = this.$route.query.newsCategoryId;
                        delNewsCategory(newsCategoryId)
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
                                    message: response.msg,
                                });
                            });
                    })
                    .catch(() => {
                    });
            },
        }

    }
</script>
