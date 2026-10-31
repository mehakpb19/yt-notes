import {
  ref,
  set,get,
  update,
} from "firebase/database";
import { VideoNotes } from "../hooks/useGetnotes";
import db from "./firebase";
interface Product {
  videoId: string;
  notes: VideoNotes;
  timestamp: number;
}
export async function writeUserData(
  sessionId: string|null,
  notes: VideoNotes,
  videoId: string,
) {
  await set(ref(db, `/video/${sessionId}`), {
    videoId: videoId,
    notes: notes,
    timestamp: 0,
  });
}
export const updateVideoTime = async (sessionKey: string, currentTime: number) => {
  try {
    // Adjust the path below if your session data is stored under a specific root node
    const sessionRef = ref(db, `/video/${sessionKey}`);
    await update(sessionRef, { currentTime });
  } catch (error) {
    console.error("Failed to sync video time to Firebase:", error);
  }
};
export async function listenToProduct(sessionId: string){
  const productRef = ref(db, `/video/${sessionId}`);
try {
    const snapshot = await get(productRef);
    if (snapshot.exists()) return snapshot.val()
    return null
}
    catch (error) {

      console.error(error);
    }
}

