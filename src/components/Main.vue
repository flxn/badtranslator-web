<template>
  <div class="container has-text-centered">
    <h1 class="title pagetitle">
      <div :style="{transform: broken1}">Bad</div>
      <!--<div :style="{transform: broken2}">ken</div>-->
      <div :style="{transform: broken3}">Trans</div>
      <div :style="{transform: broken4}">lator</div>
      <div id="pandemic-tag">
        <img src="../assets/social-distancing-200.png" alt="Social-Distancing approved!" width="200" height="200">
      </div>
    </h1>
    
    <h2 class="subtitle">
      A game of
      <em>Chinese Whispers</em> but with online translators.
      <br />Translate your message through multiple languages and back.
    </h2>

    <div class="columns">
      <div class="column">
        <div class="inputForm">
          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <div :class="{'select': true, 'is-danger': errorNoLanguage}">
                    <select
                      name="inputLanguage"
                      id="inputLanguage"
                      v-model="inputLanguage"
                      @change="languageChanged"
                    >
                      <option value disabled default selected>Select your language</option>
                      <option
                        v-for="lang of Object.keys(availableLanguages)"
                        :key="lang"
                        :value="lang"
                      >{{availableLanguages[lang]}}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <div class="select is-pulled-right">
                    <select
                      name="translationRounds"
                      id="translationRounds"
                      v-model="translationRounds"
                      @change="translationRounds"
                    >
                      <option value="3">3 rounds of translation</option>
                      <option value="4">4 rounds of translation</option>
                      <option value="5">5 rounds of translation</option>
                      <option value="6">6 rounds of translation</option>
                      <option value="7">7 rounds of translation</option>
                      <option value="8">8 rounds of translation</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="field">
            <div class="control">
              <textarea
                name="inputText"
                id="inputText"
                :class="{'textarea': true, 'is-danger': errorNoText || inputText.length > maxInputLength}"
                cols="30"
                rows="6"
                placeholder="Input any text"
                v-model="inputText"
              ></textarea>
              <span class="counter">{{inputText.length}}/{{maxInputLength}}</span>
            </div>
          </div>

          <div class="notification is-danger" v-for="error in errorMessages" :key="error">{{error}}</div>

          <button
            id="translateButton"
            :class="{'button': true, 'is-primary': true, 'is-large': true, 'is-loading': translationInProgress}"
            @click="startTranslation"
          >Translate!</button>
        </div>

        <div id="translation-steps">
          <div
            class="step"
            v-for="step in steps"
            :key="`${step.from}-${step.to}`"
            @click="step.textVisible = !step.textVisible"
            :title="`Show ${step.to} translation`"
          >
            <div class="columns">
              <div class="board from column">
                <div
                  class="letter"
                  v-for="letter in step.from"
                  :key="`from-${letter}-${Math.round(Math.random()*100000)}`"
                >{{letter.replace(" ", "_")}}</div>
              </div>
              <i class="fa fa-arrow-right column is-narrow"></i>
              <div class="board to column">
                <div
                  class="letter"
                  v-for="letter in step.to"
                  :key="`to-${letter}-${Math.round(Math.random()*100000)}`"
                >{{letter.replace(" ", "_")}}</div>
              </div>
            </div>
            <div class="columns" v-if="step.textVisible">
              <div class="column">
                <p class="step-output">{{step.text}}</p>
              </div>
            </div>
          </div>
        </div>

        <div id="result">
          <div class="title" v-if="outputText">Output</div>
          <p class="output" v-if="outputText">{{outputText}}</p>
          <ShareButtons
            v-if="outputText"
            style="margin-top: 30px"
            callToAction="Share this translation"
            title="This is what happens when you translate through random languages"
            :text="outputText"
          />
          <button
            :class="{'button': true, 'is-primary': true, 'is-loading': translationInProgress}"
            @click="startTranslation"
            v-if="outputText"
            style="margin-top: 30px"
          >Spin it again with other languages!</button>
          <p v-if="outputText" style="margin-top: 30px">
            Too crazy? Try lowering the rounds of translation.
            <br />Not crazy enough? Try increasing the number of rounds.
          </p>
        </div>

        <hr />
        <h3 class="title">How does it work?</h3>
        <div class="content" style="max-width: 960px; margin: 0 auto;">
          <p>
            This site is based on the
            <em>telephone</em> game, also called
            <em>chinese whispers</em>, just with online translation services instead of real people.
            Your text is translated through multiple random languages and then back to the starting language.
            <br />It's especially funny for fictional texts or lyrics. Try it out!
          </p>
          <p>
            Here is the first paragraph of the
            <a
              href="https://en.wikipedia.org/wiki/Chinese_whispers"
              rel="noopener"
              target="_blank"
            >Wikipedia article for "Chinese Whispers"</a> translated through 6 different languages and back to english:
          </p>
          <blockquote style="text-align: left">
            The Chinese will talk to you (English Commonwealth) or telephone (North American English) is a popular international children's game in which the players form the line, the first player comes with a message and the other person in a row was a crocodile.
            The third player repeats another player's message. When the last player is added, they report a message they have heard about the entire team.
            The first person then compares the original message with the final version. While this message is moving forward and part of joy, it ends naturally.
            Errors usually go to "reel", so the announcement the last player published is very different from the first player, usually or effect.
            The reason for change is the inability to understand the cause of depression or intolerance, irregular corrections and silence.
            <br />This game is often a party game or a game for children. It is often a metaphor for a growing error, especially rumours or rumours, or at all, a lack of reliability of human memory or oral tradition.
          </blockquote>
          <p>As a translation provider I'm currently using the Microsoft Azure Translator Text API</p>
        </div>
      </div>
    </div>
    <div :class="{'modal': true, 'is-active': showDonationModal}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Hi there 👋</p>
          <button class="delete" aria-label="close" @click="showDonationModal = false"></button>
        </header>
        <section class="modal-card-body">
          <p>
            Sorry to bother you but I see you already used BadTranslator {{translationCount}} times. I hope you enjoy this app and had a few good laughs 😊
            <br />This site will always be free but the online translation services that I am using in the background sadly are not free to me, they are quite expensive actually.
            <br />
            <br />If you like this app please consider donating so I can keep this service running.
            <br />
            <br />
          </p>
          <a
            href="https://www.paypal.com/paypalme2/fstein42/3"
            class="button"
            rel="noopener noreferrer"
            target="_blank"
            style="margin: 0 5px;"
          >
            <span class="icon">
              <i class="fab fa-paypal"></i>
            </span>
            <span>Donate on PayPal</span>
          </a>
          <a
            href="https://www.patreon.com/flxn"
            class="button"
            rel="noopener noreferrer"
            target="_blank"
            style="margin: 0 5px;"
          >
            <span class="icon">
              <i class="fab fa-patreon"></i>
            </span>
            <span>Donate on Patreon</span>
          </a>
          <a
            href="https://ko-fi.com/flxn256"
            class="button"
            rel="noopener noreferrer"
            target="_blank"
            style="margin: 0 5px;"
          >
            <span class="icon">
              <img
                src="../assets/cup-border.png"
                width="24"
                loading="lazy"
                alt="Support Me on Ko-Fi"
              />
            </span>
            <span>Donate on Ko-Fi</span>
          </a>
          <p>
            <br />If you can't afford to donate that's totally okay but please consider telling your friends about BadTranslator.
            <br />Thank you very much for your support and have fun!
          </p>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="setDonationModalDisabled()">I already donated 🥰</button>
          <button
            class="button is-warning"
            @click="setDonationModalPostponed()"
          >I'll think about it 🙂</button>
          <button
            class="button is-danger"
            @click="setDonationModalDisabled()"
          >Away you greedy idiot 😢</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios").default;
import ShareButtons from "./ShareButtons.vue";
import { EventBus } from "../eventBus.js";

export default {
  name: "Main",
  props: {
    msg: String
  },
  components: {
    ShareButtons
  },
  data() {
    return {
      broken1: this.randomTransform(),
      broken2: this.randomTransform(),
      broken3: this.randomTransform(),
      broken4: this.randomTransform(),
      globeEmoji: ["🌍", "🌏", "🌎"],
      animationRunning: true,
      maxInputLength: 1000,
      availableLanguages: {},
      translationRounds: 5,
      inputLanguage: window.localStorage.getItem("lang") || "",
      inputText: "",
      outputText: "",
      errorNoLanguage: false,
      errorNoText: false,
      steps: [],
      translationInProgress: false,
      errorMessages: [],
      showDonationModal: false,
      translationCount: 0
    };
  },
  mounted() {
    this.getAvailableLanguages();
    this.animate();
    EventBus.$on("donate-button-clicked", () => {
      this.showDonationModal = true;
    });
    this.translationCount =
      Number(window.localStorage.getItem("translationCount")) || 0;
  },
  methods: {
    async getAvailableLanguages() {
      const res = await axios.get("http://localhost:3000/languages");
      this.availableLanguages = res.data;
    },
    randomTransform() {
      return `rotateZ(${Math.round(Math.random() * 12) - 6}deg)`;
    },
    randomizeTitle() {
      this.broken1 = this.randomTransform();
      this.broken2 = this.randomTransform();
      this.broken3 = this.randomTransform();
      this.broken4 = this.randomTransform();
      this.globeEmoji.push(this.globeEmoji.shift());
    },
    getTranslationChain(inputLang) {
      const translationChain = [];
      const languageCodes = Object.keys(this.availableLanguages);
      for (let i = 0; i < this.translationRounds - 1; i++) {
        const code =
          languageCodes[Math.floor(Math.random() * languageCodes.length)];
        if (translationChain.indexOf(code) !== -1 || code === inputLang) {
          // duplicate language, try again
          i--;
        } else {
          translationChain.push(code);
        }
      }
      return translationChain;
    },
    async translate(text, from, to) {
      let res;
      try {
        res = await axios.post("http://localhost:3000/translate", {
          text: text,
          from: from,
          to: to
        });
      } catch (e) {
        console.log(e);
        this.errorMessages.push("An error occured during translation");
        throw e;
      }

      return res.data.text;
    },
    animate() {
      setTimeout(() => {
        if (this.animationRunning) {
          this.randomizeTitle();
        }
        this.animate();
      }, 1000);
    },
    async startTranslation() {
      this.outputText = "";
      this.steps = [];
      this.errorMessages = [];
      this.errorNoText = this.inputText === "";
      this.errorNoLanguage = this.inputLanguage === "";
      if (this.errorNoText || this.errorNoLanguage) {
        return;
      }

      if (this.inputText.length > this.maxInputLength) {
        this.errorMessages.push(
          `Your text is too long. Maximum is ${this.maxInputLength} characters.`
        );
        return;
      }

      this.translationInProgress = true;
      this.errorNoText = false;
      this.errorNoLanguage = false;
      const inputLang = this.inputLanguage;
      const chain = this.getTranslationChain(inputLang);
      let lastTxt = this.inputText;
      let lastLang = inputLang;
      //const container = document.querySelector("#translation-steps");
      //container.scrollIntoView();
      for (let i = 0; i < chain.length; i++) {
        const code = chain[i];
        const toName = this.availableLanguages[code];
        const fromName = this.availableLanguages[lastLang];
        try {
          lastTxt = await this.translate(lastTxt, lastLang, code);
        } catch (err) {
          this.translationInProgress = false;
          return;
        }
        this.steps.push({
          from: fromName,
          to: toName,
          text: lastTxt,
          textVisible: false
        });
        lastLang = code;
      }

      const toName = this.availableLanguages[inputLang];
      const fromName = this.availableLanguages[lastLang];
      let outTxt = "";
      try {
        outTxt = await this.translate(lastTxt, lastLang, inputLang);
      } catch (err) {
        this.translationInProgress = false;
        return;
      }
      this.steps.push({
        from: fromName,
        to: toName,
        text: outTxt,
        textVisible: false
      });

      this.outputText = outTxt;

      this.translationInProgress = false;
      // setTimeout(() => {
      //  const container = document.querySelector("#result");
      //  container.scrollIntoView();
      // }, 200);
      this.increaseCount();
    },
    languageChanged() {
      window.localStorage.setItem("lang", this.inputLanguage);
    },
    increaseCount() {
      this.translationCount =
        Number(window.localStorage.getItem("translationCount")) || 0;
      this.translationCount += 1;
      window.localStorage.setItem("translationCount", this.translationCount);
      const modalInterval =
        window.localStorage.getItem("donationModalInterval") || 10;
      const modalDisabled =
        window.localStorage.getItem("donationModalDisabled") === "true";
      if (!modalDisabled && this.translationCount % modalInterval == 0) {
        this.showDonationModal = true;
      }
    },
    setDonationModalPostponed() {
      window.localStorage.setItem("donationModalInterval", 30);
      this.showDonationModal = false;
    },
    setDonationModalDisabled() {
      window.localStorage.setItem("donationModalDisabled", true);
      this.showDonationModal = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pagetitle {
  font-size: 5rem;
  font-weight: bold;
  margin: 30px 0;
}
.pagetitle > div {
  display: inline-block;
  transition: transform 0.5s;
}

#translateButton {
  font-weight: bold;
}

.emojiglobe {
  margin: 0 10px;
}

.inputForm {
  max-width: 600px;
  margin: 0 auto;
}

.dropdown-menu {
  height: 400px;
  overflow-y: scroll;
}

#translation-steps {
  margin-top: 30px;
  min-height: 100px;
}

@-webkit-keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.step {
  -webkit-animation: fade-in 1s ease-in 1;
  animation: fade-in 1s ease-in 1;
  border-radius: 10px;
  margin: 10px 0;
}

.step > .columns > i {
  line-height: 35px;
  text-align: center;
  font-size: 25px;
  color: #222;
}

.step > .columns > div {
  display: inline-block;
}

.step:hover {
  cursor: pointer;
}

.step:hover .board > .letter {
  background-color: #222;
  color: #fafafa;
  border: 1px solid #ddd;
}

.board > .letter {
  font-family: "Roboto Mono", monospace;
  font-size: 25px;
  font-weight: bold;

  color: #222;
  background-color: #fafafa;
  display: inline-block;
  width: 30px;
  height: 35px;
  line-height: 35px;

  text-align: center;
  border: 1px solid #555;
  margin-left: -1px;
  border-radius: 3px;
}

.board.from {
  text-align: right;
}

.board.to {
  text-align: left;
}

#result {
  margin: 30px 0;
}

.output {
  max-width: 900px;
  margin: 0 auto;
  text-align: left;
  line-height: 1.75;
  font-size: 1.1rem;
  color: #222;
  padding: 20px;
  border: 1px solid #555;
  border-radius: 5px;
  white-space: pre-line;
}

.step-output {
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.75;
  border: 1px solid #555;
  border-radius: 5px;
  white-space: pre-line;
  padding: 10px;
  text-align: left;
  -webkit-animation: fade-in .1s ease-in 1;
  animation: fade-in .1s ease-in 1;
}

#pandemic-tag {
  position: absolute;
  margin-left: 10px;
  margin-bottom: -20px;
  width: 100px;
  height: 100px;
}
</style>

