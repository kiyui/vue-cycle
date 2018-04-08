

<!-- Start src/index.ts -->

# VueCycle
A **Vue** plugin for injecting **Cycle.js** apps, batteries included.

### Features
- A `vue-rx` style directive for DOM events
- A custom, testable DOM source for Vue components
- Injected helper methods that make writing Cycle-style components easier

## Usage
VueCycle is currently not published on `npm` as it is still considered beta,
and APIs may change over time. Consider it as `/dev/null` for now.

### Installing plugin
VueCycle is available as a global plugin with very minimal configuration:

```javascript
import VueCycle from '/dev/null'

Vue.use(VueCycle, {
  directive: 'xstream'
})
```

#### Composing VueCycle
If you do not want to install VueCycle as a global plugin, you can compose
and use parts of the plugin you want instead:

```javascript
import { VueCycleDOMMixin, VueCycleRunMixin, VueCycleDomDirective } from '/dev/null'

export default {
  mixins: [VueCycleDOMMixin, VueCycleRunMixin],
  directives: {
    xstream: VueCycleDomDirective
  }
}
```

## Writing VueCycle Components
The jist of what VueCycle does is that it injects a DOM driver, and a few
convenience methods that makes writing Cycle-styled components possible.

```vue
<template>
  <p>Current value is: {{ value }}</p>
  <button v-xstream:click="{ name: 'increment', data: count + 1 }">
    Increment
  </button>
</template>
<script>
export default {
  name: 'example',
  data() {
    return {
      count: 42
    }
  },
  $_cycle_app(sources) {
    const increment$ = sources.DOM.on('increment')
      .map(({ event, data }) => {
        // Where `event` is the original `click` event, and data is the
        // value passed to the directive
        return data
      })

    const state$ = increment$
      .map(newValue => {
        this.count = newValue

        return {
          count: this.count
        }
      })

    return {
      state: state$
    }
  },
  $_cycle_run(app) {
    run(app, {
      DOM: this.$domDriver,
      state: state$ => state$.addListener({
        next: () => {
          // Empty example stub to make sure `state$` side-effects are run
          // How you decide to handle state management is up to you =)
        }
      })
    })
  }
}
</script>
```

VueCycle injects a custom `xstream` directive that is used for identifying
events on the custom DOM driver. See the *directive* documentation for more
information.

The methods `$_cycle_app` and `$_cycle_run` are a core part of VueCycle
where `$_cycle_app` if where you can define your primary component logic
and `$_cycle_run` is where you perform the side-effects. You can here make
use of HOCs that do not inject to the DOM, such as `cycle-onionify`.

## API
VueCycle consists of multiple components:
* `VueCycleDOMMixin` mixin
* `VueCycleRunMixin` mixin
* `VueCycleDomDirective` directive
* `fromCustomEvent` injected method
* `watchProp` injected method

<!-- End src/index.ts -->

<!-- Start src/mixins/dom.ts -->

## VueCycleDOMMixin
Injects the `$domDriver` instance to the Vue component on `created`.

## $domDriver

The injected DOM driver instance

## on(eventName)

### Params:

* **string** *eventName* - Source event name

### Return:

* **Stream** Injected stream from `xstream` directive

<!-- End src/mixins/dom.ts -->

<!-- Start src/mixins/run.ts -->

## VueCycleRunMixin
Runs the `$_cycle_run` function with injected `$_cycle_app` on `mounted`.

<!-- End src/mixins/run.ts -->

<!-- Start src/directives/dom.ts -->

## VueCycleDomDirective
The VueCycle `xstream` directive

The directive can be used the following ways:
* `v-xstream:$event="'$sourceName'"`
* `v-xstream:$event="{ name: '$sourceName', data: 'some_value' }"`

Where `$event` is the name of the DOM or Vue custom event, and `$sourceName`
being the name of the event that will be used for filtering in the DOM driver.

<!-- End src/directives/dom.ts -->

<!-- Start src/methods/fromCustomEvent.ts -->

## fromCustomEvent(eventName)

An `xstream` wrapper for `vm.$on` events

### Params:

* **string** *eventName* - Name of the custom event

### Return:

* **Stream** `xstream` instance of custom event

<!-- End src/methods/fromCustomEvent.ts -->

<!-- Start src/methods/watchProp.ts -->

## watchProp(propName)

An `xstream` wrapper for `vm.$watch` events

### Params:

* **string** *propName* - Name of property to observe

### Return:

* **Stream** `xstream` instance of watched property

<!-- End src/methods/watchProp.ts -->

