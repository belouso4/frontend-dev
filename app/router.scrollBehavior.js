import {highlightComment} from "~/app/highlightComment.js";
const scrollBehavior = (_to, _from, _savedPosition) => {
  let top = 0;

  if (_to.hash && _to.query.comment_id) {
    const element = document.querySelector(_to.hash);

    if (element) {
      top = element.offsetTop;
      highlightComment(element)
    }
    window.scrollTo({ top, behavior: 'smooth' });
  } else {
    if (_savedPosition) {
      setTimeout(() => window.scrollTo({ top: _savedPosition.y }), 100)
    }

    return _savedPosition || { x: 0, y: 0 }
  }
};

export default scrollBehavior;


