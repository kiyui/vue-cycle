<template>
  <div>
    <input id="name" v-xstream:change="'name'"/>
    <receiver v-bind:name="name" v-xstream:state="'state'"/>
  </div>
</template>
<script>
import xs from 'xstream'
import { run } from '@cycle/run'
import Receiver from './receiver'

export default {
  name: 'sender',
  components: {
    Receiver
  },
  data() {
    return {
      name: 'Kiyui'
    }
  },
  $_cycle_app (sources) {
    const state$ = sources.DOM.on('name')
      .map(value => {
        this.name = value.event.target.value

        return {
          name: this.name
        }
      })

    const child$ = sources.DOM.on('state')

    return {
      state: state$,
      child: child$
    }
  },
  $_cycle_run (app) {
    run(app, {
      state: state$ => {
        state$.addListener({
          next: () => {
            // Empty stub
          }
        })
      }
    })
  }
}
</script>
