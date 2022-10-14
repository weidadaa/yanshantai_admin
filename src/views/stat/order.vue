<template>
    <div class="app-container">
        <el-button type="primary" @click="addNewss" style="margin: 10px">添加新闻</el-button>
<!--查询结果-->
        <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
            <el-table-column align="center" width="100" label="编号" prop="id"/>
            <el-table-column align="center" label="	新闻标题" prop="title"/>

            <el-table-column align="center" label="	新闻封面" prop="phone">
                <template slot-scope="scope">
                    <el-avatar shape="square" :size="100" fit="cover" :src="scope.row.cover"></el-avatar>
                </template>

            </el-table-column>

            <el-table-column align="center" label="	新闻摘要" prop="abstract">
                <template slot-scope="scope">
                    <span class="heightaa">{{scope.row.abstract}}</span>
                </template>

            </el-table-column>

            <el-table-column align="center" label="	作者" prop="author"/>
            <el-table-column align="center" label="	浏览量" prop="views"/>

            <el-table-column align="center" label="更改时间" prop="addTime">
                <template slot-scope="scope">
                    <span>{{new Date(Number(scope.row.addTime) * 1000).format()}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="	创建时间" prop="addTime">
                <template slot-scope="scope">
                    <span>{{new Date(Number(scope.row.addTime) * 1000).format()}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" prop="addTime">
                <template slot-scope="scope">
                    <el-button type="primary" @click="editNews(scope.row)">编辑</el-button>
                    <el-button type="danger" @click="delNews(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
<!--新闻详情-->
        <el-dialog title="新闻详情" :visible.sync="newsDeit" width="80%">
            <el-form ref="newsDetail" :model="newsDetail" label-width="100px">
                <el-form-item label="新闻标题">
                    <el-input v-model="newsDetail.title"></el-input>
                </el-form-item>
                <el-form-item label=" 新闻封面：">
                    <el-upload
                            :headers="headers"
                            :action="uploadPath"
                            :show-file-list="false"
                            :on-success="uploadPicUrl"
                            class="avatar-uploader"
                            accept=".jpg,.jpeg,.png,.gif"
                    >
                        <img v-if="newsDetail.cover" :src="newsDetail.cover" class="avatar"/>
                        <i v-else class="el-icon-plus avatar-uploader-icon"/>
                    </el-upload>

                </el-form-item>
                <el-form-item label="新闻内容：">
                    <editor v-model="newsDetail.content" :init="editorInit"/>
                </el-form-item>
                <el-form-item label="作者">
                    <el-input v-model="newsDetail.author"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitNewsDetail">修改</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
<!--        添加新闻-->
        <el-dialog title="添加新闻" :visible.sync="addNewsa" width="80%">
            <el-form ref="addStoreNews" :model="addStoreNews" label-width="100px">
                <el-form-item label="新闻标题：">
                    <el-input v-model="addStoreNews.title"></el-input>
                </el-form-item>
                <el-form-item label=" 新闻封面：">
                    <el-upload
                            :headers="headers"
                            :action="uploadPath"
                            :show-file-list="false"
                            :on-success="addUploadPicUrl"
                            class="avatar-uploader"
                            accept=".jpg,.jpeg,.png,.gif"
                    >
                        <img v-if="addStoreNews.cover" :src="addStoreNews.cover" class="avatar"/>
                        <i v-else class="el-icon-plus avatar-uploader-icon"/>
                    </el-upload>

                </el-form-item>
                <el-form-item label="新闻内容：">
                    <editor v-model="addStoreNews.content" :init="editorInit"/>
                </el-form-item>
                <el-form-item label="作者">
                    <el-input v-model="addStoreNews.author"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitAddNews">添加</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<style>
    .heightaa {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
<script>
    import { listNews, upDataNews, delNews,storeNews } from '@/api/stat'
    import {uploadPath,getImg} from '@/api/storage';
    import Editor from "@tinymce/tinymce-vue";
    import {createStorage} from "../../api/storage";
    // import {getToken} from "../../../../yipinhui-houtai/src/utils/auth";
    import {getToken} from "../../../src/utils/auth";

    export default {
        components: {Editor},
        data() {
            return {
                list: [],//获取的数据
                uploadPath,
                getImg,
                listLoading: true,
                newsDeit: false,
                addNewsa:false,
                newsDetail: {},//修改数据
                addStoreNews:{//添加数据
                    title:'',
                    catId:null,
                    storeId:1,
                    cover:null,
                    content:null,
                    author:'',
                },
                NewsId:null,//保存新闻分类id
                listCondition: {
                    categoryId: null,
                    currentPage: 1,
                    pageSize: 10,
                },
                editorInit: {
                    language: "zh_CN",
                    height: "400px",
                    convert_urls: false,
                    plugins: [
                        "advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount",
                    ],
                    toolbar: [
                        "searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample",
                        "hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen",
                    ],
                    images_upload_handler: function (blobInfo, success, failure) {
                        const formData = new FormData();
                        formData.append("file", blobInfo.blob());
                        createStorage(formData)
                            .then((res) => {
                                success(res.data.data.url);
                            })
                            .catch(() => {
                                failure("上传失败，请重新上传");
                            });
                    },
                },
            }
        },
        computed: {
            headers() {
                return {
                    "token": getToken(),
                };
            },
        },
        created() {
            this.NewsId = this.$route.query.categoryId
            this.getList()
        },
        methods: {
            addUploadPicUrl: function (response) {
                console.log(response)
                this.addStoreNews.cover = response.data;
            },

            submitAddNews(){
                this.addStoreNews.catId =this.NewsId
                storeNews(this.addStoreNews).then(res=>{
                    this.$notify.success({
                        title: "成功",
                        message: "添加成功",
                    });
                    this.getList();
                    this.addNewsa = false
                })
            },
            // 添加新闻
            addNewss(){
               this.addNewsa =true
                this.addStoreNews = {
                    title:'',
                    catId:null,
                    storeId:1,
                    cover:null,
                    content:'',
                    author:'',
                }
            },
            // 删除按钮
            delNews(row) {
                this.$confirm("确定删除?", "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    center: true,
                }).then(() => {
                        this.$router.push({
                            query: {newsId: row.id,categoryId: this.NewsId},
                        });
                        const newsId = this.$route.query.newsId;
                        delNews(newsId)
                            .then((response) => {
                                this.$notify.success({
                                    title: "成功",
                                    message: "删除成功",
                                });
                                this.listCondition.categoryId = this.$route.query.categoryId
                                this.getList();
                            })
                            .catch((response) => {
                                this.$notify.error({
                                    title: "失败",
                                    message: response.msg,
                                });
                            });
                    }).catch(() => {
                    });
            },
            // 提交修改按钮
            submitNewsDetail() {
                upDataNews(this.newsDetail).then(res => {
                    this.$notify.success({
                        title: "成功",
                        message: "修改成功",
                    });
                    this.getList();
                    this.newsDeit = false
                })
                console.log('提交了')
            },
            getList() {
                this.listCondition.categoryId = this.NewsId
                console.log(this.listCondition)
                listNews(this.listCondition).then(res =>{
                    this.listLoading = false
                    this.list = res.data.data.records
                })
            },
            // 编辑按钮
            editNews(row) {
                this.newsDeit = true
                this.newsDetail = row
            },
            uploadPicUrl: function (response) {
                console.log(response)
                this.newsDetail.cover = response.data;
            },

        }

    }
</script>
