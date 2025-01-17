import Vue from "vue";
import Router from "vue-router";

import Login from "@/components/Login";
import Apptab from "@/components/common/Apptab";
import Template from "@/views/index/Template";
// OA
// User  用户管理
// 员工管理----view/
import user_lists from "@/views/OA/User/user_lists";
import user_update from "@/views/OA/User/user_update";
import dep_select from "@/views/OA/User/dep_select";
import firm_select from "@/views/OA/User/firm_select";
import wage_calculation from "@/views/OA/User/wage_calculation";


// 日常管理----view/
import leave_select from "@/views/OA/Days/leave_select";
import add from "@/views/OA/Days/add";
import task_select from "@/views/OA/Days/task_select";
import task_add from "@/views/OA/Days/task_add";
import task_count from "@/views/OA/Days/task_count";
import company_rule_select from "@/views/OA/Days/company_rule_select";
import rule_edit from "@/views/OA/Days/rule_edit";
import work_plan_select from "@/views/OA/Days/work_plan";
import stuff_select from "@/views/OA/Days/stuff_select";
import reward_select from "@/views/OA/Days/reward_select";
import faqi from "@/views/OA/Days/faqi";

// CRM管理----view/crm
// 客户管理----view/
import customer_center from "@/views/crm/Customer/customer_center";
import customer_list from "@/views/crm/Customer/customer_list";
import customer_record from "@/views/crm/Customer/customer_record";
// 用户列表详情页
import lianxi from "@/views/crm/Customer/customerList/lianxi";
import gengxin from "@/views/crm/Customer/customerList/gengxin";
import address from "@/views/crm/Customer/customerList/adress";
import dingdan from "@/views/crm/Customer/customerList/dingdan";
import see from "@/views/crm/Customer/customerList/see";
import company_list from "@/views/crm/Customer/company_list";
import added from "@/views/crm/Customer/added";
import company_drawee_lists from "@/views/crm/Customer/company_drawee_lists";

// 订单管理----view/
import order from "@/views/crm/Order/order";
import editOrder from "@/views/crm/Order/editOrder";
import seeOrder from "@/views/crm/Order/seeOrder";
import order_list from "@/views/crm/Order/order_list";
import afterSale from "@/views/crm/Order/afterSale";
import invoice_list from "@/views/crm/Order/invoice_list";
import order_receivables_lists from "@/views/crm/Order/order_receivables_lists";
import order_receivables_lists_details from "@/views/crm/Order/order_receivables_lists_details";
import order_receivables_see from "@/views/crm/Order/order_receivables_see";

//进销存管理----view/
import sample_add from "@/views/crm/Sample/sample_add";
import sample_lists from "@/views/crm/Sample/sample_lists";
import updata_sample from "@/views/crm/Sample/updata_sample";
import seeSample from "@/views/crm/Sample/seeSample";

//进销存管理----view/
// 产品管理----view/
import product_list from "@/views/erp/Products/product_list";
import external_warehouse from "@/views/erp/Products/external_warehouse";
import product_add from "@/views/erp/Products/product_add";
import product_update from "@/views/erp/Products/product_update";
import product_class_list from "@/views/erp/Products/product_class_list";
import product_product_stock_lists from "@/views/erp/Products/product_product_stock_lists";
import product_inventory_lists from "@/views/erp/Products/product_inventory_lists";


// 供应商管理----view/
import supplier_list from "@/views/erp/supplier/supplier_list";
import supplier_money_lists from "@/views/erp/supplier/supplier_money_lists";
import express_list from "@/views/erp/supplier/express_list";
import supplier_product_money_lists from "@/views/erp/supplier/supplier_product_money_lists";

// 采购管理
import purchase_order_list from "@/views/erp/Purchase/purchase_order_list";
import Purchaseorder from "@/views/erp/Purchase/Purchaseorder";
import seePurchase from "@/views/erp/Purchase/seePurchase";
import purchase_product_stockup_supplier_lists from "@/views/erp/Purchase/purchase_product_stockup_supplier_lists";
import purchase_order_after_sales_lists from "@/views/erp/Purchase/purchase_order_after_sales_lists";
import afterSales_details from "@/views/erp/Purchase/afterSales_details";
import purchase_sample_lists from "@/views/erp/Purchase/purchase_sample_lists";
import sample_modification from "@/views/erp/Purchase/sample_modification";
import purchase_product_lists from "@/views/erp/Purchase/purchase_product_lists";
import stuff_purchase_select from "@/views/erp/Purchase/stuff_purchase_select";

// 物流
import delivery_order_list from "@/views/erp/Delivery/delivery_order_list";
import see_deliver from "@/views/erp/Delivery/see_deliver";

// 财务管理----view/
import finance_order_audit_list from "@/views/Finance/finance_order_audit_list";
import auditDetails from "@/views/Finance/auditDetails";
import finance_order_advance_charge_list from "@/views/Finance/finance_order_advance_charge_list";
import finance_order_express_cost_list from "@/views/Finance/finance_order_express_cost_list";
import finance_order_after_sales_list from "@/views/Finance/finance_order_after_sales_list";
import finance_invoice_list from "@/views/Finance/finance_invoice_list";
import financial_receivables_lists from "@/views/Finance/financial_receivables_lists";
import payee_lists from "@/views/Finance/payee_lists";
import finance_order_extra_list from "@/views/Finance/finance_order_extra_list";
import finance_product_stockup_supplier_lists from "@/views/Finance/finance_product_stockup_supplier_lists";
import finance_supplier_invoice_lists from "@/views/Finance/finance_supplier_invoice_lists";
import finance_customer_sample_lists from "@/views/Finance/finance_customer_sample_lists";
import finance_customer_sample_lists_details from "@/views/Finance/finance_customer_sample_lists_details";
import cost_lists from "@/views/Finance/cost_lists";
import finance_supplier_after_sales_list from "@/views/Finance/finance_supplier_after_sales_list";
import finance_supplier_money_lists from "@/views/Finance/finance_supplier_money_lists";
import stuff_finance_select from "@/views/Finance/stuff_finance_select";



// 统计报表
//user
import sales_rank from "@/views/report/User/sales_rank";
import order_count from "@/views/report/User/order_count";
import leave_count from "@/views/report/User/leave_count";
import dep_statistics from "@/views/report/User/dep_statistics";

//Customer
import customer_visit from "@/views/report/Customer/customer_visit";
import customer_increments from "@/views/report/Customer/customer_increments";

//Purchase
import product_sales from "@/views/report/Purchase/product_sales";
import product_order_sales from "@/views/report/Purchase/product_order_sales";
import purchase_product_sum from "@/views/report/Purchase/purchase_product_sum";

//Finance
import order_product_cost from "@/views/report/Finance/order_product_cost";
import order_cost from "@/views/report/Finance/order_cost";
import payee_diary from "@/views/report/Finance/payee_diary";


//权限管理
import auth_group from "@/views/System/auth_group";
import auth_rule from "@/views/System/auth_rule";

Vue.use(Router);

export default new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/",
      name: "Index",
      component: Apptab,
      redirect: "/sy",
      meta: {
        requireAuth: true,
        title: "Apptab"
      },
      children: [
        // 员工管理
        {
          path: "/sy",
          name: "首页",
          component: Template,
          meta: {
            requireAuth: true
          }
        },
        {
          path: "/oa/User/user_lists",
          name: "员工查询",
          component: user_lists,
          meta: {
            requireAuth: true,
            title: "user_lists"
          }
        },
        {
          path: "/oa/User/user_update/:id",
          name: "员工信息修改",
          component: user_update,
          meta: {
            requireAuth: true,
            title: "user_update"
          }
        },
        {
          path: "/oa/User/dep_select",
          name: "部门管理",
          component: dep_select,
          meta: {
            requireAuth: true,
            title: "dep_select"
          }
        },
        {
          path: "/oa/User/firm_select",
          name: "公司列表",
          component: firm_select,
          meta: {
            requireAuth: true,
            title: "firm_select"
          }
        },
        {
          path: "/oa/User/wage_calculation",
          name: "工资计算",
          component: wage_calculation,
          meta: {
            requireAuth: true,
            title: "wage_calculation"
          }
        },
        // 日常管理
        {
          path: "/oa/Days/leave_select",
          name: "请假外出",
          component: leave_select,
          meta: {
            requireAuth: true,
            title: "leave_select"
          }
        },
        {
          path: "/oa/Days/add",
          name: "发起申请",
          component: add,
          meta: {
            requireAuth: true,
            title: "add"
          }
        },
        {
          path: "/oa/Days/task_select",
          name: "任务列表",
          component: task_select,
          meta: {
            requireAuth: true,
            title: "task_select"
          }
        },
        {
          path: "/oa/Days/task_add/:id",
          name: "任务发起/修改",
          component: task_add,
          meta: {
            requireAuth: true,
            title: "task_add"
          }
        },
        {
          path: "/oa/Days/task_count",
          name: "任务统计",
          component: task_count,
          meta: {
            requireAuth: true,
            title: "task_count"
          }
        },
        {
          path: "/oa/Days/company_rule_select",
          name: "公司制度",
          component: company_rule_select,
          meta: {
            requireAuth: true,
            title: "company_rule_select"
          }
        },
        
        {
          path: "/oa/Days/rule_edit/:id",
          name: "制度编辑",
          component: rule_edit,
          meta: {
            requireAuth: true,
            title: "rule_edit"
          }
        },
        {
          path: "/oa/Days/work_plan_select",
          name: "工作计划",
          component: work_plan_select,
          meta: {
            requireAuth: true,
            title: "work_plan_select"
          }
        },
        {
          path: "/oa/Days/stuff_select",
          name: "物料采购列表",
          component: stuff_select,
          meta: {
            requireAuth: true,
            title: "stuff_select"
          }
        },
        {
          path: "/oa/Days/reward_select",
          name: "激励列表",
          component: reward_select,
          meta: {
            requireAuth: true,
            title: "reward_select"
          }
        },
        {
          path: "/oa/Days/faqi",
          name: "激励发起",
          component: faqi,
          meta: {
            requireAuth: true,
            title: "faqi"
          }
        },
        // 客户管理
        {
          path: "/CRM/Customer/customer_center",
          name: "客户中心",
          component: customer_center,
          meta: {
            requireAuth: true,
            title: "customer_center"
          }
        },
        {
          path: "/CRM/Customer/customer_list",
          name: "客户列表",
          component: customer_list,
          meta: {
            requireAuth: true,
            title: "customer_list"
          }
        },
        
        {
          path: "/CRM/Customer/customer_record",
          name: "联系记录列表",
          component: customer_record,
          meta: {
            requireAuth: true,
            title: "customer_record"
          }
        },
        {
          path: "/CRM/Customer/lianxi/:id",
          name: "联系记录",
          component: lianxi,
          meta: {
            requireAuth: true,
            title: "lianxi"
          }
        },
        {
          path: "/CRM/Customer/gengxin/:id",
          name: "更新记录",
          component: gengxin,
          meta: {
            requireAuth: true,
            title: "gengxin"
          }
        },
        {
          path: "/CRM/Customer/dingdan/:id",
          name: "订单详情",
          component: dingdan,
          meta: {
            requireAuth: true,
            title: "dingdan"
          }
        },
        {
          path: "/CRM/Customer/address/:id",
          name: "收货地址",
          component: address,
          meta: {
            requireAuth: true,
            title: "address"
          }
        },
        {
          path: "/CRM/Customer/see/:id",
          name: "查看客户",
          component: see,
          meta: {
            requireAuth: true,
            title: "see"
          }
        },
        {
          path: "/crm/Customer/customer_add",
          name: "新增客户",
          component: added,
          meta: {
            requireAuth: true,
            title: "added"
          }
        },
        {
          path: "/crm/Customer/company_list",
          name: "企业列表",
          component: company_list,
          meta: {
            requireAuth: true,
            title: "company_list"
          }
        },
        {
          path: "/crm/Customer/company_drawee_lists",
          name: "企业付款人",
          component: company_drawee_lists,
          meta: {
            requireAuth: true,
            title: "company_drawee_lists"
          }
        },
        // 订单管理
        {
          path: "/crm/Order/order_add",
          name: "添加订单",
          component: order,
          meta: {
            requireAuth: true,
            title: "order"
          }
        },
        {
          path: "/crm/Order/order_list",
          name: "订单列表",
          component: order_list,
          meta: {
            requireAuth: true,
            title: "order_list"
          }
        },
        {
          path: "/crm/Order/editOrder/:id",
          name: "修改订单",
          component: editOrder,
          meta: {
            requireAuth: true,
            title: "editOrder"
          }
        },
        {
          path: "/crm/Order/seeOrder/:id",
          name: "查看订单",
          component: seeOrder,
          meta: {
            requireAuth: true,
            title: "seeOrder"
          }
        },
        {
          path: "/crm/Order/afterSale/:id",
          name: "售后",
          component: afterSale,
          meta: {
            requireAuth: true,
            title: "afterSale"
          }
        },
        {
          path: "/crm/Order/order_receivables_lists",
          name: "认款列表",
          component: order_receivables_lists,
          meta: {
            requireAuth: true,
            title: "order_receivables_lists"
          }
        },
        {
          path: "/crm/Order/order_receivables_lists_details/:id",
          name: "认款详情",
          component: order_receivables_lists_details,
          meta: {
            requireAuth: true,
            title: "order_receivables_lists_details"
          }
        },
        {
          path: "/CRM/Order/invoice_list",
          name: "发票列表",
          component: invoice_list,
          meta: {
            requireAuth: true,
            title: "invoice_list"
          }
        },
        {
          path: "/crm/Order/order_receivables_see/:id",
          name: "查看认款详情",
          component: order_receivables_see,
          meta: {
            requireAuth: true,
            title: "order_receivables_see"
          }
        },
        // 样品管理
        {
          path: "/crm/Sample/sample_add",
          name: "寄出样品",
          component: sample_add,
          meta: {
            requireAuth: true,
            title: "sample_add"
          }
        },
        {
          path: "/crm/Sample/sample_lists",
          name: "寄样列表",
          component: sample_lists,
          meta: {
            requireAuth: true,
            title: "sample_lists"
          }
        },
        
        {
          path: "/crm/Sample/updata_sample/:id",
          name: "样品修改",
          component: updata_sample,
          meta: {
            requireAuth: true,
            title: "updata_sample"
          }
        },
        
        {
          path: "/crm/Sample/seeSample/:id",
          name: "样品查看",
          component: seeSample,
          meta: {
            requireAuth: true,
            title: "seeSample"
          }
        },
        // 采购管理
        {
          path: "/erp/Purchase/purchase_sample_lists",
          name: "样品采购列表",
          component: purchase_sample_lists,
          meta: {
            requireAuth: true,
            title: "purchase_sample_lists"
          }
        },
        {
          path: "/erp/Purchase/sample_modification/:id",
          name: "样品采购修改",
          component: sample_modification,
          meta: {
            requireAuth: true,
            title: "sample_modification"
          }
        },
        {
          path: "/erp/Purchase/purchase_order_list",
          name: "采购订单列表",
          component: purchase_order_list,
          meta: {
            requireAuth: true,
            title: "purchase_order_list"
          }
        },
        {
          path: "/erp/Purchase/Purchaseorder/:id",
          name: "采购详情",
          component: Purchaseorder,
          meta: {
            requireAuth: true,
            title: "Purchaseorder"
          }
        },
        {
          path: "/erp/Purchase/seePurchase/:id",
          name: "采购查看",
          component: seePurchase,
          meta: {
            requireAuth: true,
            title: "seePurchase"
          }
        },
        {
          path: "/erp/Purchase/purchase_product_stockup_supplier_lists",
          name: "采购备货",
          component: purchase_product_stockup_supplier_lists,
          meta: {
            requireAuth: true,
            title: "purchase_product_stockup_supplier_lists"
          }
        },
        {
          path: "/erp/Purchase/purchase_order_after_sales_lists",
          name: "订单售后",
          component: purchase_order_after_sales_lists,
          meta: {
            requireAuth: true,
            title: "purchase_order_after_sales_lists"
          }
        },
        {
          path: "/erp/Purchase/afterSales_details/:id",
          name: "售后详情",
          component: afterSales_details,
          meta: {
            requireAuth: true,
            title: "afterSales_details"
          }
        },
        
        {
          path: "/erp/Purchase/stuff_purchase_select",
          name: "采购物料列表",
          component: stuff_purchase_select,
          meta: {
            requireAuth: true,
            title: "stuff_purchase_select"
          }
        },
        {
          path: "/erp/Purchase/purchase_product_lists",
          name: "采购产品明细",
          component: purchase_product_lists,
          meta: {
            requireAuth: true,
            title: "purchase_product_lists"
          }
        },
        // 产品管理
        {
          path: "/erp/Product/product_list",
          name: "产品列表",
          component: product_list,
          meta: {
            requireAuth: true,
            title: "product_list"
          }
        },
        {
          path: "/erp/Products/external_warehouse",
          name: "外部仓库",
          component: external_warehouse,
          meta: {
            requireAuth: true,
            title: "external_warehouse"
          }
        },
        {
          path: "/erp/Product/product_add",
          name: "添加产品",
          component: product_add,
          meta: {
            requireAuth: true,
            title: "product_add"
          }
        },
        {
          path: "/erp/Product/product_update/:id",
          name: "修改产品",
          component: product_update,
          meta: {
            requireAuth: true,
            title: "product_update"
          }
        },
        {
          path: "/erp/Product/product_class_list",
          name: "产品分类",
          component: product_class_list,
          meta: {
            requireAuth: true,
            title: "product_class_list"
          }
        },
        {
          path: "/erp/Product/product_product_stock_lists",
          name: "备货申请",
          component: product_product_stock_lists,
          meta: {
            requireAuth: true,
            title: "product_product_stock_lists"
          }
        },
        {
          path: "/erp/Product/product_inventory_lists",
          name: "产品库存",
          component: product_inventory_lists,
          meta: {
            requireAuth: true,
            title: "product_inventory_lists"
          }
        },
        
        // 供应商管理
        {
          path: "/erp/supplier/supplier_list",
          name: "供应商列表",
          component: supplier_list,
          meta: {
            requireAuth: true,
            title: "supplier_list"
          }
        },
        {
          path: "/erp/supplier/supplier_product_money_lists",
          name: "供应商采购明细",
          component: supplier_product_money_lists,
          meta: {
            requireAuth: true,
            title: "supplier_product_money_lists"
          }
        },
        {
          path: "/erp/supplier/express_list",
          name: "物流列表",
          component: express_list,
          meta: {
            requireAuth: true,
            title: "express_list"
          }
        },
        {
          path: "/erp/supplier/supplier_money_lists",
          name: "供应商结算列表",
          component: supplier_money_lists,
          meta: {
            requireAuth: true,
            title: "supplier_money_lists"
          }
        },
        // 物流
        {
          path: "/erp/Delivery/delivery_order_list",
          name: "发货列表",
          component: delivery_order_list,
          meta: {
            requireAuth: true,
            title: "delivery_order_list"
          }
        },
        {
          path: "/erp/Delivery/see_deliver/:id",
          name: "发货信息",
          component: see_deliver,
          meta: {
            requireAuth: true,
            title: "see_deliver"
          }
        },
        
        // 财务管理
        {
          path: "/Finance/cost_lists",
          name: "费用支出",
          component: cost_lists,
          meta: {
            requireAuth: true,
            title: "cost_lists"
          }
        },
        {
          path: "/Finance/finance_order_audit_list",
          name: "订单审核",
          component: finance_order_audit_list,
          meta: {
            requireAuth: true,
            title: "finance_order_audit_list"
          }
        },
        {
          path: "/Finance/auditDetails/:id",
          name: "订单审核详情",
          component: auditDetails,
          meta: {
            requireAuth: true,
            title: "auditDetails"
          }
        },
        {
          path: "/Finance/finance_order_advance_charge_list",
          name: "采购付款",
          component: finance_order_advance_charge_list,
          meta: {
            requireAuth: true,
            title: "finance_order_advance_charge_list"
          }
        },
        {
          path: "/Finance/finance_order_express_cost_list",
          name: "运费付款",
          component: finance_order_express_cost_list,
          meta: {
            requireAuth: true,
            title: "finance_order_express_cost_list"
          }
        },
        {
          path: "/Finance/finance_order_after_sales_list",
          name: "售后费用审核",
          component: finance_order_after_sales_list,
          meta: {
            requireAuth: true,
            title: "finance_order_after_sales_list"
          }
        },
        {
          path: "/Finance/finance_invoice_list",
          name: "开票列表",
          component: finance_invoice_list,
          meta: {
            requireAuth: true,
            title: "finance_invoice_list"
          }
        },
        {
          path: "/Finance/finance_receivables_lists",
          name: "财务销售账款",
          component: financial_receivables_lists,
          meta: {
            requireAuth: true,
            title: "financial_receivables_lists"
          }
        },
        {
          path: "/Finance/payee_lists",
          name: "公司收款账号",
          component: payee_lists,
          meta: {
            requireAuth: true,
            title: "payee_lists"
          }
        },
        {
          path: "/Finance/finance_order_extra_list",
          name: "额外费用审核",
          component: finance_order_extra_list,
          meta: {
            requireAuth: true,
            title: "finance_order_extra_list"
          }
        },
        {
          path: "/Finance/finance_product_stockup_supplier_lists",
          name: "备货审核",
          component: finance_product_stockup_supplier_lists,
          meta: {
            requireAuth: true,
            title: "finance_product_stockup_supplier_lists"
          }
        },
        {
          path: "/Finance/finance_supplier_invoice_lists",
          name: "供应商发票记录",
          component: finance_supplier_invoice_lists,
          meta: {
            requireAuth: true,
            title: "finance_supplier_invoice_lists"
          }
        },
        
        {
          path: "/Finance/finance_customer_sample_lists",
          name: "样品费用审核",
          component: finance_customer_sample_lists,
          meta: {
            requireAuth: true,
            title: "finance_customer_sample_lists"
          }
        },
        {
          path: "/Finance/finance_customer_sample_lists_details/:id",
          name: "样品审核详情",
          component: finance_customer_sample_lists_details,
          meta: {
            requireAuth: true,
            title: "finance_customer_sample_lists_details"
          }
        },
        {
          path: "/Finance/finance_supplier_after_sales_list",
          name: "供应商售后款",
          component: finance_supplier_after_sales_list,
          meta: {
            requireAuth: true,
            title: "finance_supplier_after_sales_list"
          }
        },
        {
          path: "/Finance/finance_supplier_money_lists",
          name: "供应商结算审核",
          component: finance_supplier_money_lists,
          meta: {
            requireAuth: true,
            title: "finance_supplier_money_lists"
          }
        },
        {
          path: "/Finance/stuff_finance_select",
          name: "采购物料审核",
          component: stuff_finance_select,
          meta: {
            requireAuth: true,
            title: "stuff_finance_select"
          }
        },
        
        // 统计报表 
        {
          path: "/report/User/sales_rank",
          name: "销售排名",
          component: sales_rank,
          meta: {
            requireAuth: true,
            title: "sales_rank"
          }
        },
        {
          path: "/report/User/order_count",
          name: "订单统计",
          component: order_count,
          meta: {
            requireAuth: true,
            title: "order_count"
          }
        },
        {
          path: "/report/User/leave_count",
          name: "考勤统计",
          component: leave_count,
          meta: {
            requireAuth: true,
            title: "leave_count"
          }
        },
        {
          path: "/report/User/dep_statistics",
          name: "部门统计",
          component: dep_statistics,
          meta: {
            requireAuth: true,
            title: "dep_statistics"
          }
        },
        {
          path: "/report/Customer/customer_visit",
          name: "拜访量统计",
          component: customer_visit,
          meta: {
            requireAuth: true,
            title: "customer_visit"
          }
        },
        {
          path: "/report/Customer/customer_increments",
          name: "新增量统计",
          component: customer_increments,
          meta: {
            requireAuth: true,
            title: "customer_increments"
          }
        },
        
        {
          path: "/report/Purchase/product_order_sales",
          name: "产品销售",
          component: product_order_sales,
          meta: {
            requireAuth: true,
            title: "product_order_sales"
          }
        },
        {
          path: "/report/Purchase/product_sales",
          name: "产品采购",
          component: product_sales,
          meta: {
            requireAuth: true,
            title: "product_sales"
          }
        },
        {
          path: "/report/Purchase/purchase_product_sum",
          name: "采购产品汇总",
          component: purchase_product_sum,
          meta: {
            requireAuth: true,
            title: "purchase_product_sum"
          }
        },
        {
          path: "/report/Finance/order_product_cost",
          name: "订单产品成本",
          component: order_product_cost,
          meta: {
            requireAuth: true,
            title: "order_product_cost"
          }
        },
        {
          path: "/report/Finance/order_cost",
          name: "订单成本",
          component: order_cost,
          meta: {
            requireAuth: true,
            title: "order_cost"
          }
        },
        {
          path: "/report/Finance/payee_diary",
          name: "账户日志记账",
          component: payee_diary,
          meta: {
            requireAuth: true,
            title: "payee_diary"
          }
        },
        // 权限
        {
          path: "/System/auth_group",
          name: "权限角色",
          component: auth_group,
          meta: {
            requireAuth: true,
            title: "auth_group"
          }
        },
        {
          path: "/System/auth_rule",
          name: "权限规则",
          component: auth_rule,
          meta: {
            requireAuth: true,
            title: "auth_rule"
          }
        }
      ]
    }
  ]
});
