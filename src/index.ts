import { Store } from "vuex";
import VuexActionTrackerStore from "./store";
import { VueConstructor } from "vue/types/vue";

export default class VuexActionTracker {
  public config: {
    exclude: Array<string>;
    include: Array<string>;
  };

  private includeRegexes: Array<RegExp> = [];
  private excludeRegexes: Array<RegExp> = [];

  private _Vue;
  private _store;

  constructor(config?) {
    this.config = config;

    if(!Array.isArray(this.config.include)) {
      this.config.include = []
    }

    if(!Array.isArray(this.config.exclude)) {
      this.config.exclude = []
    }

    this.setupRegexConfig();
  }

  public install(Vue: VueConstructor, store: Store<any>) {
    if (!store) {
      throw new Error("Please provide vuex store.");
    }

    this._Vue = Vue;
    this._store = store;

    this.overrideDispatch();

    store.registerModule(
      ["vuexActionTracker"],
      new VuexActionTrackerStore(this.config)
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
    if (this.shouldInclude(type) && !this.shouldExclude(type)) {
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
  }

  private setInactive(type, payload, options) {
    if (this.shouldInclude(type)) {
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

  private shouldInclude(type) {

    if(this.includeRegexes.length === 0 && this.config.include.length === 0) {
      return true;
    }


    if (!this.regexIncludes(type) && !this.config.include.includes(type)) {
      return false;
    }
    return true;
  }

  private shouldExclude(type) {

    if(this.excludeRegexes.length === 0 && this.config.exclude.length === 0) {
      return true;
    }

    if(this.regexExcludes(type) || this.config.exclude.includes(type)) {
      return true;
    }
    return false;
  }

  private regexIncludes(type) {
    for (let index in this.includeRegexes) {
      if (this.includeRegexes[index].test(type)) {
        return true;
      }
    }
    return false;
  }

  private regexExcludes(type) {
    for (let index in this.excludeRegexes) {
      if (this.excludeRegexes[index].test(type)) {
        return true;
      }
    }
    return false;
  }

  private setupRegexConfig() {

    if(this.config && this.config.include) {
      this.config.include.forEach((type: any, index) => {
        if (type instanceof RegExp) {
          this.includeRegexes.push(type);
          this.config.include.splice(index, 1);
        }
      });
    }

    if(this.config && this.config.exclude) {
      this.config.exclude.forEach((type: any, index) => {
        if (type instanceof RegExp) {
          this.excludeRegexes.push(type);
          this.config.exclude.splice(index, 1);
        }
      });
    }
  }
}
