
<template>
  <div class="app-container">
    <v-pageSearch>
      <el-form :inline="true">
        <el-form-item :label="'编号：'">
          <el-input
            v-model="formSearch.supplierCode"
            style="width:150px;padding-right:0;"
            placeholder="请输入编号"
          />
        </el-form-item>

        <el-form-item :label="'名称：'">
          <el-input
            v-model="formSearch.supplierName"
            style="width:150px;padding-right:0;"
            placeholder="请输入名称"
          />
        </el-form-item>

        <el-form-item :label="'类型：'">
          <el-select
            v-model="formSearch.supplierSort"
            style="width:150px;padding-right:0;"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in supplierSort_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="'电话：'">
          <el-input
            v-model="formSearch.phone"
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
      <el-button :disabled="!table.body.length > 0" @click="onExport">导出</el-button>
    </v-pageToolbar>

    <v-pageTable>
      <el-table v-loading="table.loading" :data="table.body" :max-height="table.autoHeight" :header-cell-style="$store.state.element.headerBg" tooltip-effect="dark" style="width: 100%" @selection-change="selec" >
        <el-table-column type="selection" fixed width="55"/>
        <el-table-column prop="supplierCode" min-width="80" label="货主编号"/>
        <el-table-column prop="supplierName" min-width="80" label="货主名称"/>
        <el-table-column prop="supplierSortName" min-width="80" label="类型"/>
        <el-table-column prop="phone" min-width="80" label="电话"/>
        <el-table-column prop="fax" min-width="80" label="传真"/>
        <el-table-column prop="mailbox" min-width="80" label="Email"/>
        <el-table-column prop="linkman" min-width="80" label="联系人"/>
        <el-table-column prop="address" min-width="80" label="地址"/>
        <el-table-column prop="createTime" min-width="130" label="创建时间">
          <template slot-scope="scope">
            {{ timeToStr(scope.row.createTime,'{y}-{m}-{d}') }}
          </template>
        </el-table-column>
        <el-table-column prop="description" min-width="80" label="描述"/>

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

    <el-dialog id="form" :title="popupTitle" :visible.sync="popupState" :close-on-click-modal="false" top="20vh" width="800px" @close="onClose">
      <el-form ref="ruleForm" :model="popupData" :rules="rules" label-width="130px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="编号：" prop="supplierCode" >
              <el-input v-model="popupData.supplierCode" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货主名称：" prop="supplierName" >
              <el-input v-model="popupData.supplierName" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="货主类型：" prop="supplierSort" >
              <el-select
                v-model="popupData.supplierSort"
                placeholder="请选择"
                style="width:180px;padding-right:0;"
              >
                <el-option
                  v-for="item in supplierSort_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话：" prop="phone" >
              <el-input v-model="popupData.phone" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="传真：" prop="fax" >
              <el-input v-model="popupData.fax" style="width:180px;padding-right:0;"/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱：" prop="mailbox" >
              <el-input v-model="popupData.mailbox" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人：" prop="linkman" >
              <el-input v-model="popupData.linkman" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址：" prop="address" >
              <el-input v-model="popupData.address" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述：" prop="description" >
              <el-input v-model="popupData.description" style="width:560px;padding-right:0;" />
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
  name: 'Supplier',
  data() {
    return {
      // 验证规则
      rules: {
        address: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        fax: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        linkman: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        mailbox: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        supplierCode: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        supplierName: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        supplierSort: [
          { required: true, message: '请输入', trigger: 'change' }
        ]
      },
      formSearch: {
        phone: '',
        supplierCode: '',
        supplierName: '',
        supplierSort: ''
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
        supplierId: '',
        address: '',
        description: '',
        fax: '',
        linkman: '',
        mailbox: '',
        phone: '',
        supplierCode: '',
        supplierName: '',
        supplierSort: ''
      },
      popupState: false,
      popupWay: true,
      supplierSort_options: [{ value: 1, label: '虚拟货主' }, { value: 2, label: '合作货主' }],
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
      const url = 'kaili-basic/v1/suppliers/querySupplier'
      const params = {
        phone: this.formSearch.phone,
        supplierCode: this.formSearch.supplierCode,
        supplierName: this.formSearch.supplierName,
        supplierSort: this.formSearch.supplierSort
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
      this.popupTitle = '新增货主'
      this.popupState = true
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
            const url = 'kaili-basic/v1/suppliers/addSupplier'
            const params = {
              address: this.popupData.address,
              description: this.popupData.description,
              fax: this.popupData.fax,
              linkman: this.popupData.linkman,
              mailbox: this.popupData.mailbox,
              phone: this.popupData.phone,
              supplierCode: this.popupData.supplierCode,
              supplierName: this.popupData.supplierName,
              supplierSort: this.popupData.supplierSort
            }
            this.postRequest(url, params).then((res) => {
              this.onRequest()
              this.onClose()
            })
          } else {
            const url = 'kaili-basic/v1/suppliers/updateSupplier'
            const params = {
              supplierId: this.popupData.supplierId,
              address: this.popupData.address,
              description: this.popupData.description,
              fax: this.popupData.fax,
              linkman: this.popupData.linkman,
              mailbox: this.popupData.mailbox,
              phone: this.popupData.phone,
              supplierCode: this.popupData.supplierCode,
              supplierName: this.popupData.supplierName,
              supplierSort: this.popupData.supplierSort
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
        const url = `kaili-basic/v1/suppliers/${row.supplierId}/deleteSuppliers`
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
      window.location.href = `/api/kaili-basic/v1/suppliers/export?` + params
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

