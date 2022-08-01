import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodbClient";
import { unstable_getServerSession } from "next-auth/next";

import { authOptions } from "../auth/[...nextauth]";

// Returns promise, so server understand when
// function ends gathering and sending information
export default async function handler(req, res) {
  return new Promise((resolve) => {
    unstable_getServerSession(req, res, authOptions).then((session) => {
      clientPromise
        .then((client) => {
          const { id } = req.query;
          const collection = client.db("azbukadb").collection("users");

          switch (req.method) {
            case "GET":
              collection.findOne({ _id: ObjectId(id) }, (err, result) => {
                if (err || !result)
                  res.status(400).json({ error: err.toString() });
                else res.status(200).json(result);
                return resolve();
              });
              break;
            case "PUT":
              if (!session) {
                res.status(401).json({ error: "Unauthorized" });

                return resolve();
              }
              if (id === session.user.id || session.user.is_admin) {
                const updateParams = {};
                if (req.body.name) updateParams.name = req.body.name;
                if (req.body.city) updateParams.city = req.body.city;
                if (session.user.is_admin) {
                  if (req.body.is_admin)
                    updateParams.is_admin = req.body.is_admin;
                }

                collection.updateOne(
                  { _id: ObjectId(id) },
                  { $set: updateParams },
                  (err, result) => {
                    if (err) res.status(500).json({ error: err.toString() });
                    else res.status(200).json({ ok: true });
                    return resolve();
                  }
                );
              } else {
                res.status(403).json({
                  error: "You have not enough permissions for that",
                });
              }
              return resolve();
              break;

            case "DELETE":
              if (!session.user.is_admin) {
                res
                  .status(403)
                  .json({ error: "You have not enough permissions for that" });
                return resolve();
              }
              collection.deleteOne({ _id: ObjectId(id) });
              res.status(200).json({ ok: true });
              return resolve();
          }
        })
        .catch((err) => {
          res.status(500).json({ error: err.toString() });

          return resolve();
        });
    });
  });
}
