<template>
    <div class="box">
        <div>
            <label>筛选：</label>
            <el-input v-model="name" style="width:217px"></el-input>
            <el-button type="primary" style="margin-left:40px;" @click="seach">搜索</el-button>
        </div>
        <el-table :data="tableData">
            <el-table-column label="供应商" prop="supplier_name" width="250px"></el-table-column>
            <el-table-column label="售后产品" prop="name"></el-table-column>
            <el-table-column label="销售款项" prop="money" width="110px"></el-table-column>
            <el-table-column label="采购款项" prop="supplier_money" width="110px"></el-table-column>
            <el-table-column label="数量" prop="number" width="80px"></el-table-column>
            <el-table-column label="业务员" prop="order_user_name" width="80px"></el-table-column>
            <el-table-column label="售后人" prop="after_sales_user_name" width="80px"></el-table-column>
            
            <el-table-column label="结算方式" width="80px">
                <template slot-scope="scope">
                    <span>
                        {{ scope.row.settlement  == 1 ?'月结':'现结'}}
                    </span>
                </template>
            </el-table-column>

            <el-table-column label="状态" prop="status"  width="90px">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 0">已提交</span>
                    <span v-if="scope.row.status == 1">财务已审核</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" width="250px">
                <template slot-scope="scope">
                    <span>销售备注：{{ scope.row.remarks}}</span><br>
                    <span>采购备注：{{ scope.row.purchase_remarks}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="110px">
                <template slot-scope="scope">
                    <el-button @click="shenH(scope.row)" type="primary" v-if="scope.row.status == 0" size="mini">财务审核</el-button>
                    <el-button type="text" v-if="scope.row.status == 1" size="mini" >完成</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 10px;">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="per_page"
                layout="total, prev, pager, next"
                :total="total">
            </el-pagination>
        </div>

    </div>
</template>

<script>
export default {
    data(){
        return {
            name:'',
            tableData:[],
            currentPage:0,//当前页
            total:0,//总数
            per_page:0,//每页多少条
            last_page:0,//总页数
        }
    },
    methods:{
        gettableData(){
            this.axios.get('/Finance/finance_supplier_after_sales_list').then(res => {
                this.tableData = res.data.data;
                this.currentPage = res.data.current_page;
                this.total = res.data.total;
                this.per_page = res.data.per_page;
                this.last_page = res.data.last_page;
            })
        },
         seach(){
            this.axios.post('/Finance/finance_supplier_after_sales_list',{
                name:this.name
            }).then(res => {
                this.tableData = res.data.data;
                this.currentPage = res.data.current_page;
                this.total = res.data.total;
                this.per_page = res.data.per_page;
                this.last_page = res.data.last_page;
            })  
        },
        handleCurrentChange(val){
            this.axios.post('/Finance/finance_supplier_after_sales_list',{
                name:this.name,
                page:val
            }).then(res => {
                this.tableData = res.data.data;
                this.currentPage = res.data.current_page;
                this.total = res.data.total;
                this.per_page = res.data.per_page;
                this.last_page = res.data.last_page;
            }) 
        },
        shenH(a){
            this.axios.post('/Finance/finance_supplier_after_sales_status',{
                id:a.id
            }).then(res => {
                if(res.data.code == 2000){
                    this.gettableData();
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                }else{
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    });
                }
            })
        },
        
        
    },
    created(){
        this.gettableData();
    }
}
</script>

<style lang="less" scoped>
.contract{
  overflow: hidden;
  .contractInner{
    overflow: hidden;
    .contractInnerLeft{
      float: left;
    }
  }
}
.avatar-uploader,.el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
     border: 1px dashed #CCC !important;
  }
  .avatar-uploader,.el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .img{
    overflow: hidden;
    .imginner{
      float: left;
      width: 178px;
      height: 178px;
      margin-left: 10px;
      border-radius: 5px;
      position: relative;
      .avatar {
        width: 178px;
        height: 178px;
      }
      
      .avatars {
        width: 178px;
        height: 178px;
        background: rgba(102, 102, 102, 0.4);
        position: absolute;
        top: 0;
        display: none;
      }
    }
    .imginner:hover .avatars{display:block;cursor: pointer;}  
  }
</style>


