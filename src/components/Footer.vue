<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        <strong>BadTranslator.net</strong> by <a href="https://flxn.de">Felix Stein</a>.
      </p>
      <p>
        If you like my stuff you can follow me on
        <a href="https://twitter.com/flxnde" target="_blank"><i class="fab fa-twitter"></i> Twitter</a>
        or on
        <a href="https://github.com/flxn" target="_blank"><i class="fab fa-github"></i> Github</a>.
        <br/>
        If you really like it you can
        <a
          href="https://www.paypal.com/paypalme2/fstein42/3"
          class=""
          rel="noopener noreferrer"
          target="_blank"
          style="margin: 0 5px;">
          <span class="icon"><i class="fab fa-paypal"></i></span> <span>Donate on PayPal</span>
        </a>
        /
        <a
          href="https://ko-fi.com/flxn256"
          class=""
          rel="noopener noreferrer"
          target="_blank"
          style="margin: 0 5px;">
          <span class="icon"><img src="../assets/cup-border.png" width="24" loading="lazy" alt="Support Me on Ko-Fi" /></span> <span>Donate on Ko-Fi</span>
        </a>
        /
        <a
          href="https://www.patreon.com/flxn"
          class=""
          rel="noopener noreferrer"
          target="_blank"
          style="margin: 0 5px;">
          <span class="icon"><i class="fab fa-patreon"></i></span> <span>Donate on Patreon</span>
        </a>
        to help keep the site running. Thank you.
      </p>
      <p>
        If you have feedback, you can write me a mail:
        <a href="mailto:mail@flxn.de"><i class="fa fa-envelope"></i> mail@flxn.de</a>
      </p>
      <!--<ShareButtons />-->
    </div>
  </footer>
</template>

<script>
//import ShareButtons from './ShareButtons.vue';

export default {
  name: 'Footer',
  components: {
    //ShareButtons,
  },
};
</script>

<style scoped>
.footer {
  margin-top: 50px;
}
</style>
