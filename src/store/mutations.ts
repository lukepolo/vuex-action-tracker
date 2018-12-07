export default function(config) {
  return {
    setActive: (state, { type, payload, options }) => {
      if (shouldInclude(type)) {
        if (!state.dispatches[type]) {
          state.dispatches[type] = [];
        }
        state.dispatches[type].push({
          payload,
          options
        });
        state.hasRunningActions = true;
      }
    },
    setInActive: (state, { type, payload, options }) => {
      for (let index in state.dispatches[type]) {
        let dispatch = state.dispatches[type][index];
        if (dispatch.payload === payload && dispatch.options === options) {
          state.dispatches[type].splice(index, 1);
          if (state.dispatches[type].length === 0) {
            delete state.dispatches[type];
          }
          break;
        }
      }
      if (Object.keys(state.dispatches).length === 0) {
        state.hasRunningActions = false;
      }
    }
  };

  function shouldInclude(type) {
    if (config && config.include && config.include.length > 0) {
      return config.include.includes(type);
    }
    if (config && config.exclude && config.exclude.length > 0) {
      return !config.exclude.includes(type);
    }
    return true;
  }
}
