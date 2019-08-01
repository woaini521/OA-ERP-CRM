<template>
    <div class="box">
        <div class="head_box">
            <label>筛选：</label>
            <el-input placeholder="名称" v-model="seach" style="width:217px;margin-left:10px"></el-input>
            <el-button type="primary" @click="seachName"  style="margin-left:20px;">搜索</el-button>
        </div>

        <div class="content_box">
            <el-table :data="tabledata">
                <el-table-column label="订单编号" prop="customer_order_id"></el-table-column>
                <el-table-column label="产品">
                    <template slot-scope="scope">
                        <span>{{scope.row.product_sku}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="收款人" prop="receiving_name"></el-table-column>-->
                <el-table-column label="原因">
                    <template slot-scope="scope">
                        <span>{{ stata1[scope.row.type[0]] }}</span>
                    </template>
                </el-table-column> 
                <el-table-column label="金额" prop="fee"></el-table-column>
                <el-table-column label="业务员" prop="user_name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span>{{ stata[scope.row.status] }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remarks"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status == 0" type="primary" size="small" @click="FinanceSee(scope.row)">查看</el-button>
                        <el-button v-else-if="scope.row.status == 1" type="primary" size="small" @click="CashierSee(scope.row)">查看</el-button>
                        <el-button v-if="scope.row.status == 2" type="text" size="small">已打款</el-button>
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
        <!-- 财务审核 -->
        <el-dialog title="财务审核" :visible.sync="examine">
            <p style="font-size: 20px;color:#000">
                <span>收款人：</span><span>{{ receiving_name }}</span>
                <span style="margin-left:30px;">收款账号：</span><span>{{ receiving_account }}</span>
            </p>
            <p style="font-size: 20px;color:#000;margin-top:5px;"><span>预付款金额：</span><span>{{ fee }}￥</span></p>
            <el-table :data="examineData">
                <el-table-column label="产品">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}{{scope.row.sku_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数量" prop="number"></el-table-column>
                <el-table-column label="采购价" prop="purchase_price"></el-table-column>
                <el-table-column label="总金额">
                    <template slot-scope="scope">
                        <span>{{ Number(scope.row.number) * Number(scope.row.purchase_price) }}￥</span>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="examine = false">取 消</el-button>
                <el-button type="primary" @click="Submission">审核通过</el-button>
            </div>
        </el-dialog>
        <!-- 出纳审核 -->
        <el-dialog title="财务审核" :visible.sync="Cashierexamine">
            <p style="font-size: 20px;color:#000">
                <span>收款人：</span><span>{{ receiving_name }}</span>
                <span style="margin-left:30px;">收款账号：</span><span>{{ receiving_account }}</span>
            </p>
            <p style="font-size: 20px;color:#000;margin-top:5px;"><span>预付款金额：</span><span>{{ fee }}￥</span></p>
            <el-table :data="examineData">
                <el-table-column label="产品">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}{{scope.row.sku_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数量" prop="number"></el-table-column>
                <el-table-column label="采购价" prop="purchase_price"></el-table-column>
                <el-table-column label="总金额">
                    <template slot-scope="scope">
                        <span>{{ Number(scope.row.number) * Number(scope.row.purchase_price) }}￥</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="contract">
                <label>上传打款凭证</label>
                <div class="contractInner">
                    <div class="contractInnerLeft">
                    <el-upload
                        class="avatar-uploader"
                        accept="image/jpeg,image/gif,image/png,image/bmp"
                        action="/file/customer_order_advance_charge_file"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    </div>
                    <div class="img" v-show="imageUrlstate">
                    <div class="imginner" v-for="item in imageUrl" :key="item.src">
                        <img :src="item.src" class="avatar">
                        <div class="avatars">
                        <i @click="deleteimg(item.src)" style="font-size: 30px;margin-top: 75px;margin-left: 75px;color:#FFF;" class="el-icon-delete" ></i>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="Cashierexamine = false">取 消</el-button>
                <el-button type="primary" @click="CashierSubmission">提 交</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data(){
        return{
          seach:'', // 筛选
          stata:['等待财务审核','等待出纳审核','审核完毕'],  
          stata1:['补货','换货','退货','退单'],  
          tabledata:[], // 预付款数据  
          currentPage:0,//当前页
          total:0,//总数
          per_page:0,//每页多少条
          last_page:0,//总页数
          examine:false, // 财务审核弹窗
          Cashierexamine:false, // 财务审核弹窗
          id:'',
          examineData:[],
          receiving_name:'', //收款人   
          receiving_account:'', // 收款账号
          fee:'', // 金额
          // 合同图片存储
          imageUrl:[],
          imageUrlstate:false,
        }  
    },
    methods:{
        // 搜索查询
        seachName(){
            this.axios.post('/Finance/finance_order_after_sales_list',{
                supplier_name:this.seach,
            }).then(res => {
                this.tabledata = res.data.after_sales.data;
                this.currentPage = res.data.after_sales.current_page;
                this.total = res.data.after_sales.total;
                this.per_page = res.data.after_sales.per_page;
                this.last_page = res.data.after_sales.last_page;
            })
        },
        // 获取列表数据
        gettabledata(){
            this.axios.get('/Finance/finance_order_after_sales_list').then(res => {
                this.tabledata = res.data.after_sales.data;
                this.currentPage = res.data.after_sales.current_page;
                this.total = res.data.after_sales.total;
                this.per_page = res.data.after_sales.per_page;
                this.last_page = res.data.after_sales.last_page;
            })
        },
        // 分页切换
        handleCurrentChange(val) {
            const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.axios.post('/Finance/finance_order_after_sales_list',{
                page:val,
            }).then(res => {
                this.tableData = res.data.after_sales.data;
                this.currentPage = res.data.after_sales.current_page;
                loading.close();
            })  
        },

        // 财务审核按钮
        FinanceSee(a){
            this.examine = true;
            this.id = a.id;
            this.receiving_name = a.customer_order_id;
            this.receiving_account = a.type;
            this.fee = a.fee;
            this.examineData = a.product;
        },
        // 财务审核提交
        Submission(){
            this.axios.post('/Finance/finance_order_after_sales_status',{
                id:this.id,
            }).then(res => {
                if(res.data.code == 2000){
                    this.gettabledata();
                    this.open(res.data.msg,'success');
                    this.examine = false;
                }else{
                    this.open(res.data.msg,'error');
                }
            })
        },
        // 出纳审核按钮
        CashierSee(a){
            this.Cashierexamine = true;
            this.id = a.id;
            this.receiving_name = a.customer_order_id;
            this.receiving_account = a.type;
            this.fee = a.fee;
            this.examineData = a.product;
            this.getimgUrl(a.id);
        },
        // 合同上传
        handleAvatarSuccess() {
            //let url = res.src;
            //this.imageUrl.push(url);
            this.getimgUrl(this.id);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
            this.$message.error('上传图片必须是JPG/PNG格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        // 获取合同图片
        getimgUrl(a){
            this.axios.get('/crm.Order/customer_order_file_select?id='+a+'&data_table=customer_order_after_sales&correlation_id='+this.receiving_name).then(res => {
                if(res.data.customer_order_after_sales != null){
                 this.imageUrlstate = true;
                 this.imageUrl = res.data.customer_order_after_sales;
                }  
            })
        },
        // 删除合同数据图片
        deleteimg(a){
            this.axios.post('/file/customer_order_delete',{
            src:a
            }).then(res => {
                if(res.data.code == 2000){
                     this.open(res.data.msg,'success');
                      
                    this.getimgUrl(this.customer_order_id);
                }else{
                    this.open(res.data.msg,'error');
                }
            })
        },
        // 出纳提交审核
        CashierSubmission(){
            let src = [];
            for(let i=0;i<this.imageUrl.length;i++){
                let P = this.imageUrl[i].src;
                src.push(P);      
            };
             this.axios.post('/Finance/finance_order_after_sales_status',{
                id:this.id,
                src:src
            }).then(res => {
                if(res.data.code == 2000){
                    this.gettabledata();
                    this.open(res.data.msg,'success');
                    this.Cashierexamine = false;
                }else{
                    this.open(res.data.msg,'error');
                }
            })
        },


        open(a,b){
            this.$message({
                message: a,
                type: b
            });
        },
    },
    created(){
        this.gettabledata();
        
    },
    watch:{
        $route(to){
            this.gettabledata();
        }
    }
}
</script>

<style lang="less" scoped>
.avatar-uploader,.el-upload {
    width: 178px;
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

.contract{
    margin-top: 20px;
    border:1px solid #CCC;
    padding: 20px 10px;
    overflow: hidden;
    margin-bottom: 10px;
    .contractInner{
        margin-top: 20px;
        overflow: hidden;
        .contractInnerLeft{
        float: left;
        margin-left: 20px;
        }
    }
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
