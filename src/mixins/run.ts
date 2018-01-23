import Vue, { ComponentOptions } from 'vue'

export const VueCycleRunMixin: ComponentOptions<Vue> = {
  mounted() {
    if (this.$options.$_cycle_app && this.$options.$_cycle_run) {
      this.$options.$_cycle_run.call(this, (sources: any) => this.$options.$_cycle_app.call(this, sources))
    }
  }
}
