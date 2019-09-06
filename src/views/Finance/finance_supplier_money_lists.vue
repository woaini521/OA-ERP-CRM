<template>
    <div class="box">
        <div>
            <label>筛选：</label>
            <el-input v-model="name" style="width:217px"></el-input>
            <el-button type="primary" style="margin-left:40px;" @click="seach">搜索</el-button>
        </div>
        <el-table :data="tableData" ref="table" class="oo" :row-key="getRowKeys" :expand-row-keys="expands">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="收款名称" label-width="90px">
                            <span>{{ props.row.receiving_name }}</span>
                        </el-form-item>
                        <el-form-item label="收款账号" label-width="90px">
                            <span>{{ props.row.receiving_account }}</span>
                        </el-form-item>
                        <el-form-item label="开户行" label-width="90px">
                            <span>{{ props.row.opening_bank }}</span>
                        </el-form-item>
                        <el-form-item label="备注" label-width="90px">
                            <span>{{ props.row.remarks }}</span>
                        </el-form-item>
                        <el-form-item label="提交时间" label-width="90px">
                            <span>{{ props.row.add_time }}</span>
                        </el-form-item>
                        <el-form-item label=" " label-width="90px">
                            <el-button @click="shenH(props.row)" type="primary" v-if="props.row.status == 0">财务审核</el-button>
                            <el-button @click="CshenH(props.row)" type="primary" v-if="props.row.status == 1">出纳审核</el-button>
                            <el-button @click="chakan(props.row)" type="primary" v-if="props.row.status == 2">查看</el-button>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column label="供应商" prop="supplier_name" width="400px"></el-table-column>
            <el-table-column label="备货未结算" prop="product_stockup_supplier_money">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.status < 2" @click="jiner(scope.row,'product_stockup_supplier_money')">{{scope.row.product_stockup_supplier_money}}</el-button>
                    <span  v-if="scope.row.status >= 2">{{scope.row.product_stockup_supplier_money}}</span>
                </template>
            </el-table-column>
            <el-table-column label="订单" prop="purchase_product_money">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.status < 2" @click="jiner(scope.row,'purchase_product_money')">{{scope.row.purchase_product_money}}</el-button>
                    <span  v-if="scope.row.status >= 2">{{scope.row.purchase_product_money}}</span>
                </template>
            </el-table-column>
            <el-table-column label="产生的售后" prop="supplier_after_sales_money">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.status < 2" @click="jiner(scope.row,'supplier_after_sales_money')">{{scope.row.supplier_after_sales_money}}</el-button>
                    <span  v-if="scope.row.status >= 2">{{scope.row.supplier_after_sales_money}}</span>
                </template>
            </el-table-column>
            <el-table-column label="运费未结算" prop="express_cost_prepayment">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.status < 2" @click="jiner(scope.row,'express_cost_prepayment')">{{scope.row.express_cost_prepayment}}</el-button>
                    <span  v-if="scope.row.status >= 2">{{scope.row.express_cost_prepayment}}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="status">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 0">已提交</span>
                    <span v-if="scope.row.status == 1">财务已审核</span>
                    <span v-if="scope.row.status == 2">出纳已打款</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" prop="status">
                <template slot-scope="scope">
                    <el-button @click="see(scope.row)" size="mini">查看</el-button>
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

        <!-- 添加供应商结算款项明细 -->
        <el-dialog title="供应商结算款项明细" :visible.sync="dialogMingxi" width="60%">
            <el-table :data="mingxi" show-summary>
                <el-table-column label="添加时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.add_time}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="订单客户">
                    <template slot-scope="scope">
                        <span>{{scope.row.company_name}}/{{scope.row.customer_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" prop="money"></el-table-column>
                <el-table-column label="销售员">
                    <template slot-scope="scope">
                        <span>{{scope.row.dep_title}}/{{scope.row.user_name}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog title="出纳上传付款凭证" :visible.sync="voucher">
            <chuna @func="jiezi" :a="dddd"></chuna>
            <div class="contract">
                <div class="contractInner">
                    <div class="contractInnerLeft" v-show="show">
                        <el-upload
                            class="avatar-uploader"
                            accept="image/jpeg,image/gif,image/png,image/bmp"
                            action="123"
                            :show-file-list="false"
                            :http-request="upLoad"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                    <div class="img" v-show="imageUrlstate">
                        <div class="imginner" v-for="item in imageUrl" :key="item.src">
                            <img :src="item.src" class="avatar">
                                <div class="avatars">
                                    <i @click="deletesImg(item.src)" v-show="show" style="font-size: 30px;margin-top: 75px;margin-left: 75px;color:#FFF" class="el-icon-delete" ></i>
                                    <i @click="big(item.src)" v-show="!show" style="font-size: 30px;margin-top: 75px;margin-left: 75px;color:#FFF" class="el-icon-zoom-in" ></i>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>

            <el-button @click="comfile" style="margin-top:20px;" v-show="show">提交</el-button>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisibleImg">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
import chuna from "@/components/chuna";
export default {
    components:{
       chuna, 
    },
    data (){
        return {
            name:'',  // 搜索
            tableData:[],//表格数据
            currentPage:0,//当前页
            total:0,//总数
            per_page:0,//每页多少条
            last_page:0,//总页数
            expands:[''],
            ID:'',
            // 图片上传
            voucher:false,
            imageUrlstate:false,
            imageUrl:[],
            show:true,
            dialogVisibleImg:false,
            dialogImageUrl:'',

            zichuan:[],
            dddd:'',
            dialogMingxi:false,
            mingxi:[],
        }
    },
    methods:{
        gettableData(){
            this.axios.get('/Finance/finance_supplier_money_lists').then(res => {
                this.tableData = res.data.data;
                this.currentPage = res.data.current_page;
                this.total = res.data.total;
                this.per_page = res.data.per_page;
                this.last_page = res.data.last_page;
            })
        },
        getRowKeys(row){
            return row.id
        },
        seach(){
            this.axios.post('/Finance/finance_supplier_money_lists',{
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
            this.axios.post('/Finance/finance_supplier_money_lists',{
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
        see(row){
            const $table = this.$refs.table;
            this.tableData.map((item) => {
                if (row.id !== item.id) {
                $table.toggleRowExpansion(item, false)
                }
            })
            $table.toggleRowExpansion(row)
        },
        jiner(a,b){
            this.axios.get('/erp.supplier/supplier_money_select?start_time='+a.start_time+'&end_time='+a.end_time+'&id='+a.supplier_id+'&action='+b).then(res => {
                this.mingxi = res.data.express_cost
                this.dialogMingxi = true;
            })
        },
        shenH(a){
            this.axios.post('/Finance/finance_supplier_money_status',{
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
        CshenH(a){
            this.voucher = true;
            this.ID = a.id;
            this.dddd = a.id;
            this.getimgUrl(a.id);
        },
        
        handleAvatarSuccess() {
            this.getimgUrl(0);
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
        upLoad(file){
            const voucherData = new FormData()
            voucherData.append('file',file.file)
            voucherData.append('id',this.ID)
            voucherData.append('class','temporary_file')
            voucherData.append('data_table','supplier_money')
            this.axios.post(`/File/file_add`,voucherData).then(res => res.data)
            .then(data => {
                if(data.code === 2000){
                  let a = {src:data.src}
                  this.imageUrl.push(a);
                  this.imageUrlstate=true;
                }
            })  
        },
        // 获取合同图片
        getimgUrl(a){
            this.axios.post('/File/file_select',{
              data_table:'supplier_money',
              class:'temporary_file',
              id:a,
            }).then(res => {
                if(res.data != null){
                  this.imageUrlstate = true;
                  this.imageUrl = res.data;
                }  
            })
        },
        deletesImg(a){ 
            this.axios.post('/File/file_delete',{
                class:'temporary_file',
                src:a
            }).then(res => {
                if(res.data.code == 2000){
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    this.getimgUrl(this.ID)
                }else{
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    });
                } 
            })
        },
        // 接收值
        jiezi(data){
           this.zichuan = data;
           //console.log(data); 
        },
        comfile(){
            if(this.zichuan.length == 0){
                this.$message({
                    message: '选择付款账号',
                    type: 'error'
                });
            }else{
                this.axios.post('/Finance/finance_supplier_money_status',{
                    id:this.ID,
                    src:this.imageUrl,
                    paye:this.zichuan
                }).then(res => {
                    if(res.data.code == 2000){
                        this.gettableData();
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.voucher = false;
                    }else{
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                })
            }
        },
        chakan(a){
            this.voucher = true;
            this.getimgUrl(a.id) ;
            this.show = false;
        },
        // 放大
        big(a){
            this.dialogVisibleImg=true;
            this.dialogImageUrl=a;
        },
    },
    activated(){
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

