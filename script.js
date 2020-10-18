/**
 * @author Mirmukhammad Mirsodikov
 * @version 0.0.1
 * @date October 6, 2020
 */

"use strict";

/**
 * Opening selector component that lets the user pick the letters to use. 
 */
Vue.component('opening-selection', {
    template: 
    `
        <div class="uk-card uk-card-default uk-card-body uk-width-1-2 uk-margin-auto">
            <ul uk-tab uk-switcher>
                <li class="uk-active"><a>Hiragana</a></li>
                <li><a>Katakana</a></li>
            </ul>
            <ul class="uk-switcher">
                <li>
                    <h3>Select sets to study</h3>
                    <form @submit.prevent="selectSet">
                        <fieldset class="uk-fieldset">
                            <label><input class="uk-checkbox" id="hiragana-all"         type="checkbox" value="Hiragana All Letters" 
                                v-model="studySets" @click="allSelected = !allSelected"> All Letters</label>        </br>
                            <label><input class="uk-checkbox" id="hiragana-standard"    type="checkbox" value="Hiragana Standard Letters" 
                                v-model="studySets" :disabled="allSelected"> Standard Letters</label>   </br>
                            <label><input class="uk-checkbox" id="hiragana-constants"   type="checkbox" value="Hiragana Voiced Constants" 
                                v-model="studySets" :disabled="allSelected"> Voiced Constants</label>   </br>
                        </fieldset>
                    </form>
                </li>
                <li>
                    <h3>Select sets to study</h3>
                    <form>
                        <fieldset class="uk-fieldset">
                            <label><input class="uk-checkbox" id="katakana-all"         type="checkbox" value="All Letters"> All Letters</label>        </br>
                            <label><input class="uk-checkbox" id="katakana-standard"    type="checkbox"> Standard Letters</label>   </br>
                            <label><input class="uk-checkbox" id="katakana-constants"   type="checkbox"> Voiced Constants</label>   </br>
                        </fieldset>
                    </form>
                </li>
            </ul>

            <button class="uk-button uk-button-default uk-align-right" :disabled="studySets.length == 0" @click="selectSet">Submit</button>
        </div>
    `,
    data() {
        return {
            studySets: [],
            allSelected: false
        }
    },
    methods: {
        /**
         * Depending on what the user has chosen, set the beginning and ending indexes for them to practice. 
         * Emit an event that sends over the beginning and ending indexes
         */
        selectSet() {
            // const checkboxes = document.getElementsByTagName("input");
            let begin, end;

            if (this.studySets.includes("Hiragana All Letters")) {
                begin = 0;
                end = terms.length;
                console.log(`begin: ${begin}  end: ${end}`);
            }
            else if (this.studySets.includes("Hiragana Standard Letters")) {
                begin = 0;
                end = terms.map(e => {
                    return e.term;
                }).indexOf("ん");

                console.log(`begin: ${begin}  end: ${end}`);
            } 
            else if (this.studySets.includes("Hiragana Voiced Constants")) {
                begin = terms.map(e => {
                    return e.term;
                }).indexOf("が");

                end = terms.map(e => {
                    return e.term;
                }).indexOf("ゔ") + 1;

                console.log(`begin: ${begin}  end: ${end}`);
            }

            app.setsSelected = true;

            this.$emit('study-sets', { begin, end });
        }
    }
});

/**
 * The component that holds the flashcards, `progress-container`, and  `wrong-card` 
 */
Vue.component('terms-card', {
    props: {
        range: {
            type: Object,
            required: true
        }
    },
    template:
        `
        <div class="uk-grid uk-grid-small uk-height-1-1" >
            <!-- <div class="uk-width-1-6 uk-margin-remove uk-padding-remove">
                <progress-container :correct="correct" :incorrect="incorrect" :widthCorrect="widthCorrect" :widthIncorrect="widthIncorrect"></progress-container>
            </div> -->
            <div class="uk-width-expand">
                <h1 class="uk-text-center uk-padding" style="color: white; font-family: 'Montserrat', sans-serif;">
                    Quiz App
                </h1>
                <div class="uk-card uk-card-default uk-card-hover uk-width-1-2 uk-align-center uk-margin">
                    <div v-show="!wrong">
                        <div class="uk-card-header">
                            <h1 class = "uk-text-center" style="font-size: 7em;">{{ index != values.length ? values[index].term : "Complete" }}</h1>
                        </div>
                        <div class="uk-card-body">
                            <form @submit.prevent="check">
                                <input id="inpAnswer" class="uk-input uk-width-2-3" placeholder="Write here..." v-model="answer" autocomplete="off">
                                <button id="btnAnswer" class="uk-button uk-button-default uk-align-right uk-margin-remove-bottom" v-bind:style="{ 'background-color': stl}">{{ btnText }}</button>
                            </form>
                        </div>
                        <div class="uk-card-footer">
                            <div class="uk-inline uk-align-right">
                                <a class="uk-icon-link" uk-icon="cog"></a>
                                <div uk-drop="mode: click; pos: bottom-center">
                                    <div class="uk-width-1-2">
                                        <div class="uk-card uk-card-body uk-card-primary">
                                            <ul class="uk-nav-default uk-nav-parent-icon" uk-nav>
                                                <li class="uk-active" @click="regular"><a>Regular</a></li>
                                                <li class="uk-active" @click="shuffle"><a>Shuffled</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <wrong-card v-show="wrong" :value="values[index]" :answer="answer" @continue-cards="continueCards"></wrong-card>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            index: 0,
            answer: "",
            correct: 0,
            incorrect: 0,
            values: terms,
            widthCorrect: 0,
            widthIncorrect: 0,
            wrong: false,
            stl: "",
            btnText: "Answer",
            shuffled: [],
            //terms: [ {term: "あ", def: "a"}, "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も", "ら", "り", "る", "れ", "ろ", "や", "ゆ", "よ", "わ", "を", "ん"],
        }
    },
    methods: {
        /**
         * The function that's called on the submit of the button or on enter
         * 
         * Check to see if the provided answer is correct. If so, then:
         * Change the color of the button to green, 
         * Change the text of the button, and 
         * Disable the text box and the button for a brief period.
         * 
         * Start a timeout that resets everything that needs to be reset:
         * Variables, button text and color, enable button and text input
         * 
         * If the answer provided was wrong, then increase the count of the incorrect and set "wrong" to true
         * 
         */
        check() {
            if (this.answer == this.values[this.index].def) {
                this.stl = "#affc41";
                this.btnText = "Correct!";
                document.getElementById("btnAnswer").disabled = true;
                document.getElementById("inpAnswer").disabled = true;

                setTimeout(() => {
                    ++this.index;
                    this.answer = "";
                    ++this.correct;
                    this.widthCorrect += 100 / this.values.length;
                    this.stl = "";
                    this.btnText = "Answer";
                    document.getElementById("btnAnswer").disabled = false;
                    document.getElementById("inpAnswer").disabled = false;
                    document.getElementById("inpAnswer").focus();
                }, 1000);
            }
            else {
                ++this.incorrect;
                this.wrong = true;
            }

            //this.$emit('progress-count');
        },
        /**
         * Shuffle the array "values" randombly by looping through the array and swapping elements 
         * at random. Reset varibles after the shuffle has been complete.
         */
        shuffle() {
            for (let i = 0; i < 5; i++)
                for (let i = 0; i < this.values.length; ++i) {
                    let index = Math.floor(Math.random() * this.values.length)
                    let a = this.values[i];
                    this.values[i] = this.values[index];
                    this.values[index] = a;
                }
            this.widthCorrect = 0;
            this.widthIncorrect = 0;
            this.correct = 0;
            this.index = 0;
            this.incorrect = 0;
            this.$forceUpdate();
        },
        /**
         * To go back to the normal array, reload the window.
         */
        regular() {
            location.reload();
        },
        /**
         * Gets called from the event `continue-cards` to go from the `wrong-card` component back to the regular one. 
         */
        continueCards() {
            // console.log(false);
            this.wrong = false;
            this.answer = "";
            this.widthIncorrect += 100 / this.values.length;
            // this.$forceUpdate();
            ++this.index;
        }
    },
    mounted() {
        this.values = this.values.splice(this.range.begin, this.range.end);
    }
});

/**
 * Component that displays when the input answer is incorrect. 
 * Provides the term, the correct answer, and the answer that the user input. 
 * 
 * @param {Object} value Object that holds the term and definition
 * @param {String} answer String that contains the value input by the user
 *   
 */
Vue.component('wrong-card', {
    props: {
        value: {
            type: Object,
            required: true
        },
        answer: {
            type: String,
            required: true
        }
    },
    template:
    `
        <div>
            <div class="uk-card-header">
                <h1 style="color: #e63946;">Incorrect</h1>
                <p>Term</p>
                <p>{{ value.term }}</p>
            </div>
            <div class="uk-card-body">
                <p>You said</p>
                <p>{{ answer }}</p>
            </div>
            <div class="uk-card-footer">
                <p>Definition</p>
                <p>{{ value.def }}</p>
                <form @submit.prevent="continueCards">
                    <input v-show="false">
                    <button @click="continueCards" id="btnContinue" class="uk-button uk-button-default uk-align-center uk-margin-remove-bottom" style="background-color: #2bd9fe;">Continue</button>
                </form>
            </div>
        </div>
    `,
    methods: {
        /**
         * When done looking at the wrong answer, continue with the 'terms-card` component by emitting event `continue-cards`
         */
        continueCards() {
            this.$emit('continue-cards');
        }
    }
});

/**
 * The component that holds the progress bars and number values of the correct and incorrect terms.
 * 
 * @param {Number} correct The number of terms that are correct
 * @param {Number} incorrect The number of terms that are incorrect
 * @param {Number} widthCorrect The width of the progress bar for the correct terms
 * @param {Number} widthIncorrect The width of the progress bar for the incorrect terms
 */
Vue.component('progress-container', {
    props: {
        correct: {
            type: Number,
            required: true
        },
        incorrect: {
            type: Number,
            required: true
        },
        widthCorrect: {
            type: Number, 
            required: true
        },
        widthIncorrect: {
            type: Number,
            required: true
        }
    },
    template:
    `
    <div class="uk-card uk-card-default uk-margin-remove uk-height-1-1">
        <h3 class="uk-text-center">Progress</h3>
        <div class="w3-border w3-round uk-width-1-2 uk-margin-remove-bottom uk-align-center">
            <div id="myBar" class="w3-blue w3-center" v-bind:style="{ width: widthCorrect * 1.5 }"></div>
        </div>
        <div uk-grid class="uk-grid uk-child-width-1-2 uk-margin-bottom">
            <p class="uk-margin-remove uk-text-right">Correct</p>
            <p class="uk-margin-remove uk-padding-remove uk-text-center">{{ correct }}</p>
        </div>

        <div class="w3-border w3-round uk-width-1-2 uk-margin-remove-bottom uk-align-center">
            <div id="myBarIncorrect" class="w3-red w3-center" v-bind:style="{ width: widthIncorrect }" ></div>
        </div>
        <div uk-grid class="uk-grid uk-child-width-1-2 uk-margin-bottom">
            <p class="uk-margin-remove uk-text-right uk-padding-remove">Incorrect</p>
            <p class="uk-margin-remove uk-padding-remove uk-text-center">{{ incorrect }}</p>
        </div>
    </div>
    `
});

var app = new Vue({
    el: '#app',
    data: {
        title: "Quiz App",
        setsSelected: false,
        range: {}
        // letters: "あ い う え お か き く け こ さ し す せ そ た ち つ て と な に ぬ ね の は ひ ふ へ ほ ま み む め も ら り る れ ろ や ゆ よ わ を ん",
    },
    methods: {
        selectSets(range) {
            this.range = range;
        }
    }
});


/* let style = "@keyframes moveProgress {\
    from { width: " + this.width + "%; }";
this.width += 100 / this.values.length;
style += " to { width: " + this.width + "%; } }";
// setTimeout(() => {
//     style += "#myBar { width: " + this.width + "%; }";
// }, 1000);
// style += "#myBar {\
//     animation-name: moveProgress;\
//     animation-duration: 1s;\
// }"
document.getElementById("style").innerHTML = style;
//var elem = document.getElementById("myBar");
// var id = setInterval(frame, 1000);
// function frame() {
//     if (width >= 100) {
//     clearInterval(id);
//     } else {
//     width++;
//     elem.style.width = width + '%';
//     }
// }

// UIkit.util.ready(() => {
//     var bar = document.getElementById("cBar");

//     var animate = setInterval(() => {
//         bar.value += 10;

//         if (bar.value >= bar.max) {
//             clearInterval(animate);
//         }
//     }, 1000);
// }); */


/* <div class="uk-width-1-2">
                        <div class="w3-border w3-round uk-width-1-3 uk-margin-remove-bottom">
                            <div id="myBar" class="w3-blue w3-center" v-bind:style="{ width: widthCorrect }" > </div>
                        </div>
                        <div uk-grid class="uk-grid-match uk-child-width-1-4@m">
                            <p class="uk-margin-remove">Correct</p>
                            <p class="uk-align-right uk-margin-remove">{{ correct }}</p>
                        </div>

                        <div class="w3-border w3-round uk-width-1-3 uk-margin-remove-bottom">
                            <div id="myBarIncorrect" class="w3-red w3-center" v-bind:style="{ width: widthIncorrect }" > </div>
                        </div>
                        <div uk-grid class="uk-grid-match uk-child-width-1-4@m">
                            <p class="uk-margin-remove">Incorrect</p>
                            <p class="uk-align-right uk-margin-remove">{{ incorrect }}</p>
                            </div>
                        </div> */