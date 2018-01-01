import { PluginObject } from 'vue'
import { VueCycleMixin } from './mixin';
import { VueCycleDomDirective } from './directives/dom'
import { fromCustomEvent } from './methods/fromCustomEvent'
import { watchProp } from './methods/watchProp'
import { VueCycleConfiguration } from './index.d'

const VueCycle: PluginObject<VueCycleConfiguration> = {
  install (Vue, config = { directive: 'xstream' }) {
    Vue.mixin(VueCycleMixin)
    Vue.directive(config.directive, VueCycleDomDirective)
    Vue.prototype.$fromCustomEvent = fromCustomEvent
    Vue.prototype.$watchProp = watchProp
  }
}

export default VueCycle
export {
  VueCycleMixin,
  VueCycleDomDirective,
  fromCustomEvent,
  watchProp
}
