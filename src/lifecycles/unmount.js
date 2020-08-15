import { MOUNTED, UNMOUNTING, NOT_BOOTSTRAP } from "../applications/app.helper";

export async function toUnmountPromise(app) {
  // 当前应用没有被挂载，则直接什么都不用做
  if (app.status !== MOUNTED) {
    return app
  }
  app.status = UNMOUNTING
  await app.unmount(app.customProps)
  app.status = NOT_BOOTSTRAP
  return app
}
