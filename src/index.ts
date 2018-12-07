import { Store } from "vuex";
import VuexActionTrackerStore from "./store";
import { VueConstructor } from "vue/types/vue";

export default class Index {
  private _Vue;
  private _store;

  public install(
    Vue: VueConstructor,
    {
      store,
      config
    }: {
      store: Store<any>;
      config: {
        exclude: Array<string>;
        include: Array<string>;
      };
    }
  ) {
    if (!store) {
      throw new Error("Please provide vuex store.");
    }

    this._Vue = Vue;
    this._store = store;

    this.overrideDispatch();

    store.registerModule(
      ["vuexActionTracker"],
      new VuexActionTrackerStore(config)
    );
  }

  private overrideDispatch() {
    let dispatch = this._store.dispatch;
    this._store.dispatch = (type, payload, options?) => {
      this.setActive(type, payload, options);
      return dispatch(type, payload, options).then(
        response => {
          this.setInactive(type, payload, options);
          return response;
        },
        error => {
          this.setInactive(type, payload, options);
          throw error;
        }
      );
    };
  }

  private setActive(type, payload, options) {
    this._store.commit(
      "vuexActionTracker/setActive",
      {
        type,
        payload,
        options
      },
      { root: true }
    );
  }

  private setInactive(type, payload, options) {
    this._store.commit(
      "vuexActionTracker/setInActive",
      {
        type,
        payload,
        options
      },
      { root: true }
    );
  }
}
