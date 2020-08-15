// 应用的全部状态
export const NOT_LOADED = 'NOT_LOADED' // 应用初始状态
export const LOADING_SOURCE_CODE = 'LOADING_SOURCE_CODE' // 加载资源中
export const NOT_BOOTSTRAP = 'NOT_BOOTSTRAP' // 还没有调用bootstrap方法
export const BOOTSTRAPING = 'BOOTSTRAPING' // 启动中
export const NOT_MOUNTED = 'NOT_MOUNTED' // 没有调用mount方法
export const MOUNTING = 'MOUNTING' // 挂载中
export const MOUNTED = 'MOUNTED' // 挂载完毕
export const UPDATING = 'UPDATING' // 更新中
export const UNMOUNTING = 'UNMOUNTING' // 解除挂载
export const UNLOADING = 'UNLOADING' // 完全卸载中
export const LOAD_ERR = 'LOAD_ERR' // 加载出错 资源加载失败
export const SKIP_BECAUSE_BROKEN = 'SKIP_BECAUSE_BROKEN' // 代码异常出错

// 当前应用是否已经被激活
export function isActive(app) {
  return app.status === MOUNTED
}

// 当前这个应用是否要被激活
export function shouldBeActive(app) {
  return app.activeWhen(window.location)
}
