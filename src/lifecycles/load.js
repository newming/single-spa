import { LOADING_SOURCE_CODE, NOT_BOOTSTRAP } from "../applications/app.helper";

function flattenFnArray(fns) {
  fns = Array.isArray(fns) ? fns : [fns]
  return (props) => {
    return fns.reduce(
      (p, fn) => p.then(() => fn(props)),
      Promise.resolve()
    )
  }
}

export async function toLoadPromise(app) {
  if (app.loadPromise) {
    return app.loadPromise
  }
  // 这里使用 app.loadPromise 做一步缓存，避免外部 register 和 start 同步调用导致 load 两次
  return (app.loadPromise = Promise.resolve().then(async () => {
    app.status = LOADING_SOURCE_CODE

    let { bootstrap, mount, unmount } = await app.loadApp(app.customProps)

    app.status = NOT_BOOTSTRAP // 没有调用 bootstrap
    // bootstrap 可能是数组，需要将多个promise组合到一起 compose
    app.bootstrap = flattenFnArray(bootstrap)
    app.mount = flattenFnArray(mount)
    app.unmount = flattenFnArray(unmount)
    delete app.loadPromise
    return app
  }))
}
