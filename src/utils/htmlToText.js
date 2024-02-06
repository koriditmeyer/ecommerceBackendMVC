import { convert } from 'html-to-text'
// There is also an alias to `convert` called `htmlToText`.

const options = {
  wordwrap: 130,
  // ...
};

export function htmlToText(html) {
    const text = convert(html, options);
    return text
  }
  