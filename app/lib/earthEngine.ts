import ee from "@google/earthengine";
import fs from "fs";

let initialized = false;

export async function initEarthEngine() {
  if (initialized) return;
  //console.log("EE key path:", process.env.GOOGLE_APPLICATION_CREDENTIALS);

  return new Promise<void>((resolve, reject) => {
    try {
      const cred = process.env.GOOGLE_APPLICATION_CREDENTIALS;

      if (!cred) {
        throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not set");
      }

      const key = cred.trim().startsWith("{")
        ? JSON.parse(cred) // ✅ Vercel (JSON string)
        : JSON.parse(fs.readFileSync(cred, "utf8")); // ✅ Local (file path)
      ee.data.authenticateViaPrivateKey(
        key,
        () => {
          ee.initialize(
            null,
            null,
            () => {
              initialized = true;
              console.log("Earth Engine initialized with service account");
              resolve();
            },
            //@ts-ignore
            (err) => reject(err)
          );
        },
        //@ts-ignore
        (err) => reject(err)
      );
    } catch (err) {
      reject(err);
    }
  });
}

export default ee;
