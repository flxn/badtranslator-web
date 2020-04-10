import Vue from 'vue'
import VueI18n from 'vue-i18n';
import translations from './translations/loader';
import App from './App.vue'

import '@fortawesome/fontawesome-free/css/all.css';
import 'bulma/css/bulma.css';

Vue.config.productionTip = false

let locale = 'en';
const storedLocale = window.localStorage.getItem('locale')
if (storedLocale) {
  locale = storedLocale;
} else {
  const browserLocale = window.navigator.language.split('-')[0];
  if (typeof translations[browserLocale] !== "undefined") {
    locale = browserLocale;
  }
}

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: 'en',
  messages: translations,
});

new Vue({
  i18n,
  render: h => h(App),
}).$mount('#app')
