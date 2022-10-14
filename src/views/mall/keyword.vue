<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 200px;"
                      placeholder="请输入订单号"/>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
        </div>

        <!-- 查询结果 -->
        <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

            <el-table-column align="center" label="订单号" prop="orderNo"/>

            <el-table-column align="center" label="商品名称" prop="ftName"/>

            <el-table-column align="center" label="	定制详情" prop="skuData"/>

            <el-table-column align="center" label="	计量" prop="totalMetering"/>
            <el-table-column align="center" label="	封坛类型" prop="ftType">
                <template slot-scope="scope">
                    {{ scope.row.ftType === 1 ? '酒厂':'自存' }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="	支付类型" prop="ftPaytype">
                <template slot-scope="scope">
                    {{ scope.row.ftPaytype === 1 ? '线上':'线下' }}
                </template>

            </el-table-column>

            <el-table-column align="center" label="	制定年份" prop="ftYear"/>
            <el-table-column align="center" label="时间" prop="addTime">
                <template slot-scope="scope">
                    {{ new Date(Number(scope.row.addTime) * 1000).format() }}
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini"
                               @click="handleUpdate(scope.row)">封坛信息
                    </el-button>
                    <el-button type="danger" size="mini"
                               @click="handleDelete(scope.row)">转账审核
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/>

        <!-- 添加或修改对话框 -->


    </div>
</template>

<script>
    import {listKeyword} from '@/api/keyword'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

    export default {
        name: 'Keyword',
        components: {Pagination},
        data() {
            return {
                list: [],
                total: 0,
                listLoading: true,
                listQuery: {
                    currentPage: 1,
                    pageSize: 10,
                },
                dataForm: {
                    id: undefined,
                    keyword: undefined,
                    url: undefined,
                    isHot: undefined,
                    isDefault: undefined
                },
                dialogFormVisible: false,
                dialogStatus: '',

                rules: {
                    keyword: [{required: true, message: '关键词不能为空', trigger: 'blur'}]
                },
                downloadLoading: false
            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                this.listLoading = true
                listKeyword(this.listQuery).then(response => {
                    this.list = response.data.data.records
                    this.total = response.data.data.total
                    this.listLoading = false
                }).catch(() => {
                    this.list = []
                    this.total = 0
                    this.listLoading = false
                })
            },
            handleFilter() {
                this.listQuery.page = 1
                this.getList()
            },
            resetForm() {
                this.dataForm = {
                    id: undefined,
                    keyword: undefined,
                    url: undefined,
                    isHot: undefined,
                    isDefault: undefined
                }
            },
            handleCreate() {
                this.resetForm()
                this.dialogStatus = 'create'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            createData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        createKeyword(this.dataForm).then(response => {
                            this.list.unshift(response.data.data)
                            this.dialogFormVisible = false
                            this.$notify.success({
                                title: '成功',
                                message: '创建成功'
                            })
                        }).catch(response => {
                            this.$notify.error({
                                title: '失败',
                                message: response.data.errmsg
                            })
                        })
                    }
                })
            },
            handleUpdate(row) {
                this.dataForm = Object.assign({}, row)
                this.dialogStatus = 'update'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            updateData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        updateKeyword(this.dataForm).then(() => {
                            for (const v of this.list) {
                                if (v.id === this.dataForm.id) {
                                    const index = this.list.indexOf(v)
                                    this.list.splice(index, 1, this.dataForm)
                                    break
                                }
                            }
                            this.dialogFormVisible = false
                            this.$notify.success({
                                title: '成功',
                                message: '更新成功'
                            })
                        }).catch(response => {
                            this.$notify.error({
                                title: '失败',
                                message: response.data.errmsg
                            })
                        })
                    }
                })
            },
            handleDelete(row) {
                deleteKeyword(row).then(response => {
                    this.$notify.success({
                        title: '成功',
                        message: '删除成功'
                    })
                    this.getList()
                }).catch(response => {
                    this.$notify.error({
                        title: '失败',
                        message: response.data.errmsg
                    })
                })
            },
            handleDownload() {
                this.downloadLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['关键词ID', '关键词', '跳转链接', '是否推荐', '是否默认']
                    const filterVal = ['id', 'keyword', 'url', 'isHot', 'isDefault']
                    excel.export_json_to_excel2(tHeader, this.list, filterVal, '关键词设置')
                    this.downloadLoading = false
                })
            }
        }
    }
</script>
