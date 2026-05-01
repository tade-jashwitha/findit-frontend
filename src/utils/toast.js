// utils/toast.js  — tiny toast bus (no external deps needed)
let _id = 0;
let _listeners = [];

export const toast = {
  _fire(msg, type) {
    const id = ++_id;
    _listeners.forEach(fn => fn({ id, msg, type }));
  },
  success(m) { this._fire(m, "success"); },
  error(m)   { this._fire(m, "error");   },
  info(m)    { this._fire(m, "info");    },
  warn(m)    { this._fire(m, "warn");    },
  _subscribe(fn)   { _listeners.push(fn); },
  _unsubscribe(fn) { _listeners = _listeners.filter(f => f !== fn); },
};