<template>
    <div>


        <el-card class="box-card">
            <!--     提示信息-->
            <div class="text ">
                温馨提示：<br/>

                1、平台提供了等级1~等级50的可设置区间。<br/>

                2、等值数值越高，说明会员等级越高，升级所需金额也应设置更高。如等级1为初始等级，升级金额500，则等级3为更高的会员等级，升级金额1000。<br/>

                3、建议设置会员等级时,等级越高,折扣数值越小。如等级1时折扣数值为9折，等级2时折扣数值为8折，则当商品价格为100时,会员计算金额对应为90元/80元。<br/>

                4、所设置的最高会员等级不允许禁用。<br/>

                5、所设置的最高会员等级如需删除，则次一等级状态必须开启。
            </div>
            <!--     查询和添加会员等级-->
            <div class="item">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item style="margin-left: 20px">
                        <el-input placeholder="搜索会员等级名称"></el-input>
                    </el-form-item>


                    <el-form-item>
                        <el-button type="primary">查询</el-button>
                    </el-form-item>
                    <el-button style="float: right; margin-right: 20px" type="primary" @click="addStoreVip">
                        添加会员等级
                    </el-button>
                </el-form>
            </div>
        </el-card>
        <!--        查询结果-->
        <el-table
                v-loading="listLoading"
                :data="list"
                element-loading-text="正在查询中。。。"
                border
                fit
                highlight-current-row
        >
            <el-table-column
                    label="ID"
                    min-width="120" prop="id">

            </el-table-column>
            <el-table-column
                    label="会员等级"
                    min-width="120" prop="level">

            </el-table-column>
            <el-table-column
                    label="会员名称"
                    min-width="120" prop="name">

            </el-table-column>
            <el-table-column
                    label="享受折扣(折)"
                    min-width="120" prop="discount">

            </el-table-column>
            <el-table-column
                    label="购买价格"
                    min-width="120" prop="buyMoney">

            </el-table-column>
            <el-table-column
                    label="累计升级金币"
                    min-width="120" prop="upgradeMoney">

            </el-table-column>
            <el-table-column
                    label="启用状态"
                    min-width="120" prop="isClose">
                <template slot-scope="scope">
                    <el-tag  :type="scope.row.isClose === 0 ? 'success':'danger'"  >{{scope.row.isClose === 0 ? '已启用':'已禁用'}}</el-tag>
<!--                    <el-tag v-else type="">已禁用</el-tag>-->
                </template>
            </el-table-column>
            <el-table-column
                    min-width="150"
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
                            @click="delStoreVip(scope.row)"
                    >删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--            添加会员-->
        <el-dialog title="添加会员等级" :visible.sync="dialogVisible" width="50%">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
                <el-form-item label="会员等级:" prop="level">
                    <el-select v-model="ruleForm.level" placeholder="请选择会员等级">
                        <el-option
                                v-for=" item in 50"
                                :label=" '会员等级' + item "
                                :value="item"
                                :key="item"
                        ></el-option>

                    </el-select>
                </el-form-item>

                <el-form-item label="等级名称:" prop="name">
                    <el-input v-model="ruleForm.name" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="会员折扣:" prop="discount">
                    <el-input v-model="ruleForm.discount" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="会员是否启用:" prop="isClose">
                    <!--                    :active-value="0"  	switch 打开时的值-->
                    <!--                    :inactive-value="1"  switch 关闭时的值-->
                    <el-switch v-model="ruleForm.isClose"
                               :active-value="0"
                               :inactive-value="1"
                    ></el-switch>
                </el-form-item>

                <el-form-item label="会员图标:" prop="iconImg">
                    <el-upload
                            action="http://10.1.2.244:10111/yantaishan/file/upload"
                            :limit="5"
                            :headers="headers"
                            :on-exceed="uploadOverrun"
                            :on-success="handleGalleryUrl"
                            :on-remove="handleRemove"
                            multiple
                            accept=".jpg,.jpeg,.png,.gif"
                            list-type="picture-card"
                    >
                        <img v-if="ruleForm.iconImg" :src="ruleForm.iconImg" class="avatar"/>
                        <i class="el-icon-plus"/>
                    </el-upload>
                </el-form-item>

                <el-form-item label="会员背景图:" prop="backgroundImg">
                    <el-upload
                            action="http://10.1.2.244:10111/yantaishan/file/upload"
                            :limit="5"
                            :headers="headers"
                            :on-exceed="uploadOverrun"
                            :on-success="handleGalleryUrl"
                            :on-remove="handleRemove"
                            multiple
                            accept=".jpg,.jpeg,.png,.gif"
                            list-type="picture-card"
                    >
                        <img v-if="ruleForm.backgroundImg" :src="ruleForm.backgroundImg" class="avatar"/>
                        <i class="el-icon-plus"/>
                    </el-upload>
                </el-form-item>

                <el-form-item label="累计金额自动升级" prop="isOpenUpgrade">
                    <el-switch v-model="ruleForm.isOpenUpgrade"
                               :active-value="1"
                               :inactive-value="0"
                    ></el-switch>
                </el-form-item>

                <el-form-item label="升级所需金额:" prop="upgradeMoney">
                    <el-input v-model="ruleForm.upgradeMoney" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="会员是否可购买:" prop="isOpenBuy">
                    <!--                    :active-value="0"  	switch 打开时的值-->
                    <!--                    :inactive-value="1"  switch 关闭时的值-->
                    <el-switch v-model="ruleForm.isOpenBuy"
                               :active-value="0"
                               :inactive-value="1"
                    ></el-switch>
                </el-form-item>
                <el-form-item label="购买价格:" prop="buyMoney" v-if="ruleForm.isOpenBuy === 0">

                    <el-input v-model="ruleForm.buyMoney" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="会员特权:">

                    <el-form :model="ruleForm"
                             ref="ruleForm"
                             label-width="100px"
                             class="demo-dynamic"
                             v-for="(domain,index) in ruleForm.specialDesc22"
                             :key="domain.key"
                    >
                        <el-form-item label="会员标题:" :prop="'specialDesc22.'+index+'.privilege_title'">
                            <el-input placeholder="请输入会员特权,比如:包邮" v-model="domain.privilege_title"></el-input>
                        </el-form-item>

                        <el-form-item label="会员图标:" :prop="'specialDesc22.'+index+'.privilege_image'">

                            <el-upload
                                    action="http://10.1.2.244:10111/yantaishan/file/upload"
                                    :limit="1"
                                    :headers="headers"
                                    :on-exceed="uploadOverrun"
                                    :on-success="handleGalleryUrl"
                                    :on-remove="handleRemove"
                                    multiple
                                    accept=".jpg,.jpeg,.png,.gif"
                                    list-type="picture-card"
                            >
                                <i class="el-icon-plus"/>
                            </el-upload>

                        </el-form-item>
                        <el-form-item label="特权内容:" :prop="'specialDesc22.'+index+'.privilege_txt'">
                            <el-input type="textarea" placeholder="请输入特权内容...."
                                      v-model="domain.privilege_txt"></el-input>
                        </el-form-item>
                        <el-form-item label="操作:">
                            <el-button @click.prevent="removeDomain(domain)">删除</el-button>
                        </el-form-item>

                    </el-form>
                    <el-button @click="addDomain">+新增会员特权</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="addMemberLv">立即创建</el-button>
                    <el-button @click="dialogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>

        </el-dialog>
        <!--            编辑会员-->
        <el-dialog
                title="编辑会员"
                :visible.sync="updataSvipni"
                width="50%"
        >
            <el-form :model="updataSvip" :rules="rules" ref="updataSvip" label-width="130px" class="demo-ruleForm">

                <el-form-item label="会员等级:" prop="level">
                    <el-select v-model="updataSvip.level" placeholder="请选择会员等级">
                        <el-option
                                v-for=" item in 50"
                                :label=" '会员等级' + item "
                                :value="item"
                                :key="item"
                        ></el-option>

                    </el-select>
                </el-form-item>

                <el-form-item label="等级名称:" prop="name">
                    <el-input v-model="updataSvip.name" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="会员折扣:" prop="discount">
                    <el-input v-model="updataSvip.discount" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="会员是否启用:" prop="isClose">
                    <!--                    :active-value="0"  	switch 打开时的值-->
                    <!--                    :inactive-value="1"  switch 关闭时的值-->
                    <el-switch v-model="updataSvip.isClose"
                               :active-value="0"
                               :inactive-value="1"
                    ></el-switch>
                </el-form-item>

                <el-form-item label="会员图标:" prop="iconImg">
                    <el-upload
                            action="http://10.1.2.244:10111/yantaishan/file/upload"
                            :limit="5"
                            :headers="headers"
                            :on-exceed="uploadOverrun"
                            :on-success="handleGalleryUrl"
                            :on-remove="handleRemove"
                            multiple
                            accept=".jpg,.jpeg,.png,.gif"
                            list-type="picture-card"
                    >
                        <img v-if="updataSvip.iconImg" :src="updataSvip.iconImg" class="avatar" style="width: 100%"/>
                        <i class="el-icon-plus"/>
                    </el-upload>
                </el-form-item>

                <el-form-item label="会员背景图:" prop="backgroundImg">
                    <el-upload
                            action="http://10.1.2.244:10111/yantaishan/file/upload"
                            :limit="5"
                            :headers="headers"
                            :on-exceed="uploadOverrun"
                            :on-success="handleGalleryUrl"
                            :on-remove="handleRemove"
                            multiple
                            accept=".jpg,.jpeg,.png,.gif"
                            list-type="picture-card"
                    >
                        <img v-if="updataSvip.backgroundImg" :src="updataSvip.backgroundImg" class="avatar"
                             style="width: 100%"/>
                        <i class="el-icon-plus"/>
                    </el-upload>
                </el-form-item>

                <el-form-item label="累计金额自动升级" prop="isOpenUpgrade">
                    <el-switch v-model="updataSvip.isOpenUpgrade"
                               :active-value="1"
                               :inactive-value="0"
                    ></el-switch>
                </el-form-item>

                <el-form-item label="升级所需金额:" prop="upgradeMoney">
                    <el-input v-model="updataSvip.upgradeMoney" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="会员是否可购买:" prop="isOpenBuy">
                    <!--                    :active-value="0"  	switch 打开时的值-->
                    <!--                    :inactive-value="1"  switch 关闭时的值-->
                    <el-switch v-model="updataSvip.isOpenBuy"
                               :active-value="0"
                               :inactive-value="1"
                    ></el-switch>
                </el-form-item>
                <el-form-item label="购买价格:" prop="buyMoney" v-if="updataSvip.isOpenBuy === 0">

                    <el-input v-model="updataSvip.buyMoney" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="会员特权:">

                    <el-form :model="updataSvip"
                             ref="ruleForm"
                             label-width="100px"
                             class="demo-dynamic"
                             v-for="(domain,index) in updataSvip.specialDesc22"
                             :key="domain.key"
                    >
                        <el-form-item label="会员标题:" :prop="'specialDesc22.'+index+'.privilege_title'">
                            <el-input placeholder="请输入会员特权,比如:包邮" v-model="domain.privilege_title"></el-input>
                        </el-form-item>

                        <el-form-item label="会员图标:" :prop="'specialDesc22.'+index+'.privilege_image'">

                            <el-upload
                                    action="http://10.1.2.244:10111/yantaishan/file/upload"
                                    :limit="1"
                                    :headers="headers"
                                    :on-exceed="uploadOverrun"
                                    :on-success="handleGalleryUrl"
                                    :on-remove="handleRemove"
                                    multiple
                                    accept=".jpg,.jpeg,.png,.gif"
                                    list-type="picture-card"
                            >
                                <i class="el-icon-plus"/>
                            </el-upload>

                        </el-form-item>
                        <el-form-item label="特权内容:" :prop="'specialDesc22.'+index+'.privilege_txt'">
                            <el-input type="textarea" placeholder="请输入特权内容...."
                                      v-model="domain.privilege_txt"></el-input>
                        </el-form-item>
                        <el-form-item label="操作:">
                            <el-button @click.prevent="removeUpdata(domain)">删除</el-button>
                        </el-form-item>

                    </el-form>
                    <el-button @click="addUpdata">+新增会员特权</el-button>
                </el-form-item>
            </el-form>

            <el-button @click="updataSvipni = false">取 消</el-button>
            <el-button type="primary" @click="updatasSvip">确 定</el-button>

        </el-dialog>
        <!--                    页数-->
        <!--        <pagination-->
        <!--                :total="total"-->
        <!--                @pagination="getList"-->
        <!--        />-->
    </div>
</template>

<script>
    import {listStoreVip, addStoreVip, deleteStoreVip, updataSvip} from "@/api/user";
    import Pagination from "@/components/Pagination";
    import {getToken} from "@/utils/auth";

    export default {
        name: "Collect",
        components: {Pagination},
        data() {
            return {
                list: [],//会员等级数据
                // 添加拟态框显示隐藏
                dialogVisible: false,
                listLoading: true,
                updataSvipni: false,
                // 提交必填项
                ruleForm: {
                    name: "",
                    level: "",
                    discount: null,
                    iconImg: undefined,
                    backgroundImg: undefined,
                    isOpenUpgrade: null,
                    upgradeMoney: null,
                    isOpenBuy: null,
                    buyMoney: null,
                    specialDesc22: []
                },
                updataSvip: {},//点击编辑获取的数据
                specialDesc: {},//会员特权
                listQuery: {
                    currentPage: 1,
                    pageSize: 10,
                },
                total: null,
                tableData: undefined,
                // 必填项验证
                rules: {
                    name: [
                        {required: true, message: '请输入会员等级名称', trigger: 'blur'},
                        {min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur'}
                    ],
                    level: [
                        {required: true, message: '请选择会员等级', trigger: 'change'}
                    ],
                    discount: [
                        {required: true, message: '请输入会员折扣', trigger: 'blur'},
                    ],
                    upgradeMoney: [
                        {required: true, message: '请输入升级所需金额', trigger: 'blur'}
                    ]
                }
            }
        },
        computed: {
            headers() {
                return {
                    'token': getToken(),
                };
            },
        },
        created() {
            this.getList();
        },
        methods: {
            // 获取会员等级数据
            getList() {
                this.listLoading = false
                listStoreVip(this.listQuery).then(res => {
                    console.log('会员等级列表', res)
                    this.list = res.data.data.records
                    this.total = res.data.data.total;
                })
            },

            // 点击添加会员等级
            addStoreVip() {
                this.dialogVisible = true
            },
            // 添加会员等级
            addMemberLv() {
                console.log(this.ruleForm)
                addStoreVip(this.ruleForm).then(res => {
                    this.$notify.success({
                        title: "成功",
                        message: "添加成功",
                    });
                    this.getList();
                    this.dialogVisible = false
                }).catch((response) => {
                    this.$notify.error({
                        title: "失败",
                        message: response.msg,
                    });
                });
            },
            // 点击编辑按钮
            handleDetail(row) {

                row.specialDesc22 = eval(row.specialDesc22)
                row.specialDesc = null
                console.log('111',row)
                this.updataSvip = row
                this.updataSvipni = true

            },

            updatasSvip() {
                console.log('123',this.updataSvip)
                updataSvip(this.updataSvip).then(res => {
                    this.$notify.success({
                        title: "成功",
                        message: "修改成功",
                    });
                    this.getList()
                    this.updataSvipni = false
                })
            },
            // 点击删除按钮
            delStoreVip(row) {
                console.log('删除了')
                this.$confirm('确定删除?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    this.$router.push({
                        query: {vipId: row.id},
                    });
                    const vipId = this.$route.query.vipId;
                    deleteStoreVip(vipId).then(response => {
                        this.$notify.success({
                            title: '成功',
                            message: '删除成功'
                        })
                        this.getList()
                        this.$router.push({name: 'collect'})
                    }).catch(response => {
                        this.$notify.error({
                            title: '失败',
                            message: response.msg
                        })
                    })
                }).catch(() => {
                })
            },
            // 添加会员的会员特权
            // 动态添加会员特权
            addDomain() {
                // this.itemType =true;
                this.ruleForm.specialDesc22.push({
                    privilege_title: '',
                    privilege_image: '',
                    privilege_txt: '',
                    key: Date.now()
                });
            },
            // 删除会员特权
            removeDomain(item) {
                var index = this.ruleForm.specialDesc22.indexOf(item)
                if (index !== -1) {
                    this.ruleForm.specialDesc22.splice(index, 1)
                }
            },


            // 编辑会员的会员特权

            addUpdata() {
                // this.itemType =true;
                this.updataSvip.specialDesc22.push({
                    privilege_title: '',
                    privilege_image: '',
                    privilege_txt: '',
                    key: Date.now()
                });
            },
            // 删除会员特权
            removeUpdata(item) {
                var index = this.updataSvip.specialDesc22.indexOf(item)
                if (index !== -1) {
                    this.updataSvip.specialDesc22.splice(index, 1)
                }
            },
            // 会员背景图
            uploadOverrun: function () {
                this.$message({
                    type: "error",
                    message: "上传文件个数超出限制!最多上传5张图片!",
                });
            },
            handleGalleryUrl(response, file, fileList) {
                if (response.errno === 0) {
                    this.goods.gallery.push(response.data.url);
                }
            },
            handleRemove: function (file, fileList) {
                for (var i = 0; i < this.goods.gallery.length; i++) {
                    // 这里存在两种情况
                    // 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
                    //    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
                    // 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
                    var url;
                    if (file.response === undefined) {
                        url = file.url;
                    } else {
                        url = file.response.data.url;
                    }

                    if (this.goods.gallery[i] === url) {
                        this.goods.gallery.splice(i, 1);
                    }
                }
            },

            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }
        }
    };
</script>
<style lang="scss" scoped>
    .filter-container .filter-item {
        margin-bottom: 2px;
    }

    .text {
        padding: 20px;
        background-color: #f4f4f5;
        font-size: 13px;
        color: #909395;
        margin-bottom: 10px;
        border-radius: 10px;
    }

    .item {
        padding-top: 20px;
        background-color: #f4f4f5;
    }

    .demo-dynamic {
        padding: 5px;
        border: 1px solid #99a9bf;
        margin-bottom: 5px;
    }
</style>
