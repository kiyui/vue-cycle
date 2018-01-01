import { Stream } from 'xstream'

declare module 'vue/types/vue' {
  interface Vue {
    $_dom_source: {
      [key: string]: Stream<any>[];
    };
    $fromCustomEvent: Function;
  }
}

export interface DOMSourceValue {
  name : string;
  data? : any;
}

export interface VueCycleConfiguration {
  directive: string;
}
