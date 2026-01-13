import ee from "@google/earthengine";
import fs from "fs";

let initialized = false;

export async function initEarthEngine() {
  if (initialized) return;

  return new Promise<void>((resolve, reject) => {
    try {
      const cred = process.env.GOOGLE_APPLICATION_CREDENTIALS;

      if (!cred) {
        throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not set");
      }

      console.log("Attempting to initialize Earth Engine...");

      let key;
      try {
        // ✅ Try parsing as JSON first (Vercel)
        key = JSON.parse(cred);
      } catch {
        // ✅ If parsing fails, treat as file path (Local)
        if (fs.existsSync(cred)) {
          key = JSON.parse(fs.readFileSync(cred, "utf8"));
        } else {
          throw new Error("Could not parse credentials as JSON or find file");
        }
      }

      // ✅ Validate key structure
      if (!key.client_email || !key.private_key) {
        throw new Error("Invalid service account key structure");
      }

      ee.data.authenticateViaPrivateKey(
        key,
        () => {
          ee.initialize(
            null,
            null,
            () => {
              initialized = true;
              console.log("✅ Earth Engine initialized successfully");
              resolve();
            },
            (err: any) => {
              console.error("❌ Earth Engine initialization failed:", err);
              reject(new Error(`EE init failed: ${err}`));
            }
          );
        },
        (err: any) => {
          console.error("❌ Earth Engine authentication failed:", err);
          reject(new Error(`EE auth failed: ${err}`));
        }
      );
    } catch (err: any) {
      console.error("❌ Error in initEarthEngine:", err);
      reject(err);
    }
  });
}

export default ee;