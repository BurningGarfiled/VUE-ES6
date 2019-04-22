import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path*',
    component: () =>
            import('@/views/redirect/index')
  }]
}, {
  name: 'constant-login',
  path: '/login',
  component: () =>
            import('@/views/login/index'),
  hidden: true
},
{
  name: 'constant-404',
  path: '/404',
  component: () =>
            import('@/views/errorPage/404'),
  hidden: true
},
{
  name: 'constant-401',
  path: '/401',
  component: () =>
            import('@/views/errorPage/401'),
  hidden: true
},
{
  path: '',
  component: Layout,
  redirect: 'dashboard',
  children: [{
    path: 'dashboard',
    component: () =>
                import('@/views/dashboard/index'),
    name: 'Dashboard',
    meta: { title: 'dashboard', icon: 'dashboard' }
  }]
}
]

/** 1.这里要注意在创建基础路由表时,一级的虚拟路由（即不在页面菜单中显示的路由项）要加上alwaysShow: false;
 *  2.除虚拟路由外,其他路由项name也要标注清楚;
 */
export const baseRouterMap = [
  // {
  //   path: '/icon',
  //   component: Layout,
  //   hidden: true,
  //   alwaysShow: false,
  //   redirect: '/icon/icon-index',
  //   meta: { title: 'icons', icon: 'icon' },
  //   children: [{
  //     path: 'icon-index',
  //     component: () =>
  //         import('@/views/svg-icons/index'),
  //     name: 'Icons',
  //     meta: { title: 'icons', icon: 'icon', noCache: true }
  //   }]
  // },
  // {
  //   path: '/example',
  //   component: Layout,
  //   hidden: true,
  //   alwaysShow: true,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'example' },
  //   children: [{
  //     path: 'table',
  //     name: 'Table',
  //     hidden: true,
  //     component: () =>
  //                     import('@/views/table/index'),
  //     meta: { title: 'Table', icon: 'table' }
  //   },
  //   {
  //     path: 'tree',
  //     name: 'Tree',
  //     hidden: true,
  //     component: () =>
  //                     import('@/views/tree/index'),
  //     meta: { title: 'Tree', icon: 'tree' }
  //   }
  //   ]
  // },

  // {
  //   path: '/form',
  //   component: Layout,
  //   hidden: true,
  //   alwaysShow: false,
  //   redirect: '/form/index',
  //   meta: { title: 'Form', icon: 'form' },
  //   children: [{
  //     path: 'form-index',
  //     name: 'Form',
  //     hidden: true,
  //     component: () =>
  //                 import('@/views/form/index'),
  //     meta: { title: 'Form', icon: 'form' }
  //   }]
  // },

  // {
  //   path: '/charts',
  //   component: Layout,
  //   hidden: true,
  //   alwaysShow: false,
  //   redirect: 'noredirect',
  //   name: 'Charts',
  //   meta: {
  //     title: 'charts',
  //     icon: 'chart'
  //   },
  //   children: [{
  //     path: 'keyboard',
  //     hidden: true,
  //     component: () =>
  //                     import('@/views/charts/keyboard'),
  //     name: 'KeyboardChart',
  //     meta: { title: 'keyboardChart', noCache: true }
  //   },
  //   {
  //     path: 'line',
  //     hidden: true,
  //     component: () =>
  //                     import('@/views/charts/line'),
  //     name: 'LineChart',
  //     meta: { title: 'lineChart', noCache: true }
  //   },
  //   {
  //     path: 'mixchart',
  //     hidden: true,
  //     component: () =>
  //                     import('@/views/charts/mixChart'),
  //     name: 'MixChart',
  //     meta: { title: 'mixChart', noCache: true }
  //   }
  //   ]
  // },

  // {
  //   path: '/tab',
  //   component: Layout,
  //   hidden: true,
  //   alwaysShow: false,
  //   redirect: '/tab/tab-index',
  //   meta: { title: 'tab', icon: 'tab' },
  //   children: [{
  //     path: 'tab-index',
  //     component: () =>
  //                 import('@/views/tab/index'),
  //     name: 'Tab',
  //     meta: { title: 'tab', icon: 'tab' }
  //   }]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   hidden: true,
  //   redirect: '/nested/menu1',
  //   alwaysShow: true,
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [{
  //     path: 'menu1',
  //     hidden: true,
  //     component: () =>
  //                     import('@/views/nested/menu1/index'), // Parent router-view
  //     name: 'Menu1',
  //     meta: { title: 'Menu1', icon: 'list' },
  //     children: [{
  //       path: 'menu1-1',
  //       hidden: true,
  //       component: () =>
  //                             import('@/views/nested/menu1/menu1-1'),
  //       name: 'Menu1-1',
  //       meta: { title: 'Menu1-1', icon: 'icon' }
  //     },
  //     {
  //       path: 'menu1-2',
  //       hidden: true,
  //       alwaysShow: true,
  //       component: () =>
  //                             import('@/views/nested/menu1/menu1-2'),
  //       name: 'Menu1-2',
  //       meta: { title: 'Menu1-2', icon: 'icon' },
  //       children: [{
  //         path: 'menu1-2-1',
  //         hidden: true,
  //         component: () =>
  //                                     import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //         name: 'Menu1-2-1',
  //         meta: { title: 'Menu1-2-1' }
  //       },
  //       {
  //         path: 'menu1-2-2',
  //         hidden: true,
  //         component: () =>
  //                                     import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //         name: 'Menu1-2-2',
  //         meta: { title: 'Menu1-2-2' }
  //       }
  //       ]
  //     },
  //     {
  //       path: 'menu1-3',
  //       hidden: true,
  //       component: () =>
  //                             import('@/views/nested/menu1/menu1-3'),
  //       name: 'Menu1-3',
  //       meta: { title: 'Menu1-3', icon: 'icon' }
  //     }
  //     ]
  //   },
  //   {
  //     path: 'menu2',
  //     name: 'Menu2',
  //     hidden: true,
  //     component: () =>
  //                     import('@/views/nested/menu2/index'),
  //     meta: { title: 'menu2', icon: 'list' }
  //   }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   name: 'External',
  //   hidden: true,
  //   alwaysShow: false,
  //   component: Layout,
  //   children: [{
  //     name: 'External-index',
  //     hidden: true,
  //     path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //     meta: { title: 'External Link', icon: 'link' }
  //   }]
  // },
  // 系统设置
  {
    path: '/system',
    component: Layout,
    hidden: true,
    alwaysShow: true,
    redirect: '/system/staff',
    name: 'system',
    meta: { title: '系统设置', icon: 'example' },
    children: [
      {
        path: 'staff',
        name: 'Staff',
        hidden: true,
        component: () => import('@/views/system/staff/index'),
        meta: { title: '员工管理', icon: 'table' }
      },
      {
        path: 'role',
        name: 'Role',
        hidden: true,
        component: () =>
                        import('@/views/system/role/index'),
        meta: { title: '角色管理', icon: 'table' }
      },
      {
        path: 'department',
        name: 'Department',
        hidden: true,
        component: () =>
                        import('@/views/system/department/index'),
        meta: { title: '部门管理', icon: 'table' }
      },
      {
        path: 'resource',
        name: 'Resource',
        hidden: true,
        component: () =>
                        import('@/views/system/resource/index'),
        meta: { title: '资源管理', icon: 'table' }
      },
      {
        path: 'barcode',
        name: 'Barcode',
        hidden: true,
        component: () =>
                        import('@/views/system/barCode/index'),
        meta: { title: '流水号管理', icon: 'table' }
      }
    ]
  },
  // 基本资料
  {
    path: '/base',
    component: Layout,
    hidden: true,
    alwaysShow: true,
    redirect: '/base/depot',
    name: 'Base',
    meta: { title: '基本资料', icon: 'example' },
    children: [
      {
        path: 'depot',
        name: 'Depot',
        hidden: true,
        component: () => import('@/views/baseInfo/depot/index'),
        meta: { title: '仓库管理', icon: 'table' }
      },
      {
        path: 'depotPosition',
        name: 'DepotPosition',
        hidden: true,
        component: () => import('@/views/baseInfo/depotPosition/index'),
        meta: { title: '库位管理', icon: 'table' }
      },
      {
        path: 'supplier',
        name: 'Supplier',
        hidden: true,
        component: () => import('@/views/baseInfo/supplier/index'),
        meta: { title: '货主管理', icon: 'table' }
      },
      {
        path: 'customer',
        name: 'Customer',
        hidden: true,
        component: () => import('@/views/baseInfo/customer/index'),
        meta: { title: '客户管理', icon: 'table' }
      },
      {
        path: 'unit',
        name: 'Unit',
        hidden: true,
        component: () => import('@/views/baseInfo/unit/index'),
        meta: { title: '计量单位', icon: 'table' }
      },
      {
        path: 'category',
        name: 'Category',
        hidden: true,
        component: () => import('@/views/baseInfo/category/index'),
        meta: { title: '产品类别', icon: 'table' }
      },
      {
        path: 'product',
        name: 'Product',
        hidden: true,
        component: () => import('@/views/baseInfo/product/index'),
        meta: { title: '产品管理', icon: 'table' }
      },
      {
        path: 'forwarder',
        name: 'Forwarder',
        hidden: true,
        component: () => import('@/views/baseInfo/forwarder/index'),
        meta: { title: '承运商管理', icon: 'table' }
      },
      {
        path: 'rent',
        name: 'Rent',
        hidden: true,
        component: () => import('@/views/baseInfo/rent/index'),
        meta: { title: '租金设置', icon: 'table' }
      }
    ]
  },
  // 仓库作业
  {
    path: '/depotInfo',
    component: Layout,
    hidden: true,
    alwaysShow: true,
    redirect: '/depotInfo/inbound',
    name: 'DepotInfo',
    meta: { title: '仓库作业', icon: 'example' },
    children: [
      {
        path: 'inbound',
        name: 'Inbound',
        hidden: true,
        component: () => import('@/views/depotInfo/inbound/index'),
        meta: { title: '入库管理', icon: 'table' }
      },
      {
        path: 'outbound',
        name: 'Outbound',
        hidden: true,
        component: () => import('@/views/depotInfo/outbound/index'),
        meta: { title: '出库管理', icon: 'table' }
      },
      {
        path: 'damage',
        name: 'Damage',
        hidden: true,
        component: () => import('@/views/depotInfo/damage/index'),
        meta: { title: '报损管理', icon: 'table' }
      },
      {
        path: 'transfer',
        name: 'Transfer',
        hidden: true,
        component: () => import('@/views/depotInfo/transfer/index'),
        meta: { title: '移库管理', icon: 'table' }
      },
      {
        path: 'check',
        name: 'Check',
        hidden: true,
        component: () => import('@/views/depotInfo/check/index'),
        meta: { title: '盘点管理', icon: 'table' }
      },
      {
        path: 'allocation',
        name: 'Allocation',
        hidden: true,
        component: () => import('@/views/depotInfo/allocation/index'),
        meta: { title: '调拨管理', icon: 'table' }
      }
    ]
  },
  // 业务操作
  {
    path: '/business',
    component: Layout,
    hidden: true,
    alwaysShow: true,
    redirect: '/business/inboundApply',
    name: 'Business',
    meta: { title: '业务操作', icon: 'example' },
    children: [
      {
        path: 'inboundApply',
        name: 'InboundApply',
        hidden: true,
        component: () => import('@/views/business/inboundApply/index'),
        meta: { title: '采购管理', icon: 'table' }
      },
      {
        path: 'inboundReturn',
        name: 'InboundReturn',
        hidden: true,
        component: () => import('@/views/business/inboundReturn/index'),
        meta: { title: '采购退货', icon: 'table' }
      },
      {
        path: 'outboundApply',
        name: 'OutboundApply',
        hidden: true,
        component: () => import('@/views/business/outboundApply/index'),
        meta: { title: '销售管理', icon: 'table' }
      },
      {
        path: 'returnApply',
        name: 'ReturnApply',
        hidden: true,
        component: () => import('@/views/business/returnApply/index'),
        meta: { title: '销售退货', icon: 'table' }
      }
    ]
  },
  // 拣货管理
  {
    path: '/pickInfo',
    component: Layout,
    hidden: true,
    alwaysShow: true,
    redirect: '/pickInfo/sortingBox',
    name: 'PickInfo',
    meta: { title: '拣货管理', icon: 'example' },
    children: [
      {
        path: 'sortingBox',
        name: 'SortingBox',
        hidden: true,
        component: () => import('@/views/pickInfo/sortingBox/index'),
        meta: { title: '分拣盒管理', icon: 'table' }
      },
      {
        path: 'pickGoods',
        name: 'PickGoods',
        hidden: true,
        component: () => import('@/views/pickInfo/pickGoods/index'),
        meta: { title: '拣货管理', icon: 'table' }
      },
      {
        path: 'wellen',
        name: 'Wellen',
        hidden: true,
        component: () => import('@/views/pickInfo/wellen/index'),
        meta: { title: '波次管理', icon: 'table' }
      },
      {
        path: 'twoSorting',
        name: 'TwoSorting',
        hidden: true,
        component: () => import('@/views/pickInfo/twoSorting/index'),
        meta: { title: '二次分拣', icon: 'table' }
      }
    ]
  },
  // 财务管理
  {
    path: '/finance',
    component: Layout,
    hidden: true,
    alwaysShow: true,
    redirect: '/finance/finCategory',
    name: 'Finance',
    meta: { title: '财务管理', icon: 'example' },
    children: [
      {
        path: 'finCategory',
        name: 'FinCategory',
        hidden: true,
        component: () => import('@/views/finance/finCategory/index'),
        meta: { title: '财务类别', icon: 'table' }
      },
      {
        path: 'receive',
        name: 'Receive',
        hidden: true,
        component: () => import('@/views/finance/receive/index'),
        meta: { title: '应收管理', icon: 'table' }
      },
      {
        path: 'payment',
        name: 'Payment',
        hidden: true,
        component: () => import('@/views/finance/payment/index'),
        meta: { title: '应付管理', icon: 'table' }
      },
      {
        path: 'chargeUp',
        name: 'ChargeUp',
        hidden: true,
        component: () => import('@/views/finance/chargeUp/index'),
        meta: { title: '财务记账', icon: 'table' }
      }
    ]
  },
  // 报表管理
  {
    path: '/reportForm',
    component: Layout,
    hidden: true,
    alwaysShow: true,
    redirect: '/reportForm/templet',
    name: 'ReportForm',
    meta: { title: '报表管理', icon: 'example' },
    children: [
      {
        path: 'templet',
        name: 'Templet',
        hidden: true,
        component: () => import('@/views/reportForm/templet/index'),
        meta: { title: '模板管理', icon: 'table' }
      },
      {
        path: 'stockBill',
        name: 'StockBill',
        hidden: true,
        component: () => import('@/views/reportForm/stockBill/index'),
        meta: { title: '库存清单', icon: 'table' }
      },
      {
        path: 'stockOut',
        name: 'StockOut',
        hidden: true,
        component: () => import('@/views/reportForm/stockOut/index'),
        meta: { title: '可出库存', icon: 'table' }
      },
      {
        path: 'beginAndEnd',
        name: 'BeginAndEnd',
        hidden: true,
        component: () => import('@/views/reportForm/beginAndEnd/index'),
        meta: { title: '期初期末', icon: 'table' }
      },
      {
        path: 'stockAccount',
        name: 'StockAccount',
        hidden: true,
        component: () => import('@/views/reportForm/stockAccount/index'),
        meta: { title: '库存台账', icon: 'table' }
      },
      {
        path: 'leaseCost',
        name: 'LeaseCost',
        hidden: true,
        component: () => import('@/views/reportForm/leaseCost/index'),
        meta: { title: '租赁费用', icon: 'table' }
      },
      {
        path: 'rotationRate',
        name: 'RotationRate',
        hidden: true,
        component: () => import('@/views/reportForm/rotationRate/index'),
        meta: { title: '周转率', icon: 'table' }
      },
      {
        path: 'stockWarning',
        name: 'StockWarning',
        hidden: true,
        component: () => import('@/views/reportForm/stockWarning/index'),
        meta: { title: '库存预警', icon: 'table' }
      },
      {
        path: 'stockCapacity',
        name: 'StockCapacity',
        hidden: true,
        component: () => import('@/views/reportForm/stockCapacity/index'),
        meta: { title: '库存容量', icon: 'table' }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
