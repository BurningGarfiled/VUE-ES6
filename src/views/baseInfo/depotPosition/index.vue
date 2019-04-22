<template>
  <div class="app-container">
    <v-pageSearch>
      <el-form :inline="true">
        <el-form-item label="编号：">
          <el-input
            v-model="formSearch.storeLocationCode"
            style="width:150px;padding-right:0;"
            placeholder="请输入编号"
          />
        </el-form-item>

        <el-form-item label="名称：">
          <el-input
            v-model="formSearch.storeLocationName"
            style="width:150px;padding-right:0;"
            placeholder="请输入名称"
          />
        </el-form-item>

        <el-form-item label="仓库：">
          <select-basics
            v-model="formSearch.storeId"
            style-name="width:150px;padding-right:0;"
            type="store"
            clearable
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
        <el-table-column type="selection" fixed width="55" />
        <el-table-column prop="storeLocationCode" min-width="80" label="库位编号"/>
        <el-table-column prop="storeLocationName" min-width="80" label="库位名称"/>
        <el-table-column prop="storeLocationType" min-width="80" label="库位类型"/>
        <el-table-column prop="statusNum" min-width="80" label="禁用">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.statusNum" @change="changeDisable(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column prop="defaultLocationNum" min-width="80" label="默认">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.defaultLocationNum" @change="changeDefault(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" min-width="80" label="创建时间">
          <template slot-scope="scope">
            {{ timeToStr(scope.row.createTime,'{y}-{m}-{d}') }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" min-width="80" label="备注"/>

        <el-table-column :label="'操作'" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button :title="'编辑'" type="primary" size="mini" icon="el-icon-edit" @click="onCompile(scope.row)"/>
            <el-button :title="'删除'" type="primary" size="mini" icon="el-icon-delete" @click="onDelete(scope.row)"/>
        </template></el-table-column>
      </el-table>

      <template
        slot="pagination"
        slot-scope="props"
      >
        <el-pagination
          :layout="props.layout"
          :page-sizes="props.sizes"
          :current-page.sync="table.currentPage"
          :total="table.paginationTotal"
          background
          @current-change="pageChange"
          @size-change="sizeChange"
        />
      </template>

    </v-pageTable>

    <el-dialog id="form" :title="popupTitle" :visible.sync="popupState" :close-on-click-modal="false" top="20vh" width="800px" @close="onClose">
      <el-form ref="ruleForm" :model="popupData" :rules="rules" label-width="130px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="库位编号：" prop="storeLocationCode" >
              <el-input v-model="popupData.storeLocationCode" :disabled="true" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库位名称：" prop="storeLocationName" >
              <el-input v-model="popupData.storeLocationName" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="库位类型：" prop="storeLocationType" >
              <select-dict
                v-model="popupData.storeLocationType"
                placeholder="请选择"
                type="storage"
                style-name="width:180px;padding-right:0;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库：" prop="storeId" >
              <select-basics
                v-model="popupData.storeId"
                type="store"
                style-name="width:180px;padding-right:0;"
                clearable
                placeholder="请选择"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否默认：" prop="defaultLocation" >
              <el-checkbox v-model="popupData.defaultLocation">默认</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否禁用：" prop="status" >
              <el-checkbox v-model="popupData.status">禁用</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark" >
              <el-input v-model="popupData.remark" class="enter" style="width:550px;padding-right:0;"/>
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
  name: 'DepotPosition',
  data() {
    return {
      // 验证规则
      rules: {
        defaultLocation: [
          { required: false, message: '请输入', trigger: 'change' }
        ],
        status: [
          { required: false, message: '请输入', trigger: 'change' }
        ],
        storeId: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        storeLocationCode: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        storeLocationName: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        storeLocationType: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入', trigger: 'change' }
        ]

      },
      formSearch: {
        storeLocationCode: '',
        storeId: '',
        storeLocationName: ''
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
        id: '',
        defaultLocation: false,
        remark: '',
        status: false,
        storeId: '',
        storeLocationCode: '',
        storeLocationName: '',
        storeLocationType: ''
      },
      storeLocationType_options: [],
      popupState: false,
      Export: {},
      popupTitle: ''
    }
  },
  mounted() {
    this.getDictionaries()
    this.onSearch()
  },
  methods: {
    // 勾选
    selec() {

    },
    // 查询
    onSearch() {
      this.getTableData(1, 'page')
      this.table.currentPage = 1
    },
    // 查询请求
    onRequest() {
      const url = 'kaili-basic/v1/storeLocation'
      const params = {
        storeLocationCode: this.formSearch.storeLocationCode,
        storeId: this.formSearch.storeId,
        storeLocationName: this.formSearch.storeLocationName
      }
      this.Export = Object.assign({}, params)
      params.page = this.table.page
      params.pageSize = this.table.pageSize
      this.table.loading = true
      this.getRequestParams(url, params).then((res) => {
        this.table.loading = false
        this.table.body = res.data.records
        if (this.table.body.length > 0) {
          this.table.body.forEach(item => {
            item.statusNum = !item.status
            item.defaultLocationNum = !item.defaultLocation
          })
        }
        this.table.paginationTotal = res.data.total
        this.table.pageSize = res.data.size
      })
    },
    // 新增按钮
    onOpen() {
      this.popupWay = true
      this.popupTitle = '新增库位'
      this.popupState = true
      this.popupData.defaultLocation = false
      this.popupData.status = false
      const url = 'kaili-basic/v1/storeLocation/code'
      const params = ''
      this.getRequest(url, params).then((res) => {
        this.popupData.storeLocationCode = res.data
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      })
    },
    // 编辑
    onCompile(row) {
      this.popupWay = false
      this.popupTitle = '编辑'
      this.popupState = true
      for (const key in row) {
        if (key === 'defaultLocation') {
          this.popupData[key] = !row[key]
        } else if (key === 'status') {
          this.popupData[key] = !row[key]
        } else if (key === 'storeLocationType') {
          this.storeLocationType_options.forEach((item) => {
            if (item.label === row.storeLocationType) {
              this.popupData.storeLocationType = item.value
            }
          })
        } else {
          this.popupData[key] = row[key]
        }
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
            const url = 'kaili-basic/v1/storeLocation'
            const params = {
              defaultLocation: this.popupData.defaultLocation ? 0 : 1,
              remark: this.popupData.remark,
              status: this.popupData.status ? 0 : 1,
              storeId: this.popupData.storeId,
              storeLocationCode: this.popupData.storeLocationCode,
              storeLocationName: this.popupData.storeLocationName,
              storeLocationType: this.popupData.storeLocationType
            }
            this.postRequest(url, params).then((res) => {
              this.onRequest()
              this.onClose()
            })
          } else {
            const url = 'kaili-basic/v1/storeLocation'
            const params = {
              id: this.popupData.id,
              defaultLocation: this.popupData.defaultLocation ? 0 : 1,
              remark: this.popupData.remark,
              status: this.popupData.status ? 0 : 1,
              storeId: this.popupData.storeId,
              storeLocationCode: this.popupData.storeLocationCode,
              storeLocationName: this.popupData.storeLocationName,
              storeLocationType: this.popupData.storeLocationType
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
        const url = `kaili-basic/v1/storeLocation/${row.id}`
        this.deleteRequest(url, '').then((res) => {
          this_.onRequest()
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
      for (const key in this.popupData) {
        this.popupData[key] = ''
      }
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    // 禁用状态修改
    changeDisable(row) {
      const url = 'kaili-basic/v1/storeLocation/status'
      const params = {
        id: row.id,
        status: row.statusNum ? 0 : 1
      }
      this.putRequest(url, params).then((res) => {
        this.onRequest()
      })
    },
    // 默认状态修改
    changeDefault(row) {
      const url = 'kaili-basic/v1/storeLocation/default'
      const params = {
        id: row.id,
        status: row.defaultLocationNum ? 0 : 1
      }
      this.putRequest(url, params).then((res) => {
        this.onRequest()
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
      window.location.href = `/api/kaili-basic/v1/storeLocation/export?` + params
    },

    // 库位类型
    getDictionaries() {
      const url = 'kaili-basic/v1/dicts/210/byParentId'
      this.getRequest(url, '').then((res) => {
        this.storeLocationType_options = res.data.map(item => {
          return { value: item.dictId, label: item.dictName }
        })
      })
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

