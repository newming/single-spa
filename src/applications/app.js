import { NOT_LOADED, BOOTSTRAPING, shouldBeActive, LOADING_SOURCE_CODE, NOT_BOOTSTRAP, NOT_MOUNTED, MOUNTED } from './app.helper'
import { reroute } from '../navigations/reroute'

const apps = [] // 用来存放所有的应用

/**
 * 注册子应用
 * @param {string} appName 应用名称
 * @param {function} loadApp 加载应用的函数
 * @param {function} activeWhen 当判断路由激活是会调用 loadApp
 * @param {any} customProps 自定义属性
 */
export function registerApplication(appName, loadApp, activeWhen, customProps) {
  // 维护应用所有的状态
  apps.push({
    name: appName,
    loadApp,
    activeWhen,
    customProps,
    status: NOT_LOADED
  })
  reroute()
}

export function getAppChanges() {
  const appsToUnmount = [] // 要卸载的app
  const appsToLoad = [] // 要加载的app
  const appsToMount = [] // 需要挂载的app

  apps.forEach(app => {
    // 需不需要被加载
    const appShouldBeActive = shouldBeActive(app)
    switch (app.status) {
      case NOT_LOADED:
      case LOADING_SOURCE_CODE:
        if (appShouldBeActive) {
          appsToLoad.push(app)
        }
        break;
      case NOT_BOOTSTRAP:
      case BOOTSTRAPING:
      case NOT_MOUNTED:
        if (appShouldBeActive) {
          appsToMount.push(app)
        }
        break;
      case MOUNTED:
        if (!appShouldBeActive) {
          appsToUnmount.push(app)
        }
        break;
      default:
        break;
    }
  })
  console.log(appsToLoad)
  return {
    appsToUnmount,
    appsToLoad,
    appsToMount
  }
}