import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodbClient";
import { getServerSession } from "next-auth/next";

import { authOptions } from "../auth/[...nextauth]";

// Returns promise, so server understand when
// function ends gathering and sending information
export default async function handler(req, res) {
  return new Promise((resolve) => {
    getServerSession(req, res, authOptions).then((session) => {
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
                resolve();
              });
              break;
            case "PUT":
              if (!session) {
                res.status(401).json({ error: "Unauthorized" });

                resolve();
              }
              if (id === session.user.id || session.user.isAdmin) {
                const updateParams = {};
                if (req.body.name) updateParams.name = req.body.name;
                if (req.body.city) updateParams.city = req.body.city;
                if (session.user.isAdmin) {
                  if (req.body.isAdmin) updateParams.isAdmin = req.body.isAdmin;
                }

                collection.updateOne(
                  { _id: ObjectId(id) },
                  { $set: updateParams },
                  (err, result) => {
                    if (err) res.status(500).json({ error: err.toString() });
                    else res.status(200).json({ ok: true });
                    resolve();
                  }
                );
              } else {
                res.status(403).json({
                  error: "You have not enough permissions for that",
                });
              }
              resolve();
              break;

            case "DELETE":
              if (!session.user.isAdmin) {
                res
                  .status(403)
                  .json({ error: "You have not enough permissions for that" });
                resolve();
              }
              collection.deleteOne({ _id: ObjectId(id) });
              res.status(200).json({ ok: true });
              resolve();
          }
        })
        .catch((err) => {
          res.status(500).json({ error: err.toString() });

          resolve();
        });
    });
  });
}
