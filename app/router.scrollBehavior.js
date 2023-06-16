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
  }
};

export default scrollBehavior;


