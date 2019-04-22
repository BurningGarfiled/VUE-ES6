<template>
  <div class="app-container">
    <v-pageSearch>
      <el-form :inline="true">
        <el-form-item :label="'编号'">
          <el-input
            v-model="formSearch.measurementCode"
            style="width:150px;padding-right:0;"
            placeholder="请输入编号"
          />
        </el-form-item>

        <el-form-item :label="'名称'">
          <el-input
            v-model="formSearch.measurementName"
            style="width:150px;padding-right:0;"
            placeholder="请输入名称"
          />
        </el-form-item>

        <el-form-item label="货主：" >
          <select-basics
            v-model="formSearch.shipperId"
            style-name="width:150px;padding-right:0;"
            type="supplier"
            placeholder="请选择"
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
      <el-button :disabled="!table.body.length > 0" @click="onExport">导出</el-button>
    </v-pageToolbar>
    <v-pageTable>
      <el-table v-loading="table.loading" :data="table.body" :max-height="table.autoHeight" :header-cell-style="$store.state.element.headerBg" tooltip-effect="dark" style="width: 100%" @selection-change="selec" >
        <el-table-column type="selection" fixed width="55"/>
        <el-table-column prop="measurementCode" min-width="80" label="单位编号"/>
        <el-table-column prop="measurementName" min-width="80" label="单位名称"/>
        <el-table-column prop="shipperName" min-width="80" label="货主"/>

        <el-table-column :label="'操作'" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button :title="'编辑'" type="primary" size="mini" icon="el-icon-edit" @click="onCompile(scope.row)"/>
            <el-button :title="'删除'" type="primary" size="mini" icon="el-icon-delete" @click="onDelete(scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
      <template slot="pagination" slot-scope="props">
        <el-pagination :layout="props.layout" :page-sizes="props.sizes" :total="table.paginationTotal" :current-page.sync="table.currentPage" background @current-change="pageChange" @size-change="sizeChange" />
      </template>

    </v-pageTable>

    <el-dialog id="form" :title="popupTitle" :visible.sync="popupState" :close-on-click-modal="false" top="20vh" width="400px" @close="onClose">
      <el-form ref="ruleForm" :model="popupData" :rules="rules" label-width="140px" label-position="right">
        <el-row>
          <el-col :span="24">
            <el-form-item label="单位编号：" prop="measurementCode" >
              <el-input v-model="popupData.measurementCode" :disabled="true" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="单位名称：" prop="measurementName" >
              <el-input v-model="popupData.measurementName" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="货主：" prop="shipperId" >
              <select-basics
                v-model="popupData.shipperId"
                type="supplier"
                placeholder="请选择"
                style-name="width:180px;padding-right:0;"
              />
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
  name: 'Unit',
  data() {
    return {
      // 验证规则
      rules: {
        measurementCode: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        measurementName: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        shipperId: [
          { required: true, message: '请输入', trigger: 'change' }
        ]
      },
      formSearch: {
        measurementCode: '',
        measurementName: '',
        shipperId: ''
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
        measurementCode: '',
        measurementName: '',
        shipperId: '',
        measurementId: ''
      },
      popupState: false,
      measurementCode: '',
      shipperId_options: [{ value: 1, label: 1 }],
      Export: {},
      popupTitle: '',
      popupWay: true
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
      const url = 'kaili-basic/v1/measurements'
      const params = {
        measurementCode: this.formSearch.measurementCode,
        measurementName: this.formSearch.measurementName,
        shipperId: this.formSearch.shipperId

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
      this.popupTitle = '新增单位'
      const url = 'kaili-basic/v1/measurementCodes'
      const params = ''
      this.popupState = true
      this.popupData.measurementCode = ''
      this.getRequest(url, params).then((res) => {
        this.popupData.measurementCode = res.data
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
            const url = 'kaili-basic/v1/measurements'
            const params = {
              measurementName: this.popupData.measurementName,
              shipperId: this.popupData.shipperId,
              measurementCode: this.popupData.measurementCode
            }
            this.postRequest(url, params).then((res) => {
              this.onRequest()
              this.onClose()
            })
          } else {
            const url = 'kaili-basic/v1/measurements'
            const params = {
              measurementId: this.popupData.measurementId,
              measurementName: this.popupData.measurementName,
              shipperId: this.popupData.shipperId,
              measurementCode: this.popupData.measurementCode
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
        const url = `kaili-basic/v1/measurements/${row.measurementId}`
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
    // 导出
    onExport() {
      const arr = []
      for (const key in this.Export) {
        arr.push(key + '=' + this.Export[key])
      }
      const params = arr.join('&')
      window.location.href = `/api/kaili-basic/v1/measurements/export?` + params
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

