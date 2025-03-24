/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

admin.initializeApp();
const db = admin.firestore();

exports.autoDeleteCompletedTasks = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async () => {
    const completedTasks = await db.collection("tasks").where("completed", "==", true).get();
    completedTasks.forEach((doc) => doc.ref.delete());
    console.log("Completed tasks deleted.");
  });
