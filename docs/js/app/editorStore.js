import { db, auth } from "./firebaseConfig.js";
import {
  doc,
  setDoc,
  getDoc,
  getDocs, //added for getVersions
  addDoc,
  collection,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Role: Data Store with Firestore

// Extract title from markdown body
function extractTitle(body) {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "Untitled";
}

// Save to current (for autosave)
export async function saveEditor(body) {
  const user = auth.currentUser;
  if (!user) return;

  const uid = user.uid;
  const title = extractTitle(body);

  await setDoc(
    doc(db, "editors", uid, "docs", "current"),
    {
      title,
      body,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

// Commit to versions
export async function commitVersion(body) {
  const user = auth.currentUser;
  if (!user) return;

  const uid = user.uid;
  const title = extractTitle(body);

  await addDoc(collection(db, "editors", uid, "docs", "current", "versions"), {
    title,
    body,
    createdAt: serverTimestamp(),
  });
  await toast("Version committed!");
}

// Get Versions List
export async function getVersions() {
  const user = auth.currentUser;
  if (!user) return [];

  const uid = user.uid;
  const ref = collection(db, "editors", uid, "docs", "current", "versions");

  const snap = await getDocs(ref);

  return snap.docs.map(function (doc) {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });
}

//Load Version by ID
export async function loadVersion(versionId) {
  const user = auth.currentUser;
  if (!user) return "";
  const uid = user.uid;
  const ref = doc(db, "editors", uid, "docs", "current", "versions", versionId);

  const snap = await getDoc(ref);

  if (!snap.exists()) return "";

  return snap.data().body || "";
}

// Initial Load (from current)
export async function loadEditor() {
  const user = auth.currentUser;
  if (!user) return "";

  const uid = user.uid;
  const snap = await getDoc(doc(db, "editors", uid, "docs", "current"));

  if (!snap.exists()) return "";
  return snap.data().body || "";
}
