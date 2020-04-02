<template>
  <div class="container has-text-centered">
    <h1 class="title pagetitle">
      <div :style="{transform: broken1}">Bad</div>
      <!--<div :style="{transform: broken2}">ken</div>-->
      <div :style="{transform: broken3}">Trans</div>
      <div :style="{transform: broken4}">lator</div>
      <div id="pandemic-tag">
        <img
          src="../assets/social-distancing-200.png"
          alt="Social-Distancing approved!"
          width="200"
          height="200"
        />
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
          <div class="field input-controls">
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

            <div class="control">
              <div class="select">
                <select
                  name="translationRounds"
                  id="translationRounds"
                  v-model="translationRounds"
                  title="Select how many rounds of translation you like."
                >
                  <option value="3">Translate 3 times</option>
                  <option value="4">Translate 4 times</option>
                  <option value="5">Translate 5 times</option>
                  <option value="6">Translate 6 times</option>
                  <option value="7">Translate 7 times</option>
                  <option value="8">Translate 8 times</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <div class="select">
                <select
                  name="exampleSelect"
                  id="exampleSelect"
                  v-model="selectedExampleIdx"
                  @change="onExampleSelected"
                >
                  <option value="-1" selected disabled default>Use an example</option>
                  <option
                    v-for="(ex, index) of examples"
                    :key="`ex-${index}`"
                    :value="index"
                  >{{ex.title}}</option>
                </select>
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
                @change="onInputTextChanged"
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
      endpoint: process.env.VUE_APP_API_ENDPOINT,
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
      translationCount: 0,
      selectedExampleIdx: -1,
      examples: [
        {
          title: "Queen - Bohemian Rhapsody",
          text:
            "Is this the real life?\nIs this just fantasy?\nCaught in a landslide,\nNo escape from reality.\n\nOpen your eyes,\nLook up to the skies and see,\nI'm just a poor boy, I need no sympathy,\nBecause I'm easy come, easy go,\nLittle high, little low,\nAny way the wind blows doesn't really matter to me, to me.\n\nMama, just killed a man,\nPut a gun against his head,\nPulled my trigger, now he's dead.\nMama, life had just begun,\nBut now I've gone and thrown it all away.\n\nMama, ooh,\nDidn't mean to make you cry,\nIf I'm not back again this time tomorrow,\nCarry on, carry on as if nothing really matters."
        },
        {
          title: "Avril Lavigne - Sk8er Boi",
          text:
            "He was a boy.\nShe was a girl.\nCan I make it anymore obvious?\nHe was a punk.\nShe did ballet.\nWhat more can I say?\nHe wanted her.\nShe'd never tell.\nSecretly she wanted him as well.\nAnd all of her friends stuck up their nose.\nThey had a problem with his baggy clothes."
        },
        {
          title: "Lord's Prayer",
          text:
            "Our Father in heaven,\nhallowed be your name,\nyour kingdom come,\nyour will be done,\non earth as in heaven.\nGive us today our daily bread.\nForgive us our sins\nas we forgive those who sin against us.\nSave us from the time of trial\nand deliver us from evil.\nFor the kingdom, the power, and the glory are yours\nnow and for ever. Amen."
        },
        {
          title: "Universal Declaration of Human Rights",
          text: "Article I\nAll human beings are born free and equal in dignity and rights. They are\nendowed with reason and conscience and should act towards one another in a\nspirit of brotherhood.\n\nArticle 2\nEveryone is entitled to all the rights and freedoms set forth in this Declaration,\nwithout distinction of any kind, such as race, colour, sex, language, religion,\npolitical or other opinion, national or social origin, property, birth or other status.\nFurthermore, no distinction shall be made on the basis of the political,\njurisdictional or international status of the country or territory to which a person\nbelongs, whether it be independent, trust, non-self-governing or under any other\nlimitation of sovereignty.\n\nArticle 3\nEveryone has the right to life, liberty and the security of person."
        },
        {
          title: "Pride and Prejudice",
          text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.\nHowever little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families that he is considered as the rightful property of some one or other of their daughters.\n\"My dear Mr. Bennet,\" said his lady to him one day, \"have you heard that Netherfield Park is let at last?\"\nMr. Bennet replied that he had not.\n\"But it is,\" returned she; \"for Mrs. Long has just been here, and she told me all about it.\"\nMr. Bennet made no answer."
        },
        {
          title: "I have a dream (Martin Luther King)",
          text: "And so even though we face the difficulties of today and tomorrow, I still have a dream. It is a dream deeply rooted in the American dream.\n\nI have a dream that one day this nation will rise up and live out the true meaning of its creed: \"We hold these truths to be self-evident, that all men are created equal.\"\n\nI have a dream that one day on the red hills of Georgia, the sons of former slaves and the sons of former slave owners will be able to sit down together at the table of brotherhood.\n\nI have a dream that one day even the state of Mississippi, a state sweltering with the heat of injustice, sweltering with the heat of oppression, will be transformed into an oasis of freedom and justice."
        }
      ],
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
      const res = await axios.get(this.endpoint + "/languages");
      for(const lang of res.data) {
        this.availableLanguages[lang.code] = lang.name;
      }
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
        res = await axios.post(this.endpoint + "/translate", {
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
    onExampleSelected() {
      if (this.selectedExampleIdx >= 0) {
        this.inputText = this.examples[this.selectedExampleIdx].text;
        this.inputLanguage = "en";
      }
    },
    onInputTextChanged() {
      this.selectedExampleIdx = -1;
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
  -webkit-animation: fade-in 0.1s ease-in 1;
  animation: fade-in 0.1s ease-in 1;
}

#pandemic-tag {
  position: absolute;
  margin-left: 10px;
  margin-bottom: -20px;
  width: 100px;
  height: 100px;
}

.input-controls {
  text-align: left;
  margin-bottom: ;
}

.input-controls > .control {
  display: inline-block;
  margin-right: 15px;
}
</style>

