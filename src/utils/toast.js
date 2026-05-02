// src/utils/toast.js — simple toast event bus
const listeners = [];

export const toast = {
  success: (msg) => emit({ msg, type: "success" }),
  error:   (msg) => emit({ msg, type: "error"   }),
  info:    (msg) => emit({ msg, type: "info"    }),
};

function emit(payload) {
  listeners.forEach(fn => fn(payload));
}

export function onToast(fn) {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i > -1) listeners.splice(i, 1);
  };
}