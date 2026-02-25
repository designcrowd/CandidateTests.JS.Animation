declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<object, object, unknown>;

  // eslint-disable-next-line import/no-default-export
  export default component;
}
