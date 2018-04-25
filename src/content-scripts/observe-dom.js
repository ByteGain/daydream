// https://stackoverflow.com/a/14570614/1248811

const observeDOM = (() => {
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
    eventListenerSupported = window.addEventListener;

  return (obj, callback) => {
    if(MutationObserver) {
      // define a new observer
      const obs = new MutationObserver((mutations, observer) => {
        if(mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
          callback();
        }
      });
      // have the observer observe foo for changes in children
      obs.observe(obj, { childList: true, subtree: true });
    } else if(eventListenerSupported) {
      obj.addEventListener('DOMNodeInserted', callback, false);
      obj.addEventListener('DOMNodeRemoved', callback, false);
    }
  };
})();

export default observeDOM;
