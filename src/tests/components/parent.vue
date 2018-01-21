<template>
  <div>
    <p>Current value is: {{ count }}</p>
    <button id="increment" v-if="show" v-xstream:click="{ name: 'changeValue', data: count + 1 }" v-xstream:mouseover="'hover'">
      Increment by 1
    </button>
    <child v-xstream:customSelectEvent="'select'"/>
    <button id="multiply" v-if="large" v-xstream:click="{ name: 'changeValue', data: count * 2 }">
      Multiply by 2
    </button>
  </div>
</template>
<script>
import xs from 'xstream'
import { run } from '@cycle/run'
import Child from './child'

export default {
  name: 'parent',
  components : {
    Child
  },
  data() {
    return {
      count: 0
    }
  },
  computed: {
    show() {
      return this.count < 4
    },
    large() {
      return this.count > 8
    }
  },
  $_cycle_app (sources) {
    const increment$ = sources.DOM.on('changeValue')
      .map(value => value.data)

    const select$ = sources.DOM.on('select')
      .map(value => value.event)

    const state$ = xs.merge(increment$, select$)
      .map(newCount => {
        this.count = newCount

        return {
          count: this.count
        }
      })
      .startWith({ count: this.count })

    const hover$ = sources.DOM.on('hover')
      .mapTo('..now the red ones make me fly and the blue ones help me fall!')

    return {
      state: state$,
      hover: hover$
    }
  },
  $_cycle_run (app) {
  }
}
</script>
