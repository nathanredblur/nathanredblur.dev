// Drop-in ESM shim for the CJS `debug` package. The real `debug`
// references `module.exports`, which throws "module is not defined"
// when astro dev runs under @cloudflare/vite-plugin's workerd runner.
// `obug` is a fork that is ESM-native but exports only named bindings;
// most consumers do `import debug from "debug"` or `require("debug")`
// and then call `debug("ns")`, so we re-expose a compatible default.
//
// TODO: Remove this shim, the alias in astro.config.mjs, and the `obug`
// dep from package.json once withastro/astro#16569 ships in a release
// of @astrojs/cloudflare. The upstream fix carries the same workaround
// inside the adapter itself, so we won't need it here anymore.
import { createDebug, disable, enable, enabled, namespaces } from "obug";

export default createDebug;
export { createDebug, disable, enable, enabled, namespaces };
