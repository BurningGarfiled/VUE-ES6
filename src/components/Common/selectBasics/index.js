import selectBasics from './main'

selectBasics.install = function(Vue) {
  Vue.component(selectBasics.name, selectBasics)
}

export default selectBasics
