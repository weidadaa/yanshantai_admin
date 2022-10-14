<template>
    <div class="app-container">
        <div class="filter-container">
            <div>
                <el-button class="filter-item" type="success" @click="handleCreate"
                >新建分组
                </el-button
                >
            </div>

            <div>
                <el-input

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
                >查找
                </el-button>
            </div>
        </div>
        <el-table
                v-loading="listLoading"
                :data="listGrouping"
                element-loading-text="正在查询中。。。"
                border
                fit
                highlight-current-row
        >

            <el-table-column align="center" label="商品ID" prop="groupId" />

            <el-table-column align="center" label="分组名称" prop="groupName" />

            <el-table-column align="center" label="排序(越大越靠前)" prop="sort" />

            <el-table-column
                    align="center"
                    min-width="150"
                    label="创建时间"
                    prop="addTime"
                    sortable
            >
                <template slot-scope="scope">
          <span>{{new Date(Number(scope.row.addTime) * 1000).format()}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    align="center"
                    label="操作"
                    width="300"
                    class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
<!--新建分组拟态框-->
        <el-dialog
                title="新建分组"
                :visible.sync="dialogVisible"
                width="30%"
        >
            <el-form ref="group" :model="group" label-width="80px">
                <el-form-item label="分组名称">
                    <el-input v-model="group.groupName"></el-input>
                </el-form-item>
                <el-form-item label="分组排序">
                    <el-select v-model="group.sort" placeholder="请选择排序">
                        <el-option
                                v-for=" i in 10"
                                :label="i"
                                :value="i"
                                :key="i"
                        ></el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="分组简介">
                    <el-input v-model="group.groupLabel"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="productGroup">确 定</el-button>
  </span>
        </el-dialog>
        <!--编辑分组拟态框-->
        <el-dialog
                title="编辑分组"
                :visible.sync="editGroup"
                width="30%"
        >
            <el-form ref="updateGroup" :model="updateGroup" label-width="80px">
                <el-form-item label="分组名称">
                    <el-input v-model="updateGroup.groupName"></el-input>
                </el-form-item>
                <el-form-item label="分组排序">
                    <el-select v-model="updateGroup.sort" placeholder="请选择排序">
                        <el-option
                                v-for=" i in 10"
                                :label="i"
                                :value="i"
                                :key="i"
                        ></el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="分组简介">
                    <el-input v-model="updateGroup.groupLabel"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="editGroup = false">取 消</el-button>
    <el-button type="primary" @click="update">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<style>
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
    import {listGrouping, updateGroup, publishGroup, deleteGroup} from "@/api/goods";
    import {getToken} from "@/utils/auth";
    export default {
        name: "GoodsEdit",
        data() {
            return {
                updateGroup:{},//编辑商品数据
                dialogVisible:false,//新建分组拟态框
                editGroup:false,//新建分组拟态框
                listQuery: {
                    currentPage: 1,
                    pageSize: 10,
                    goodsSn: undefined,
                    name: undefined,
                },
                listLoading: true,//遮罩层正在查询
                // 分组数据
                listGrouping:[],
                group:{
                    storeId: null,
                    groupName: "",
                    isShowName: "1",
                    firstSort: "0",
                    secondSort: "0",
                    listStyleSize: "2",
                    listStyleType: "0",
                    isShowPrice: "1",
                    isShowProductName: "0",
                    isShowBuyButton: "1",
                    buyButtonStyle: "1",
                    groupLabel: undefined,
                    productCount: 0,
                    hasCustom: 0,
                    sort: null
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
            getList(){
                this.listLoading = true
                listGrouping(this.listQuery).then( res =>{
                    console.log(res)
                    this.listGrouping =res.data.data.records
                    this.listLoading =false
                })
            },
            // 新建分组拟态框显示
            handleCreate(){
                this.dialogVisible = true
            },
            // 新建分组
            productGroup(){
                publishGroup(this.group).then(res=>{
                    this.$notify.success({
                        title: "成功",
                        message: "创建成功",
                    });
                    this.getList()
                    this.dialogVisible = false
                })
            },
            // 查询
            handleFilter(){
                console.log(123)
                this.listLoading =false
            },
            // 编辑拟态框
            handleUpdate(row){
                this.updateGroup = row
                this.editGroup = true
            },
            // 编辑分组
            update(){
                updateGroup( this.updateGroup).then(res=>{
                    this.$notify.success({
                        title: "成功",
                        message: "编辑成功",
                    });
                    this.getList()
                    this.editGroup = false
                }).catch( res =>{
                    this.$notify.error({
                        title: '失败',
                        message: "编辑失败"
                    })
                    this.editGroup = false
                })
            },
            // 删除
            handleDelete(row) {
                this.$confirm('确定删除?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    this.$router.push({
                        query: { groupId: row.groupId },
                    });
                    const productId = this.$route.query.groupId;
                    deleteGroup(productId).then(response => {
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
                }).catch(() => {
                })
            },
        }
    };
</script>
