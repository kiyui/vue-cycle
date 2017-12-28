import xs, { Listener, Stream } from 'xstream'

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
