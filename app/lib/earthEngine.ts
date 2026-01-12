import ee from "@google/earthengine";
import fs from "fs";

let initialized = false;

export async function initEarthEngine() {
  if (initialized) return;
console.log("EE key path:", process.env.GOOGLE_APPLICATION_CREDENTIALS);

  return new Promise<void>((resolve, reject) => {
    try {
      const key = JSON.parse(
        fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS!, "utf8")
      );

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
