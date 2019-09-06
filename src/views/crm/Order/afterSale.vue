<template>
    <div class="box">
        <h3 style="color:red;margin-bottom:10px;">
            整体订单需要额外增加售后成本,在此处填写如果是单独供应商发货补货售后请点击按钮选择对应的处理地址,填写售后
        </h3>
        <el-button type="primary" @click="s_sh">供应商售后</el-button>
        <el-form :model="dataForm" ref="dataForm">
            <el-form-item label="方式" label-width="90px" prop="type">
                <el-checkbox-group v-model="dataForm.type">
                    <el-checkbox label="1" name="type">补货</el-checkbox>
                    <el-checkbox label="2" name="type">换货</el-checkbox>
                    <el-checkbox label="3" name="type">退货</el-checkbox>
                    <el-checkbox label="4" name="type">退单</el-checkbox>
                    <el-checkbox label="5" name="type">其他</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="费用" label-width="90px" prop="feiyong">
               <el-input v-model="dataForm.feiyong" placeholder="可以为负数" style="width:217px;"></el-input>
            </el-form-item>
            <el-form-item label="产品" label-width="90px" prop="product">
                <el-checkbox-group v-model="dataForm.product">
                    <el-checkbox v-for="item in product" :key="item.id" :label="item.id" name="product">{{item.name}}{{item.sku_name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="备注" label-width="90px" prop="remark">
                <el-input type="textarea" style="width:317px;" v-model="dataForm.remark"></el-input>
            </el-form-item>
            <el-form-item label="上传附件" label-width="90px">
                <div class="contractInner">
                    <div class="contractInnerLeft">
                        <el-upload
                            class="avatar-uploader"
                            accept="image/jpeg,image/gif,image/png,image/bmp"
                            action="/file/customer_order_after_sales_file"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    
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
            </el-form-item>
            <el-form-item label="" label-width="90px">
                <el-button type="primary" @click="add">提 交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {mapActions} from 'vuex';
export default {
    data(){
        return{
            dataForm:{
                type:[],
                feiyong:'',
                product:[],
                remark:'',
            },
            imageUrl:[],
            imageUrlstate:false,
            product:'',
        }
    },
    props:['expressid','orderid'],
    methods:{
        ...mapActions("customerList", ["triggerReplaceId"]),
        ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex","triggerDeleteTabs"]),
        // 获取产品
        getproduct(){
            this.axios.get('/crm.Order/customer_order_product_sku_select?customer_order_id='+this.$route.params.id).then(res => {
                this.product = res.data.product_sku;
            })
        },

        // 合同上传
        handleAvatarSuccess() {
            this.getimgUrl(this.id);
        },
        // 上传之前 判断图片格式 大小
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
            this.axios.get('/crm.Order/customer_order_file_select?id='+a+'&class=customer_order_after_sales').then(res => {
                if(res.data.customer_order_after_sales !== undefined){
                    this.imageUrlstate = true;
                    this.imageUrl = res.data.customer_order_after_sales;
                }else{
                   this.imageUrlstate = false; 
                }  
            })
        },
        // 删除合同数据图片
        deleteimg(a){
            this.axios.post('/file/customer_order_delete',{
            src:a,
            class:'customer_order'
            }).then(res => {
                if(res.data.code == 2000){
                    this.getimgUrl(this.$route.params.id);
                    this.open(res.data.msg,'success');
                }else{
                    this.open(res.data.msg,'error');
                }
            })
        },
        // 提交
        add(){
            let src = [];
            for(let i=0;i<this.imageUrl.length;i++){
                let P = this.imageUrl[i].src;
                src.push(P);      
            };
            this.axios.post('/crm.Order/order_list_after_sales_add',{
              customer_order_id:this.$route.params.id,
              type:this.dataForm.type,
              fee:this.dataForm.feiyong,
              remarks:this.dataForm.remark,
              customer_order_product_sku:this.dataForm.product,
              src:src,
            }).then(res => {
                if(res.data.code == 2000){
                    this.$refs['dataForm'].resetFields();  
                    this.imageUrlstate = false;
                    this.imageUrl = [];              
                    this.open(res.data.msg,'success');
                    this.triggerDeleteTabs(this.$route.path);
                    this.$router.push({ path: "/crm/Order/order_list" });
                }else{
                    this.open(res.data.msg,'error');
                }
            })
            
        },
        // 供应商售后按钮
        s_sh(){
            this.triggerReplaceId(this.$route.params.id);
            this.$router.push({
                path: `/crm/Order/seeOrder/${this.$route.params.id}`,
                params: { userId: this.$route.params.id }
            });
            let ins1 = {
                route: `/crm/Order/seeOrder/${this.$route.params.id}`,
                name: "查看订单",
                id: this.$route.params.id
            };
            let ins2 = `/crm/Order/seeOrder/${this.$route.params.id}`;
            this.triggerAddTabs(ins1);
            this.triggerSetActiveIndex(ins2);
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
        this.getproduct();
    },
    watch:{
        $route(to){
            if(!this.$route.params.id){
            
            }else{
                this.getproduct();
            }
            
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
     float: left;
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

.contractInner{
        margin-top: 20px;
        overflow: hidden;
        .contractInnerLeft{
        float: left;
        margin-left: 20px;
        overflow: hidden;
        .img{
            overflow: hidden;
            float: left;
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
        }
    }


</style>

