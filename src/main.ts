import { createApp } from "vue";
import { setupDefaultAxios } from "./api";
import App from "./App.vue";
import "./main.css";
import router from "./router";
import axios from "axios";
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";
import { createPinia } from "pinia";
import { useUserStore } from "./store/user";

// redirect
if (import.meta.env.PROD) {
  if (location.protocol !== "https:") {
    location.replace(
      `https:${location.href.substring(location.protocol.length)}`,
    );
  }
}

// vue
const app = createApp(App);

// sentry
if (import.meta.env.PROD) {
  const release = import.meta.env.VITE_SENTRY_RELEASE as string;
  console.info(`release: ${release}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).SENTRY_RELEASE = release;
  Sentry.init({
    app,
    dsn: "https://b56d6b7f58b840e986423662e9b4586e@sentry.law-orga.de/3",
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracePropagationTargets: ["localhost", "law-orga.de", /^\//],
      }),
    ],
    environment: "production",
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

// store
const pinia = createPinia();
app.use(pinia);

// setup axios
setupDefaultAxios(axios);

// use router
app.use(router);

// mount
app.mount("#app");

// check login status
const userStore = useUserStore();
userStore.updateData();

// get the manifest working
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/serviceWorker.js")
    .then(function () {
      // registration successful
    })
    .catch(function () {
      // registration failed
    });
}
