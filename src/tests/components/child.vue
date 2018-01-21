<template>
  <select id="customSelect" v-xstream:change="'changeSelect'">
    <option value="7">7</option>
    <option value="8">8</option>
    <option value="9">9</option>
    <option value="2">2</option>
  </select>
</template>
<script>
import xs from 'xstream'
import { run } from '@cycle/run'

export default {
  name: 'child',
  $_cycle_app (sources) {
    const emit$ = sources.CustomDomSourceName.on('changeSelect')

    return {
      emit: emit$
    }
  },
  $_cycle_run (app) {
    run(app, {
      CustomDomSourceName: this.$domDriver,
      emit: sink$ => {
        sink$.addListener({
          next: value => {
            this.$emit('customSelectEvent', parseInt(value.event.target.value))
          }
        })
      }
    })
  }
}
</script>
