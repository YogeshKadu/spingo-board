import { AudioController } from "./Entity/AudioController.js";
import GameEvent from "./Entity/GameEvent.js";
import { SOUNDS } from "./Entity/sounds.js";
import { defaultSettings } from "./utils/settings.js";

window.resetGameEvent = new GameEvent();
window.startGameEvent = new GameEvent();
window.updateBoardEvent = new GameEvent();
window.pauseGameEvent = new GameEvent();
window.resumeGameEvent = new GameEvent();
window.overGameEvent = new GameEvent();


const inGameHomeButton = document.getElementById("home");
const inGameMuteButton = document.getElementById("mute");
const inGameRestartButton = document.getElementById("restart");
const inGameHelpButton = document.getElementById("help");
const inGameHelpDialogElement = document.getElementById("help-dialog");
const inGameCloseModalButton = document.getElementById("data-close-modal");
const inGameEnemyName = document.getElementById("playerName");
const inGameOverModal = document.getElementById("game-over");
const cancelGameOverModalButton = document.getElementById("over-cancel");
const replayGameOverButton = document.getElementById("over-retry");
const homeGameOverButton = document.getElementById("over-home");

// start buttons
const playBotButton = document.getElementById("play-bot");
const playEnemyButton = document.getElementById("play-enemy");
const easyGameButton = document.getElementById("easy-game");
const complexGameButton = document.getElementById("complex-game");
// sections
const mainSection = document.getElementById("main-menu");
const gameBoardSection =document.getElementById("game-board");

window.audioController = new AudioController();

const InitializeSettings = () => {
    window.settings = { ...JSON.parse(JSON.stringify(defaultSettings.settings))};
    window.player = { ...JSON.parse(JSON.stringify(defaultSettings.player))};
    window.enemy = { ...JSON.parse(JSON.stringify(defaultSettings.enemy))};
    window.game = { ...JSON.parse(JSON.stringify(defaultSettings.game))};
}
InitializeSettings();

Object.entries(SOUNDS).forEach(([name, src]) => {
  window.audioController.load(name, src);
});
//#region custom Events
window.startGameEvent.subscribe("start-ui", () => {
    inGameOverModal.close();
    audioController.stopAll();
})
window.overGameEvent.subscribe("end-ui-and-settings",() => {
    const banner = inGameOverModal.querySelector("h1");
    const { playWith } = window.settings;
    const { winner, isGameDraw } = window.game;
    if(isGameDraw) {
        banner.innerHTML = "ITS A DRAW!";
    } else {
        if(winner != "player") {
            if(playWith == "bot") 
                banner.innerHTML = "BOT WINS!";
            else
                banner.innerHTML = "ENEMY WINS!";
        } else 
            banner.innerHTML = "PLAYER WINS!";
    }
    setTimeout(()=> {
        const audioKey = winner != "player" && playWith == "bot" ? "LOSE" : "WIN";
        audioController.play(audioKey);
        inGameOverModal?.showModal();
    },1000)
});
//#endregion

//#region init functions
const HandleGameStart = () => {
    const { playWith } = window.settings;
    console.log("started Game");
    const isOk = confirm("Are you sure you want to restart the game ?");
    if(isOk) {
        HandlePlay(playWith);
    }
}
const HandleAudioToggle = () => {
    const { sfx = true } = window?.settings?.audio || {};
    window.settings.audio.sfx = !sfx; // assuming initially its active;
    const icons = inGameMuteButton.querySelectorAll('svg');
    console.log(sfx, window.settings.audio.sfx,'\n',icons);
    if(sfx) {
        icons[0].classList.add('hidden');
        icons[1].classList.remove('hidden');
    } else {
        icons[0].classList.remove('hidden');
        icons[1].classList.add('hidden');
    }
    audioController.setMuteState(sfx);
}
const HandleOpenHelpDialog = () => {
    inGameHelpDialogElement.showModal();
}
const HandleCloseHelpDialog = () => {
    inGameHelpDialogElement.close();
}
const HandlePlay = (playWith) => {
    mainSection.classList.add("hidden");
    gameBoardSection.classList.remove("hidden");
    inGameEnemyName.textContent = playWith != "bot" ? "ENEMY" : "bot";
    window.settings.playWith = playWith;
    window.game = { ...defaultSettings.game,  };
    window.startGameEvent.trigger();
}
const BackToHome = () => {
    window.game = {...JSON.parse(JSON.stringify(defaultSettings.game))};
    if(window.settings.complexity == "easy") {
        HandlePlayEasyGame();
    }else {
        HandlePlayComplexGame();
    }
    audioController.stopAll();
    mainSection.classList.remove("hidden");
    gameBoardSection.classList.add("hidden");
}
const HandlePlayEasyGame = () => {
    audioController.play("CLICK");
    window.settings.complexity = "easy";
    easyGameButton.children[0].classList.remove("border-2");
    easyGameButton.children[0].classList.add("bg-white");
    complexGameButton.children[0].classList.remove("bg-white");
    complexGameButton.children[0].classList.add("border-2");
}
const HandlePlayComplexGame = () => {
    audioController.play("CLICK");
    window.settings.complexity = "complex";
    easyGameButton.children[0].classList.remove("bg-white");
    easyGameButton.children[0].classList.add("border-2");
    complexGameButton.children[0].classList.remove("border-2");
    complexGameButton.children[0].classList.add("bg-white");
}
const HandleCloseGameOverModal = () => {
    inGameOverModal?.close();
}
const HandleReplayGame = () => {
    const { playWith } = window.settings;
    HandlePlay(playWith);
}
//#endregion

//#region Event Listeners
if(inGameRestartButton) 
    inGameRestartButton.addEventListener("click", () => HandleGameStart());
if(inGameMuteButton)
    inGameMuteButton.addEventListener("click", () => HandleAudioToggle());
if(inGameHelpButton)
    inGameHelpButton.addEventListener("click", () => HandleOpenHelpDialog());
if(inGameCloseModalButton)
    inGameCloseModalButton.addEventListener("click", () => HandleCloseHelpDialog());
if(inGameHomeButton)
    inGameHomeButton.addEventListener("click", () => BackToHome());

if(playBotButton)
    playBotButton.addEventListener("click", () => HandlePlay("bot"));
if(playEnemyButton)
    playEnemyButton.addEventListener("click", () => HandlePlay("player"));
if(easyGameButton)
    easyGameButton.addEventListener("click", () => HandlePlayEasyGame());
if(complexGameButton)
    complexGameButton.addEventListener("click", () => HandlePlayComplexGame());

if(cancelGameOverModalButton)
    cancelGameOverModalButton.addEventListener("click", () => HandleCloseGameOverModal());
if(replayGameOverButton)
    replayGameOverButton.addEventListener("click", () => HandleReplayGame());
if(homeGameOverButton)
    homeGameOverButton.addEventListener("click", () => { HandleCloseGameOverModal(), BackToHome()});

//#endregion
