// Drop-in ESM shim for the CJS `debug` package. The real `debug`
// references `module.exports`, which throws "module is not defined"
// when astro dev runs under @cloudflare/vite-plugin's workerd runner.
// `obug` is a fork that is ESM-native but exports only named bindings;
// most consumers do `import debug from "debug"` or `require("debug")`
// and then call `debug("ns")`, so we re-expose a compatible default.
import { createDebug, disable, enable, enabled, namespaces } from "obug";

export default createDebug;
export { createDebug, disable, enable, enabled, namespaces };
