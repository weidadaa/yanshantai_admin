<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">

            <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
        </div>

        <!-- 查询结果 -->
        <el-table
                v-loading="listLoading"
                :data="list" element-loading-text="正在查询中。。。"
                border
                fit
                highlight-current-row
                row-key="catId">

            <el-table-column align="center" label="类目ID" prop="catId"/>

            <el-table-column align="center" label="类目名" prop="catName"/>


            <el-table-column align="center" property="catPic" label="类目图片">
                <template slot-scope="scope">
                    <el-image
                            :src="thumbnail(scope.row.catPic)"
                            :preview-src-list="toPreview(scope.row, scope.row.catPic)"
                            style="width: 40px; height: 40px"
                    />
                </template>
            </el-table-column>

            <el-table-column align="center" label="状态" prop="catStatus">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.catStatus === 0 ? 'info' : 'primary'">{{ scope.row.catStatus === 2 ? '已禁用'
                        : '已启用' }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="级别" prop="catFid">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.catFid === 0 ? 'primary' : 'info' ">{{ scope.row.catFid === 0 ? '一级类目'
                        : '二级类目' }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini"
                               @click="handleUpdate(scope.row)">编辑
                    </el-button>
                    <el-button type="danger" size="mini"
                               @click="handleDelete(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加对话框 -->

        <el-dialog :visible.sync="dialogFormVisible">
            <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left"
                     label-width="100px" style="width: 400px; margin-left:50px;">
                <el-form-item label="类目名称" prop="catName">
                    <el-input v-model="dataForm.catName"/>
                </el-form-item>

                <el-form-item label="类目级别" prop="catFid">
                    <el-select v-model="dataForm.catFid">
                        <el-option label="一级类目" :value="0"/>
                        <el-option label="二级类目" :value="1"/>
                    </el-select>
                </el-form-item>

                <el-form-item label="父类目" >
                    <el-select v-model="fucatId">
                        <el-option
                                v-for="item in list"
                                :key="item.catId"
                                :label="item.catName"
                                :value="item.catId"/>
                    </el-select>
                </el-form-item>

                <el-form-item label="是否启用" prop="catStatus">
                    <template>
                        <el-radio v-model="dataForm.catStatus" :label="1">启用</el-radio>
                        <el-radio v-model="dataForm.catStatus" :label="2">不启用</el-radio>
                    </template>
                </el-form-item>

                <el-form-item label="类目排序" prop="catSort">
                    <el-input v-model="dataForm.catSort"/>
                </el-form-item>
                <el-form-item label="类目图片"  prop="picUrl">
                    <el-upload
                            :headers="headers"
                            :action="uploadPath"
                            :show-file-list="false"
                            :on-success="uploadPicUrl"
                            class="avatar-uploader"
                            accept=".jpg,.jpeg,.png,.gif">
                        <img v-if="dataForm.catPic" :src="dataForm.catPic" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"/>
                    </el-upload>
                </el-form-item>
                <el-form-item label="类目简介" prop="catDesc">
                    <el-input v-model="dataForm.catDesc"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="createData">确定</el-button>

            </div>
        </el-dialog>

        <!-- 修改对话框 -->

        <el-dialog :visible.sync="updataCategory">
            <el-form ref="updataFenlie" :rules="rules" :model="updataFenlie" status-icon label-position="left"
                     label-width="100px" style="width: 400px; margin-left:50px;">
                <el-form-item label="类目名称" prop="catName">
                    <el-input v-model="updataFenlie.catName"/>
                </el-form-item>

                <el-form-item label="类目级别" prop="catFid">
                    <el-select v-model="updataFenlie.catFid">
                        <el-option label="一级类目" :value="0"/>
                        <el-option label="二级类目" :value="1"/>
                    </el-select>
                </el-form-item>

                <el-form-item label="父类目" >
                    <el-select v-model="fucatId" clearable >
                        <el-option
                                v-for="item in list"
                                :key="item.catId"
                                :label="item.catName"
                                :value="item.catId"/>
                    </el-select>
                </el-form-item>

                <el-form-item label="是否启用" prop="catStatus">
                    <template>
                        <el-radio v-model="updataFenlie.catStatus" :label="1">启用</el-radio>
                        <el-radio v-model="updataFenlie.catStatus" :label="2">不启用</el-radio>
                    </template>
                </el-form-item>

                <el-form-item label="类目排序" prop="catSort">
                    <el-input v-model="updataFenlie.catSort"  />
                </el-form-item>
                <el-form-item label="类目图片" prop="picUrl">
                    <el-upload
                            :headers="headers"
                            :action="uploadPath"
                            :show-file-list="false"
                            :on-success="uploadPicUrl2"
                            class="avatar-uploader"
                            accept=".jpg,.jpeg,.png,.gif">
                        <img v-if="updataFenlie.catPic" :src="updataFenlie.catPic" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"/>
                    </el-upload>
                </el-form-item>
                <el-form-item label="类目简介" prop="catDesc">
                    <el-input v-model="updataFenlie.catDesc"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updataCategory = false">取消</el-button>
                <el-button type="primary" @click="updateData">确定</el-button>

            </div>
        </el-dialog>

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

    import {listCatAndBrand, publishCategory, updateCategory, deleteCategory} from '@/api/goods'
    import {uploadPath} from '@/api/storage'
    import {getToken} from '@/utils/auth'
    import { thumbnail, toPreview } from "@/utils/index";
    export default {
        name: 'Category',
        data() {
            return {
                thumbnail,
                toPreview,
                uploadPath,
                list: [],
                fucatId: null,//父级类目
                listLoading: true,
                catL1: {},
                dataForm: {
                    catName: "",
                    catDesc: "",
                    catFid: null,
                    catStatus: null,
                    catSort: null,
                    catPic: undefined
                },
                updataFenlie:{},
                dialogFormVisible: false,
                updataCategory:false,//修改拟态框
                dialogStatus: '',
                textMap: {
                    update: '编辑',
                    create: '创建'
                },
                rules: {
                    catName: [{required: true, message: '类目名不能为空', trigger: 'blur'}],
                    catSort:[{required: true, message: '排序不能为空', trigger: 'blur'},
                        {pattern: /^[0-9]*$/, message: '排序需为数字', trigger: 'blur'}]
                }
            }
        },
        computed: {
            headers() {
                return {
                    'token': getToken()
                }
            }
        },
        created() {
            this.getList()

        },
        methods: {
            getList: function () {
                this.listLoading = true
                listCatAndBrand()
                    .then(response => {
                        const generateOptions = (options, childs) => {
                            childs.forEach(child => {
                                options.push({
                                    catId: child.catId,
                                    catName: child.catName,
                                    catSort: child.catSort,
                                    catPic: child.catPic,
                                    catStatus: child.catStatus,
                                    catFid: child.catFid,
                                    catDesc:child.catDesc,
                                    children: generateOptions([], child.childCategory)
                                })
                            })
                            return options;
                        }
                        const options = generateOptions([], response.data.data)
                        this.list = options
                        this.listLoading = false
                    })
                    .catch(() => {
                        this.list = []
                        this.listLoading = false
                    })
            },
            handleCreate() {
                this.dialogFormVisible = true
            },

            uploadPicUrl: function (response) {
                console.log(response)
                this.dataForm.catPic = response.data
            },
            uploadPicUrl2: function (response) {
                console.log(response)
                this.updataFenlie.catPic = response.data
            },

            // 新建类目
            createData() {
                console.log(this.dataForm.catFid)
                if (this.dataForm.catFid === 0){
                    publishCategory(this.dataForm)
                        .then(response => {
                            this.getList()
                            this.dialogFormVisible = false
                            this.$notify.success({
                                title: '成功',
                                message: '创建成功'
                            })
                            this.fucatId = null
                        })
                        .catch(response => {
                            this.$notify.error({
                                title: '失败',
                                message: response.data.msg
                            })
                        })
                }else {
                    this.dataForm.catFid = this.fucatId
                    publishCategory(this.dataForm)
                        .then(response => {
                            this.getList()
                            this.dialogFormVisible = false
                            this.$notify.success({
                                title: '成功',
                                message: '创建成功'
                            })
                            this.fucatId = null
                        })
                        .catch(response => {
                            this.$notify.error({
                                title: '失败',
                                message: response.data.msg
                            })
                        })
                }
            },
            // 点击编辑
            handleUpdate(row) {
                this.updataCategory = true
                if(row.catFid === 0){
                    this.updataFenlie = row
                    this.fucatId = null
                } else if(row.catFid !== 0) {
                    this.fucatId = null
                    this.updataFenlie = row
                    this.fucatId = this.updataFenlie.catFid
                    this.updataFenlie.catFid = 1
                }
                console.log('分类',row)
            },
            // 修改分类函数
            updateData() {
               if(this.updataFenlie.catFid === 0){
                   updateCategory(this.updataFenlie)
                       .then((res) => {
                           this.getList()
                           this.updataCategory = false
                           this.$notify.success({
                               title: '成功',
                               message: '更新成功'
                           })
                           this.fucatId = null
                       })
                       .catch(response => {
                           this.$notify.error({
                               title: '失败',
                               message: response.data.msg
                           })
                           this.fucatId = null
                       })
               }else {
                   this.updataFenlie.catFid = this.fucatId
                   updateCategory(this.updataFenlie)
                       .then((res) => {
                           this.getList()
                           this.updataCategory = false
                           this.$notify.success({
                               title: '成功',
                               message: '更新成功'
                           })
                           this.fucatId = null
                       })
                       .catch(response => {
                           this.updataCategory = false
                           this.$notify.error({
                               title: '失败',
                               message: response.data.msg
                           })
                           this.fucatId = null
                       })
               }

            },
            // 删除分类
            handleDelete(row) {
                this.$confirm("确定删除?", "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    center: true,
                })
                    .then(() => {
                        this.$router.push({
                            query: { catId: row.catId },
                        });
                        const catId = this.$route.query.catId;
                        deleteCategory(catId)
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
            }
        }
    }
</script>
