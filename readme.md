[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](https://github.com/lukepolo/vuex-progress/blob/master/LICENSE)
[![donate](https://img.shields.io/badge/$-donate-ff5f5f.svg?style=flat-square)](https://www.paypal.me/lukepolo)

# Vuex Action Tracker

Simply tracks the actions that are being processed with Vuex.

## Why is this useful?

This is useful for show loaders when actions are being processed.

## Install

```js
npm install vuex-action-tracker
```

```js
import store from "./store";
import VuexActionTracker from "vuex-action-tracker";

Vue.use(new VuexActionTracker(), store);
```

## Usage

```vue
<template>
  <div>
    <loader :active="loaderIsVisible"> {{ user.name }} </loader>
  </div>
</template>
<script>
export default {
    created() {
        this.$store.dispatch('auth/getUser');
    },
    computed() {
        loaderIsVisible() {
            return this.$store.getters["vuexActionTracker/hasRunningActions"]()
        },
        user() {
            return this.$store.auth.user;
        }
    }
}
</script>
```

## Config

You can pass in a configuration into the plugin :

```js
Vue.use(
  new VuexActionTracker({
    include: [],
    exclude: []
  }),
  store
);
```

## Excluding Actions

To exclude certain actions you can define them in the config.

```js
Vue.use(
  new VuexActionTracker({
    exclude: ["loaders/show", "loaders/hide"]
  }),
  store
);
```

## Including Actions

By including actions you will by default exclude `all` actions outside of the include config.

```js
Vue.use(
  new VuexActionTracker({
    include: ["users/search", "auth/getUser"]
  }),
  store
);
```

## Advanced Usage

To see if only certain actions are currently running you can pass them into the getter function :

```vue
<template>
  <div>
    <loader :active="loaderIsVisible"> {{ user.name }} </loader>
  </div>
</template>
<script>
export default {
    created() {
        this.$store.dispatch('auth/getUser');
        this.$store.dispatch('users/search');
    },
    computed() {
        loaderIsVisible() {
            return this.$store.getters["vuexActionTracker/hasRunningActions"](['auth/getUser'])
        },
        user() {
            return this.$store.auth.user;
        }
    }
}
</script>
```
