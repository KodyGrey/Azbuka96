import clientPromise from "../../../lib/mongodbClient";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  return new Promise((resolve) => {
    const { id } = req.query;
    switch (req.method) {
      case "GET":
        clientPromise
          .then((client) => {
            const collection = client.db().collection("products");
            collection.findOne({ _id: ObjectId(id) }, (error, product) => {
              if (error) res.status(500).json({ error: error.toString() });
              else res.status(200).json(product);
              resolve();
            });
          })
          .catch((error) => {
            res.status(500).json({ error: error.toString() });
            resolve();
          });
        break;
      case "PUT":
        getServerSession(req, res, authOptions).then((session) => {
          if (!session) {
            res.status(401).json({ error: "Unauthenticated" });
            resolve();
          } else if (!session.user.isAdmin) {
            res
              .status(403)
              .json({ error: "You have not enough permissions for that" });
            resolve();
          } else {
            const updateParams = JSON.parse(req.body);
            clientPromise
              .then((client) => {
                const collection = client.db().collection("products");
                collection.updateOne(
                  { _id: ObjectId(id) },
                  { $set: updateParams },
                  (error, ok) => {
                    if (error)
                      res.status(500).json({ error: error.toString() });
                    else res.status(200).json({ ok: true });
                    resolve();
                  }
                );
              })
              .catch((error) => {
                res.status(500).json({ error: error.toString() });
                resolve();
              });
          }
        });
        break;
      case "DELETE":
        getServerSession(req, res, authOptions)
          .then((session) => {
            if (!session) {
              res.status(401).json({ error: "Unauthenticated" });
              resolve();
            } else if (!session.user.isAdmin) {
              res
                .status(403)
                .json({ error: "You have not enough permissions for that" });
              resolve();
            } else {
              clientPromise
                .then((client) => {
                  const collection = client.db().collection("products");
                  collection.deleteOne({ _id: ObjectId(id) }, (error, ok) => {
                    if (error)
                      res.status(500).json({ error: error.toString() });
                    else res.status(200).json({ ok: true });
                    resolve();
                  });
                })
                .catch((error) => {
                  res.status(500).json({ error: error.toString() });
                  resolve();
                });
            }
          })
          .catch((error) => {
            res.status(500).json({ error: error.toString() });
            resolve();
          });
        break;
    }
  });
}
