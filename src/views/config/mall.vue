<template>
    <div class="app-container">
        <el-button type="primary" @click="onSubmit">新建门店</el-button>
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
                    min-width="100"
                    label="门店名称"
                    prop="name"
            />

            <el-table-column align="center" label="门店类型" prop="price"/>

            <el-table-column align="center" label="联系地址" prop="address"/>

            <el-table-column align="center" label="联系电话">
                <template slot-scope="scope">
                    <span v-show="scope.row.phone1 !== '' ">{{scope.row.phone1}}-</span><span>{{scope.row.phone2}}</span>
                </template>

            </el-table-column>

            <el-table-column align="center" label="营业时间" prop="productCategory.catName"/>


            <el-table-column
                    align="center"
                    label="操作"
                    width="400"
                    class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row)"
                    >编辑
                    </el-button
                    >
                    <el-button type="danger" size="mini" @click="handleDelete(scope.row)"
                    >删除
                    </el-button
                    >
                    <el-button
                            type="success"
                            size="mini"
                            @click="handleTuiguang(scope.row)"
                    >设为总店
                    </el-button
                    >
                    <el-button
                            type="success"
                            size="mini"
                            @click="handleTuiguang(scope.row)"
                    >配置主页
                    </el-button
                    >
                </template>
            </el-table-column>
        </el-table>
<!--新建拟态框-->
        <el-dialog
                title="新建门店"
                :visible.sync="dialogVisible"
                width="50%"
               >
            <el-form :model="storeInfo" :rules="rules" ref="storeInfo" label-width="100px" class="demo-ruleForm">
                <el-form-item label="门店名称：" prop="name">
                    <el-input v-model="storeInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="门店地址：" prop="name">
                    <el-input v-model="storeInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="联系电话：">
                        <el-input v-model="areaCode" style="width: 50px; display: inline-block" placeholder="请输入区号(区号可为空)"></el-input> -
                        <el-input v-model="phone" style="width: 150px; display: inline-block" placeholder="请输入电话号码"></el-input>
                </el-form-item>

                <el-form-item label="营业时间：">
                    <el-time-picker
                            is-range
                            v-model="bangTime"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围">
                    </el-time-picker>
                    <el-checkbox-group v-model="checkList">
                        <el-checkbox label="周一" ></el-checkbox>
                        <el-checkbox label="周二" ></el-checkbox>
                        <el-checkbox label="周三" ></el-checkbox>
                        <el-checkbox label="周四" ></el-checkbox>
                        <el-checkbox label="周五" ></el-checkbox>
                        <el-checkbox label="周六" ></el-checkbox>
                        <el-checkbox label="周日" ></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="商品主图：" prop="image">
                    <el-upload
                            action="http://10.1.2.244:10111/yantaishan/ShanglalaProduct/save"
                            :limit="5"
                            :headers="headers"
                            :on-exceed="uploadOverrun"

                            multiple
                            accept=".jpg,.jpeg,.png,.gif"
                            list-type="picture-card"
                    >
                        <img v-if="storeInfo.image" :src="storeInfo.image" class="avatar"/>
                        <i class="el-icon-plus"/>
                    </el-upload>
                </el-form-item>

                <el-form-item label="门店类型：" >
                    <el-checkbox-group v-model="checkList2">
                        <el-checkbox label="自提点" name="type"></el-checkbox>
                        <el-checkbox label="门店" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="门店简介：">
                    <el-input type="textarea" v-model="storeInfo.desc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import {listMall} from '@/api/config'
    import {getToken} from "@/utils/auth";

    export default {
        name: 'ConfigMail',
        data() {
            return {
                total:'',
                listLoading: true,
                dialogVisible:false,
                list: '',
                checkList:[],
                checkList2:[],
                bangTime:'',
                listCondition: {
                    currentPage: 1,
                    pageSize: 10
                },
                storeInfo:{}
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
            this.getList()
        },
        methods: {
            getList() {
                listMall(this.listCondition).then(res => {
                    console.log('店铺列表', res)
                    this.listLoading = false
                    this.list = res.data.data.records
                    this.total =res.data.data.total
                })
            },
            // 新建门店
            onSubmit(){
                console.log('门店')
                this.dialogVisible = true
            },
            // 商品主图方法
            uploadOverrun: function () {
                this.$message({
                    type: "error",
                    message: "上传文件个数超出限制!最多上传5张图片!",
                });
            },
            // handleGalleryUrl(response, file, fileList) {
            //     if (response.errno === 0) {
            //         this.goods.gallery.push(response.data.url);
            //     }
            // },
            // handleRemove: function (file, fileList) {
            //     for (var i = 0; i < this.goods.gallery.length; i++) {
            //         // 这里存在两种情况
            //         // 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
            //         //    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
            //         // 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
            //         var url;
            //         if (file.response === undefined) {
            //             url = file.url;
            //         } else {
            //             url = file.response.data.url;
            //         }
            //
            //         if (this.goods.gallery[i] === url) {
            //             this.goods.gallery.splice(i, 1);
            //         }
            //     }
            // },
        }
    }
</script>
