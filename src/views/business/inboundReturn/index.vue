<template>
  <div class="app-container">
    <v-pageSearch>
      <el-form :inline="true">
        <el-form-item label="退货单号：" label-width="100px">
          <el-input v-model="formSearch.returnOdd" clearable placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="入库申请单：" label-width="100px">
          <el-input v-model="formSearch.requestCode" clearable placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="产品编号：" label-width="100px">
          <el-input v-model="formSearch.productCode" clearable placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="产品名称：" label-width="100px">
          <el-input v-model="formSearch.productName" clearable placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="订单类型：" label-width="100px">
          <el-select v-model="formSearch.orderStatus" placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="货主编号：" label-width="100px">
          <el-input v-model="formSearch.supplierCode" clearable placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="货主名称：" label-width="100px">
          <el-input v-model="formSearch.supplierName" clearable placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="起始时间：" label-width="100px">
          <el-date-picker
            v-model="formSearch.startTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="00:00:00"
            style="width: 180px"/>
        </el-form-item>
        <el-form-item label="结束时间：" label-width="100px">
          <el-date-picker
            v-model="formSearch.endTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="23:59:59"
            style="width: 180px"/>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="getTableData">查询</el-button>
        </el-form-item>
      </el-form>
    </v-pageSearch>

    <v-pageToolbar align="left">
      <el-button>
        <i class="iconfont icon">&#xe67b;</i>导出
      </el-button>
    </v-pageToolbar>

    <v-pageTable>
      <el-table
        v-loading="table.loading"
        :header-cell-style="$store.state.element.headerBg"
        :data="table.body"
        :max-height="table.autoHeight"
        row-key="id"
      >
        <el-table-column prop="requestCode" label="退货单号" />
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="productCode" label="产品编号" />
        <el-table-column prop="format" label="产品规格" />
        <el-table-column prop="unit" label="单价" />
        <el-table-column prop="quantity" label="退货数" />
        <el-table-column prop="unit" label="单位" />
        <el-table-column prop="volume" label="总额" />
        <el-table-column prop="tray" label="入库申请单" />
        <el-table-column prop="supplierName" label="货主名称" />
        <el-table-column prop="orderStatus" label="状态">
          <template slot-scope="scope">{{ scope.row.orderStatusName }}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="90">
          <template slot-scope="scope">{{ scope.row.createTime | parseTime('{y}-{m}-{d}') }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="420">
          <template slot-scope="scope">
            <el-button type="primary" title="查看" @click="showHandle(scope.row)">
              <i class="iconfont">&#xe62e;</i>
            </el-button>
            <el-button v-if="isConfirmOrCancel(scope.row)" type="primary" title="确认" @click="confirmHandle(scope.row)">
              <i class="iconfont">&#xe63b;</i>
            </el-button>
            <el-button v-if="isConfirmOrCancel(scope.row)" type="primary" title="取消" @click="cancelHandle(scope.row)">
              <i class="iconfont">&#xe671;</i>
            </el-button>
            <el-button v-if="isDelete(scope.row)" type="primary" title="删除" icon="el-icon-delete" @click="deleteHandle(scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
      <template slot="pagination" slot-scope="props">
        <el-pagination
          :layout="props.layout"
          :total="table.paginationTotal"
          :current-page.sync="table.currentPage"
          :page-size="table.pageSize"
          :page-sizes="props.sizes"
          background
          @size-change="sizeChange"
          @current-change="pageChange"
        />
      </template>
    </v-pageTable>

    <!--查看弹窗-->
    <el-dialog :close-on-click-modal="false" :visible.sync="popDetail" :title="title" top="10vh" width="800px" @close="closePop">
      <el-form ref="addForm" :model="addData" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="退货单号：" prop="requestCode ">
              <el-input v-model="addData.requestCode" disabled placeholder="可不填，自动生成"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="制单日期：" prop="documentationDate">
              <el-date-picker
                v-model="addData.documentationDate"
                disabled
                type="date"
                placeholder="选择日期"
                class="fullW"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="退货日期：" prop="deliveryDate">
              <el-date-picker
                v-model="addData.deliveryDate"
                disabled
                type="date"
                placeholder="选择日期"
                class="fullW"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="入库申请单：" prop="preparedBy">
              <el-input v-model="addData.preparedBy" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="制单人：" prop="preparedBy">
              <el-input v-model="addData.preparedBy" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货主名称：" prop="supplierId">
              <select-basics
                v-model="addData.supplierId"
                disabled
                type="supplier"
                placeholder="请选择"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="联系人：" prop="linkman">
              <el-input v-model="addData.linkman" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话：" prop="phone">
              <el-input v-model="addData.phone" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态：" prop="remark">
              <el-input v-model="addData.remark" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="addData.remark" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :header-cell-style="$store.state.element.headerBg"
        :data="submitBody.body"
      >
        <el-table-column prop="productCode" label="产品编码"/>
        <el-table-column prop="productName" label="产品名称"/>
        <el-table-column prop="quantity" label="数量" width="60px"/>
        <el-table-column prop="weight" label="重量" width="60px"/>
        <el-table-column prop="volume" label="体积" width="60px"/>
        <el-table-column prop="tray" label="托盘" width="60px"/>
        <el-table-column prop="format" label="规格" width="60px"/>
        <el-table-column prop="unit" label="单位" width="60px"/>
        <el-table-column prop="batch" label="批次" min-width="90">
          <template slot-scope="scope">{{ scope.row.batch | parseTime('{y}-{m}-{d}') }}</template>
        </el-table-column>
        <el-table-column prop="expirationTime" label="过期时间" min-width="90">
          <template slot-scope="scope">{{ scope.row.expirationTime | parseTime('{y}-{m}-{d}') }}</template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="closePop">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'InboundReturn',
  data() {
    return {
      rules: {
        // name: [
        //   { required: true, message: '请输入部门名称', trigger: 'blur' }
        // ]
      },
      table: {
        body: [],
        page: 1,
        pageSize: 15,
        currentPage: 1,
        paginationTotal: 15,
        autoHeight: 749,
        loading: false
      },
      load: false,
      formSearch: {
        requestCode: '',
        productCode: '',
        productName: '',
        orderStatus: '',
        supplierCode: '',
        supplierName: '',
        startTime: '',
        endTime: ''
      },
      statusOptions: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '创建订单'
        },
        {
          value: '2',
          label: '订单确认'
        },
        {
          value: '3',
          label: '订单取消'
        }
      ], // 订单状态列表
      title: '新增采购',
      editLoading: false, // 提交按钮禁用状态
      popDetail: false, // 弹窗显示状态
      addData: {
        supplierCode: '',
        documentationDate: '',
        preparedBy: '',
        supplierId: '',
        linkman: '',
        mailbox: '',
        phone: '',
        deliveryDate: '',
        declarationNumber: '',
        containerNo: '',
        agencyCommission: '',
        remark: ''
      }, // 新增数据
      popData: {
        requestCode: '',
        supplierCode: '',
        documentationDate: '',
        preparedBy: '',
        supplierId: '',
        linkman: '',
        mailbox: '',
        phone: '',
        deliveryDate: '',
        declarationNumber: '',
        containerNo: '',
        agencyCommission: '',
        remark: ''
      }, // 查看数据
      proSearch: {
        productCode: '',
        productName: ''
      }, // 产品查询条件
      submitBody: {
        loading: false,
        body: []
      } // 要提交的表格数据
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    // 是否主单--子单
    isParent(row) {
      const flag = row.mainSonFlag
      return flag === 1 // 状态为1，表示主单，否则为子单
    },
    // 是否可以确定取消
    isConfirmOrCancel(row) {
      const orderStatus = Number(row.orderStatus)
      return orderStatus === 1 && this.isParent(row) // 创建订单状态下（创建订单：1,），并且是主单，可以取消和确认
    },
    // 是否可以删除
    isDelete(row) {
      const orderStatus = Number(row.orderStatus)
      return orderStatus === 1 // 创建订单状态下（创建订单：1,）,可以删除
    },
    // 分页查询
    getTableData(val, flag) {
      if (flag === 'pageSize') {
        this.table.pageSize = val
      } else if (flag === 'page') {
        this.table.page = val
      }
      const url = 'kaili-basic/v1/warehousingReturns/queryWarehousingReturn'
      const params = this.formSearch
      if (params.startTime === '' || params.startTime === undefined) {
        params.startTime = ''
      } else {
        params.startTime = this.$gFun.parseTime(params.startTime, '{y}-{m}-{d} {h}:{i}:{s}')
      }
      if (params.endTime === '' || params.endTime === undefined) {
        params.endTime = ''
      } else {
        params.endTime = this.$gFun.parseTime(params.endTime, '{y}-{m}-{d} {h}:{i}:{s}')
      }
      params.page = this.table.page
      params.pageSize = this.table.pageSize
      this.table.loading = true
      this.getRequestParams(url, params).then(data => {
        this.table.loading = false
        this.table.body = data.data.records
        this.table.body.forEach((e) => {
          e.id = e.returnId // table展开数组必须要有个id
          e.children = [].concat(e.warehousingReturnProductList) // 拷贝数组，存放在children字段中，element表格展开用到
          e.children.forEach((m) => {
            m.oldId = m.id // 保存原Id
            m.id = m.id + '9999' // 新增字段，展开子项用到
          })
        })
        this.table.paginationTotal = data.data.total
      })
    },
    // 根据主单Id查找数据
    searchByApplyId(id) {
      const body = this.table.body
      let obj
      for (let i = 0; i < body.length; i++) {
        const applyId = body[i].applyId
        if (applyId === id) {
          obj = body[i]
          return obj
        }
      }
    },
    // 查看
    showHandle(row) {
      const this_ = this
      this_.title = '编辑采购'
      this_.resetForm('addForm')
      const obj = this.searchByApplyId(row.applyId)
      this.addData = this.$gFun.arrDeepCopy(obj)
      this.submitBody.body = this.addData.warehousingReturnProductList
      this_.popDetail = true
      this_.$nextTick(() => {
        this_.$refs['addForm'].clearValidate()
      })
    },
    // 关闭新增弹窗
    closePop() {
      this.popDetail = false
      this.submitBody.body = []
    },
    // 删除
    deleteHandle(row) {
      this.$confirm('确认删除？', '提示', {
        type: 'warning'
      }).then(() => {
        const mainSonFlag = row.mainSonFlag
        let params
        if (mainSonFlag === 1) {
          params = {
            mainIds: [row.returnId]
          }
        } else {
          params = {
            sonIds: [row.oldId]
          }
        }
        const url = 'kaili-basic/v1/warehousingReturns/deleteWarehousingReturns'
        this.deleteRequest(url, params).then(() => {
          this.$message.success('删除成功')
          this.getTableData()
        })
      })
    },
    // 确认
    confirmHandle(row) {
      this.$confirm('确认？', '提示', {
        type: 'warning'
      }).then(() => {
        const url = `kaili-basic/v1/warehousingReturns/${row.returnId}/orderConfirmation`
        this.putRequest(url, {}).then(() => {
          this.$message.success('操作成功')
          this.getTableData()
        })
      })
    },
    // 取消
    cancelHandle(row) {
      this.$confirm('确认取消？', '提示', {
        type: 'warning'
      }).then(() => {
        const url = `kaili-basic/v1/warehousingReturns/${row.returnId}/orderCancellation`
        this.putRequest(url, {}).then(() => {
          this.$message.success('操作成功')
          this.getTableData()
        })
      })
    },
    // 重置表单
    resetForm(formName) {
      if (formName === 'popForm') {
        this.popData = {
          requestCode: '',
          supplierCode: '',
          documentationDate: '',
          preparedBy: '',
          supplierId: '',
          linkman: '',
          mailbox: '',
          phone: '',
          deliveryDate: '',
          declarationNumber: '',
          containerNo: '',
          agencyCommission: '',
          remark: ''
        }
      } else if (formName === 'addForm') {
        this.addData = {
          supplierCode: '',
          documentationDate: '',
          preparedBy: '',
          supplierId: '',
          linkman: '',
          mailbox: '',
          phone: '',
          deliveryDate: '',
          declarationNumber: '',
          containerNo: '',
          agencyCommission: '',
          remark: ''
        }
      }
      this.submitBody.body = []
    },
    // 表格条数改变
    sizeChange(val) {
      this.getTableData(val, 'pageSize')
    },
    // 表格页数改变
    pageChange(val) {
      this.getTableData(val, 'page')
    }
  }
}
</script>
