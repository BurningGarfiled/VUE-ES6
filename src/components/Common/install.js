// 组件全局注册
import Vue from 'vue'

import timeToStr from './parseTime'
import HasPermission from './hasPermission'
import PageNotes from './pageNotes'
import PageTitle from './pageTitle'
import PageToolbar from './pageToolbar'
import PageSection from './pageSection'
import PageTable from './pageTable'
import PageSearch from './pageSearch'
import PageBack from './pageBack'
import PageHeader from './pageHeader'
import selectBasics from './selectBasics'
import SelectDict from './SelectDict'

// 形成组件库
const components = [
  timeToStr,
  HasPermission,
  PageNotes,
  PageTitle,
  PageSection,
  PageTable,
  PageToolbar,
  PageSearch,
  PageBack,
  PageHeader,
  selectBasics,
  SelectDict
]

// 注册全局组件
components.map((com) => {
  Vue.use(com)
  // Vue.component(com.name, com)
})

export default components
