<template>
  <div class="app-container">
    <v-pageSearch>
      <el-form :inline="true">
        <el-form-item label="编号：">
          <el-input
            v-model="formSearch.productCode"
            style="width:150px;padding-right:0;"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item label="名称：">
          <el-input
            v-model="formSearch.categoryName"
            style="width:150px;padding-right:0;"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item label="货主：">
          <select-basics
            v-model="formSearch.shipperId"
            style-name="width:150px;padding-right:0;"
            type="supplier"
            clearable
            placeholder="请选择"
          />
        </el-form-item>

        <el-form-item label="类型：">
          <select-basics
            v-model="formSearch.categoryId"
            style-name="width:150px;padding-right:0;"
            type="category"
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
      <el-button @click="onImport">导入</el-button>
    </v-pageToolbar>

    <v-pageTable>
      <el-table v-loading="table.loading" :data="table.body" :max-height="table.autoHeight" :header-cell-style="$store.state.element.headerBg" tooltip-effect="dark" style="width: 100%" @selection-change="selec" >
        <el-table-column type="selection" fixed width="55" />
        <el-table-column prop="productCode" min-width="80" label="产品条码"/>
        <el-table-column prop="productName" min-width="80" label="产品名称"/>
        <el-table-column prop="autoCode" min-width="80" label="自编码"/>
        <el-table-column prop="helpCode" min-width="80" label="助记码"/>
        <el-table-column prop="format" min-width="80" label="规格"/>
        <el-table-column prop="category" min-width="80" label="类别"/>
        <el-table-column prop="measurementId" min-width="80" label="单位"/>
        <el-table-column prop="buy" min-width="80" label="进货价(元)"/>
        <el-table-column prop="trade" min-width="80" label="批发价(元)"/>
        <el-table-column prop="trade" min-width="80" label="零售价(元)"/>
        <el-table-column prop="weight " min-width="80" label="单重"/>
        <el-table-column prop="" min-width="80" label="长宽高(cm)">
          <template slot-scope="scope">
            {{ scope.row.length }}*{{ scope.row.weight }}*{{ scope.row.height }}
          </template>
        </el-table-column>

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

    <el-dialog id="form" :title="popupTitle" :visible.sync="popupState" :close-on-click-modal="false" top="10vh" width="800px" @close="onClose">
      <el-form ref="ruleForm" :model="popupData" :rules="rules" label-width="130px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品名称：" prop="productName" >
              <el-input v-model="popupData.productName" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示名称：" prop="productShow" >
              <el-input v-model="popupData.productShow" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品条码：" prop="productCode" >
              <el-input v-model="popupData.productCode" :disabled="true" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自编码：" prop="autoCode" >
              <el-input v-model="popupData.autoCode" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="货主：" prop="shipperId">
              <select-basics
                v-model="popupData.shipper"
                type="supplier"
                placeholder="请选择"
                filterable
                remote
                obj
                style-name="width:180px;padding-right:0;"
                @change="shipperChange"
              >
                <template slot-scope="item">
                  <span>{{ item.supplierCode }}</span>
                  <span>{{ item.supplierName }}</span>
                  <span>{{ item.linkman }}</span>
                </template>
              </select-basics>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item ref="categoryId" label="类别：" prop="categoryId" >
              <el-select
                v-model="popupData.categoryId"
                placeholder="请选择"
                style="width:180px;padding-right:0;"
              >
                <el-option
                  v-for="item in categoryId_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="规格：" prop="format">
              <el-input v-model="popupData.format" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批发价(元)：" prop="trade" >
              <el-input v-model.number="popupData.trade" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="进货价(元)：" prop="buy">
              <el-input v-model.number="popupData.buy" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="零售价(元)：" prop="retail">
              <el-input v-model.number="popupData.retail" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="长(cm)：" prop="length" >
              <el-input v-model.number="popupData.length" style="width:180px;padding-right:0;" @blur="count"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="宽(cm)：" prop="width" >
              <el-input v-model.number="popupData.width" style="width:180px;padding-right:0;" @blur="count"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="高(cm)：" prop="height" >
              <el-input v-model.number="popupData.height" style="width:180px;padding-right:0;" @blur="count"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="体积：" prop="volume" >
              <el-input v-model="popupData.volume" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="重量(kg)：" prop="weight" >
              <el-input v-model.number="popupData.weight" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="助记码：" prop="helpCode" >
              <el-input v-model="popupData.helpCode" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item ref="measurementId" label="单位：" prop="measurementId" >
              <el-select
                v-model="popupData.measurementId"
                placeholder="请选择"
                style="width:180px;padding-right:0;"
              >
                <el-option
                  v-for="item in measurementId_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期(天)：" prop="validity" >
              <el-input v-model="popupData.validity" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上限值：" prop="upper" >
              <el-input v-model="popupData.upper" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下限值：" prop="lower" >
              <el-input v-model="popupData.lower" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark" >
              <el-input v-model="popupData.remark" style="width:560px;padding-right:0;"/>
            </el-form-item>
          </el-col>

        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="onClose">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="leadState" :close-on-click-modal="false" title="" width="550px" @close="closelead('lead')">
      <el-form ref="lead" :model="leadData" label-width="30px" size="mini">
        <el-form-item label="">
          <label class="ui_button ui_button_primary" for="xFile">选择文件</label>
          <span>{{ leadData.uploadTip }}</span>
          <input id="xFile" ref="getFile" type="file" style="position:absolute;clip:rect(0 0 0 0);" @change="getFile($event)">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="leadData.uploadFlag" type="primary" @click="upload($event)">提交</el-button>
        <el-button @click="closelead('lead')">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Product',
  data() {
    return {
      // 验证规则
      rules: {
        buy: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        categoryId: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        autoCode: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        format: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        height: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        helpCode: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        length: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        lower: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        measurementId: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        productCode: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        productName: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        retail: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        shipper: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        productShow: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        trade: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        upper: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        validity: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        volume: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        weight: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        width: [
          { required: true, message: '请输入', trigger: 'change' }
        ]
      },
      formSearch: {
        productCode: '',
        shipperId: '',
        categoryName: '',
        categoryId: ''
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
        buy: '',
        categoryId: '',
        autoCode: '',
        format: '',
        height: '',
        helpCode: '',
        length: '',
        lower: '',
        measurementId: '',
        productCode: '',
        productId: '',
        productName: '',
        remark: '',
        retail: '',
        shipperId: '',
        productShow: '',
        trade: '',
        upper: '',
        validity: '',
        volume: '',
        weight: '',
        width: '',
        shipper: ''
      },
      categoryId_options: [],
      measurementId_options: [],
      popupState: false,
      Export: {},
      popupTitle: '',
      leadState: false,
      leadData: {
        uploadFlag: false,
        sendFlag: false,
        uploadTip: '',
        dataConfirm: ''
      },
      editLoading: false
    }
  },
  mounted() {
    this.onSearch()
  },
  methods: {
    // 计算体积
    count() {
      const number = this.popupData.width * this.popupData.length * this.popupData.height
      if (!isNaN(number)) {
        this.popupData.volume = number
      } else {
        this.popupData.volume = 0
      }
    },
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
      const url = 'kaili-basic/v1/products'
      const params = {
        productCode: this.formSearch.productCode,
        shipperId: this.formSearch.shipperId,
        categoryName: this.formSearch.categoryName,
        categoryId: this.formSearch.categoryId
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
      this.popupTitle = '新增产品'
      const url = 'kaili-basic/v1/productCodes'
      const params = ''
      this.popupState = true
      this.getRequest(url, params).then((res) => {
        this.popupData.productCode = res.data
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
        this.popupData[key] = row[key]
      }
      const url = `kaili-basic/v1/suppliers/${row.shipperId}/querySupplierSortUnit`
      this.getRequestParams(url, '').then((res) => {
        console.log(res)
        this.categoryId_options = res.data.categoryList.map(item => {
          return { value: item.categoryId, label: item.categoryName }
        })
        this.measurementId_options = res.data.measurementList.map(item => {
          return { value: item.measurementId, label: item.measurementName }
        })
      })

      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    shipperChange(query) {
      this.popupData.shipperId = query.supplierId
      this.categoryId_options = query.categoryList.map(item => {
        return { value: item.categoryId, label: item.categoryName }
      })
      this.measurementId_options = query.measurementList.map(item => {
        return { value: item.measurementId, label: item.measurementName }
      })
      this.popupData.categoryId = ''
      this.popupData.measurementId = ''
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate(['categoryId', 'measurementId'])
      })
    },
    // 表单提交
    onSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.popupWay) {
            const url = 'kaili-basic/v1/products'
            const params = {
              buy: this.popupData.buy,
              categoryId: this.popupData.categoryId,
              autoCode: this.popupData.autoCode,
              format: this.popupData.format,
              height: this.popupData.height,
              helpCode: this.popupData.helpCode,
              length: this.popupData.length,
              lower: this.popupData.lower,
              measurementId: this.popupData.measurementId,
              productCode: this.popupData.productCode,
              productName: this.popupData.productName,
              remark: this.popupData.remark,
              retail: this.popupData.retail,
              shipperId: this.popupData.shipperId,
              productShow: this.popupData.productShow,
              trade: this.popupData.trade,
              upper: this.popupData.upper,
              validity: this.popupData.validity,
              volume: this.popupData.volume,
              weight: this.popupData.weight,
              width: this.popupData.width
            }
            this.postRequest(url, params).then((res) => {
              this.onRequest()
              this.onClose()
            })
          } else {
            const url = 'kaili-basic/v1/products'
            const params = {
              buy: this.popupData.buy,
              categoryId: this.popupData.categoryId,
              autoCode: this.popupData.autoCode,
              format: this.popupData.format,
              height: this.popupData.height,
              helpCode: this.popupData.helpCode,
              length: this.popupData.length,
              lower: this.popupData.lower,
              measurementId: this.popupData.measurementId,
              productCode: this.popupData.productCode,
              productId: this.popupData.productId,
              productName: this.popupData.productName,
              remark: this.popupData.remark,
              retail: this.popupData.retail,
              shipperId: this.popupData.shipperId,
              productShow: this.popupData.productShow,
              trade: this.popupData.trade,
              upper: this.popupData.upper,
              validity: this.popupData.validity,
              volume: this.popupData.volume,
              weight: this.popupData.weight,
              width: this.popupData.width
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
      this.$confirm('确认删除吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.table.loading = true
        const url = `kaili-basic/v1/products/${row.productId}`
        this.deleteRequest(url, '').then((res) => {
          this.onRequest()
          this.$message({
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
    // 导入弹窗
    onImport() {
      this.leadState = true
    },
    // 导入弹窗关闭
    closelead(formName) {
      this.leadState = false
      this.leadData.uploadFlag = true
      this.leadData.sendFlag = true
      this.$refs.getFile.value = ''
      this.leadData.uploadTip = '未选择文件'
    },
    // 选取文件
    getFile(event) {
      this.leadData.file = event.target.files[0]
      this.leadData.uploadTip = this.leadData.file.name
      if (this.leadData.file === undefined) {
        this.leadData.uploadFlag = true
      } else {
        if (this.leadData.file.name.indexOf('xls') !== -1) {
          this.leadData.uploadFlag = false
        } else {
          this.leadData.uploadFlag = true
          this.$message({
            message: '文件类型错误，请重新选取',
            type: 'warning'
          })
        }
      }
    },
    // 导入
    upload(event) {
      const formData = new FormData()
      formData.append('file', this.leadData.file)
      const url = `kaili-basic/v1/products/import`
      this.uploadFileRequest(url, formData).then((data) => {
        this.closelead()
        this.onSearch()
      }

      )
    },

    // ========================
    // 导出
    onExport() {
      const arr = []
      for (const key in this.Export) {
        arr.push(key + '=' + this.Export[key])
      }
      const params = arr.join('&')
      window.location.href = `/api/kaili-basic/v1/products/export?` + params
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
<style  rel="stylesheet/scss" lang="scss" scoped>
  .ui_button {
    display: inline-block;
    line-height: 30px;
    padding: 0 30px;
    color: #FFFFFF;
    font-weight: 700;
    cursor: pointer;
    border-radius: 3px;
}
.ui_button_primary {
    background-color: #FF6600;
}
</style>

