import { Stream } from 'xstream'

export interface DOMSourceEvent<S=Event, T=any> {
  event: S;
  data?: T;
}

export interface DOMSourceValue {
  name : string;
  data? : any;
}

declare module 'vue/types/vue' {
  interface Vue {
    $_dom_source: {
      [key: string]: Stream<any>[];
    };
    $fromCustomEvent<S=Event, T=any>(eventName: string): Stream<DOMSourceEvent<S,T>>;
    $watchProp<T>(propName: string): Stream<T>;
    $domDriver: {
      on<S=Event, T=any>(eventName: string): Stream<DOMSourceEvent<S,T>>;
    }
  }
}

export interface VueCycleConfiguration {
  directive: string;
}
