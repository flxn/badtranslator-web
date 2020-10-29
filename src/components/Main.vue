<template>
  <div class="container has-text-centered">
    <h1 class="title pagetitle">
      <div :style="{transform: broken1}">Bad</div>
      <!--<div :style="{transform: broken2}">ken</div>-->
      <div :style="{transform: broken3}">Trans</div>
      <div :style="{transform: broken4}">lator</div>
      <div id="pandemic-tag" class="is-hidden-mobile">
        <img
          src="../assets/social-distancing-200.png"
          alt="Social-Distancing approved!"
          width="200"
          height="200"
        />
      </div>
    </h1>

    <h2 class="subtitle" v-html="$t('subtitle')">
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
                  <option value disabled default selected>{{ $t('selectLanguage') }}</option>
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
                  :title="$t('translationRoundsHelp')">
                  <option v-for="n in [3,4,5,6,7,8]" :key="`rnd-${n}`" :value="n">{{ $t('translationRounds', {n: n}) }}</option>
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
                  <option value="-1" selected disabled default>{{ $t('useExample') }}</option>
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
                :placeholder="$t('textInputPlaceholder')"
                v-model="inputText"
                @change="onInputTextChanged"
                @focus="selectText"
              ></textarea>
              <span class="counter">{{inputText.length}}/{{maxInputLength}}</span>
            </div>
          </div>

          <div class="notification is-danger" v-for="error in errorMessages" :key="error">{{error}}</div>

          <button
            id="translateButton"
            :class="{'button': true, 'is-primary': true, 'is-large': true, 'is-loading': translationInProgress}"
            @click="startTranslation"
          >{{ $t('translateButton') }}</button>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div id="translation-steps">
          <div
            class="step"
            v-for="(step, idx) in steps"
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
              <i class="fa fa-arrow-right column is-narrow is-hidden-mobile"></i>
              <i class="fa fa-arrow-down column is-narrow is-hidden-tablet"></i>
              <div :class="{'board': true, 'to': true, 'column': true, 'is-hidden-mobile': (idx !== steps.length - 1)}">
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
          <p class="output box" v-if="outputText">{{outputText}}</p>
          <ShareButtons
            v-if="outputText"
            style="margin-top: 30px"
            :callToAction="$t('shareTranslation')"
            :title="$t('shareTranslationTitle')"
            :text="outputText + ' (Translated with badtranslator.net)'"
          />
          <button
            :class="{'button': true, 'is-primary': true, 'is-loading': translationInProgress}"
            @click="startTranslation"
            v-if="outputText"
            style="margin-top: 30px"
          >{{ $t('tryAgain') }}</button>
          <p v-if="outputText" style="margin-top: 30px" v-html="$t('tryAgainDescription')"></p>
        </div>

        <hr />
        <h3 class="title">{{ $t('howItWorksTitle') }}</h3>
        <div class="content" style="max-width: 960px; margin: 0 auto;">
          <p v-html="$t('howItWorksParagraph1')"></p>
          <p v-html="$t('howItWorksParagraph2')"></p>
          <blockquote style="text-align: left" v-html="$t('howItWorksQuote')"></blockquote>
        </div>
      </div>
    </div>
    <div :class="{'modal': true, 'is-active': showDonationModal}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ $t('supportModalTitle') }} 👋</p>
          <button class="delete" aria-label="close" @click="showDonationModal = false"></button>
        </header>
        <section class="modal-card-body">
          <p v-html="$t('supportModalText', {translationCount: translationCount})"></p>
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
            <span v-html="$t('donateOnX', {x: 'PayPal'})"></span>
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
            <span v-html="$t('donateOnX', {x: 'Patreon'})"></span>
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
            <span v-html="$t('donateOnX', {x: 'Ko-Fi'})"></span>
          </a>
          <br/>
          <br/>
          <p v-html="$t('supportModalThanks')"></p>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="setDonationModalDisabled()">{{ $t('alreadyDonated') }} 🥰</button>
          <button
            class="button is-warning"
            @click="setDonationModalPostponed()"
          >{{ $t('thinkingAboutDonating') }} 🙂</button>
          <button
            class="button is-danger"
            @click="setDonationModalPostponed()"
          >{{ $t('wontDonate') }} 😢</button>
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
      maxInputLength: 600,
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
      specialCommand: "💩",
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
          title: "Ring Verse (LOTR)",
          text: "Three Rings for the Elven-kings under the sky,\nSeven for the Dwarf-lords in their halls of stone,\nNine for Mortal Men doomed to die,\nOne for the Dark Lord on his dark throne\nIn the Land of Mordor where the Shadows lie.\nOne Ring to rule them all, One Ring to find them,\nOne Ring to bring them all, and in the darkness bind them,\nIn the Land of Mordor where the Shadows lie."
        },
        {
          title: "Lord's Prayer",
          text:
            "Our Father in heaven,\nhallowed be your name,\nyour kingdom come,\nyour will be done,\non earth as in heaven.\nGive us today our daily bread.\nForgive us our sins\nas we forgive those who sin against us.\nSave us from the time of trial\nand deliver us from evil.\nFor the kingdom, the power, and the glory are yours\nnow and for ever. Amen."
        },
        /*{
          title: "Pride and Prejudice",
          text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.\nHowever little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families that he is considered as the rightful property of some one or other of their daughters.\n\"My dear Mr. Bennet,\" said his lady to him one day, \"have you heard that Netherfield Park is let at last?\"\nMr. Bennet replied that he had not.\n\"But it is,\" returned she; \"for Mrs. Long has just been here, and she told me all about it.\"\nMr. Bennet made no answer."
        },
        {
          title: "Cheesecake Recipe",
          text: "New York Style Cheesecake Recipe\n\nIngredients:\n\nFilling:\n12 oz. softened cream cheese\n1/2 tsp. vanilla extract\n1 c. sugar\n3 eggs\n\nCrust:\n1 c. graham cracker crumbs\n¼ c. sugar\n7 Tbs. melted butter\n\nFoods for Garnish:\nChocolate glaze (recipe below)\nWhipped cream\nCherries\n\nDirections:\nPreheat oven to 350 degrees F.\n\nFilling:\nBeat the cream cheese and then mix in sugar and vanilla while beating until well blended. Add in eggs and combine. Pour mixture into prepared crust. Bake for 45 minutes. Remove from oven and let cool to room temperature. Refrigerate overnight. When ready to serve, top with chocolate glaze, cherries, and whipped cream.\n\nCrust:\nIn a medium size bowl, combine the graham cracker crumbs with the butter and sugar. Mix well and pour into an 8-inch springform cake pan. Make sure to press against the sides and bottom of the pan. Place into oven and bake for 8 minutes. Let cool.\n",
        },
        {
          title: "Macaroni And Cheese Recipe",
          text: "Ingredients:\n1/2 pound cheddar cheese, grated\n1 teaspoon cornstarch\n2 quarts water\n1 tablespoon salt\n2 cups uncooked elbow macaroni\n2 tablespoons unsalted butter\n2 tablespoons flour\n1 1/4 cup milk, heated until steamy\n1/2 teaspoon lemon juice\n1/4 cup ham\n\nIn a medium sized bowl, mix cornstarch with the grated cheese. The cornstarch will help the cheese from getting too stringy.\nHeat 2 quarts of water with a tablespoon of salt to a rolling boil in thick-bottomed saucepan. \nAdd 2 cups of elbow macaroni and follow the cooking time instructions on the package, minus about 2 minutes.\nWhile the macaroni is cooking, prepare the sauce: Melt 2 Tbsp butter in a large saucepan on medium heat. Whisk in 2 Tbsp flour. Let cook for about a minute.\nSlowly dribble in 1 1/4 cups milk, while whisking until the sauce is smooth.\nSlowly add the grated cheese, whisking until smooth. Stir in the lemon juice.\nAdd the cooked macaroni and ham to the cheese sauce. Stir to combine.",
        }*/
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

      if (!this.inputText.startsWith(this.specialCommand) && this.inputText.length > this.maxInputLength) {
        this.errorMessages.push(
          `Your text is too long. Maximum is ${this.maxInputLength} characters.`
        );
        return;
      }

      this.trackTranslationEvent();

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
      window.localStorage.setItem("donationModalInterval", 20);
      this.showDonationModal = false;
    },
    setDonationModalDisabled() {
      window.localStorage.setItem("donationModalDisabled", true);
      this.showDonationModal = false;
    },
    trackTranslationEvent() {
      const details = `Rounds: ${this.translationRounds}, Total Count: ${this.translationCount}`;
      // eslint-disable-next-line no-underscore-dangle
      window._paq.push(['trackEvent', 'badtranslator', 'Translate', details]);
    },
    selectText(e) {
      e.target.select();
    },
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
  color: #303030;
  margin: 0 auto;
  text-align: left;
  line-height: 1.75;
  font-size: 1.1rem;
  padding: 20px;
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: 5px;
  white-space: pre-line;
}

.step-output {
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.75;
  border: 1px solid rgba(0,0,0,0.2);
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
}

.input-controls > .control {
  display: inline-block;
  margin-right: 15px;
}
</style>

