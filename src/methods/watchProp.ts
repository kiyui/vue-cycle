import xs, { Listener, Stream } from 'xstream'

/**
 * An `xstream` wrapper for `vm.$watch` events
 * @function watchProp
 * @param {string} propName - Name of property to observe
 * @returns {Stream} `xstream` instance of watched property
 */
export function watchProp<T> (propName: string): Stream<T> {
  return xs.create({
    start: (listener: Listener<T>) => {
      if (!this.$_vue_cycle_unwatch_hooks) {
        this.$_vue_cycle_unwatch_hooks = {}
      }

      const unwatch = this.$watch(propName, (value: T) => {
        listener.next(value)
      })

      this.$_vue_cycle_unwatch_hooks[propName] = unwatch
    },
    stop: () => {
      this.$_vue_cycle_unwatch_hooks[propName]()
    }
  })
}
