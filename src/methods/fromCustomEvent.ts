import xs, { Listener, Stream } from 'xstream'

/**
 * An `xstream` wrapper for `vm.$on` events
 * @function fromCustomEvent
 * @param {string} eventName - Name of the custom event
 * @returns {Stream} `xstream` instance of custom event
 */
export function fromCustomEvent<T> (eventName: string): Stream<T> {
  return xs.create({
    start: (listener: Listener<T>) => {
      if (!this.$_dom_source_custom_listener) {
        this.$_dom_source_custom_listener = {}
      }

      const eventHandler = (event: T) => {
        listener.next(event)
      }

      this.$_dom_source_custom_listener[eventName] = eventHandler
      this.$on(eventName, eventHandler)
    },
    stop: () => {
      this.$off(eventName, this.$_dom_source_custom_listener[eventName])
    }
  })
}
