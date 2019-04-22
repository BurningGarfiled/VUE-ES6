<template>
  <div class="app-container">
    <v-pageSearch>
      <el-form :inline="true">
        <el-form-item label="入库申请单：">
          <el-input
            v-model="formSearch.depotId"
            style="width:150px;padding-right:0;"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item :label="'货主名称：'">
          <el-input
            v-model="formSearch.boxName"
            style="width:150px;padding-right:0;"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item :label="'货主编号：'">
          <el-input
            v-model="formSearch.boxNo"
            style="width:150px;padding-right:0;"
            placeholder="请输入"
          />
        </el-form-item>

        <el-button
          type="primary"
          icon="el-icon-search"
          @click="onSearch"
        >查询</el-button>
      </el-form>

    </v-pageSearch>
    <v-pageToolbar align="left">
      <el-button type="primary" icon="el-icon-tickets" @click="onOpen">生成波次单</el-button>
      <el-button :disabled="!table.body.length > 0" @click="onExport">导出</el-button>
    </v-pageToolbar>

    <v-pageTable>
      <el-table v-loading="table.loading" ref="tableRef" :data="table.body" :max-height="table.autoHeight" :header-cell-style="$store.state.element.headerBg" tooltip-effect="dark" style="width: 100%" @selection-change="check" >
        <el-table-column type="selection" fixed width="55"/>
        <el-table-column prop="123123" min-width="80" label="申请单号"/>
        <el-table-column prop="123123" min-width="80" label="货主"/>
        <el-table-column prop="123123" min-width="80" label="客户单号"/>
        <el-table-column prop="123123" min-width="80" label="客户名"/>
        <el-table-column prop="123123" min-width="80" label="状态"/>
        <el-table-column prop="123123" min-width="80" label="客户名"/>
        <el-table-column prop="createTime" min-width="80" label="创建时间">
          <template slot-scope="scope">
            {{ timeToStr(scope.row.createTime,'{y}-{m}-{d}') }}
          </template>
        </el-table-column>
        <el-table-column prop="123123" min-width="80" label="波次单号"/>
        <el-table-column prop="createTime" min-width="80" label="波次时间">
          <template slot-scope="scope">
            {{ timeToStr(scope.row.createTime,'{y}-{m}-{d}') }}
          </template>
        </el-table-column>
        <el-table-column :label="'操作'" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button :title="'查看'" type="primary" size="mini" icon="el-icon-edit" @click="onCompile(scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
      <template slot="pagination" slot-scope="props">
        <el-pagination :layout="props.layout" :page-sizes="props.sizes" :current-page.sync="table.currentPage" :total="table.paginationTotal" background @current-change="pageChange" @size-change="sizeChange" />
      </template>
    </v-pageTable>

    <el-dialog id="form" :title="popupTitle" :visible.sync="popupState" :close-on-click-modal="false" :modal="false" top="10vh" width="1000px" @close="onClose">
      <el-form ref="ruleForm" :model="popupData" :rules="rules" label-width="100px">
        <template v-if="popupWay">
          <el-row>
            <el-col :span="24">
              <el-form :inline="true">
                <el-form-item label="仓库名称：" >
                  <el-input v-model="popupData.boxName" style="width:180px;padding-right:0;" />
                </el-form-item>

                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="onPopSearch"
                >查询</el-button>
              </el-form>

            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-row>
            <el-col :span="8">
              <el-form-item label="订单号：" >
                <el-input v-model="popupData.boxName" style="width:180px;padding-right:0;" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发货日期：" >
                <el-date-picker
                  v-model="popupData.leaseTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  style="width:180px;padding-right:0;"
                  readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="制单日期：" >
                <el-date-picker
                  v-model="popupData.leaseTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  style="width:180px;padding-right:0;"
                  readonly />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="客户单号：" >
                <el-input v-model="popupData.boxName" style="width:180px;padding-right:0;" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="代理费：" >
                <el-input v-model="popupData.boxName" style="width:180px;padding-right:0;" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="制单人：" >
                <el-input v-model="popupData.boxName" style="width:180px;padding-right:0;" readonly />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="货主：" >
                <el-input v-model="popupData.boxName" style="width:180px;padding-right:0;" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户名称：" >
                <el-input v-model="popupData.boxName" style="width:180px;padding-right:0;" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系人：" >
                <el-input v-model="popupData.boxName" style="width:180px;padding-right:0;" readonly />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="电话：" >
                <el-input v-model="popupData.boxName" style="width:180px;padding-right:0;" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态：" >
                <el-input v-model="popupData.boxName" style="width:180px;padding-right:0;" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注：" >
                <el-input v-model="popupData.boxName" style="width:180px;padding-right:0;" readonly />
              </el-form-item>
            </el-col>
          </el-row>

        </template>
      </el-form>

      <el-row>
        <el-table v-loading="popTable.loading" ref="popTableRef" :data="popTable.body" :max-height="popTable.autoHeight" :header-cell-style="$store.state.element.headerBg" tooltip-effect="dark" style="width: 100%" @select-all="popSelect" @select="popCheck" >
          <template v-if="popupWay">
            <el-table-column key="selection" type="selection" fixed width="55"/>
            <el-table-column prop="boxName" min-width="80" label="仓库编号"/>
            <el-table-column prop="boxName1" min-width="80" label="仓库名称"/>
            <el-table-column prop="boxName2" min-width="80" label="商户名"/>
            <el-table-column prop="boxName3" min-width="80" label="联系人"/>
            <el-table-column prop="boxName4" min-width="80" label="电话"/>
          </template>

          <template v-else>
            <el-table-column prop="boxName5" min-width="80" label="产品名称"/>
            <el-table-column prop="boxName6" min-width="80" label="产品编号"/>
            <el-table-column prop="boxName7" min-width="80" label="规格"/>
            <el-table-column prop="boxName8" min-width="80" label="单位"/>
            <el-table-column prop="boxName9" min-width="80" label="数量"/>
            <el-table-column prop="boxName10" min-width="80" label="体积"/>
            <el-table-column prop="boxName11" min-width="80" label="重量"/>

          </template>
        </el-table>

        <template slot="pagination" slot-scope="props">
          <el-pagination :layout="props.layout" :page-sizes="props.sizes" :current-page.sync="popTable.currentPage" :total="popTable.paginationTotal" background @current-change="popPageChange" @size-change="popSizeChange" />
        </template>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="popupWay" type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="onClose">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'PickGoods',
  data() {
    return {
      // 验证规则
      rules: {
        boxName: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        boxNo: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        depotId: [
          { required: true, message: '请输入', trigger: 'change' }
        ]
      },
      formSearch: {
        depotId: '',
        boxName: '',
        boxNo: ''
      },
      table: {
        body: [],
        page: 1,
        pageSize: 15,
        paginationTotal: 0,
        autoHeight: 749,
        loading: false,
        currentPage: 1
      },
      popupData: {
        boxId: '',
        boxName: '',
        boxNo: '',
        depotId: ''
      },
      popupState: false,
      Export: {},
      popupTitle: '',
      popupWay: true,
      popTable: {
        body: [],
        page: 1,
        pageSize: 15,
        paginationTotal: 0,
        autoHeight: 749,
        loading: false,
        currentPage: 1
      },
      transfer: [],
      popTransfer: ''
    }
  },
  mounted() {
    this.onSearch()
  },
  methods: {
    check(selection) {
      const b = []
      selection.map(item => {
        b.push(item)
      })

      this.selec(b)
    },

    selec(selection) {
      if (selection.length > 0) {
        this.transfer = selection.map(item => {
          return {
            item: item
          }
        })
      } else {
        this.transfer = []
      }
      console.log(this.transfer)
    },
    // 查询
    onSearch() {
      this.transfer = []
      this.getTableData(1, 'page')
      this.table.currentPage = 1
    },
    // 查询请求
    onRequest() {
      const url = 'kaili-basic/v1/pickBox'
      const params = {
        depotId: this.formSearch.depotId,
        boxName: this.formSearch.boxName,
        boxNo: this.formSearch.boxNo
      }
      this.Export = Object.assign({}, params)
      params.page = this.table.page
      params.pageSize = this.table.pageSize
      this.table.loading = true
      this.getRequestParams(url, params).then((res) => {
        this.table.loading = false
        this.table.body = res.data.records
        this.table.paginationTotal = res.data.total
        this.table.pageSize = res.data.size
      })
    },

    // 生成波次单
    onOpen() {
      if (this.transfer.length === 0) {
        this.$message({
          message: '请选择要拣货的订单',
          type: 'warning'
        })
      } else {
        this.popupWay = true
        this.popupTitle = '生成波次单'
        this.popupState = true
        this.onPopSearch()
      }
    },
    // 编辑
    onCompile(row) {
      this.popupState = true
      this.popupWay = false
      this.popupTitle = '出库申请详情'
      const url = 'kaili-basic/v1/pickBox'
      this.getRequestParams(url, '').then((res) => {
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      })
    },

    // 表单提交
    onSubmit() {
      const url = 'kaili-basic/v1/pickBox'
      const params = {
        boxName: this.popupData.boxName,
        boxNo: this.popupData.boxNo,
        depotId: this.popupData.depotId
      }
      this.postRequest(url, params).then((res) => {
        this.onRequest()
        this.onClose()
      })
    },

    // 关闭弹窗
    onClose() {
      this.popupState = false
      for (const i in this.popupData) {
        this.popupData[i] = ''
      }
      this.popTable.body = []
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },

    // ========================
    // 导出
    onExport() {
      const arr = []
      for (const key in this.Export) {
        arr.push(key + '=' + this.Export[key])
      }
      const params = arr.join('&')
      window.location.href = `/api/kaili-basic/v1/pickBox/export?` + params
    },
    sizeChange(val) {
      this.getTableData(val, 'pageSize')
    },
    pageChange(val) {
      this.getTableData(val, 'page')
    },
    getTableData(val, flag) {
      if (flag === 'pageSize') {
        this.table.pageSize = val
      } else if (flag === 'page') {
        this.table.page = val
      }
      this.onRequest()
    },
    // ==========================
    // 查询
    onPopSearch() {
      this.popGetTableData(1, 'page')
      this.popTable.currentPage = 1
    },
    // 查询请求
    onPopRequest() {
      const url = 'kaili-basic/v1/pickBox'
      const params = {
        depotId: this.popupData.depotId
      }
      params.page = this.table.page
      params.pageSize = this.table.pageSize
      this.popTable.loading = true
      this.getRequestParams(url, params).then((res) => {
        this.popTable.loading = false
        this.popTable.body = res.data.records
        this.popTable.paginationTotal = res.data.total
        this.popTable.pageSize = res.data.size
      })
    },
    popCheck(selection, row) {
      this.$refs['popTableRef'].clearSelection()
      this.$refs['popTableRef'].toggleRowSelection(row, true)
      this.popTransfer = row
      console.log(this.popTransfer)
    },
    popSelect() {
      this.$refs['popTableRef'].clearSelection()
      this.popTransfer = ''
      console.log(this.popTransfer)
    },
    popSizeChange(val) {
      this.popGetTableData(val, 'pageSize')
    },
    popPageChange(val) {
      this.popGetTableData(val, 'page')
    },
    popGetTableData(val, flag) {
      if (flag === 'pageSize') {
        this.popTable.pageSize = val
      } else if (flag === 'page') {
        this.popTable.page = val
      }
      this.onPopRequest()
    }
  }
}
</script>

