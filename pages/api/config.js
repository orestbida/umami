import { ok, methodNotAllowed } from 'next-basics';

export default async (req, res) => {
  if (req.method === 'GET') {
    return ok(res, {
      basePath: process.env.BASE_PATH || '',
      trackerScriptName: process.env.TRACKER_SCRIPT_NAME,
      updatesDisabled: !!process.env.DISABLE_UPDATES,
      telemetryDisabled: !!process.env.DISABLE_TELEMETRY,
      ignoreCurrentUser: !!process.env.IGNORE_LOGGED_IN_USER,
    });
  }

  return methodNotAllowed(res);
};
