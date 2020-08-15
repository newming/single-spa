import { NOT_BOOTSTRAP, BOOTSTRAPING, NOT_MOUNTED } from "../applications/app.helper";

export async function toBootstrapPromise(app) {
  if (app.status !== NOT_BOOTSTRAP) {
    return app
  }
  app.status = BOOTSTRAPING
  await app.bootstrap(app.customProps)
  app.status = NOT_MOUNTED
  return app
}
