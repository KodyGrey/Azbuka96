import clientPromise from "../../../lib/mongodbClient";
import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  return new Promise((resolve) => {
    const { id } = req.query;
    unstable_getServerSession(req, res, authOptions)
      .then((session) => {
        if (!session) {
          res.status(401).json({ error: "Unauthenticated" });
          resolve();
        }
        switch (req.method) {
          case "GET":
            clientPromise
              .then((client) => {
                const collection = client.db().collection("orders");
                collection.findOne({ _id: ObjectId(id) }, (error, order) => {
                  if (error) res.status(500).json({ error: error.toString() });
                  else if (
                    !session.user.isAdmin &&
                    session.user.id !== order.userId
                  )
                    res.status(403).json({
                      error: "You have not enough permissions for that",
                    });
                  else res.status(200).json(order);
                  resolve();
                });
              })
              .catch((error) => {
                res.status(500).json({ error: error.toString() });
                resolve();
              });
            break;
          case "PUT":
            if (!session.user.isAdmin) {
              res
                .status(403)
                .json({ error: "You have not enough permissions for that" });
              resolve();
            } else {
              const updateParams = req.body;
              clientPromise
                .then((client) => {
                  const collection = client.db().collection("orders");
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
            break;
          case "DELETE":
            if (!session.user.isAdmin) {
              res
                .status(403)
                .json({ error: "You have not enough permissions for that" });
              resolve();
            } else {
              clientPromise
                .then((client) => {
                  const collection = client.db().collection("orders");
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

            break;
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.toString() });
        resolve();
      });
  });
}
