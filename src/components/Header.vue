<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <img src="../assets/logo.png" />
        <span id="site-title">BadTranslator.net</span>
      </a>

      <a
        role="button"
        class="navbar-burger burger"
        :class="{ 'is-active': navbarOpen }"
        aria-label="menu"
        aria-expanded="false"
        @click="toggleNavigation"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" :class="{ 'is-active': navbarOpen }">
      <div class="navbar-end">
        <div class="navbar-item">
          <!--<LanguageSelector />-->
        </div>
        <div class="navbar-item">
          <ShareButtons />
        </div>
        <div class="navbar-item">
          <div class="buttons">
            <button class="button" @click="donateClicked()">
              <span class="icon">
                🙏
              </span>
              <span>{{$t('supportMe')}}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import ShareButtons from './ShareButtons.vue';
import { EventBus } from '../eventBus.js';
//import LanguageSelector from './LanguageSelector.vue';

export default {
  name: 'Header',
  components: {
    ShareButtons,
    //LanguageSelector,
  },
  data() {
    return {
      navbarOpen: false,
    };
  },
  methods: {
    toggleNavigation() {
      this.navbarOpen = !this.navbarOpen;
      console.log(this.navbarOpen);
    },
    donateClicked() {
      EventBus.$emit('donate-button-clicked');
    }
  },
};
</script>

<style>
#site-title {
  margin-left: 10px;
  font-size: 1.4rem;
  font-weight: bold;
}
</style>
