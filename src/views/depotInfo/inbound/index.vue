<template>
  <div class="app-container">
    <v-pageSearch>
      <el-form :inline="true">
        <el-row>
          <el-form-item label="入库单号：">
            <el-input
              v-model="formSearch.orderNo"
              style="width:150px;padding-right:0;"
              placeholder="请输入"
            />
          </el-form-item>

          <el-form-item label="单据类型：">
            <select-dict
              v-model="formSearch.inStoreType"
              style-name="width:150px;padding-right:0;"
              type="depot"
              placeholder="请选择"
              clearable
            />
          </el-form-item>
          <el-form-item label="关联单号：">
            <el-input
              v-model="formSearch.linkOrderNo"
              style="width:130px;padding-right:0;"
              placeholder="请输入"
            />
          </el-form-item>

          <el-form-item label="仓库：">
            <select-basics
              v-model="formSearch.storeId"
              style-name="width:130px;padding-right:0;"
              type="store"
              clearable
              placeholder="请选择"
            />
          </el-form-item>

        </el-row>
        <el-row>
          <el-form-item label="货主编号：">
            <el-input
              v-model="formSearch.supplierCode"
              style="width:150px;padding-right:0;"
              placeholder="请输入"
            />
          </el-form-item>

          <el-form-item label="货主名称：">
            <el-input
              v-model="formSearch.supplierName"
              style="width:150px;padding-right:0;"
              placeholder="请输入"
            />
          </el-form-item>

          <el-form-item :label="'起始时间：'">
            <el-date-picker
              v-model="formSearch.time"
              type="datetimerange"
              range-separator="至"
              style="width:330px;padding-right:0;"
              start-placeholder="开始日期"
              end-placeholder="结束日期"/>
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        </el-row>

      </el-form>

    </v-pageSearch>
    <v-pageToolbar align="left">
      <el-button type="primary" icon="el-icon-tickets" @click="onOpen">新增</el-button>
      <el-button :disabled="!table.body.length > 0" @click="onExport">导出</el-button>
    </v-pageToolbar>

    <v-pageTable>
      <el-table v-loading="table.loading" :data="table.body" :max-height="table.autoHeight" :header-cell-style="$store.state.element.headerBg" :load="load" lazy row-key="id" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="orderNo" min-width="120" label="订单号"/>
        <el-table-column prop="productName" min-width="120" label="产品名称"/>
        <el-table-column prop="productCode" min-width="120" label="产品编号"/>
        <el-table-column prop="batch" min-width="150" label="批次"/>
        <el-table-column prop="format" min-width="120" label="规格"/>
        <el-table-column prop="deadTime" min-width="150" label="过期时间">
          <template slot-scope="scope">
            {{ scope.row.deadTime?timeToStr(scope.row.deadTime,'{y}-{m}-{d}'):'-' }}
          </template>
        </el-table-column>
        <el-table-column prop="amount" min-width="120" label="数量"/>
        <el-table-column prop="volume" min-width="120" label="体积"/>
        <el-table-column prop="weight" min-width="120" label="重量"/>
        <el-table-column prop="storeName" min-width="120" label="仓库"/>
        <el-table-column prop="locationName" min-width="120" label="库位"/>
        <el-table-column prop="inStoreTypeName" min-width="120" label="入库类型"/>
        <el-table-column prop="fax" min-width="120" label="货主"/>
        <el-table-column prop="createName" min-width="120" label="制单人"/>
        <el-table-column prop="createTime" min-width="150" label="制单时间">
          <template slot-scope="scope">
            {{ timeToStr(scope.row.createTime,'{y}-{m}-{d}') }}
          </template>
        </el-table-column>
        <el-table-column prop="isAuduit" min-width="120" label="状态">
          <template slot-scope="scope">
            {{ scope.row.isAuduit|auduit }}
          </template>
        </el-table-column>
        <el-table-column prop="auditName" min-width="120" label="审核人"/>
        <el-table-column prop="auditTime" min-width="150" label="审核时间">
          <template slot-scope="scope">
            {{ scope.row.auditTime?timeToStr(scope.row.auditTime,'{y}-{m}-{d}'):null }}
          </template>
        </el-table-column>

        <el-table-column :label="'操作'" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button v-if="scope.row.hasChildren" :title="'编辑'" type="primary" size="mini" icon="el-icon-edit" @click="onCompile(scope.row)"/>
            <el-button v-if="scope.row.hasChildren" :title="'删除'" type="primary" size="mini" icon="el-icon-delete" @click="onDelete(scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
      <template slot="pagination" slot-scope="props">
        <el-pagination :layout="props.layout" :page-sizes="props.sizes" :current-page.sync="table.currentPage" :total="table.paginationTotal" background @current-change="pageChange" @size-change="sizeChange" />
      </template>
    </v-pageTable>

    <el-dialog id="form" :title="popupTitle" :visible.sync="popupState" :close-on-click-modal="false" :modal="false" top="10vh" width="1300px">
      <el-form ref="ruleForm" :model="popupData" :rules="rules" label-width="130px">
        <el-row>
          <el-col :span="6">

            <el-form-item label="入库单编号：" prop="orderNo" >
              <el-input v-model="popupData.orderNo" disabled style="width:180px;padding-right:0;" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入库单类型：" prop="inStoreType" >
              <select-dict v-model="popupData.inStoreType" style-name="width:180px;padding-right:0;" type="inStore" clearable placeholder="请选择"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="仓库：" prop="storeId" >
              <select-basics v-model="popupData.storeId" style-name="width:180px;padding-right:0;" type="store" clearable placeholder="请选择"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="制单人：" prop="createBy" >
              <el-input v-model="popupData.createBy" style="width:180px;padding-right:0;"/>
            </el-form-item>
        </el-col></el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="货主：" prop="supplier">
              <select-basics
                v-model="popupData.supplier"
                :def-opt="defOpt.supplier"
                type="supplier"
                placeholder="请选择"
                def
                filterable
                remote
                obj
                style-name="width:180px;padding-right:0;"
                clearable
                @change="supplierChange"
              >
                <template slot-scope="item">
                  <span>{{ item.supplierCode }}</span>
                  <span>{{ item.supplierName }}</span>
                  <span>{{ item.linkman }}</span>
                </template>
              </select-basics>

            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="联系人：" prop="linkman" >
              <el-input v-model="popupData.linkman" disabled style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系方式：" prop="phone" >
              <el-input v-model="popupData.phone" disabled style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="地址：" prop="address" >
              <el-input v-model="popupData.address" disabled style="width:180px;padding-right:0;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="制单时间：" prop="time" >
              <el-date-picker
                v-model="popupData.createTime"
                type="datetime"
                placeholder="选择日期时间"
                readonly
                style="width:180px;padding-right:0;"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="预到时间：" prop="preArrviceTime" >
              <el-date-picker
                v-model="popupData.preArrviceTime"
                type="datetime"
                placeholder="选择日期时间"
                style="width:180px;padding-right:0;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收货时间：" prop="receivingTime" >
              <el-date-picker
                v-model="popupData.receivingTime"
                type="datetime"
                placeholder="选择日期时间"
                style="width:180px;padding-right:0;"
              />
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark" >
              <el-input v-model="popupData.remark" class="enter" style="width:1120px;padding-right:0;"/>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-button type="primary" icon="el-icon-tickets" @click="popOpen">新增</el-button>
        </el-row>
        <el-row>
          <el-table v-loading="popTable.loading" :data="popTable.body" :max-height="popTable.autoHeight" :header-cell-style="$store.state.element.headerBg" tooltip-effect="dark" style="width: 100%" >
            <el-table-column prop="productId" min-width="150" label="产品编号" show-overflow-tooltip/>
            <el-table-column prop="productName" min-width="150" label="产品名称" show-overflow-tooltip/>
            <el-table-column prop="format" min-width="130" label="规格" show-overflow-tooltip/>
            <el-table-column prop="batch" min-width="150" label="批次" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.batch?timeToStr(scope.row.batch,'{y}-{m}-{d}'):null }}
              </template>
            </el-table-column>
            <el-table-column prop="deadTime" min-width="150" label="过期时间" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.deadTime? timeToStr(scope.row.deadTime,'{y}-{m}-{d}'):null }}
              </template>
            </el-table-column>
            <el-table-column prop="amount" min-width="150" label="数量" show-overflow-tooltip/>
            <el-table-column prop="volume" min-width="150" label="体积" show-overflow-tooltip/>
            <el-table-column prop="weight" min-width="150" label="重量" show-overflow-tooltip/>
            <el-table-column prop="trays" min-width="150" label="托盘数" show-overflow-tooltip/>
            <el-table-column prop="amount" min-width="150" label="实入数" show-overflow-tooltip/>
            <el-table-column prop="volume" min-width="150" label="实入体积" show-overflow-tooltip/>
            <el-table-column prop="weight" min-width="150" label="实入重量" show-overflow-tooltip/>
            <el-table-column prop="trays" min-width="150" label="实入托数" show-overflow-tooltip/>
            <el-table-column prop="trays" min-width="150" label="仓库" show-overflow-tooltip/>
            <el-table-column prop="trays" min-width="150" label="库位" show-overflow-tooltip/>
            <el-table-column :label="'操作'" fixed="right" width="200" >
              <template slot-scope="scope">
                <el-button :title="'编辑'" type="primary" size="mini" icon="el-icon-edit" @click="onCompile(scope.row)"/>
                <el-button :title="'删除'" type="primary" size="mini" icon="el-icon-delete" @click="onDelete(scope.row)"/>
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
    <el-dialog :title="popTitle" :visible.sync="popState" :close-on-click-modal="false" :modal="true" top="20vh" width="450px">
      <el-form ref="popRuleForm" :model="popData" :rules="rules" label-width="130px">
        <el-row>
          <el-col>
            <el-form-item label="产品编码：" prop="product" >
              <select-basics
                v-model="popData.product"
                :query-arr="{shipperId:popupData.supplierId}"
                type="products"
                placeholder="请选择"
                filterable
                remote
                obj
                style-name="width:250px;padding-right:0;"
                @change="productChange"
              >
                <template slot-scope="item">
                  <span>{{ item.productCode }}</span>
                  <span>{{ item.productName }}</span>
                </template>
              </select-basics>
            </el-form-item>

          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="产品名称：" prop="productName" >
              <el-input v-model="popData.productName" style="width:250px;padding-right:0;" disabled/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="规格/有效期：" prop="day" >
              <el-input v-model="popData.format" style="width:120px;padding-right:0;" disabled/> / <el-input v-model.number="popData.day" style="width:120px;padding-right:0;" @blur="dayBlur" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="长宽高">
              <el-input v-model="popData.length" style="width:57px;padding-right:0;" disabled/>*<el-input v-model="popData.width" style="width:57px;padding-right:0;" disabled/>*<el-input v-model="popData.height" style="width:57px;padding-right:0;" disabled/>=<el-input v-model="popData.totalVolume" style="width:61px;padding-right:0;" disabled/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="数量/体积：" prop="volume" >
              <el-input v-model="popData.amount" style="width:120px;padding-right:0;" /> / <el-input v-model="popData.volume" style="width:120px;padding-right:0;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="价格：" prop="retail" >
              <el-input v-model="popData.amount" disabled style="width:70px;padding-right:0;" /> * <el-input v-model="popData.retailCardinal" disabled style="width:74px;padding-right:0;" /> = <el-input v-model="popData.retail" style="width:80px;padding-right:0;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="产品批次" prop="batch" >
          <el-date-picker
            v-model="popData.batch"
            type="date"
            style="width:250px;padding-right:0;"
            placeholder="选择"/>
        </el-form-item>
        <el-form-item label="过期时间" prop="deadTime" >
          <el-date-picker
            v-model="popData.deadTime"
            type="date"
            style="width:250px;padding-right:0;"
            placeholder="选择"/>
        </el-form-item>

        <el-form-item label="入库库位" prop="locationId" >
          <select-basics
            v-model="popData.locationId"
            :query="{storeId:popupData.storeId}"
            type="storage"
            placeholder="请选择"
            style-name="width:250px;padding-right:0;"
          />
        </el-form-item>
        <el-form-item label="重量" prop="weight" >
          <el-input v-model="popData.amount" disabled style="width:70px;padding-right:0;" /> * <el-input v-model="popData.weightCardinal" disabled style="width:74px;padding-right:0;" /> = <el-input v-model="popData.weight" style="width:80px;padding-right:0;" />
        </el-form-item>
        <el-form-item label="托盘数" prop="trays" >
          <el-input v-model="popData.trays" style="width:250px;padding-right:0;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onPopSubmit">确定</el-button>
        <el-button @click="onPopClose">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Inbound',
  filters: {
    auduit: function(value) {
      const arr = ['未审核', '已审核', '审核不过']
      if (!value) return ''
      return arr[value]
    }
  },
  data() {
    return {
      // 验证规则
      rules: {

        orderNo: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        inStoreType: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        storeId: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        createBy: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        supplier: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        linkman: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        // time: [
        //   { required: true, message: '请输入', trigger: 'change' }
        // ],
        preArrviceTime: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        receivingTime: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        product: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        productName: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        day: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        volume: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        retail: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        batch: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        locationId: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        weight: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        trays: [
          { required: true, message: '请输入', trigger: 'change' }
        ]
      },
      defOpt: { supplier: '' },
      formSearch: {
        orderNo: '',
        linkOrderNo: '',
        storeId: '',
        inStoreType: '',
        supplierCode: '',
        supplierName: '',
        time: ''
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
        body: [],
        page: 1,
        pageSize: 15,
        paginationTotal: 0,
        autoHeight: 300,
        loading: false,
        currentPage: 1
      },
      popupData: {
        id: '',
        orderNo: '',
        inStoreType: '',
        storeId: '',
        createBy: '',
        supplier: '',
        supplierId: '',
        linkman: '',
        phone: '',
        address: '',
        createTime: '',
        preArrviceTime: '',
        receivingTime: '',
        remark: ''
      },
      popData: {
        storeId: '',
        product: '',
        productCode: '',
        productId: '',
        productName: '',
        format: '',
        day: '',
        length: '',
        width: '',
        height: '',
        volume: '',
        amount: '',
        retailCardinal: '',
        totalVolume: '',
        batch: '',
        retail: '',
        deadTime: '',
        locationId: '',
        weightCardinal: '',
        weight: '',
        trays: ''
      },
      popState: false,
      popupState: false,
      Export: {},
      popTitle: '',
      popupTitle: '',
      setTime: ''// 定时器
    }
  },

  watch: {
    'popData.amount': {
      handler(val, oldVal) {
        const volume = this.popData.length * this.popData.width * this.popData.height // 体积
        if (volume * this.popData.amount === 0) {
          this.popData.volume = 0
        } else if (isNaN(volume * this.popData.amount)) {
          this.popData.volume = 0
        } else {
          this.popData.volume = volume * this.popData.amount
        }
        const retail = this.popData.retailCardinal // 价格
        if (retail * this.popData.amount === 0) {
          this.popData.retail = 0
        } else if (isNaN(retail * this.popData.amount)) {
          this.popData.retail = 0
        } else {
          this.popData.retail = retail * this.popData.amount
        }
        const weight = this.popData.weightCardinal
        if (weight * this.popData.amount === 0) {
          this.popData.weight = 0
        } else if (isNaN(weight * this.popData.amount)) {
          this.popData.weight = 0
        } else {
          this.popData.weight = weight * this.popData.amount
        }
      },
      deep: true
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
      const url = 'kaili-basic/v1/inStore'
      const params = {
        orderNo: this.formSearch.orderNo,
        linkOrderNo: this.formSearch.linkOrderNo,
        storeId: this.formSearch.storeId,
        inStoreType: this.formSearch.inStoreType,
        startTime: this.formSearch.time[0] ? this.timeToStr(this.formSearch.time[0].getTime(), '{y}-{m}-{d} {h}:{i}:{s}') : '',
        endTime: this.formSearch.time[1] ? this.timeToStr(this.formSearch.time[1].getTime(), '{y}-{m}-{d} {h}:{i}:{s}') : '',
        supplierCode: this.formSearch.supplierCode,
        supplierName: this.formSearch.supplierName
      }
      this.Export = Object.assign({}, params)
      params.page = this.table.page
      params.pageSize = this.table.pageSize
      this.table.loading = true
      this.getRequestParams(url, params).then((res) => {
        this.table.loading = false
        this.table.body = res.data.records
        this.table.body.forEach(el => {
          el.hasChildren = true
        })
        this.table.paginationTotal = res.data.total
        this.table.pageSize = res.data.size
      })
    },
    // 折叠行
    load(tree, treeNode, resolve) {
      const url = `kaili-basic/v1/inStore/detail/${tree.orderNo}`
      this.getRequestParams(url, '').then((res) => {
        res.data.forEach(element => {
          element.id = element.id + 'a'
        })
        resolve(res.data)
      })
    },
    // 新增按钮
    onOpen() {
      this.popupWay = true
      this.popupTitle = '新增入库'
      this.popupState = true
      const url = 'kaili-basic/v1/inStore/orderNo'
      this.popupState = true
      this.getRequest(url).then((res) => {
        this.popupData.orderNo = res.data
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      })
      this.setTime = setInterval(() => {
        this.popupData.createTime = new Date()
      }, 1000)
      this.popTable.body = []
    },
    // 编辑
    onCompile(row) {
      this.popupWay = false
      this.popupTitle = '编辑'
      const url = `kaili-basic/v1/inStore/edit/${row.id}`
      this.getRequest(url).then((res) => {
        for (const i in row) {
          this.popupData[i] = row[i]
        }
        this.popupData.supplier = {
          value: row.supplierId,
          label: row.supplierName
        }

        this.defOpt.supplier = {
          value: row.supplierId,
          label: row.supplierName
        }

        this.popTable.body = res.data.list
        this.popupState = true
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      })
    },

    // 表单提交
    onSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.popupWay) {
            const url = 'kaili-basic/v1/inStore'
            const params = {
              inStoreType: this.popupData.inStoreType,
              orderNo: this.popupData.orderNo,
              storeId: this.popupData.storeId,
              supplierId: this.popupData.supplierId,
              preArrviceTime: this.timeToStr(this.popupData.preArrviceTime.getTime(), '{y}-{m}-{d} {h}:{i}:{s}'),
              receivingTime: this.timeToStr(this.popupData.receivingTime.getTime(), '{y}-{m}-{d} {h}:{i}:{s}'),
              detailList: this.popTable.body
            }
            this.postRequest(url, params).then((res) => {
              this.onRequest()
              this.onClose()
            })
          } else {
            const url = 'kaili-basic/v1/inStore'
            const params = {
              inStoreType: this.popupData.inStoreType,
              orderNo: this.popupData.orderNo,
              storeId: this.popupData.storeId,
              supplierId: this.popupData.supplierId,
              preArrviceTime: this.timeToStr(this.popupData.preArrviceTime.getTime(), '{y}-{m}-{d} {h}:{i}:{s}'),
              receivingTime: this.timeToStr(this.popupData.receivingTime.getTime(), '{y}-{m}-{d} {h}:{i}:{s}'),
              detailList: this.popTable.body
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
        const url = `kaili-basic/v1/inStore/${row.id}`
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
      clearInterval(this.setTime)
      this.popupState = false
      for (const i in this.popupData) {
        this.popupData[i] = ''
      }
      this.popTable.body = []
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    // 新增产品
    popOpen() {
      if (this.popupData.supplierId) {
        this.popTitle = '新增产品'
        if (this.popupData.storeId) {
          this.popState = true
        } else {
          this.$message({
            message: '请选择仓库',
            type: 'warning'
          })
        }
      } else {
        this.$message({
          message: '请选择货主',
          type: 'warning'
        })
      }
      this.popData.storeId = this.popupData.storeId
      this.popData.width = 0
      this.popData.length = 0
      this.popData.height = 0
      this.popData.day = 0
    },
    // 新增产品提交
    onPopSubmit() {
      this.$refs['popRuleForm'].validate((valid) => {
        if (valid) {
          const obj = Object.assign({}, this.popData)
          obj.batch = this.timeToStr(obj.batch.getTime(), '{y}-{m}-{d} {h}:{i}:{s}')
          obj.deadTime = this.timeToStr(obj.deadTime.getTime(), '{y}-{m}-{d} {h}:{i}:{s}')
          this.popTable.body.push(obj)
          this.popState = false
          for (const i in this.popData) {
            this.popData[i] = ''
          }
        }
      })
    },
    // 关闭新增产品
    onPopClose() {
      this.popState = false
      for (const i in this.popData) {
        this.popData[i] = ''
      }
      this.$nextTick(() => {
        this.$refs['popRuleForm'].clearValidate()
      })
    },
    // 有效期失去焦点
    dayBlur() {
      if (isNaN(this.popData.day)) {
        this.popData.day = 0
      } else {
        this.popData.deadTime = new Date((new Date().getTime() + this.popData.day * 24 * 60 * 60 * 1000))
      }
    },

    // 货主选择
    supplierChange(val) {
      if (val) {
        this.popupData.supplierId = val.value
        this.popupData.linkman = val.linkman
        this.popupData.address = val.address
        this.popupData.phone = val.phone
      } else {
        this.popupData.supplierId = ''
      }
    },
    // 产品选择
    productChange(val) {
      this.popData.amount = 0
      if (val) {
        this.popData.format = val.format// 規格
        this.popData.length = val.length
        this.popData.width = val.width
        this.popData.height = val.height
        this.popData.totalVolume = val.volume
        this.popData.retailCardinal = val.retail
        this.popData.weightCardinal = val.weight
        this.popData.productCode = val.productCode
        this.popData.productId = val.productId
        this.popData.productName = val.productName
      } else {
        this.popData.format = ''
        this.popData.length = 0
        this.popData.width = 0
        this.popData.height = 0
        this.popData.totalVolume = 0
        this.popData.retailCardinal = 0
        this.popData.weightCardinal = 0
        this.popData.productCode = ''
        this.popData.productId = ''
        this.popData.productName = ''
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
      window.location.href = `/api/kaili-basic/v1/inStore/export?` + params
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

