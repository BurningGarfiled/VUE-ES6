<template>
  <div class="app-container">
    <v-pageSearch>
      <el-form :inline="true">
        <el-form-item label="销售单号：" label-width="100px">
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
        <el-form-item label="客户编号：" label-width="100px">
          <el-input v-model="formSearch.customerCode" clearable placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="客户名称：" label-width="100px">
          <el-input v-model="formSearch.customerName" clearable placeholder="请输入"/>
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
      <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
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
        <el-table-column prop="requestCode" label="申请单号" />
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="productCode" label="产品编号" />
        <el-table-column prop="format" label="产品规格" />
        <el-table-column prop="unit" label="单位" />
        <el-table-column prop="supplierName" label="货主" />
        <el-table-column prop="quantity" label="数量" />
        <el-table-column prop="actualSelectQuantity" label="实出数" />
        <el-table-column prop="actualQuantityReturned" label="退货数" />
        <el-table-column prop="customerNo" label="客户单号" />
        <el-table-column prop="customerName" label="客户名" />
        <el-table-column prop="procurationFee" label="代理费" />
        <el-table-column prop="orderStatus" label="状态">
          <template slot-scope="scope">{{ scope.row.orderStatusName }}</template>
        </el-table-column>
        <el-table-column prop="entryPriceStatus" label="是否入账">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.entryPriceStatus === 1" type="success">是</el-tag>
            <el-tag v-if="scope.row.entryPriceStatus === 2" type="danger">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="salesReturnStatus" label="退货">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.salesReturnStatus === 1" type="success">是</el-tag>
            <el-tag v-if="scope.row.salesReturnStatus === 2" type="danger">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="90">
          <template slot-scope="scope">{{ scope.row.createTime | parseTime('{y}-{m}-{d}') }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="420">
          <template slot-scope="scope">
            <el-button v-if="isOutbound(scope.row)" type="primary" title="出库" @click="openOutbound(scope.row)">
              <i class="iconfont">&#xe646;</i>
            </el-button>
            <el-button v-if="isConfirmOrCancel(scope.row)" type="primary" title="确认" @click="confirmHandle(scope.row)">
              <i class="iconfont">&#xe63b;</i>
            </el-button>
            <el-button v-if="isConfirmOrCancel(scope.row)" type="primary" title="取消" @click="cancelHandle(scope.row)">
              <i class="iconfont">&#xe671;</i>
            </el-button>
            <el-button v-if="isReturnGoods(scope.row)" type="primary" title="退货" @click="editHandle(scope.row)">
              <i class="iconfont">&#xe604;</i>
            </el-button>
            <el-button v-if="ifEntry(scope.row)" type="primary" title="入账" @click="editHandle(scope.row)">
              <i class="iconfont">&#xe652;</i>
            </el-button>
            <el-button type="primary" title="编辑" icon="el-icon-edit" @click="editHandle(scope.row)"/>
            <el-button type="primary" title="查看" @click="showHandle(scope.row)">
              <i class="iconfont">&#xe62e;</i>
            </el-button>
            <el-button type="primary" title="删除" icon="el-icon-delete" @click="deleteHandle(scope.row)"/>
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

    <!--新增、编辑弹窗-->
    <el-dialog :close-on-click-modal="false" :visible.sync="addAndEdit" :title="title" top="10vh" width="800px" @close="closePop">
      <el-form ref="addForm" :model="addData" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="申请订单：" prop="requestCode ">
              <el-input v-model="addData.requestCode" disabled placeholder="可不填，自动生成"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货主单号：" prop="supplierNo">
              <el-input v-model="addData.supplierNo "/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="制单日期：" prop="documentationDate">
              <el-date-picker
                v-model="addData.documentationDate"
                type="date"
                placeholder="选择日期"
                class="fullW"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="制单人：" prop="preparedBy">
              <el-input v-model="addData.preparedBy"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货主：" prop="supplierId">
              <select-basics
                v-model="addData.supplierId"
                :disabled="!isAdd"
                type="supplier"
                placeholder="请选择"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户名：" prop="customer">
              <select-basics
                v-model="addData.customer"
                :query-arr="{supplierId:addData.supplierId}"
                type="customer"
                placeholder="请选择"
                filterable
                remote
                obj
                @change="customerChange"
              >
                <template slot-scope="item">
                  <span>{{ item.customerId }}</span>
                  <span>{{ item.customerName }}</span>
                </template>
              </select-basics>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="联系人：" prop="linkman">
              <el-input v-model="addData.linkman"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话：" prop="phone">
              <el-input v-model="addData.phone"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="代理费：" prop="phone">
              <el-input v-model="addData.phone"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="发货日期：" prop="deliveryDate">
              <el-date-picker
                v-model="addData.deliveryDate"
                type="date"
                placeholder="选择日期"
                class="fullW"/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="addData.remark"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <v-pageToolbar align="left">
        <el-button type="primary" icon="el-icon-plus" @click="addProduct">新增产品</el-button>
      </v-pageToolbar>
      <el-table
        :header-cell-style="$store.state.element.headerBg"
        :data="submitBody.body">
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
        <el-button :loading="editLoading" type="primary" @click.native="submitForm()">确定</el-button>
        <el-button @click.native="closePop">关闭</el-button>
      </div>
    </el-dialog>

    <!--退货、入库弹窗-->
    <el-dialog :close-on-click-modal="false" :visible.sync="inAndReturn" :title="title" top="10vh" width="800px" @close="closePop">
      <el-form ref="popForm" :model="popData" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="订单号：" prop="requestCode">
              <el-input v-model="popData.requestCode" disabled placeholder="可不填，自动生成"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发货日期：" prop="deliveryDate">
              <el-date-picker
                v-model="popData.deliveryDate"
                disabled
                type="date"
                placeholder="选择日期"
                class="fullW"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="制单日期：" prop="documentationDate">
              <el-date-picker
                v-model="popData.documentationDate"
                disabled
                type="date"
                placeholder="选择日期"
                class="fullW"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户单号：" prop="preparedBy">
              <el-input v-model="popData.preparedBy" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="代理费：" prop="preparedBy">
              <el-input v-model="popData.preparedBy" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="制单人：" prop="preparedBy">
              <el-input v-model="popData.preparedBy" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="货主：" prop="supplierCode">
              <el-input v-model="popData.supplierCode" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户名称：" prop="supplierName">
              <el-input v-model="popData.supplierName" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人：" prop="linkman">
              <el-input v-model="popData.linkman" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="电话：" prop="phone">
              <el-input v-model="popData.phone" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态：" prop="orderStatusName">
              <el-input v-model="popData.orderStatusName" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="popData.remark" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :header-cell-style="$store.state.element.headerBg"
        :data="submitBody.body">
        <el-table-column prop="productCode" label="产品编码"/>
        <el-table-column prop="productName" label="产品名称"/>
        <el-table-column prop="quantity" label="数量" width="60px"/>
        <el-table-column prop="weight" label="重量" width="60px"/>
        <el-table-column prop="volume" label="体积" width="60px"/>
        <el-table-column prop="tray" label="托盘" width="60px"/>
        <el-table-column :label="inbound ? '入库数' : '退货数'" prop="quantity" min-width="90px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.quantity"/>
          </template>
        </el-table-column>
        <el-table-column :label="inbound ? '入库重量' : '退货重量'" prop="weight" min-width="90px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.weight"/>
          </template>
        </el-table-column>
        <el-table-column :label="inbound ? '入库体积' : '退货体积'" prop="volume" min-width="90px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.volume"/>
          </template>
        </el-table-column>
        <el-table-column :label="inbound ? '入库托盘' : '退货托盘'" prop="volume" min-width="90px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.volume"/>
          </template>
        </el-table-column>
        <el-table-column v-if="inbound" prop="depotId" label="库位" min-width="140px">
          <template slot-scope="scope">
            <select-basics
              v-model="scope.row.depotId"
              type="store"
              placeholder="请选择"
            />
          </template>
        </el-table-column>
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
        <el-button :loading="editLoading" type="primary" @click.native="submitForm()">确定</el-button>
        <el-button @click.native="closePop">关闭</el-button>
      </div>
    </el-dialog>

    <!--查看弹窗-->
    <el-dialog :close-on-click-modal="false" :visible.sync="isShow" :title="title" top="10vh" width="800px" @close="closePop">
      <el-form ref="popForm" :model="popData" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="订单号：" prop="requestCode">
              <el-input v-model="popData.requestCode" disabled placeholder="可不填，自动生成"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发货日期：" prop="deliveryDate">
              <el-date-picker
                v-model="popData.deliveryDate"
                disabled
                type="date"
                placeholder="选择日期"
                class="fullW"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="制单日期：" prop="documentationDate">
              <el-date-picker
                v-model="popData.documentationDate"
                disabled
                type="date"
                placeholder="选择日期"
                class="fullW"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户单号：" prop="preparedBy">
              <el-input v-model="popData.preparedBy" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="代理费：" prop="preparedBy">
              <el-input v-model="popData.preparedBy" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="制单人：" prop="preparedBy">
              <el-input v-model="popData.preparedBy" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="货主：" prop="supplierCode">
              <el-input v-model="popData.supplierCode" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户名称：" prop="supplierName">
              <el-input v-model="popData.supplierName" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人：" prop="linkman">
              <el-input v-model="popData.linkman" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="电话：" prop="phone">
              <el-input v-model="popData.phone" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态：" prop="orderStatusName">
              <el-input v-model="popData.orderStatusName" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="popData.remark" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :header-cell-style="$store.state.element.headerBg"
        :data="submitBody.body">
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
        <el-button :loading="editLoading" type="primary" @click.native="submitForm()">确定</el-button>
        <el-button @click.native="closePop">关闭</el-button>
      </div>
    </el-dialog>

    <!--新增产品弹窗-->
    <el-dialog :close-on-click-modal="false" :visible.sync="addPro" title="选择产品" top="10vh" width="800px" @close="closeProPop">
      <v-pageSearch>
        <el-form :inline="true">
          <el-form-item label="产品编号：" label-width="100px">
            <el-input v-model="proSearch.productCode" clearable placeholder="请输入"/>
          </el-form-item>
          <el-form-item label="产品名称：" label-width="100px">
            <el-input v-model="proSearch.productName" clearable placeholder="请输入"/>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" icon="el-icon-search" @click="getProduct">查询</el-button>
          </el-form-item>
        </el-form>
      </v-pageSearch>
      <el-table
        v-loading="proArr.loading"
        ref="proTable"
        :header-cell-style="$store.state.element.headerBg"
        :data="proArr.body"
        :max-height="proArr.autoHeight"
        tooltip-effect="dark"
        @selection-change="proSelect"
      >
        <el-table-column
          type="selection"
          width="50"
          fixed="left"/>
        <el-table-column prop="productCode" label="产品编号"/>
        <el-table-column prop="productName" label="产品名称"/>
        <el-table-column prop="format" label="规格" width="50px"/>
        <el-table-column prop="quantity" label="数量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.quantity" @change="quantityCharge(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column prop="totalWeight" label="重量" width="50px"/>
        <el-table-column prop="totalVolume" label="体积" width="50px"/>
        <el-table-column prop="tray" label="托盘"/>
        <el-table-column prop="tray" label="出库数">
          <template slot-scope="scope">
            <el-input v-model="scope.row.tray"/>
          </template>
        </el-table-column>
        <el-table-column prop="tray" label="出库重量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.tray"/>
          </template>
        </el-table-column>
        <el-table-column prop="tray" label="出库体积">
          <template slot-scope="scope">
            <el-input v-model="scope.row.tray"/>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="类别" width="50px"/>
        <el-table-column prop="unit" label="单位" width="50px"/>
        <el-table-column prop="weight" label="单价" width="60px"/>
      </el-table>
      <template slot="pagination" slot-scope="props">
        <el-pagination
          :layout="props.layout"
          :total="proArr.paginationTotal"
          :current-page.sync="proArr.currentPage"
          :page-size="proArr.pageSize"
          :page-sizes="props.sizes"
          background
          @size-change="productSize"
          @current-change="productPage"
        />
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="editLoading" type="primary" @click.native="confirmPro()">确定</el-button>
        <el-button @click.native="closeProPop">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'OutboundApply',
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
        customerCode: '',
        customerName: '',
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
        },
        {
          value: '4',
          label: '部分出货'
        },
        {
          value: '5',
          label: '全部出货'
        }
      ], // 订单状态列表
      title: '新增采购',
      addAndEdit: false, // 新增、编辑弹窗
      inAndReturn: false, // 入库、退货弹窗
      isAdd: true, // 新增：true; 编辑：false
      inbound: true, // 入库：true; 退货：false
      isShow: false, // 查看弹窗
      addPro: false, // 新增产品弹窗
      editLoading: false, // 提交按钮禁用状态
      addData: {
        supplierCode: '',
        documentationDate: '',
        preparedBy: '',
        supplierId: '',
        customerId: '',
        customerName: '',
        linkman: '',
        mailbox: '',
        phone: '',
        deliveryDate: '',
        declarationNumber: '',
        containerNo: '',
        procurationFee: '',
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
        procurationFee: '',
        remark: ''
      }, // 查看数据
      proSearch: {
        productCode: '',
        productName: ''
      }, // 产品查询条件
      proData: {}, // 新增产品数据
      proSelArr: [], // 勾选数据
      proArr: {
        body: [],
        page: 1,
        pageSize: 15,
        currentPage: 1,
        paginationTotal: 15,
        autoHeight: 749,
        loading: false
      },
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
    // 是否可以出库
    isOutbound(row) {
      const left = Number(row.residueQuantity)
      const orderStatus = row.orderStatus // 订单状态
      const status = orderStatus === 2 || orderStatus === 4
      return left > 0 && status // 订单状态为(订单确认：2，部分出货：4)，并且剩余数量大于0，可以入库和退货
    },
    // 是否可以退货
    isReturnGoods(row) {
      const left = Number(row.residueQuantity)
      return left > 0 // 剩余数量大于0，可以出货和退货
    },
    // 是否可入账
    ifEntry(row) {
      const entry = Number(row.entryPriceStatus)
      const procurationFee = Number(row.procurationFee) // 代理费用
      const status = procurationFee > 0
      return entry !== 1 && status // 状态不为1(已经入账：1),并且代理费用大于0
    },
    // 分页查询
    getTableData(val, flag) {
      if (flag === 'pageSize') {
        this.table.pageSize = val
      } else if (flag === 'page') {
        this.table.page = val
      }
      const url = 'kaili-basic/v1/outboundApplications/queryOutboundApplication'
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
          e.id = e.applyId // table展开数组必须要有个id
          e.children = [].concat(e.outboundProductList) // 拷贝数组，存放在children字段中，element表格展开用到
          e.children.forEach((m) => {
            m.oldId = m.id // 保存原Id
            m.id = m.id + '9999' // 新增字段，展开子项用到(防止主项和子项id重复)
          })
        })
        this.table.paginationTotal = data.data.total
      })
    },
    // 分页查询产品
    getProduct(val, flag) {
      if (flag === 'pageSize') {
        this.proArr.pageSize = val
      } else if (flag === 'page') {
        this.proArr.page = val
      }
      const url = 'kaili-basic/v1/suppliers/querySupplierProduct'
      const params = {
        supplierId: this.addData.supplierId,
        productCode: this.proSearch.productCode,
        productName: this.proSearch.productName
      }
      params.page = this.proArr.page
      params.pageSize = this.proArr.pageSize
      this.proArr.loading = true
      this.getRequestParams(url, params).then(data => {
        this.proArr.loading = false
        this.proArr.body = data.data.records
        this.proArr.paginationTotal = data.data.total
        this.addPro = true
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
    // 客户选择
    customerChange(val) {
      if (val) {
        this.addData.customerId = val.customerId
        this.addData.customerName = val.customerName
      } else {
        this.addData.customerId = ''
        this.addData.customerName = ''
      }
    },
    // 新增
    onAdd() {
      const this_ = this
      this_.isAdd = true
      this.addAndEdit = true
      this_.title = '新增采购'
      this_.resetForm('addForm')
      this_.$nextTick(() => {
        this_.$refs['addForm'].clearValidate()
      })
    },
    // 编辑
    editHandle(row) {
      const this_ = this
      this_.isAdd = false
      this.addAndEdit = true
      this_.title = '编辑采购'
      this_.resetForm('addForm')
      this.searchByApplyId(row.applyId)
      this.addData = this.$gFun.arrDeepCopy(row)
      this.submitBody.body = this.addData.outboundProductList
      this_.$nextTick(() => {
        this_.$refs['addForm'].clearValidate()
      })
    },
    // 查看
    showHandle(row) {
      this.isShow = true
      this.title = '采购订单详情'
    },
    // 打开出库库界面
    openOutbound(row, string) {
      const this_ = this
      this.resetForm('popForm')
      if (string === 'inbound') {
        this.title = '出库操作'
        this.inbound = true
      } else if (string === 'returnGoods') {
        this.title = '退货操作'
        this.inbound = false
      }
      // 判断主单、子单
      if (row.mainSonFlag === 1) {
        this.popData = this.$gFun.arrDeepCopy(row)
        this.submitBody.body = this.popData.outboundProductList
      } else {
        const obj = this.searchByApplyId(row.applyId)
        this.popData = this.$gFun.arrDeepCopy(obj)
        this.submitBody.body = [row]
      }
      this.inAndReturn = true
      this_.$nextTick(() => {
        this_.$refs['popForm'].clearValidate()
      })
    },
    // 关闭新增弹窗
    closePop() {
      this.addAndEdit = false
      this.inAndReturn = false
      this.isShow = false
      this.submitBody.body = []
    },
    // 关闭产品查询弹窗
    closeProPop() {
      this.addPro = false
      this.proSearch = {
        productCode: '',
        productName: ''
      }
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
            mainIds: [row.applyId]
          }
        } else {
          params = {
            sonIds: [row.oldId]
          }
        }
        const url = 'kaili-basic/v1/outboundApplications/deleteOutboundApplications'
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
        const url = `kaili-basic/v1/outboundApplications/${row.applyId}/orderConfirmation`
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
        const url = `kaili-basic/v1/outboundApplications/${row.applyId}/orderCancellation`
        this.putRequest(url, {}).then(() => {
          this.$message.success('操作成功')
          this.getTableData()
        })
      })
    },
    // 新增产品
    addProduct() {
      if (this.addData.supplierId) {
        this.getProduct()
      } else {
        this.$message.info('请选择货主')
      }
    },
    // 产品选中
    proSelect(val) {
      this.proSelArr = val
    },
    // 选择产品--确认
    confirmPro() {
      let flag = true
      const arr = this.proSelArr
      if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i]
          const num = item.quantity // 数量
          const batch = item.batch // 批次
          const expirationTime = item.expirationTime // 过期时间
          if (!num || !batch || !expirationTime) {
            this.$message.info('数量、批次、过期时间不能为空')
            flag = false
            return
          }
        }
        if (flag) {
          this.proMerge()
        }
      } else {
        this.$message.info('请选择产品')
      }
    },
    // 合并产品
    proMerge() {
      // const arr1 = this.submitBody.body
      // const arr2 = this.proSelArr
      this.submitBody.body = this.submitBody.body.concat(this.proSelArr)
      this.addPro = false
    },
    // 数量变化
    quantityCharge(row) {
      row.totalVolume = row.volume * row.quantity
      row.totalWeight = row.weight * row.quantity
    },
    // 提交表单
    submitForm() {
      const this_ = this
      let formName
      if (this.addAndEdit) {
        formName = 'addForm'
      } else if (this.inAndReturn) {
        formName = 'popForm'
      } else if (this.isShow) {
        formName = 'popForm'
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this_.editLoading = true
          let url = ''
          const params = this_.$gFun.arrDeepCopy(this_.addData)
          params.outboundProductList = this_.submitBody.body
          params.deliveryDate = this_.$gFun.parseTime(params.deliveryDate, '{y}-{m}-{d} {h}:{i}:{s}')
          params.documentationDate = this_.$gFun.parseTime(params.documentationDate, '{y}-{m}-{d} {h}:{i}:{s}')
          params.outboundProductList.forEach(e => {
            e.batch = this_.$gFun.parseTime(e.batch, '{y}-{m}-{d} {h}:{i}:{s}')
            e.expirationTime = this_.$gFun.parseTime(e.expirationTime, '{y}-{m}-{d} {h}:{i}:{s}')
          })
          let message = ''
          const ajaxArr = [this_.postRequest, this_.putRequest]
          let index = 0
          if (this_.isAdd) {
            url = 'kaili-basic/v1/outboundApplications/addOutboundApplication'
            message = '新增成功'
            index = 0
          } else {
            url = 'kaili-basic/v1/outboundApplications/updateOutboundApplication'
            message = '修改成功'
            index = 1
          }
          ajaxArr[index](url, params).then(data => {
            this_.editLoading = false
            this_.$message({
              message: message,
              type: 'success'
            })
            this_.getTableData()
            this.closePop()
            this.closeProPop()
          })
          setTimeout(function() {
            this_.editLoading = false
          }, 2000)
        } else {
          console.log('error submit!!')
          return false
        }
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
          customerId: '',
          customerName: '',
          linkman: '',
          mailbox: '',
          phone: '',
          deliveryDate: '',
          declarationNumber: '',
          containerNo: '',
          procurationFee: '',
          remark: ''
        }
      } else if (formName === 'addForm') {
        this.addData = {
          supplierCode: '',
          documentationDate: '',
          preparedBy: '',
          supplierId: '',
          customerId: 1,
          customerName: '',
          linkman: '',
          mailbox: '',
          phone: '',
          deliveryDate: '',
          declarationNumber: '',
          containerNo: '',
          procurationFee: '',
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
    },
    // 表格条数改变
    productSize(val) {
      this.getProduct(val, 'pageSize')
    },
    // 表格页数改变
    productPage(val) {
      this.getProduct(val, 'page')
    }
  }
}
</script>
