// Thin analytics abstraction — no provider is wired in yet, so this is a
// no-op until `window.gtag` (Google Analytics) or an equivalent is added.
// Every call site in the app already uses this instead of talking to a
// provider directly, so wiring one in later is a one-line change here.
//
// Never pass file contents, passwords, or other private text as `params` —
// only tool identifiers and coarse outcome flags.
export function trackEvent(name, params = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}
