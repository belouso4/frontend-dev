export function highlightComment(element) {

  window.addEventListener('scroll', debounce(once(() => {
      if (isElementVisible(element)) {
        element.classList.add('active')
        setTimeout(() => element.classList.remove('active'), 3000)
       }
    }, true ),200)
  );
}

// const once = fn => {
//   let called = false;
//   return function(...args) {
//     if (called) return;
//     called = true;
//     return fn.apply(this, args);
//   };
// };
const once = (fn, t = false ) => {
  let called = false;
  return function(...args) {
    if (called) return;
    called = t;
    return fn.apply(this, args);
  };
};

function isElementVisible(el) {
  var rect = el.getBoundingClientRect();

  return rect.bottom > 0 &&
    rect.right > 0 &&
    rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
    rect.top < (window.innerHeight || document.documentElement.clientHeight);
}

function debounce(func, wait) {
  let timeout;
  return () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(func, wait)
  }
}
