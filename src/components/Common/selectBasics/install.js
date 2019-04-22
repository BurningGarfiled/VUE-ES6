const BasicsType = {
  // 货主选择
  supplier: {
    mode1: {
      url: 'suppliers/queryAllSupplier',
      options: ''
    },
    mode2: {
      url: 'suppliers/xxxxx/dimQuerySupplier',
      options: ''
    },
    mode3: {
      url: '',
      key: '',
      queryArr: [
        { value: 'supplierId', required: true, message: '必填' }
      ]
    },
    options: {
      value: 'supplierId',
      label: 'supplierName',
      supplierId: 'supplierId',
      measurementList: 'measurementList',
      categoryList: 'categoryList',
      supplierCode: 'supplierCode',
      supplierName: 'supplierName',
      linkman: 'linkman',
      address: 'address',
      phone: 'phone'

    }
  },
  // 库位选择
  storage: {
    mode1: {
      url: 'storeLocation/byType'
    },
    options: {
      value: 'id',
      label: 'storeLocationName'
    }
  },
  // 仓库选择
  store: {
    mode1: {
      url: 'storeHouse/all',
      options: ''
    },
    options: {
      value: 'id',
      label: 'wareHouseName'
    }
  },
  // 类别选择
  category: {
    mode1: {
      url: 'categorys/all',
      options: ''
    },
    options: {
      value: 'categoryId',
      label: 'categoryName'
    }
  },
  // 部门选择
  dept: {
    mode1: {
      url: 'getAllDeps',
      options: ''
    },
    options: {
      value: 'id',
      label: 'name'
    }
  },
  // 角色选择
  roles: {
    mode1: {
      url: 'allBaseRole',
      options: ''
    },
    options: {
      value: 'id',
      label: 'name'
    }
  },
  // 产品根据货主多参数查询
  products: {
    mode3: {
      url: 'products/like',
      key: 'productNameOrCode',
      queryArr: [
        { value: 'shipperId', required: true, message: '请选择货主' }
      ]
    },
    options: {
      value: 'productCode',
      label: 'productCode',
      productName: 'productName',
      productId: 'productId',
      productCode: 'productCode',
      format: 'format',
      length: 'length',
      width: 'width',
      height: 'height',
      volume: 'volume',
      retail: 'retail',
      weight: 'weight'
    }
  },
  // 客户选择
  customer: {
    mode1: {
      url: 'suppliers/queryAllSupplier',
      options: ''
    },
    mode2: {
      url: 'customers/xxxxx/queryCustomerBySupplier',
      options: ''
    },
    mode3: {
      url: 'customers/dimQueryCustomerBySupplier',
      key: 'parameterName',
      queryArr: [
        { value: 'supplierId', required: true, message: '请选择货主' }
      ]
    },
    options: {
      value: 'customerId',
      label: 'customerName'
    }
  }
}

export default BasicsType

// mode1   普通下拉框
// mode2   模糊查询下拉框
// mode3   多个入参数模糊查询下拉框
