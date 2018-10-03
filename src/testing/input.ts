export function input(el: HTMLInputElement, text: string) {
  // simulate user entering a new name into the input box
  el.value = text;
  // dispatch a DOM event so that Angular learns of input value change.
  el.dispatchEvent(new Event('input'));
}
