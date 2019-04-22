<template>
  <div class="app-container">
    <v-pageSearch>
      <el-form :inline="true">
        <el-form-item :label="'编号：'">
          <el-input
            v-model="formSearch.wareHouseCode"
            placeholder="请输入"
            style="width:150px;padding-right:0;"
          />
        </el-form-item>

        <el-form-item :label="'名称：'">
          <el-input
            v-model="formSearch.wareHouseName"
            placeholder="请输入"
            style="width:150px;padding-right:0;"
          />
        </el-form-item>

        <el-form-item :label="'部门：'">
          <el-select
            v-model="formSearch.deptId"
            placeholder="请选择"
            style="width:150px;padding-right:0;"
            clearable
          >
            <el-option
              v-for="item in deptId_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="'类型：'">
          <select-dict
            v-model="formSearch.wareHouseType"
            style-name="width:150px;padding-right:0;"
            type="depot"
            placeholder="请选择"
            clearable
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

        <el-table-column prop="wareHouseCode" min-width="80" label="仓库编号"/>
        <el-table-column prop="wareHouseName" min-width="80" label="仓库名称"/>
        <el-table-column prop="leaseTime" min-width="80" label="租赁时间">
          <template slot-scope="scope">
            {{ timeToStr(scope.row.leaseTime,'{y}-{m}-{d}') }}
          </template>
        </el-table-column>
        <el-table-column prop="wareHouseType" min-width="80" label="仓库类型"/>
        <el-table-column prop="deptName" min-width="80" label="所属部门"/>
        <el-table-column prop="statusNum" min-width="80" label="禁用">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.statusNum" @change="changeDisable(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column prop="defaultStoreNum" min-width="80" label="默认">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.defaultStoreNum" @change="changeDefault(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column prop="address" min-width="80" label="地址"/>
        <el-table-column prop="acreage" min-width="80" label="面积"/>
        <el-table-column prop="contactsBy" min-width="80" label="联系人"/>

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
            <el-form-item label="仓库编号：" prop="wareHouseCode" >
              <el-input v-model="popupData.wareHouseCode" :disabled="true" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库名称：" prop="wareHouseName">
              <el-input v-model="popupData.wareHouseName" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="仓库类型：" prop="wareHouseType" >
              <select-dict
                v-model="popupData.wareHouseType"
                type="depot"
                placeholder="请选择"
                clearable
                style-name="width:180px;padding-right:0;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作用：" prop="remark" >
              <el-input v-model="popupData.remark" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属部门：" prop="deptId" >
              <el-select
                v-model="popupData.deptId"
                placeholder="请选择"
                style="width:180px;padding-right:0;"
              >
                <el-option
                  v-for="item in deptId_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="租赁时间：" prop="leaseTime" >
              <el-date-picker
                v-model="popupData.leaseTime"
                type="datetime"
                placeholder="选择日期时间"
                style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="面积：" prop="acreage" >
              <el-input v-model="popupData.acreage" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址：" prop="address" >
              <el-input v-model="popupData.address" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人：" prop="contactsBy" >
              <el-input v-model="popupData.contactsBy" style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话：" prop="phone" >
              <el-input v-model="popupData.phone" style="width:180px;padding-right:0;"/>
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
  name: 'Depot',
  data() {
    return {
      // 验证规则
      rules: {
        acreage: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        contactsBy: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        deptId: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        leaseTime: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        wareHouseCode: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        wareHouseName: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        wareHouseType: [
          { required: true, message: '请输入', trigger: 'change' }
        ]
      },
      formSearch: {
        wareHouseCode: '',
        wareHouseName: '',
        deptId: '',
        wareHouseType: ''
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
        acreage: '',
        address: '',
        contactsBy: '',
        deptId: '',
        leaseTime: '',
        phone: '',
        remark: '',
        wareHouseCode: '',
        wareHouseName: '',
        wareHouseType: ''
      },
      popupState: false,
      popupWay: true,
      deptId_options: [{ value: 1, label: 1 }],
      wareHouseType_options: [],
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
    selec() {},
    // 查询
    onSearch() {
      this.getTableData(1, 'page')
      this.table.currentPage = 1
    },
    // 查询请求
    onRequest() {
      const url = 'kaili-basic/v1/storeHouse'
      const params = {
        wareHouseCode: this.formSearch.wareHouseCode,
        deptId: this.formSearch.deptId,
        wareHouseType: this.formSearch.wareHouseType,
        wareHouseName: this.formSearch.wareHouseName
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
            item.defaultStoreNum = !item.defaultStore
          })
        }
        this.table.paginationTotal = res.data.total
        this.table.pageSize = res.data.size
      })
    },
    // 新增按钮
    onOpen() {
      this.popupWay = true
      this.popupTitle = '新增仓库'
      const url = 'kaili-basic/v1/storeHouse/code'
      const params = ''
      this.popupState = true
      this.popupData.wareHouseCode = ''
      this.getRequest(url, params).then((res) => {
        this.popupData.wareHouseCode = res.data
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
        if (key === 'leaseTime') {
          this.popupData.leaseTime = new Date(row.leaseTime)
        } else if (key === 'wareHouseType') {
          this.wareHouseType_options.map((item) => {
            if (item.label === row.wareHouseType) {
              this.popupData.wareHouseType = item.value
            }
          })
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
            const url = 'kaili-basic/v1/customers/addOrUpdateCustomer'
            const params = {
              customerCode: this.popupData.customerCode,
              customerName: this.popupData.customerName,
              fax: this.popupData.fax,
              mailbox: this.popupData.mailbox,
              phone: this.popupData.phone,
              customerType: this.popupData.customerType,
              remark: this.popupData.remark,
              linkman: this.popupData.linkman,
              address: this.popupData.address,

              customerAdd: this.popupData.wareHouseCode
            }
            this.postRequest(url, params).then((res) => {
              this.onRequest()
              this.onClose()
            })
          } else {
            const url = 'kaili-basic/v1/customers/addOrUpdateCustomer'
            const params = {
              id: this.popupData.id,
              acreage: this.popupData.acreage,
              address: this.popupData.address,
              contactsBy: this.popupData.contactsBy,
              deptId: this.popupData.deptId,
              leaseTime: this.timeToStr(this.popupData.leaseTime.getTime(), '{y}-{m}-{d} {h}:{i}:{s}'),
              phone: this.popupData.phone,
              remark: this.popupData.remark,
              wareHouseCode: this.popupData.wareHouseCode,
              wareHouseName: this.popupData.wareHouseName,
              wareHouseType: this.popupData.wareHouseType
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
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    // 禁用状态修改
    changeDisable(row) {
      const url = 'kaili-basic/v1/storeHouse/status'
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
      const url = 'kaili-basic/v1/storeHouse/default'
      const params = {
        id: row.id,
        status: row.defaultStoreNum ? 0 : 1
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
      window.location.href = `/api/kaili-basic/v1/storeHouse/export?` + params
    },
    // 仓库类型
    getDictionaries() {
      const url = 'kaili-basic/v1/dicts/200/byParentId'
      this.getRequest(url, '').then((res) => {
        this.wareHouseType_options = res.data.map(item => {
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

