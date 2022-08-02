import clientPromise from "../../../lib/mongodbClient";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

// Returns promise, so server understand when
// function ends gathering and sending information
export default async function handler(req, res) {
  return new Promise((resolve) => {
    unstable_getServerSession(req, res, authOptions).then((session) => {
      if (!session) {
        res.status(401).json({ error: "Unauthorized" });
        return resolve();
      } else if (!session.user.is_admin) {
        res
          .status(403)
          .json({ error: "You have not enough permissions for that" });
        return resolve();
      }

      clientPromise
        .then((client) => {
          const collection = client.db().collection("users");
          collection.find({}).toArray((err, array) => {
            if (err) res.status(500).json({ error: err.toString() });
            else {
              res.status(200).json(array);
            }
            return resolve();
          });
        })
        .catch((err) => {
          res.status(500).json({ error: err.toString() });
          return resolve();
        });
    });
  });
}
