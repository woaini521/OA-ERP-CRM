<template>
    <div class="box">
         <div class="headbox">
            <el-form :data="formProduct">
                <el-form-item label="产品名称" :label-width="lableWidth">
                    <el-input v-model="formProduct.name" style="width:300px"></el-input>
                </el-form-item>
                <el-form-item label="产品类型" :label-width="lableWidth">
                    <el-radio v-model="formProduct.type" label="1">礼品</el-radio>
                    <el-radio v-model="formProduct.type" label="0">印刷</el-radio>
                </el-form-item>
                <el-form-item label="产品分类" :label-width="lableWidth">
                    <el-cascader :options="options" :props="props" change-on-select @change="handleItemChange"></el-cascader>
                    <span>你当前的选择类型：<span style="color:red">{{lei}}</span></span>
                </el-form-item>
                <!-- <el-form-item label="产品内容" :label-width="lableWidth">
                <el-input type="textarea" v-model="formProduct.content" style="width:300px"></el-input>
                </el-form-item> -->
            </el-form>
        </div>
        <div class="contentbox">
            <label>SKU编码</label>
            <el-button type="primary" style="margin-left:35px;" @click="add">添加SKU</el-button>
            <el-table :data="SKUdata" style="width: 100%">
                <el-table-column prop="sku_name" label="类别"></el-table-column>
                <el-table-column prop="firm_id" label="是否是专版">
                    <template slot-scope="scope">
                        <span>{{scope.row.firm_id == 0 ? '否' : '是'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="maximum_delivery" label="最快交货时间"></el-table-column>
                <el-table-column prop="slowest_delivery" label="最慢交货时间"></el-table-column>
                <el-table-column prop="starting_quantity" label="起订量"></el-table-column>
                <el-table-column prop="unit" label="单位"></el-table-column>
                <el-table-column prop="logo" label="定制logo">
                    <template slot-scope="scope">
                        <span>{{scope.row.logo == 0 ? '否' : '是'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="cost_price" label="成本"></el-table-column>
                <el-table-column prop="selling_price" label="销售价格"></el-table-column>
                <el-table-column label="操作" width="155">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
                        <el-button type="danger" size="mini" @click="editSKU(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="添加修改SKU" :visible.sync="dialogFormProduct">
                <el-form ref="Product" :model="Product" inline>
                    <el-form-item label="SKU名称" :label-width="lableWidth" prop="category">
                       <el-input v-model="Product.category" style="width:217px"></el-input>
                    </el-form-item> 
                    <el-form-item label="是否是专版" :label-width="lableWidth" prop="firm_id">
                        <el-radio v-model="Product.firm_id" label="1">是</el-radio>
                       <el-radio v-model="Product.firm_id" label="0">否</el-radio>
                    </el-form-item>
                    <br>
                    <el-form-item label="最快交货时间" :label-width="lableWidth" prop="fastTime">
                       <el-input v-model="Product.fastTime" style="width:217px"></el-input>
                    </el-form-item> 
                    <el-form-item label="最慢交货时间" :label-width="lableWidth" prop="lastTime">
                       <el-input v-model="Product.lastTime" style="width:217px"></el-input>
                    </el-form-item> 
                     <br>
                    <el-form-item label="起订量" :label-width="lableWidth" prop="StartingQuantity">
                       <el-input v-model="Product.StartingQuantity" style="width:100px"></el-input>
                    </el-form-item> 
                    <el-form-item label="单位" :label-width="lableWidth" prop="unit">
                       <el-input v-model="Product.unit" style="width:100px"></el-input>
                    </el-form-item> 
                    <el-form-item label="定制logo" :label-width="lableWidth" prop="Customized">
                       <el-radio v-model="Product.Customized" label="1">是</el-radio>
                       <el-radio v-model="Product.Customized" label="0">否</el-radio>
                    </el-form-item> 
                    <br>
                    <el-form-item label="成本" :label-width="lableWidth" prop="cost">
                       <el-input v-model="Product.cost" style="width:217px"></el-input>
                    </el-form-item> 
                    
                    <el-form-item label="销售价格" :label-width="lableWidth" prop="Sell">
                       <el-input v-model="Product.Sell" style="width:217px"></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item label="装箱数" :label-width="lableWidth" prop="cost">
                       <el-input v-model="Product.boxing" style="width:217px"></el-input>
                    </el-form-item> 
                    
                    <el-form-item label="尺寸" :label-width="lableWidth" prop="Sell">
                       <el-input v-model="Product.size" style="width:217px"></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item label="规格" :label-width="lableWidth" prop="cost">
                       <el-input v-model="Product.specifications" style="width:217px"></el-input>
                    </el-form-item> 
                    
                    <el-form-item label="材质" :label-width="lableWidth" prop="Sell">
                       <el-input v-model="Product.material_quality" style="width:217px"></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item label="创意" :label-width="lableWidth">
                        <el-radio v-model="Product.originality" label="0">厂家</el-radio>
                        <el-radio v-model="Product.originality" label="1">原创</el-radio>
                    </el-form-item>    
                    <br>
                    <el-form-item label="参与人员" :label-width="lableWidth">
                        <el-select v-model="Product.user" filterable multiple  placeholder="请选择" style="width:200%">
                            <el-option
                            v-for="item in Useroptions"
                            :key="item.user_id"
                            :label="item.name"
                            :value="item.user_id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <br>
                    <el-form-item label="上传图片" :label-width="lableWidth">
                      <el-upload class="avatar-uploader" 
                        :multiple="true"
                        accept="image/jpeg,image/gif,image/png,image/bmp"
                        :show-file-list="false" 
                        action="/File/product_sku_img/"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="Product.imageUrl" :src="Product.imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>   
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormProduct = false">取 消</el-button>
                    <el-button type="primary" @click="addSKU">确 定</el-button>
                </div>
            </el-dialog>
        </div>

       <div class="contentfoot">
            <label>供应商阶梯价</label>
            <el-button type="primary" style="margin-left:35px;" @click="addSupplierPrice">添加信息</el-button>
            <el-table :data="SupplierPrice">
                <el-table-column label="阶梯数量" prop="number"></el-table-column>
                <el-table-column label="成本价" prop="cost_price"></el-table-column>
                <el-table-column label="销售价" prop="selling_price"></el-table-column>
                <el-table-column label="供应商" prop="supplier_name"></el-table-column>
                <el-table-column label="备注" prop="remarks"></el-table-column>
                <el-table-column label="操作" width="155">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="SupplierPriceModify(scope.row)">修改</el-button>
                        <el-button type="danger" size="mini" @click="SupplierPriceEdit(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>    
            <el-dialog title="添加修改供应商阶梯价" :visible.sync="dialogFormSupplierPrice">
                <el-form ref="SteppedPrice" v-model="SteppedPrice">
                    <el-form-item label="供应商" prop="supplier" :label-width="lableWidth">
                        <el-select v-model="SteppedPrice.supplier_id" filterable placeholder="请选择" style="width:217px">
                            <el-option v-for="item in optionSupplier" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="产品" prop="product" :label-width="lableWidth">
                       <el-select v-model="SteppedPrice.product" filterable placeholder="请选择" style="width:217px">
                            <el-option v-for="item in optionproduct" :key="item.id" :label="item.sku_name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数量" prop="number" :label-width="lableWidth">
                        <el-input v-model="SteppedPrice.number" style="width:217px"></el-input>
                    </el-form-item>
                    <el-form-item label="成本价" prop="costPrice" :label-width="lableWidth">
                        <el-input v-model="SteppedPrice.cost_price" style="width:217px"></el-input>
                    </el-form-item>
                    <el-form-item label="销售价" prop="sellPrice" :label-width="lableWidth">
                        <el-input v-model="SteppedPrice.selling_price" style="width:217px"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark" :label-width="lableWidth">
                        <el-input v-model="SteppedPrice.remarks" type="textarea" style="width:217px"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormSupplierPrice = false">取 消</el-button>
                    <el-button type="primary" @click="addingSteppedPrice">确 定</el-button>
                </div>
            </el-dialog>
        </div>   

        <label>产品内容</label> 
        <vue-ueditor-wrap v-model="msg" :config="myConfig"  style="margin-top:10px;padding-bottom:20px"></vue-ueditor-wrap>

        <el-button type="primary" @click="comfirm">确认提交</el-button>
    </div>
</template>
<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import {mapActions} from 'vuex';
export default {
    data(){
        return{
            msg:'',
            formProduct:{
                name:'',
                category:'',
                content:'',
                type:'',
            },
            options:[
                {
                    id:1,
                    value:'杯具'
                },
                {
                    id:2,
                    value:'包'
                },
                {
                    id:3,
                    value:'碗'
                }
            ],
            props:{
                value:'id',
                label:'name',
                children:'children'
            },
            lableWidth:'100px',
            SKUdata:[
            ],
            lei:'',
            class_id:'',
            dialogFormProduct:false,
            Product:{
                category:'',
                specialSection:'',
                firm_id:'',
                fastTime:'',
                lastTime:'',
                StartingQuantity:'',
                unit:'',
                Customized:'',
                cost:'',
                Sell:'',
                product_id:'',
                id:'',
                imageUrl:'',
                boxing:'',
                size:'',
                specifications:'',
                material_quality:'',
                user:[],
                originality:'',
            },
            Useroptions:[
                {
                    label:'dada',
                    value:1,
                },
                {
                    label:'erer',
                    value:2,
                },
            ], // 人员
            optionSupplier:[
                {
                    label:'太保',
                    value:1,
                },
                {
                    label:'人保',
                    value:2,
                },
                {
                    label:'国寿',
                    value:3,
                },
                {
                    label:'平安',
                    value:4,
                }
            ],  
            optionproduct:[],
            SupplierPrice:[
            ],
            dialogFormSupplierPrice:false,
            SteppedPrice:{
                product_id:'',
                supplier_id:'',
                product:'',
                number:'',
                cost_price:'',
                selling_price:'',
                remarks:'',
                id:'',
            },
            //baidu fuwenben
            myConfig: {
                // 编辑器不自动被内容撑高
                autoHeightEnabled: false,
                // 初始容器高度
                initialFrameHeight: 240,
                // 初始容器宽度
                initialFrameWidth: '100%',
                // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
                //serverUrl: 'http://35.201.165.105:8000/controller.php',
                // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
                UEDITOR_HOME_URL: '/static/UEditor/'
            },
        }       
    },
    components: {
        VueUeditorWrap
    },
    methods:{
         ...mapActions("Tabs", ['triggerDeleteTabs']),
        handleItemChange:function(value){
            let a = value.length;
            let b = value[a-1];
            this.formProduct.category = b;
        },
        getEditData(){
             this.axios.get('/erp.Product/product_update?id='+this.$route.params.id).then(res => {

                let shuju = res.data;
                this.formProduct.category = shuju.class_id;
                this.formProduct.name = shuju.name;
                this.formProduct.type = String(shuju.type);
                this.lei = shuju.class_name;
                this.class_id = shuju.class_id;
                this.Product.product_id = shuju.id;
                this.SKUdata = shuju.sku;
                this.optionproduct = shuju.sku;
                this.msg = shuju.content;
             }) 
        },
        getData(){
            this.axios.get('/erp.Product/product_class_select').then(res => {
                this.options = res.data.product_class;
                this.Useroptions = res.data.user;
            })
        },
        getUseroptions(){
            
        },
        // 打开添加SKU弹窗
        add(){
            this.queryimg();
            this.dialogFormProduct = true;
            this.Product.firm_id = '';
            this.Product.product_id = '';
            this.Product.category = '';
            this.Product.fastTime = '';
            this.Product.lastTime = '';
            this.Product.StartingQuantity = '';
            this.Product.unit = '';
            this.Product.Customized = '';
            this.Product.cost =  '';
            this.Product.Sell = '';
            this.Product.boxing = '';
            this.Product.size = '';
            this.Product.specifications = '';
            this.Product.material_quality = '';
            this.Product.user = [];
            this.Product.originality = '1'
        },
        // 新增是查询图片
        queryimg(){
            this.axios.post('/File/file_select',{
                class:'product_file',
                type:'img',
                sku_id:'',
            }).then(res => {
                if(res.data != null){
                    this.Product.img = res.data.src;
                }
            })
        },

        // 添加 SKU
        addSKU(){
            this.axios.post('/erp.Product/product_sku_update',{
                product_id:this.$route.params.id,
                id:this.Product.id,
                firm_id:this.Product.firm_id,
                sku_name:this.Product.category,
                maximum_delivery:this.Product.fastTime,
                slowest_delivery:this.Product.lastTime,
                starting_quantity:this.Product.StartingQuantity,
                unit:this.Product.unit,
                logo:this.Product.Customized,
                cost_price:this.Product.cost,
                selling_price:this.Product.Sell,  
                boxing:this.Product.boxing,
                size:this.Product.size,
                specifications:this.Product.specifications,
                material_quality:this.Product.material_quality,
                img:this.Product.imageUrl,
                user:this.Product.user,
                originality:this.Product.originality
                }).then(res => {
                    if(res.data.code == 2000){
                    this.$refs['Product'].resetFields(); 
                    this.open(res.data.msg,'success');
                    this.getEditData();
                    this.dialogFormProduct = false;
                    }else{
                    this.open(res.data.msg,'error'); 
                    }   
                })
        },
         // 合同上传
        handleAvatarSuccess(res) {
            this.Product.imageUrl = res.src;
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
        // 修改SKU
        edit(a){
            let a_f;
            let a_l;
            if(a.firm_id == 1){
                a_f = '1';
            }else{
                a_f = '0';
            };
             if(a.logo == 1){
                a_l = '1';
            }else{
                a_l = '0';
            };
            this.dialogFormProduct = true;
            this.Product.firm_id = a_f;
            this.Product.category = a.sku_name;
            this.Product.fastTime = a.maximum_delivery;
            this.Product.lastTime = a.slowest_delivery;
            this.Product.StartingQuantity = a.starting_quantity;
            this.Product.unit = a.unit;
            this.Product.Customized = a_l;
            this.Product.cost =  a.cost_price.split('.')[0];
            this.Product.Sell = a.selling_price.split('.')[0];
            this.Product.id = a.id;
            this.Product.imageUrl = a.src;
            this.Product.boxing = a.boxing;
            this.Product.size = a.size;
            this.Product.specifications = a.specifications;
            this.Product.material_quality = a.material_quality;
            this.Product.user = a.user;
            this.Product.originality = String(a.originality)
        },
        // 删除SKU
        editSKU(a){
            this.axios.post('/erp.Product/product_sku_delete',{
                id:a.id
            }).then(res => {
                if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.getEditData();
                }else{
                    this.open(res.data.msg,'error'); 
                } 
            })
        },
        
        // 添加供应商阶梯价 弹窗
        addSupplierPrice(){
            this.dialogFormSupplierPrice = true;
            this.SteppedPrice.product_id = this.Product.product_id;
            this.SteppedPrice.supplier_id = '';
            this.SteppedPrice.number = '';
            this.SteppedPrice.cost_price = '';
            this.SteppedPrice.selling_price = '';
            this.SteppedPrice.remarks = '';
            this.SteppedPrice.id = '';
        },
        // 供应商阶梯价 修改删除
        SupplierPriceModify(a){
           this.dialogFormSupplierPrice = true;
            this.SteppedPrice.id = a.id;
            this.SteppedPrice.supplier_id = a.supplier_id;
            this.SteppedPrice.product_id = this.Product.product_id;
            this.SteppedPrice.number =a.number;
            this.SteppedPrice.cost_price =a.cost_price;
            this.SteppedPrice.selling_price = a.selling_price;
            this.SteppedPrice.remarks = a.remarks;
        },
        SupplierPriceEdit(a){
           this.axios.post('/erp.Product/product_supplier_delete',{
               id:a.id
           }).then(res => {
               if(res.data.code == 2000){
                   this.open(res.data.msg,'success');
                   this.getSupplierList(this.Product.product_id);
               }else{
                   this.open(res.data.msg,'error');
               } 
           })
        },
        //添加 修改供应商阶梯价
        addingSteppedPrice(){
            //添加
            if(this.SteppedPrice.id == ''){
                this.axios.post('/erp.Product/product_supplier_add',{
                product_id:  this.SteppedPrice.product_id,
                supplier_id : this.SteppedPrice.supplier_id,
                product_sku_id:this.SteppedPrice.product,
                number : this.SteppedPrice.number,
                cost_price : this.SteppedPrice.cost_price,
                selling_price : this.SteppedPrice.selling_price,
                remarks : this.SteppedPrice.remarks,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.getSupplierList(this.SteppedPrice.product_id);
                        this.dialogFormSupplierPrice = false;
                    }else{
                        this.open(res.data.msg,'error');
                    } 
                })
            }else{
                // 修改
                this.axios.post('/erp.Product/product_supplier_update',{
                id:  this.SteppedPrice.id,
                supplier_id : this.SteppedPrice.supplier_id,
                product_sku_id:this.SteppedPrice.product,
                number : this.SteppedPrice.number,
                cost_price : this.SteppedPrice.cost_price,
                selling_price : this.SteppedPrice.selling_price,
                remarks : this.SteppedPrice.remarks,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.getSupplierList(this.SteppedPrice.product_id);
                        this.dialogFormSupplierPrice = false;
                    }else{
                        this.open(res.data.msg,'error');
                    } 
                })
            }
        },
        // 获取供应商阶梯价列表
        getSupplierList(a){
          this.axios.get('/erp.Product/product_supplier_list?id='+a).then(res => {
                this.SupplierPrice = res.data.product_supplier;
                 // console.log(res)
            })  
        },
        // 获取供应商
        getSupplier(){
            this.axios.get('/erp.supplier/supplier_select').then(res => {
                this.optionSupplier = res.data.supplier;
            })
        },
        comfirm(){
            this.axios.post('/erp.Product/product_update',{
                id:this.$route.params.id,
                content:this.msg,
                name:this.formProduct.name,
                type:this.formProduct.type,
                class_id:this.class_id,
            }).then(res => {
                 if(res.data.code == 2000){
                    this.open(res.data.msg,'success');
                    this.triggerDeleteTabs(this.$route.path);
                    this.$router.push({ path: "/erp/Product/product_list" });
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
      this.getEditData();
      this.getData();
      this.getSupplierList(this.$route.params.id);
      this.getSupplier();
    },
    mounted(){
      console.log(this.$route.params); 
    },
    watch:{
        $route(to){
            if(!this.$route.params.id){

            }else{
                this.getEditData(); // 这是我ajax获取用户信息的方法
                this.getSupplierList(this.$route.params.id);
            }
            
        }
    }
}
</script>
<style lang="less" scoped>
.box{
    min-width: 950px;
    margin-top: 10px;
    .contentfoot{
        margin-top: 30px;
        margin-bottom: 30px;
    }
}
.avatar-uploader,.el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader,.el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 160px;
    height: 160px;
    line-height: 160px;
    text-align: center;
  }
  .avatar {
    width: 170px;
    height: 170px;
    display: block;
  }
</style>
