import Selector from 'css-selector-generator'
import observeDOM from './observe-dom.js'

const selector = new Selector();

class EventRecorder {
  addEventHandlers() {
    const typeableElements = document.querySelectorAll('input, textarea');
    const clickableElements = document.querySelectorAll('a, button');

    for (let i = 0; i < typeableElements.length; i++) {
      typeableElements[i].addEventListener('keydown', this.handleKeydown);
    }

    for (let i = 0; i < clickableElements.length; i++) {
      clickableElements[i].addEventListener('click', this.handleClick);
    }
  }

  removeEventHandlers() {
    const typeableElements = document.querySelectorAll('input, textarea');
    const clickableElements = document.querySelectorAll('a, button');

    for (let i = 0; i < typeableElements.length; i++) {
      typeableElements[i].removeEventListener('keydown', this.handleKeydown);
    }

    for (let i = 0; i < clickableElements.length; i++) {
      clickableElements[i].removeEventListener('click', this.handleClick);
    }
  }

  handleKeydown(e) {
    console.log('%c record key', 'color: #b0b');
    EventRecorder.sendMessage(e);
  }

  handleClick(e) {
    console.log('%c record click', 'color: #b0b');
    if (e.target.href) {
      chrome.runtime.sendMessage({
        action: 'url',
        value: e.target.href,
      });
    }
    EventRecorder.sendMessage(e);
  }

  static sendMessage(e) {
    chrome.runtime.sendMessage({
      selector: selector.getSelector(e.target),
      value: e.target.value,
      action: e.type,
    });
  }
}

console.log('%c recorder', 'color: #b0b');
const eventRecorder = new EventRecorder();
eventRecorder.addEventHandlers();

observeDOM(document.querySelector('body') ,function(){ 
  console.log('%c dom updated', 'color: #b0b');
  eventRecorder.removeEventHandlers();
  eventRecorder.addEventHandlers();
});
