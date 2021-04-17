import { reroute } from './reroute'

// 路由拦截: hash路由/history路由
export const routingEventsListeningTo = ['hashchange', 'popstate']

function urlReroute (e) {
  reroute([], arguments) // 会根据路径重新加载不同的应用
  // 执行用户传入的方法
  if(capturedEventListeners[e.type]) {
    capturedEventListeners[e.type].forEach(cb => cb())
  }
}

// 后续挂载的事件先暂存起来，当应用加载完之后，依次执行
const capturedEventListeners = {
  hashchange: [],
  popstate: []
}

// 当路由切换后，重新挂载app
// hashchange
// popstate 浏览器前进后退
// h5 api 不会触发 popstate
window.addEventListener('hashchange', urlReroute)
window.addEventListener('popstate', urlReroute)

// 我们处理应用加载的逻辑在最前面
// 用户可能还会绑定自己的路由事件 vue
// 当我们应用切换后，还需要处理原来的方法，需要在应用切换后在执行
const originalAddEventListener = window.addEventListener
const originRemoveEventListener = window.removeEventListener

window.addEventListener = function (eventName, fn,) {
  if (routingEventsListeningTo.indexOf(eventName) >= 0 && !capturedEventListeners[eventName].some(listener => listener == fn)) {
    capturedEventListeners[eventName].push(fn)
    return
  }
  return originalAddEventListener.apply(this, arguments)
}
window.removeEventListener = function (eventName, fn,) {
  if (routingEventsListeningTo.indexOf(eventName) >= 0) {
    capturedEventListeners[eventName] = capturedEventListeners[eventName].filter(listener => listener !== fn)
    return
  }
  return originRemoveEventListener.apply(this, arguments)
}

function patchedUpdateState(updateState, methodName) {
  return function () {
    const urlBefore = window.location.href
    updateState.apply(this, arguments) // 调用原始切换方法
    const urlAfter = window.location.href

    if (urlBefore !== urlAfter) {
      // 重新加载应用，传入自己构建的事件源
      urlReroute(new PopStateEvent('popstate'))
    }
  }
}

window.history.pushState = patchedUpdateState(window.history.pushState, 'pushState')
window.history.replaceState = patchedUpdateState(window.history.replaceState, 'replaceState')
