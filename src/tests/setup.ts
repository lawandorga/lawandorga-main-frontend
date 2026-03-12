// JSDOM does not implement ResizeObserver, but @headlessui/vue's Dialog uses it when opening
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
