import Selector from 'css-selector-generator'
import observeDOM from './observe-dom.js'
import { debounce } from './debounce.js'

const selector = new Selector();

class EventRecorder {
  addEventHandlers() {
    const typeableElements = document.querySelectorAll('input, textarea');
    const clickableElements = document.querySelectorAll('a, button');

    for (let i = 0; i < typeableElements.length; i++) {
      typeableElements[i].addEventListener('keydown', debounce(EventRecorder.sendMessage, 500));
    }

    for (let i = 0; i < clickableElements.length; i++) {
      clickableElements[i].addEventListener('click', EventRecorder.handleClick);
    }
  }

  removeEventHandlers() {
    const typeableElements = document.querySelectorAll('input, textarea');
    const clickableElements = document.querySelectorAll('a, button');

    for (let i = 0; i < typeableElements.length; i++) {
      typeableElements[i].removeEventListener('keydown', debounce(EventRecorder.handleKeydown, 500));
    }

    for (let i = 0; i < clickableElements.length; i++) {
      clickableElements[i].removeEventListener('click', EventRecorder.handleClick);
    }
  }

  static handleClick(e) {
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

debounce(observeDOM(document.querySelector('body') , () => {
  console.log('%c dom updated', 'color: #b0b');
  eventRecorder.removeEventHandlers();
  eventRecorder.addEventHandlers();
}), 250);
