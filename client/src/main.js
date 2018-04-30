// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { split } from 'apollo-link'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'

import Buefy from 'buefy'
import 'buefy/lib/buefy.css'
Vue.use(Buefy)

const httpLink = new HttpLink({
  //uri: 'https://graph-yoga-example-sourdiesel.c9users.io',
  uri: 'http://localhost:9000',
})

// Create the subscription websocket link
const wsLink = new WebSocketLink({
//uri: 'wss://graph-yoga-example-sourdiesel.c9users.io',
  uri: 'ws://localhost:9000',
  options: {
    reconnect: true,
  },
})

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' &&
      operation === 'subscription'
  },
  wsLink,
  httpLink
)

// Create the apollo client
const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true,
})
// Install the vue plugin
Vue.use(VueApollo)

Vue.config.productionTip = false

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  provide: apolloProvider.provide(),
  router,
  components: { App },
  template: '<App/>'
})
