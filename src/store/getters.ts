export default {
  hasRunningActions: state => types => {
    if (types) {
      if (!Array.isArray(types)) {
        types = [types];
      }
      if (state.hasRunningActions) {
        for (let index in types) {
          if (state.dispatches.hasOwnProperty(types[index])) {
            return true;
          }
        }
      }
      return false;
    }
    return state.hasRunningActions;
  }
};
