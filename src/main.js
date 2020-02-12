import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import AuthPlugin from "./plugins/auth";

import VueApollo from "vue-apollo";

import ApolloClient from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";

Vue.use(VueApollo);
Vue.use(AuthPlugin);

Vue.config.productionTip = false;

const getHeaders = () => {
  const headers = {};
  const token = window.localStorage.getItem("apollo-token");
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }
  return headers;
};
// Create a WebSocket link:
const link = new WebSocketLink({
  uri: "wss://todo2-app.herokuapp.com/v1/graphql",
  options: {
    reconnect: true,
    timeout: 30000,
    connectionParams: () => {
      return { headers: getHeaders() };
    }
  }
});
const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache({
    addTypename: true
  })
});
const apolloProvider = new VueApollo({
  defaultClient: client
});

new Vue({
  router,
  apolloProvider,
  render: h => h(App)
}).$mount("#app");
