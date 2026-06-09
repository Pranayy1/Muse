let txt = null;

export const decodeHTML = (html) => {
  if (!html || typeof html !== 'string') return '';
  if (!txt) {
    txt = document.createElement('textarea');
  }
  txt.innerHTML = html;
  return txt.value;
};
