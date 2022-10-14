<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="商品ID" prop="productId" />
      <el-table-column align="center" label="商品名称" prop="productName" />
      <el-table-column align="center" label="评论图片" prop="productImage">
        <template slot-scope="scope">
          <el-image  :src="scope.row.productImage" style="width: 40px; height: 40px; margin-right: 5px;" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="评价类型" prop="score">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.score | scoreTy }}</el-tag>
        </template>

      </el-table-column>
      <el-table-column align="center" label="用户名称" prop="nickname" />
      <el-table-column align="center" label="用户头像" prop="picUrls">
        <template slot-scope="scope">
          <el-avatar shape="square" :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column align="center" label="评价内容" prop="content"/>

      <el-table-column align="center" label="时间" prop="dateline">
        <template slot-scope="scope">
          <span>{{
            new Date(Number(scope.row.dateline) * 1000).format()

          }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="审核状态" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="success">通过审核</el-tag>
          <el-tag v-else type="danger">未通过审核</el-tag>
        </template>

      </el-table-column>

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handlePut(scope.row)">审核</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />


  </div>
</template>

<script>
import { listComment, deleteComment,editComment } from '@/api/comment'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Comment',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      scoreCSS:'',
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 10,
      },
    }
  },
  filters:{
    scoreTy(value){
        if(value === 1){
          // this.scoreCSS = 'danger'
          return '非常不满意'
        } else if(value===2){
          // this.scoreCSS = 'warning'
          return '不满意'
        } else if(value===3){
          // this.scoreCSS = 'info'
          return '一般'
        } else if(value===4){
          // this.scoreCSS = ''
          return '良好'
        }else if(value===5){
          // this.scoreCSS = 'success'
          return '满意'
        }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(){
      listComment(this.listQuery).then(res=>{
        console.log('平论',res)
        this.listLoading =false
        this.list = res.data.data.records
        this.total =res.data.data.total
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
// 审核按钮
    handlePut(row){

      if(row.status === 1){
        row.status=0
      }else {
        row.status=1
      }

      this.$router.push({
        query: { cid: row.id,
          status:row.status},
      });
      const data = this.$route.query
      console.log(data)
      editComment(data).then(res=>{
        this.$notify.success({
          title: "成功",
          message: "修改成功",
        });
        this.getList();
      })
    },

    handleDelete(row) {
      this.$confirm("确定删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      }).then(()=>{
        this.$router.push({
          query: { cid: row.id },
        });
        const cid = this.$route.query.cid;
        deleteComment(cid).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
          })
          this.getList()
        }).catch((response) => {
          this.$notify.error({
            title: "失败",
            message: response.data.msg,
          });
        });

      })

    },
  }
}
</script>
