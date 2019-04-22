import { parseTime } from '@/utils'

const timeToStr = {
// eslint-disable-next-line
  install(Vue, options) {
    Vue.mixin({
      methods: {
        timeToStr(time, cFormat) {
          return parseTime(time, cFormat)
        }
      }
    })
  }
}

export default timeToStr
