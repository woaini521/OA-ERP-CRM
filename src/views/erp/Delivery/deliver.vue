<template>
    <div class="box">
        <div class="head_box_man">
           <el-table :data="shuju">
               <el-table-column label="产品" prop="name"></el-table-column>
               <el-table-column label="数量" prop="number"></el-table-column>
               <el-table-column label="收货人" prop="address_name"></el-table-column>
               <el-table-column label="收货人号码" prop="address_phone"></el-table-column>
               <el-table-column label="供应商" prop="supplier_name" width="300px" v-if="!Group1"></el-table-column>
               <el-table-column label="采购" prop="purchase_user_name"></el-table-column>
               <el-table-column label="操作"  v-if="this.xian == 1">
                   <template slot-scope="scope">
                       <el-button type="primary" size="mini" @click="openWuliu(scope.row)">添加物流信息</el-button>
                   </template>
               </el-table-column>
           </el-table>
        </div>
        <div class="content_box_wuliu">
            <el-table :data="tableDataWuliu">
                <el-table-column label="物流公司" prop="express_name"></el-table-column>
                <el-table-column label="快递单号" prop="express_numbers"></el-table-column>
                <el-table-column label="快递联系方式" prop="express_phone"></el-table-column>
                <el-table-column label="备注" prop="remarks"></el-table-column>
                <el-table-column label="操作" width="310px"  v-if="this.xian == 1">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="Feiyong(scope.row)">费用</el-button>
                        <el-button type="warning" size="mini" @click="edit(scope.row)">修改</el-button>
                        <el-button type="danger" size="mini" @click="deletes(scope.row)">删除</el-button>
                        <el-button type="danger" size="mini" @click="wuliu(scope.row)">物流</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="content_box_feiyong">
            <label>费用</label>
            <el-table :data="tableDataFeiyong">
                <el-table-column label="物流公司" prop="express_name"></el-table-column>
                <el-table-column label="费用" prop="prepayment"></el-table-column>
                <el-table-column label="付款方式">
                    <template slot-scope="scope">
                        <span>{{status1[scope.row.payment_method]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="付款账户" prop="payment_account"></el-table-column>
                <el-table-column label="结算方式">
                    <template slot-scope="scope">
                        <span>{{status2[scope.row.type]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span>{{status3[scope.row.status]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="修改" v-if="this.xian == 1">
                    <template slot-scope="scope">
                        <el-button type="warning" v-if="scope.row.status == 0" size="small" @click="editFeiyong(scope.row)">修改</el-button>
                         <el-button type="warning" v-else size="small" @click="editFeiyong(scope.row)" disabled>修改</el-button>   
                        <el-button type="danger" size="small" v-if="scope.row.status == 0" @click="deletesFeiyong(scope.row)">删除</el-button>
                        <el-button type="danger" size="small" v-else @click="deletesFeiyong(scope.row)" disabled>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 物流弹窗 -->
        <el-dialog title="物流" :visible.sync="dialogWuliu">
            <el-form :model="dialogWuliuForm" ref="dialogWuliuForm">
                <el-form-item label="物流公司" label-width="100px" prop="value">
                    <el-select v-model="dialogWuliuForm.value" clearable placeholder="请选择" style="width:317px">
                        <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="快递编号" label-width="100px" prop="CourierNumber">
                    <el-input v-model="dialogWuliuForm.CourierNumber" style="width:317px"></el-input>
                </el-form-item>
                <el-form-item label="快递联系方式" label-width="100px" prop="CourierNumber">
                    <el-input v-model="dialogWuliuForm.phone" style="width:317px"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="100px" prop="remark">
                    <el-input type="textarea" v-model="dialogWuliuForm.remark" style="width:317px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogWuliu = false">取 消</el-button>
                <el-button type="primary" @click="addWuliu">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 费用弹窗 -->
        <el-dialog title="费用" :visible.sync="dialogFeiyong">
            <el-form :model="dialogFeiyongForm">
                <el-form-item label="付款方式" label-width="90px">
                    <el-radio v-model="dialogFeiyongForm.payment" label="0">无</el-radio>
                    <el-radio v-model="dialogFeiyongForm.payment" label="1">微信</el-radio>
                    <el-radio v-model="dialogFeiyongForm.payment" label="2">支付宝</el-radio>
                    <el-radio v-model="dialogFeiyongForm.payment" label="3">银行卡</el-radio>
                </el-form-item>
                <el-form-item label="付款账号" label-width="90px">
                    <el-input v-model="dialogFeiyongForm.payment_account" style="width:317px;"></el-input>
                </el-form-item>
                <el-form-item label="类型" label-width="90px">
                    <el-radio v-model="dialogFeiyongForm.type" label="0">自费</el-radio>
                    <el-radio v-model="dialogFeiyongForm.type" label="1">整体结算</el-radio>
                    <el-radio v-model="dialogFeiyongForm.type" label="2">月结算</el-radio>
                </el-form-item>
                <el-form-item label="费用" label-width="90px">
                    <el-input v-model="dialogFeiyongForm.money" style="width:317px;"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="90px">
                    <el-input type="textarea" v-model="dialogFeiyongForm.remark" style="width:317px;"></el-input>
                </el-form-item>
                <el-form-item label="上传图片" label-width="90px">
                    <div class="contract">
                    <div class="contractInner">
                        <div class="contractInnerLeft">
                        <el-upload
                            class="avatar-uploader"
                            accept="image/jpeg, image/gif, image/png, image/bmp"
                            action="111"
                            :show-file-list="false"
                            :http-request="upLoad"
                            :before-upload="beforeAvatarUpload"
                        >
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        </div>
                        <div class="img" v-show="imageUrlstate">
                        <div class="imginner" v-for="(item,index) in imageUrl" :key="item.src">
                            <img :src="item.src" class="avatar" />
                            <div class="avatars">
                                <i
                                    @click="deletesImg(item.src,index)"
                                    style="font-size: 30px;margin-top: 75px;margin-left: 75px;color:#FFF;"
                                    class="el-icon-delete"
                                ></i>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFeiyong = false">取 消</el-button>
                <el-button type="primary" @click="addFeiyong">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="物流状态" :visible.sync="dialogWuliuXx">
            <trackwuLiu :order_express_id="a"></trackwuLiu>
        </el-dialog>
        
    </div>
</template>

<script>
import trackwuLiu from "@/views/erp/Delivery/Track";
export default {
    components:{
        trackwuLiu,
    },
    data(){
        return{
            tableData:[],//物流表格数据
            feiyongform:{
                value:''
            },// 费用表单
            dialogWuliu:false,//物流弹窗
            dialogWuliuForm:{
                value:'',
                CourierNumber:'',
                number:'',
                phone:'',
                id:'',
                remark:'',
                supplier_id:'',
                customer_order_purchase_id:'',
                customer_order_id:'',
            },
            dialogFeiyong:false, // 费用弹窗
            dialogFeiyongForm:{
                money:'',
                remark:'',
                payment:'',
                payment_account:'',
                type:'',
                express_id:'',
                customer_order_id:'',
                id:'',
                supplier_id:'',
                customer_order_purchase_id:'',
            },
            status1:['无','微信','支付宝','银行卡'],
            status2:['自费','整体结算','月结'],
            status3:['等待财务审核','等待出纳审核','审核通过'],
            dialogWuliuXx:false,
            a:'',
            b:'',
            c:'',
            Group1:false,
            imageUrl:[],
            imageUrlstate:false,
        }
    },
    props:['shuju','options','tableDataWuliu','tableDataFeiyong','xian'],
    methods:{
        // 打开添加物流信息弹窗
        openWuliu(a){
            this.dialogWuliuForm.supplier_id= a.supplier_id;
            this.dialogWuliuForm.customer_order_purchase_id= a.customer_order_purchase_id;
            this.dialogWuliuForm.customer_order_id= a.customer_order_id;
            this.dialogWuliu = true;
            this.dialogWuliuForm.value = '';
            this.dialogWuliuForm.CourierNumber = '';
            this.dialogWuliuForm.phone = '';
            this.dialogWuliuForm.id = '';
            this.dialogWuliuForm.remark = a.remarks;
        },
        // 提交物流信息
        addWuliu(a){
            if(this.dialogWuliuForm.id == ''){
                this.axios.post('/erp.Delivery/delivery_order_express_add',{
                customer_order_id:this.dialogWuliuForm.customer_order_id,
                supplier_id:this.dialogWuliuForm.supplier_id,
                customer_order_purchase_id:this.dialogWuliuForm.customer_order_purchase_id,
                express_id:this.dialogWuliuForm.value,
                express_numbers:this.dialogWuliuForm.CourierNumber,
                express_phone:this.dialogWuliuForm.phone,
                remarks:this.dialogWuliuForm.remark,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.$refs['dialogWuliuForm'].resetFields();
                        this.$emit('func','1')
                        this.dialogWuliu = false;
                    }else{
                        this.open(res.data.msg,'error');
                    }
                }).catch(res =>{
                    this.open('请联系管理员','error');   
                })
            }else{
                this.axios.post('/erp.Delivery/delivery_order_express_update',{
                   customer_order_id:this.dialogWuliuForm.customer_order_id,
                   supplier_id:this.dialogWuliuForm.supplier_id,
                   customer_order_purchase_id:this.dialogWuliuForm.customer_order_purchase_id,
                   express_id:this.dialogWuliuForm.value,
                   express_numbers:this.dialogWuliuForm.CourierNumber,
                   express_phone:this.dialogWuliuForm.phone,
                   remarks:this.dialogWuliuForm.remark, 
                   id:this.dialogWuliuForm.id,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.$refs['dialogWuliuForm'].resetFields();
                        this.$emit('func','1')
                        this.dialogWuliu = false;
                    }else{
                        this.open(res.data.msg,'error');
                    }
                })
            }
            
            
        },
        // 物流费用按钮
        Feiyong(a){
            this.dialogFeiyong = true;
            this.dialogFeiyongForm.money = '';
            this.dialogFeiyongForm.remark = '';
            this.dialogFeiyongForm.payment = '';
            this.dialogFeiyongForm.payment_account = '';
            this.dialogFeiyongForm.id = '';
            this.dialogFeiyongForm.type = '';
            this.dialogFeiyongForm.express_id = a.id;
            this.dialogFeiyongForm.customer_order_id = a.customer_order_id;
            this.dialogFeiyongForm.supplier_id = a.supplier_id;
            this.getimageUrl();
        },
        // 物流 修改按钮
        edit(a){
            this.dialogWuliuForm.value = a.express_id;
            this.dialogWuliuForm.CourierNumber = a.express_numbers;
            this.dialogWuliuForm.phone = a.express_phone;
            this.dialogWuliuForm.id = a.id;
            this.dialogWuliuForm.remark = a.remarks;
            this.dialogFeiyongForm.express_id = a.id;
            this.dialogFeiyongForm.customer_order_id = a.customer_order_id;
            this.dialogFeiyongForm.supplier_id = a.supplier_id
            this.dialogWuliu = true;
        },
        // 物流 删除按钮
        deletes(a){
            this.axios.post('/erp.Delivery/delivery_order_express_delete',{
                id:a.id
            }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.$emit('func','1')
                }else{
                    this.open(res.data.msg,'error'); 
                }
            })
        },
        // 费用提交
        addFeiyong(){
            let img = [];
            for (let i = 0; i < this.imageUrl.length; i++) {
                img.push(this.imageUrl[i].src);
            }
            if(this.dialogFeiyongForm.id == ''){
                this.axios.post('/erp.Delivery/delivery_order_express_cost_add',{
                customer_order_id:this.dialogFeiyongForm.customer_order_id,
                customer_order_express_id:this.dialogFeiyongForm.express_id,
                payment_method:this.dialogFeiyongForm.payment,
                payment_account:this.dialogFeiyongForm.payment_account,
                type:this.dialogFeiyongForm.type,
                prepayment:this.dialogFeiyongForm.money,
                remarks:this.dialogFeiyongForm.remark,
                supplier_id:this.dialogFeiyongForm.supplier_id,
                src:img
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.$emit('func','1')
                        this.imageUrlstate = false;
                        this.imageUrl = [];
                        this.dialogFeiyong = false;
                    }else{
                        this.open(res.data.msg,'error'); 
                    }
                })
            }else{
                this.axios.post('/erp.Delivery/delivery_order_express_cost_update',{
                id:this.dialogFeiyongForm.id,
                payment_method:this.dialogFeiyongForm.payment,
                payment_account:this.dialogFeiyongForm.payment_account,
                type:this.dialogFeiyongForm.type,
                prepayment:this.dialogFeiyongForm.money,
                remarks:this.dialogFeiyongForm.remark,
                src:img
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.$emit('func','1')
                        this.imageUrlstate = false;
                        this.imageUrl = [];
                        this.dialogFeiyong = false;
                    }else{
                        this.open(res.data.msg,'error'); 
                    }
                })   
            }
            
        },
        // 费用修改按钮
        editFeiyong(a){
            this.dialogFeiyong = true;
            this.dialogFeiyongForm.money = a.prepayment;
            this.dialogFeiyongForm.remark = a.remarks;
            this.dialogFeiyongForm.payment = String(a.payment_method);
            this.dialogFeiyongForm.payment_account = a.payment_account;
            this.dialogFeiyongForm.id = a.id;
            this.dialogFeiyongForm.type = String(a.type);
            this.dialogFeiyongForm.express_id = '';
            this.dialogFeiyongForm.customer_order_id = '';
            this.getimageUrl();
        },
        // 费用删除
        deletesFeiyong(a){
            this.axios.post('/erp.Delivery/delivery_order_express_cost_delete',{
                id:a.id
            }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.$emit('func','1')
                }else{
                    this.open(res.data.msg,'error'); 
                }
            })
        },
        wuliu(a){
            this.dialogWuliuXx = true;
            this.a = a.id;
        },
        // 图片上传
        // 图片删除
        deletesImg(b) {
           this.axios.post('/File/file_delete',{
               src:b,
               class:'customer_order'
            }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.getimageUrl()
                }else{
                    this.open(res.data.msg,'error'); 
                }
            })
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpeg" || file.type === "image/png";
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error("上传图片必须是JPG/PNG格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return isJPG && isLt2M;
        },
        upLoad(file) {
            const formData = new FormData();
            formData.append("file", file.file);
            formData.append("data_table", 'customer_order_express_cost');
            formData.append("class", 'customer_order');
            this.axios
                .post(`/File/file_add`, formData)
                .then(res => res.data)
                .then(data => {
                if (data.code === 2000) {
                    let a = { src: data.src };
                    this.imageUrl.push(a);
                    this.imageUrlstate = true;
                }else{
                    this.$message.error(data.msg);  
                }
            });
        },
        // 获取图片
        getimageUrl(){
            this.axios.post('/File/file_select',{
               class:'customer_order',
               data_table:'customer_order_express_cost',
            }).then(res => {
                if(res.data != null){
                    this.imageUrl = res.data;
                    this.imageUrlstate = true;  
                }else{
                    this.imageUrl = [];
                    this.imageUrlstate = false;  
                }
            })
        },
         // 公用弹窗
        open(a,b){
            this.$message({
                message: a,
                type: b
            });
        },
        
    },
    created(){
        
        let Group = JSON.parse(localStorage.getItem('Group'));
        this.Group1 = Group.includes(10);
        console.log(this.Group1)
    }
}
</script>

<style lang="less" scoped>
.head_box_man{
    margin-top: 10px;
}
.content_box_wuliu,.content_box_feiyong{
    margin-top: 20px;
    border: 1px solid #CCC;
    padding: 20px;
}
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
