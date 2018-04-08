import { PluginObject } from 'vue'
import { VueCycleDOMMixin } from './mixins/dom';
import { VueCycleRunMixin } from './mixins/run';
import { VueCycleDomDirective } from './directives/dom'
import { fromCustomEvent } from './methods/fromCustomEvent'
import { watchProp } from './methods/watchProp'
import { VueCycleConfiguration } from './index.d'

const VueCycle: PluginObject<VueCycleConfiguration> = {
  install (Vue, config = { directive: 'xstream' }) {
    Vue.mixin(VueCycleDOMMixin)
    Vue.mixin(VueCycleRunMixin)
    Vue.directive(config.directive, VueCycleDomDirective)
    Vue.prototype.$fromCustomEvent = fromCustomEvent
    Vue.prototype.$watchProp = watchProp
  }
}

export default VueCycle
export {
  VueCycleDOMMixin,
  VueCycleRunMixin,
  VueCycleDomDirective,
  fromCustomEvent,
  watchProp
}
