/* global describe test expect jest */
import { createLocalVue, mount } from '@vue/test-utils'
import { mockTimeSource } from '@cycle/time'

import VueCycle from '../index'
import Parent from './components/parent'
import Sender from './components/sender'

describe('VueCycle', () => {
  const deepEqual = (x, y) => expect(x).toEqual(y)
  const count = x => x.count
  console.error = jest.fn()

  describe('dom driver', () => {
    test('should support dom events', done => {
      const Time = mockTimeSource()
      const localVue = createLocalVue()
      localVue.use(VueCycle)

      /* eslint-disable no-multi-spaces  */
      const increment$ = Time.diagram('--x-x-x-x-x-x-')
      const state$     = Time.diagram('0-1-2-3-4-----')
      /* eslint-enable no-multi-spaces  */

      const mockedParent = {
        ...Parent,
        $_cycle_run (app) {
          const sinks = app({
            DOM: this.$domDriver()
          })

          Time.assertEqual(sinks.state.map(count), state$, deepEqual)
        }
      }

      const wrapper = mount(mockedParent, {
        localVue
      })

      increment$.addListener({
        next: () => {
          const button = wrapper.find('#increment')
          if (button.exists()) {
            button.trigger('click')
          }
        }
      })

      Time.run(done)
    })

    test('should support custom events', done => {
      const Time = mockTimeSource()
      const localVue = createLocalVue()
      localVue.use(VueCycle)

      /* eslint-disable no-multi-spaces  */
      const change$ = Time.diagram('--0-1-2-')
      const state$  = Time.diagram('0-7-8-9-')
      /* eslint-enable no-multi-spaces  */

      const mockedParent = {
        ...Parent,
        $_cycle_run (app) {
          const sinks = app({
            DOM: this.$domDriver()
          })

          Time.assertEqual(sinks.state.map(count), state$, deepEqual)
        }
      }

      const wrapper = mount(mockedParent, {
        localVue
      })

      change$.addListener({
        next: index => {
          const select = wrapper.find('#customSelect')
          select.element.selectedIndex = index
          select.trigger('change')
        }
      })

      Time.run(done)
    })

    test('should support late dom subscribers', done => {
      const Time = mockTimeSource()
      const localVue = createLocalVue()
      localVue.use(VueCycle)

      /* eslint-disable no-multi-spaces  */
      const increment$ = Time.diagram('--x-----------------x-x-')
      const change$    = Time.diagram('------1---2-----3-------')
      const multiply$  = Time.diagram('----x---x---x-x---x-----')
      const state$     = Time.diagram('0-1---8---9-a-b-2---3-4-', { a: 18, b: 36 })
      /* eslint-enable no-multi-spaces  */

      const mockedParent = {
        ...Parent,
        $_cycle_run (app) {
          const sinks = app({
            DOM: this.$domDriver()
          })

          Time.assertEqual(sinks.state.map(count), state$, deepEqual)
        }
      }

      const wrapper = mount(mockedParent, {
        localVue
      })

      increment$.addListener({
        next: () => {
          const button = wrapper.find('#increment')
          if (button.exists()) {
            button.trigger('click')
          }
        }
      })

      change$.addListener({
        next: index => {
          const select = wrapper.find('#customSelect')
          select.element.selectedIndex = index
          select.trigger('change')
        }
      })

      multiply$.addListener({
        next: () => {
          const button = wrapper.find('#multiply')
          if (button.exists()) {
            button.trigger('click')
          }
        }
      })

      Time.run(done)
    })

    test('should support multiple dom events', done => {
      const Time = mockTimeSource()
      const localVue = createLocalVue()
      localVue.use(VueCycle)

      /* eslint-disable no-multi-spaces  */
      const increment$ = Time.diagram('--x---x---')
      const hover$     = Time.diagram('----x---x-')
      const state$     = Time.diagram('0-1---2---')
      /* eslint-enable no-multi-spaces  */

      const mockedParent = {
        ...Parent,
        $_cycle_run (app) {
          const sinks = app({
            DOM: this.$domDriver()
          })

          Time.assertEqual(sinks.state.map(count), state$, deepEqual)
          Time.assertEqual(sinks.hover, hover$.mapTo('..now the red ones make me fly and the blue ones help me fall!'), deepEqual)
        }
      }

      const wrapper = mount(mockedParent, {
        localVue
      })

      increment$.addListener({
        next: () => {
          const button = wrapper.find('#increment')
          button.trigger('click')
        }
      })

      hover$.addListener({
        next: () => {
          const button = wrapper.find('#increment')
          button.trigger('mouseover')
        }
      })

      Time.run(done)
    })
  })

  describe('dom directive', () => {
    test('should throw error when value is undefined', () => {
      const localVue = createLocalVue()
      localVue.use(VueCycle)

      const Example = {
        name: 'example',
        template: `
        <div v-xstream:click="">
        </div>
        `
      }

      expect(() => mount(Example, { localVue })).toThrow()
    })

    test('should throw error when argument is undefined', () => {
      const localVue = createLocalVue()
      localVue.use(VueCycle)

      const Example = {
        name: 'example',
        template: `
        <div v-xstream="'click'">
        </div>
        `
      }

      expect(() => mount(Example, { localVue })).toThrow()
    })
  })

  describe('non-dom methods', () => {
    describe('watchProp', () => {
      test('should trigger when props change', done => {
        const Time = mockTimeSource()
        const localVue = createLocalVue()
        localVue.use(VueCycle)

        /* eslint-disable no-multi-spaces  */
        const input$ = Time.diagram('--a-b-', { a: 'Korra', b: 'Stallman' })
        const child$ = Time.diagram('i-a-b-', { i: 'Kiyui', a: 'Korra', b: 'Stallman' })
        /* eslint-enable no-multi-spaces  */

        const mockedSender = {
          ...Sender,
          $_cycle_run (app) {
            const sinks = app({
              DOM: this.$domDriver()
            })

            const childState$ = sinks.child.map(value => value.event.customName)

            sinks.state.addListener({ next: () => false })
            Time.assertEqual(childState$, child$, deepEqual)
          }
        }

        const wrapper = mount(mockedSender, {
          localVue
        })

        input$.addListener({
          next: name => {
            const input = wrapper.find('#name')
            input.element.value = name
            input.trigger('change')
          }
        })

        Time.run(done)
      })
    })
  })
})
