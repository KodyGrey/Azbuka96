import clientPromise from "../../../lib/mongodbClient";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

// Returns promise, so server understand when
// function ends gathering and sending information
export default async function handler(req, res) {
  return new Promise((resolve) => {
    getServerSession(req, res, authOptions).then((session) => {
      if (!session) {
        res.status(401).json({ error: "Unauthorized" });
        resolve();
      } else if (!session.user.isAdmin) {
        res
          .status(403)
          .json({ error: "You have not enough permissions for that" });
        resolve();
      }

      clientPromise
        .then((client) => {
          const collection = client.db().collection("users");
          collection.find({}).toArray((err, array) => {
            if (err) res.status(500).json({ error: err.toString() });
            else {
              res.status(200).json(array);
            }
            resolve();
          });
        })
        .catch((err) => {
          res.status(500).json({ error: err.toString() });
          resolve();
        });
    });
  });
}
