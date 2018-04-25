class Daydream {
  constructor() {
    this.isRunning = false;
    this.recorder = new Recorder();
  }

  boot() {
    // Chrome Extension pop-up
    chrome.browserAction.onClicked.addListener(() => {
      if (this.isRunning) {
        this.recorder.stop();
        chrome.storage.sync.set({ recording: this.recorder.recording });
        chrome.browserAction.setIcon({ path: './images/icon-black.png' });
        chrome.browserAction.setPopup({ popup: 'index.html' }); // to prevent caching
        chrome.browserAction.setBadgeText({ text: String.fromCharCode(0x2714) });
      } else {
        this.recorder.start();
        chrome.browserAction.setIcon({ path: './images/icon-green.png' });
      }
      this.isRunning = !this.isRunning;
    });
  }
}


class Recorder {
  constructor() {
    this.recording = [];
    this.lastUrl;
  }

  start() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const activeTab = tabs[0];
      this.handleMessage({ action: 'goto', url: activeTab.url })
    });
    chrome.tabs.onUpdated.addListener(this.handleRouteUpdate.bind(this));
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
  }

  stop() {
    chrome.webNavigation.onCommitted.removeListener();
    chrome.runtime.onMessage.removeListener();
    chrome.tabs.onUpdated.removeListener();
  }

  handleRouteUpdate(tabId, changeInfo, tab) {
    if (tab.active === true && changeInfo.status === 'complete') {
      // console.log('%c active tab update complete', 'color: #b0b', changeInfo, tab);
      this.handleMessage({ action: 'goto', url: tab.url })
    }
  }

  handleMessage(message) {
    console.log('%c message', 'color: #b0b', message);
    if (message.action === 'url') {
      this.lastUrl = message.value;
    } else {
      this.recording.push(message);
    }
  }
}


console.log('%c daydream', 'color: #b0b');

const daydream = new Daydream();
daydream.boot();
