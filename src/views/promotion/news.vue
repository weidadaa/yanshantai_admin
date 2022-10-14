<template>
    <div class="app-container">
        <el-input v-model="uid" placeholder="请输入ID" style="width: 150px"></el-input>
        <el-button
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                @click="handleUserAdd()"
        >添加管理员
        </el-button
        >
        <el-button
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                @click="getUserAdd()"
        >获取用户信息
        </el-button
        >
        <el-button
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                @click="handleUserAdd()"
        >邀请二维码
        </el-button
        >
        <!-- 查询结果 -->
        <el-table
                v-loading="listLoading"
                :data="GMlist"
                element-loading-text="正在查询中。。。"
                border
                fit
                highlight-current-row
                style="margin-top: 20px"
        >
            <el-table-column
                    align="center"
                    width="100px"
                    label="ID"
                    prop="uid"
                    sortable
            />
            <el-table-column align="center" label="头像" prop="avatar">
                <template slot-scope="scope">
                    <el-avatar shape="square" :size="50" :src="scope.row.avatar"></el-avatar>
                </template>

            </el-table-column>


            <el-table-column align="center" label="微信昵称" prop="nickname"/>

            <el-table-column align="center" label="用户类型" prop="role_type">
                <template slot-scope="scope">
                    {{ scope.row.role_type ? ' 管理员 (店铺)':'暂无管理门店'}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="添加时间" prop="add_time">
                <template slot-scope="scope">
                    {{ new Date(Number(scope.row.add_time) * 1000).format()}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="管理门店" prop="is_agent">
                <template slot-scope="scope">
                    {{ scope.row.is_agent ? '':'暂无管理门店'}}
                </template>
            </el-table-column>

            <!-- 编辑 -->
            <el-table-column
                    align="center"
                    label="操作"
                    class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button
                            type="primary"
                            @click="handeleNewsEdit(scope.row)"
                    >编辑
                    </el-button>
                    <el-button type="danger" @click="handleDelete(scope.row)"
                    >删除
                    </el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <!--        添加管理员-->
        <el-dialog
                title="添加管理员"
                :visible.sync="addUser"
                width="70%"
        >
            <el-table
                    v-loading="listLoading"
                    :data="list"
                    element-loading-text="正在查询中。。。"
                    border
                    fit
                    highlight-current-row
                    style="margin-top: 20px"
            >
                <el-table-column
                        align="center"
                        width="100px"
                        label="ID"
                        prop="uid"
                        sortable
                />
                <el-table-column align="center" label="头像" prop="avatar">
                    <template slot-scope="scope">
                        <el-avatar shape="square" :size="50" :src="scope.row.avatar"></el-avatar>
                    </template>

                </el-table-column>
                <el-table-column align="center" label="微信昵称" prop="nickname"/>

                <el-table-column align="center" label="用户类型" prop="role_type">
                    <template slot-scope="scope">
                        {{ scope.row.role_type ? ' 管理员 (店铺)':'(店铺)'}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="添加时间" prop="regTime">
                    <template slot-scope="scope">
                        {{ new Date(Number(scope.row.regTime) * 1000).format()}}
                    </template>
                </el-table-column>
                <!-- 编辑 -->
                <el-table-column
                        align="center"
                        label="操作"
                        class-name="small-padding fixed-width"
                >
                    <template slot-scope="scope">
                        <el-button
                                type="primary"
                                @click="handeleNewsEdit(scope.row)">选择
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                    v-show="total > 0"
                    :total="total"
                    :page.sync="getUserlist.currentPage"
                    :limit.sync="getUserlist.pageSize"
                    @pagination="getUserAdd"
            />
        </el-dialog>


        <pagination
                v-show="GMtotal > 0"
                :total="GMtotal"
                :page.sync="listQuery.currentPage"
                :limit.sync="listQuery.pageSize"
                @pagination="getList"
        />
    </div>
</template>

<script>
    import {GMList, addNews, deleteNews} from "@/api/news";
    import {fetchList} from "@/api/user";
    import {thumbnail, toPreview} from "@/utils/index";
    import Pagination from "@/components/Pagination";
    import Editor from "@tinymce/tinymce-vue";

    export default {
        name: "News",
        components: {Editor, Pagination},
        data() {
            return {
                thumbnail,
                toPreview,
                list: null,
                GMlist: null,
                GMtotal: 0,
                total: 0,
                listLoading: true,
                downloadLoading: false,
                editNews: false,
                uid: '',
                addUser: false, // 添加窗口
                listQuery: {
                    currentPage: 1,
                    pageSize: 10,
                },
                getUserlist: {
                    currentPage: 1,
                    pageSize: 10,
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
                GMList(this.listQuery)
                    .then((response) => {
                        console.log(response);
                        this.GMlist = response.data.data.records;
                        this.GMtotal = response.data.data.total;
                        this.listLoading = false;
                    })
                    .catch(() => {
                        this.GMlist = [];
                        this.GMtotal = 0;
                        this.listLoading = false;
                    });
            },

            // 新闻删除
            handleDelete(row) {
                this.$confirm("确定删除?", "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    center: true,
                })
                    .then(() => {
                        deleteNews(row["uid"])
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
                                    message: response.data.msg,
                                });
                            });
                    })
                    .catch(() => {
                    });
            },
            // 获取用户信息按钮
            getUserAdd() {
                this.addUser = true;
                fetchList(this.getUserlist)
                    .then((response) => {
                        console.log(response);
                        this.list = response.data.data.records;
                        this.total = response.data.data.total;
                        this.listLoading = false;
                    })
                    .catch(() => {
                        this.list = [];
                        this.total = 0;
                        this.listLoading = false;
                    });
            },
            // 选择按钮
            handeleNewsEdit(row) {
                this.addUser = false;
                this.uid = row.uid
                console.log(this.uid,'id')
            },
            // 新闻添加
            handleUserAdd() {
                addNews(this.uid)
                    .then((response) => {
                        this.$notify.success({
                            title: "成功",
                            message: response.data.msg,
                        });
                        this.addUser = false;
                        this.getList();
                    })
                    .catch((response) => {
                        this.$notify.error({
                            title: "失败",
                            message: response.data.msg,
                        });
                    });
            },

        },
    };
</script>

<style>
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

    .el-form {
        width: unset !important;
        margin-right: 50px;
    }

    .cell {
        max-height: 110px;
    }
</style>
