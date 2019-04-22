<template>
  <div class="app-container">
    <v-pageSearch>
      <el-form :inline="true">
        <el-form-item :label="'编号：'">
          <el-input
            v-model="formSearch.customerCode"
            style="width:150px;padding-right:0;"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item :label="'名称：'">
          <el-input
            v-model="formSearch.customerName"
            style="width:150px;padding-right:0;"
            placeholder="请输入名称"
          />
        </el-form-item>

        <el-form-item :label="'电话：'">
          <el-input
            v-model="formSearch.phone"
            style="width:150px;padding-right:0;"
            placeholder="请输入名称"
          />
        </el-form-item>

        <el-form-item :label="'客户类型：'">
          <el-select
            v-model="formSearch.customerType"
            style="width:150px;padding-right:0;"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in customerType_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="onSearch"
        >查询</el-button>
      </el-form>

    </v-pageSearch>
    <v-pageToolbar align="left">
      <el-button type="primary" icon="el-icon-tickets" @click="onOpen">新增</el-button>
      <el-button :disabled="!table.body.length > 0" @click="onExport">导出</el-button>
    </v-pageToolbar>

    <v-pageTable>
      <el-table v-loading="table.loading" :data="table.body" :max-height="table.autoHeight" :header-cell-style="$store.state.element.headerBg" tooltip-effect="dark" style="width: 100%" @selection-change="selec" >
        <el-table-column type="selection" fixed width="55"/>
        <el-table-column prop="customerCode" min-width="80" label="客户编号"/>
        <el-table-column prop="customerName" min-width="80" label="客户名称"/>
        <el-table-column prop="supplierName" min-width="80" label="货主"/>
        <el-table-column prop="address" min-width="80" label="地址"/>
        <el-table-column prop="linkman" min-width="80" label="联系人"/>
        <el-table-column prop="phone" min-width="80" label="电话"/>
        <el-table-column prop="remark" min-width="80" label="备注"/>
        <el-table-column prop="mailbox" min-width="80" label="邮箱"/>
        <el-table-column prop="fax" min-width="80" label="传真"/>
        <el-table-column prop="createTime" min-width="80" label="创建时间">
          <template slot-scope="scope">
            {{ timeToStr(scope.row.createTime,'{y}-{m}-{d}') }}
          </template>
        </el-table-column>
        <el-table-column :label="'操作'" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button :title="'编辑'" type="primary" size="mini" icon="el-icon-edit" @click="onCompile(scope.row)"/>
            <el-button :title="'删除'" type="primary" size="mini" icon="el-icon-delete" @click="onDelete(scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
      <template slot="pagination" slot-scope="props">
        <el-pagination :layout="props.layout" :page-sizes="props.sizes" :current-page.sync="table.currentPage" :total="table.paginationTotal" background @current-change="pageChange" @size-change="sizeChange" />
      </template>
    </v-pageTable>

    <el-dialog id="form" :title="popupTitle" :visible.sync="popupState" :close-on-click-modal="false" :modal="false" top="10vh" width="1000px">
      <el-form ref="ruleForm" :model="popupData" :rules="rules" label-width="130px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="编号：" prop="customerCode" >
              <el-input v-model="popupData.customerCode" style="width:180px;padding-right:0;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="名称：" prop="customerName" >
              <el-input v-model="popupData.customerName" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="传真：" prop="fax" >
              <el-input v-model="popupData.fax" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="邮箱：" prop="mailbox" >
              <el-input v-model="popupData.mailbox" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话：" prop="phone" >
              <el-input v-model="popupData.phone" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货主：" prop="supplierId" >
              <select-basics
                v-model="popupData.supplierId"
                type="supplier"
                style-name="width:180px;padding-right:0;"
                placeholder="请选择"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark" >
              <el-input v-model="popupData.remark" class="enter" style="width:820px;padding-right:0;"/>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-table v-loading="popTable.loading" :data="popTable.body" :max-height="popTable.autoHeight" :header-cell-style="$store.state.element.headerBg" tooltip-effect="dark" style="width: 100%" @selection-change="selec" >
            <el-table-column label="" min-width="30">
              <template slot-scope="scope">
                <el-button :icon="dialog_icon(scope)" type="primary" style="height:26px;width:26px;padding:4px;" circle @click="dialogClick(scope)"/>
              </template>
            </el-table-column>

            <el-table-column prop="linkman" min-width="150" label="联系人" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.linkman" />
              </template>
            </el-table-column>

            <el-table-column prop="address" min-width="150" label="地址" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.address" />
              </template>
            </el-table-column>

            <el-table-column prop="phone" min-width="150" label="电话" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.phone" />
              </template>
            </el-table-column>

            <el-table-column prop="remark" min-width="150" label="备注" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" />
              </template>
            </el-table-column>

          </el-table>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="onClose">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Customer',
  data() {
    return {
      // 验证规则
      rules: {
        customerCode: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        customerName: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        fax: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        mailbox: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        supplierId: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入', trigger: 'change' }
        ]
      },
      formSearch: {
        customerCode: '',
        customerName: '',
        phone: '',
        customerType: ''
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
      popTable: {
        body: [{
          linkman: '',
          address: '',
          phone: '',
          remark: ''
        }],
        page: 1,
        pageSize: 15,
        paginationTotal: 0,
        autoHeight: 300,
        loading: false,
        currentPage: 1
      },
      popupData: {
        customerId: '',
        customerCode: '',
        customerName: '',
        fax: '',
        mailbox: '',
        phone: '',
        supplierId: '',
        remark: ''
      },
      popupState: false,
      customerType_options: [{ value: 1, label: '客户' }, { value: 2, label: '货主' }],
      Export: {},
      popupTitle: '',
      popData: {
        linkman: '',
        address: '',
        phone: '',
        remark: ''
      },
      popState: false,
      popTitle: ''
    }
  },
  mounted() {
    this.onSearch()
  },
  methods: {
    // 勾选
    selec() {},
    // 查询
    onSearch() {
      this.getTableData(1, 'page')
      this.table.currentPage = 1
    },
    // 查询请求
    onRequest() {
      const url = 'kaili-basic/v1/customers/queryCustomer'
      const params = {
        customerCode: this.formSearch.customerCode,
        customerName: this.formSearch.customerName,
        phone: this.formSearch.phone,
        customerType: this.formSearch.customerType
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

    // 新增按钮
    onOpen() {
      this.popupWay = true
      this.popupTitle = '新增客户'
      this.popupState = true
      this.popTable.body = [{
        linkman: '',
        address: '',
        phone: '',
        remark: ''
      }]
    },
    // 编辑
    onCompile(row) {
      this.popupWay = false
      this.popupState = true
      this.popupTitle = '编辑'
      const url = `kaili-basic/v1/customers/${row.customerId}/queryCustomerById`
      this.getRequestParams(url, '').then((res) => {
        for (const i in res.data) {
          this.popupData[i] = res.data[i]
        }
        this.popTable.body = res.data.customerAddressList
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      })
    },
    // 弹窗  添加删除 按钮
    dialogClick(scope) {
      if (scope.$index === 0) {
        this.popTable.body.push({
          linkman: '',
          address: '',
          phone: '',
          remark: ''
        })
      } else {
        const this_ = this
        this.$confirm('确认删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          if (scope.row === this.popTable.body[scope.$index]) {
            this.popTable.body.splice(scope.$index, 1)
          } else {
            const inx = this.popTable.body.indexOf(scope.row)
            this.popTable.body.splice(inx, 1)
          }
          this_.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      }
    },

    // 表单提交
    onSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.popupWay) {
            const url = 'kaili-basic/v1/customers/addCustomer'
            const params = {
              customerCode: this.popupData.customerCode,
              customerName: this.popupData.customerName,
              fax: this.popupData.fax,
              mailbox: this.popupData.mailbox,
              phone: this.popupData.phone,
              supplierId: this.popupData.supplierId,
              remark: this.popupData.remark

            }
            if (this.popTable.body.length > 0) {
              params.customerAddressList = this.popTable.body
            }
            this.postRequest(url, params).then((res) => {
              this.onRequest()
              this.onClose()
            })
          } else {
            const url = 'kaili-basic/v1/customers/updateCustomer'
            const params = {
              customerId: this.popupData.customerId,
              customerCode: this.popupData.customerCode,
              customerName: this.popupData.customerName,
              fax: this.popupData.fax,
              mailbox: this.popupData.mailbox,
              phone: this.popupData.phone,
              supplierId: this.popupData.supplierId,
              remark: this.popupData.remark
            }
            if (this.popTable.body.length > 0) {
              params.customerAddressList = this.popTable.body
            }
            this.putRequest(url, params).then((res) => {
              this.onRequest()
              this.onClose()
            })
          }
        }
      })
    },

    // 刪除
    onDelete(row) {
      const this_ = this
      this.$confirm('确认删除吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this_.table.loading = true
        const url = `kaili-basic/v1/storeHouse/${row.id}`
        this.deleteRequest(url, '').then((res) => {
          this_.onRequest()
          this_.table.loading = false
          this_.$message({
            message: '删除成功',
            type: 'success'
          })
        })
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
    dialog_icon(scope) {
      const index = scope.$index
      if (index === 0) {
        return 'el-icon-plus'
      } else {
        return 'el-icon-minus'
      }
    },

    // ========================
    // 导出
    onExport() {
      const arr = []
      for (const key in this.Export) {
        arr.push(key + '=' + this.Export[key])
      }
      const params = arr.join('&')
      window.location.href = `/api/kaili-basic/v1/customers/export?` + params
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
    }
  }
}
</script>

