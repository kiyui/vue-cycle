import xs, { Stream, Listener } from 'xstream'
import fromEvent from 'xstream/extra/fromEvent'
import Vue from 'vue'
import { VNode, VNodeDirective } from 'vue/types/vnode'
import { DOMSourceValue } from '../index.d';

interface DOMSourceHTMLElement extends HTMLElement {
  $_dom_source_data: {
    [key: string]: any;
  };
  $_dom_source_unbind_callback: {
    [key: string]: Function;
  };
}

interface DOMSourceDirective extends VNodeDirective {
  value : DOMSourceValue | string;
}

export const VueCycleDomDirective = {
  bind (el: DOMSourceHTMLElement, binding: DOMSourceDirective, vnode: VNode) {
    if (typeof (binding.value) === 'undefined') {
      throw new Error('VueCycle expects directive value to be defined')
    }

    // sourceName is the name of domSource listener
    const { name: sourceName, data } = typeof (binding.value) === 'string'
      ? ({ name: binding.value, data : null })
      : binding.value

    // eventName is the name of the actual dom event
    if (!binding.arg) {
      throw new Error('VueCycle expects an event name in directive argument')
    }
    const eventName = binding.arg

    if (!el.$_dom_source_data) {
      el.$_dom_source_data = {}
    }

    if (!el.$_dom_source_unbind_callback) {
      el.$_dom_source_unbind_callback = {}
    }

    if (!vnode.context.$_dom_source[sourceName]) {
      vnode.context.$_dom_source[sourceName] = [];
    }

    el.$_dom_source_data[eventName] = data

    const source$ = xs.create({
      start: (listener: Listener<any>) => {
        let event$ = null
        if (!binding.modifiers.native && vnode.componentInstance) {
          if (vnode.componentInstance.$fromCustomEvent) {
            event$ = vnode.componentInstance.$fromCustomEvent(eventName)
          } else {
            // TODO: Show warning
          }
        } else {
          event$ = fromEvent(el, eventName)
        }

        event$.addListener({
          next: (event: any) => {
            listener.next({
              event,
              data: el.$_dom_source_data[eventName]
            })
          }
        })
      },
      stop: () => {
        delete el.$_dom_source_data[sourceName]
      }
    })

    vnode.context.$_dom_source[sourceName].push(source$)
  },
  update (el: DOMSourceHTMLElement, binding: DOMSourceDirective) {
    if (typeof(binding.value) !== 'string') {
      el.$_dom_source_data[binding.arg] = binding.value.data
    }
  }
}
