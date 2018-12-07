import state from "./state";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

export default class VuexLoaderStore {
  public name;
  public state;
  public actions;
  public getters;
  public mutations;
  public namespaced;

  constructor(config) {
    this.namespaced = true;
    this.name = "vuexLoader";
    this.state = state;
    this.actions = actions;
    this.getters = getters;
    this.mutations = mutations(config);
  }
}
