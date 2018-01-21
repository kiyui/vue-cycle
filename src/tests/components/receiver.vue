<template>
  <p>Hello there! My name is {{ customName }}</p>
</template>
<script>
import xs from 'xstream'
import { run } from '@cycle/run'

export default {
  name: 'receiver',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      customName: this.name
    }
  },
  $_cycle_app (sources) {
    const state$ = this.$watchProp('name')
      .map(value => {
        return {
          customName: value
        }
      })
      .startWith({
        customName: this.customName
      })

    return {
      state: state$
    }
  },
  $_cycle_run (app) {
    run(app, {
      state: state$ => {
        state$.addListener({
          next: (state) => {
            // We emit the state to parent so the parent
            // can treat it as a sink for testing
            this.$emit('state', state)
          }
        })
      }
    })
  }
}
</script>
