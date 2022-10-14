<template>
    <div class="app-container">
        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-form :inline="true" :model="listQuery" class="demo-form-inline">
                <el-form-item label="会员昵称：">
                    <el-input v-model="listQuery.nickname" placeholder="请输入会员昵称"></el-input>
                </el-form-item>
                <el-form-item label="会员等级：">
                    <el-select v-model="listQuery.kryVipName" placeholder="请选择">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-date-picker
                        v-model="listQuery.regTime"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        class="filter-item"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                />
                <el-form-item>
                    <el-button type="primary" @click="handleFilter">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button
                            :loading="downloadLoading"
                            class="filter-item"
                            type="primary"
                            icon="el-icon-download"
                            @click="handleDownload"
                    >导出会员
                    </el-button
                    >
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
                    width="120" prop="uid">

            </el-table-column>
            <el-table-column
                    prop="name"
                    label="会员信息"
                    min-width="80">
                <template slot-scope="scope">
                    <p>会员呢称：{{scope.row.nickname}}</p>
                    <p>会员等级：{{scope.row.kryVipName}}</p>
                </template>

            </el-table-column>
            <el-table-column align="center" label="用户头像" width="80">
                <template slot-scope="scope">
                    <el-avatar :src="scope.row.avatar"/>
                </template>
            </el-table-column>
            <el-table-column align="center" width="80" label="积分余额" prop="point"/>

            <el-table-column align="center" width="80" label="账户余额" prop="cash"/>
            <el-table-column
                    align="center"
                    width="150"
                    label="手机号码"
                    prop="phone"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.phone === '' ">该用户暂未绑定手机号</span>
                    <span v-else>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    min-width="100"
                    label="直属店铺(来源)"
                    prop="storeName"
            />
            <el-table-column
                    align="center"
                    label="日期"
                    width="120">
                <template slot-scope="scope">{{ new Date(Number(scope.row.regTime) * 1000).format()}}</template>
            </el-table-column>


            <el-table-column
                    align="center"
                    label="操作"
                    class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleDetail(scope.row)"
                    >编辑
                    </el-button
                    >
                    <el-button
                            type="primary"
                            size="mini"
                            @click="handeleXiaoFeiQuan(scope.row)"
                    >充值
                    </el-button>
                </template>


            </el-table-column>

        </el-table>
        <!--编辑-->
        <el-dialog
                title="提示"
                :visible.sync="bianJi"
                width="40%"
        >
            <el-form ref="userDetail" :model="userDetail" label-width="150px">
                <el-form-item label="会员名称：">
                    <el-input v-model="userDetail.nickname" disabled style="width: 200px"></el-input>
                </el-form-item>

                <el-form-item label="会员头像：">
                    <el-image
                            style="width: 100px; height: 100px"
                            :src="userDetail.avatar"
                            fit="cover"></el-image>
                </el-form-item>

                <el-form-item label="会员等级:">
                    <el-select v-model="userDetail.ssvId" placeholder="请选择会员等级">
                        <el-option
                                v-for="item in listStoreVip"
                                :label="item.name"
                                :value="item.id"
                                :key="item.id"
                        ></el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="上级名称：">
                    <el-input style="width: 200px" v-model="shangJi" disabled></el-input>
                </el-form-item>
                <el-form-item label="是否拉进黑名单：">
                    <el-switch
                            v-model="userDetail.isBlack"
                            :active-value="1"
                            :inactive-value="0"
                            active-color ="#ff4949"
                    ></el-switch><el-tag type="danger">加入黑名单用户将无法下单</el-tag>
                </el-form-item>
                <el-form-item label="最后登陆时间：">
                    <el-input style="width: 200px" :value="new Date(Number(userDetail.regTime) * 1000).format()" disabled></el-input>



                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="bianJi = false">取 消</el-button>
    <el-button type="primary" @click="handleUserUpdate">确 定</el-button>
  </span>
        </el-dialog>
        <!--            页数-->
        <pagination
                v-show="total > 0"
                :total="total"
                :page.sync="listQuery.currentPage"
                :limit.sync="listQuery.pageSize"
                @pagination="getList"
        />

    </div>
</template>

<script>
    import {
        fetchList,
        updateUser,
        zcupdate,
        listStoreVip
    } from "@/api/user";
    import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

    export default {
        name: "User",
        components: {Pagination},
        data() {
            return {
                list: null,
                total: 0,
                listLoading: true,
                listQuery: {
                    currentPage: 1,
                    pageSize: 10,
                    nickname: undefined,
                    phone: undefined,
                    uid: undefined,
                    kryVipName: undefined,
                    regTime: undefined

                },
                listStoreVip: [],//会员等级列表
                downloadLoading: false,
                userDialogVisible: false,
                bianJi: false, // 编辑窗口
                addUser: false, // 添加窗口
                shangJi: "平台",
                userDetail: {},
                remarks: undefined,
                type: undefined,
                money: undefined,
                radioText: "1",
                compute: "0", // 单选框状态初始化
            };
        },
        created() {
            this.getList();
        },
        methods: {
            // 时间
            pickerOptions() {
                console.log('时间')
            },
            // 获取数据
            getList() {
                this.listLoading = true;
                fetchList(this.listQuery)
                    .then((response) => {
                        console.log('会员列表', response);
                        this.list = response.data.data.records;
                        this.total = response.data.data.total;
                        this.listLoading = false;
                    }).catch(() => {
                    this.list = [];
                    this.total = 0;
                    this.listLoading = false;
                });

            },
            handleFilter() {
                this.listQuery.page = 1;
                this.getList();
            },
            handleDownload() {
                this.downloadLoading = true;
                import("@/vendor/Export2Excel").then((excel) => {
                    const tHeader = ["用户名", "手机号码", "性别", "生日", "状态"];
                    const filterVal = [
                        "username",
                        "mobile",
                        "gender",
                        "birthday",
                        "status",
                    ];
                    excel.export_json_to_excel2(tHeader, this.list, filterVal, "用户信息");
                    this.downloadLoading = false;
                });
            },
            // 资产模态框
            handeleXiaoFeiQuan(row) {
                this.userDetail = row;
                this.editXiaoFeiQuan = true;
            },
            // 资产编辑里面的单选框
            radioChange(val) {
                console.log(val);
                this.compute = val;
            },

            // 资产更新
            zcUpdate() {
                // console.log(this.userDetail.username,this.remarks,this.type,this.money,this.compute,this.userDetail.id);
                const editzc = {};
                editzc.id = this.userDetail.id;
                editzc.username = this.userDetail.username;
                editzc.remarks = this.remarks;
                editzc.type = this.type;
                editzc.money = this.money;
                editzc.compute = +this.compute;
                // console.log(editzc);
                zcupdate(editzc)
                    .then((response) => {
                        this.$notify.success({
                            title: "成功",
                            message: "更新用户成功",
                        });
                        this.editXiaoFeiQuan = false;
                        this.getList();
                    })
                    .catch((response) => {
                        this.$notify.error({
                            title: "失败",
                            message: response.data.errmsg,
                        });
                    });
            },

            // 编辑用户
            handleDetail(row) {
                this.userDetail = row;
                this.bianJi = true;
                listStoreVip().then(res => {
                    console.log('会员等级列表', res)
                    this.listStoreVip = res.data.data.records
                }).catch(() => {
                    this.listStoreVip = [];
                    this.total = 0;
                    this.listLoading = false;
                });
            },
// 修改用户信息
            handleUserUpdate() {
                console.log(this.userDetail);
                updateUser(this.userDetail)
                    .then((response) => {
                        this.bianJi = false;
                        this.$notify.success({
                            title: "成功",
                            message: "更新用户成功",
                        });
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

