import Vue, { ComponentOptions } from 'vue'

/**
 * ## VueCycleRunMixin
 * Runs the `$_cycle_run` function with injected `$_cycle_app` on `mounted`.
 */
export const VueCycleRunMixin: ComponentOptions<Vue> = {
  mounted() {
    if (this.$options.$_cycle_app && this.$options.$_cycle_run) {
      this.$options.$_cycle_run.call(this, (sources: any) => this.$options.$_cycle_app.call(this, sources))
    }
  }
}
