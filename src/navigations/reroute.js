import { started } from "../start"
import { getAppChanges } from "../applications/app"
import { toLoadPromise } from '../lifecycles/load'
import { toUnmountPromise } from "../lifecycles/unmount"
import { toBootstrapPromise } from "../lifecycles/bootstrap"
import { toMountPromise } from "../lifecycles/mount"

import './navigator-events'

export function reroute() {
  // 需要获取要加载的应用
  // 需要获取要被挂载的应用
  // 哪些应用需要卸载
  const { appsToUnmount, appsToLoad, appsToMount } = getAppChanges()
  console.log(appsToUnmount, appsToLoad, appsToMount)

  // 由于 register 和 start 可能在外部同步调用，所以这里可能会执行两遍 toLoadPromise，需要在 load 中处理一下
  if (started) {
    console.log('调用start方法')
    // app装载
    return performAppChanges()
  } else {
    console.log('调用 register')
    // 注册应用时，需要预先加载
    return loadApps() // 预加载应用
  }

  async function loadApps() {
    // 预加载应用
    let apps = await Promise.all(appsToLoad.map(toLoadPromise)) // 获取到 子应用 导出的bootstrap, mount, unmount方法放到app上
    console.log('apps', apps)
  }

  async function performAppChanges() {
    // 根据路径来装载应用
    // 1. 先卸载不需要的应用
    let unmountPromise = appsToUnmount.map(toUnmountPromise)
    // 2. 去加载需要的应用 加载=>启动=>挂载
    appsToLoad.map(async (app) => {
      app = await toLoadPromise(app)
      app = await toBootstrapPromise(app)
      return await toMountPromise(app)
    })
    appsToMount.map(async (app) => {
      app = await toBootstrapPromise(app)
      return await toMountPromise(app)
    })
  }
}
