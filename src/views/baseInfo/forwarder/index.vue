<template>
  <div class="app-container">
    <v-pageSearch>
      <el-form :inline="true">

        <el-form-item label="名称：">
          <el-input
            v-model="formSearch.carrierName"
            style="width:150px;padding-right:0;"
            placeholder="请输入名称"
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
      <el-button type="primary" icon="el-icon-tickets" @click="onOpen">新增</el-button>
    </v-pageToolbar>
    <v-pageTable>
      <el-table v-loading="table.loading" :data="table.body" :max-height="table.autoHeight" :header-cell-style="$store.state.element.headerBg" tooltip-effect="dark" style="width: 100%" @selection-change="selec" >
        <el-table-column type="selection" fixed width="55"/>
        <el-table-column prop="carrierCode" min-width="80" label="承运商编号"/>
        <el-table-column prop="carrierName" min-width="80" label="承运商名称"/>
        <el-table-column prop="remark" min-width="80" label="备注"/>

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

    <el-dialog id="form" :title="popupTitle" :visible.sync="popupState" :close-on-click-modal="false" top="20vh" width="400px" @close="onClose">
      <el-form ref="ruleForm" :model="popupData" :rules="rules" label-width="140px" label-position="right">
        <el-row>
          <el-col :span="24">
            <el-form-item label="承运商编号：" prop="carrierCode">
              <el-input v-model="popupData.carrierCode" :disabled="true" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="承运商名称：" prop="carrierName">
              <el-input v-model="popupData.carrierName" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

          <el-col :span="24">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="popupData.remark" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
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
  name: 'Forwarder',
  data() {
    return {
      // 验证规则
      rules: {
        carrierCode: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        carrierName: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入', trigger: 'change' }
        ]
      },
      formSearch: {
        carrierName: ''
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
        carrierId: '',
        carrierCode: '',
        carrierName: '',
        remark: ''
      },
      popupState: false,
      Export: {},
      popupTitle: ''
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
      const url = 'kaili-basic/v1/carriers'
      const params = {
        carrierName: this.formSearch.carrierName
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
      this.popupTitle = '新增承运商'
      const url = 'kaili-basic/v1/carrierCodes'
      const params = ''
      this.popupState = true
      this.popupData.carrierCode = ''
      this.getRequest(url, params).then((res) => {
        this.popupData.carrierCode = res.data
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      }
      )
    },
    // 编辑
    onCompile(row) {
      this.popupWay = false
      this.popupState = true
      this.popupTitle = '编辑'

      for (const key in row) {
        this.popupData[key] = row[key]
      }
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    // 表单提交
    onSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.popupWay) {
            const url = 'kaili-basic/v1/carriers'
            const params = {
              carrierCode: this.popupData.carrierCode,
              carrierName: this.popupData.carrierName,
              remark: this.popupData.remark
            }
            this.postRequest(url, params).then((res) => {
              this.onRequest()
              this.onClose()
            })
          } else {
            const url = 'kaili-basic/v1/carriers'
            const params = {
              carrierCode: this.popupData.carrierCode,
              carrierId: this.popupData.carrierId,
              carrierName: this.popupData.carrierName,
              remark: this.popupData.remark
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
        const url = `kaili-basic/v1/carriers/${row.carrierId}`
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
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    // ========================

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

