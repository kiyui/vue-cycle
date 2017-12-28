import Vue, { ComponentOptions } from 'vue'
import xs, { Listener, Stream } from 'xstream'
import { adapt } from '@cycle/run/lib/adapt';

export const VueCycleMixin: ComponentOptions<Vue> = {
  created () {
    if (!this.$_dom_source) {
      this.$_dom_source = {}
    }

    this.$domDriver = () => {
      return {
        on: (eventName: string) => {
          const dom$ = xs.create({
            start: (listener: Listener<any>) => {
              if (this.$_dom_source[eventName]) {
                for (let i = 0; i < this.$_dom_source[eventName].length; i++) {
                  const source$ = this.$_dom_source[eventName][i]
                  source$.addListener({
                    next: (data: any) => {
                      listener.next(data)
                    },
                    complete: () => {
                      delete this.$_dom_source[eventName][i]
                    }
                  })
                }
              }

              this.$_dom_source[eventName] = {
                push(source$: Stream<any>) {
                  source$.addListener({
                    next: (data: any) => {
                      listener.next(data)
                    }
                  })
                }
              }
            },
            stop: () => {
            }
          })

          return adapt(dom$);
        }
      }
    }
  },
  mounted() {
    if (this.$options.$_cycle_app && this.$options.$_cycle_run) {
      this.$options.$_cycle_run.call(this, (sources: any) => this.$options.$_cycle_app.call(this, sources))
    }
  }
}
