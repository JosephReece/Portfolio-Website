export function portal(node: HTMLElement, target: HTMLElement = document.body) {
  target.appendChild(node);

  return {
    update(newTarget: HTMLElement) {
      if (newTarget && newTarget !== target) {
        newTarget.appendChild(node);
        target = newTarget;
      }
    },
    destroy() {
      node.remove();
    },
  };
}
