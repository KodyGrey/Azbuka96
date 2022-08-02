import clientPromise from "../../../lib/mongodbClient";
import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";

export default async function handler(req, res) {
  return new Promise((resolve) => {
    switch (req.method) {
      case "GET":
        clientPromise
          .then((client) => {
            const collection = client.db().collection("products");
            collection.find({}).toArray((error, array) => {
              if (error) res.status(500).json({ error: err.toString() });
              else res.status(200).json(array);
              resolve();
            });
          })
          .catch((err) => {
            res.status(500).json({ error: err.toString() });
            resolve();
          });
        break;
      case "POST":
        unstable_getServerSession(req, res, authOptions).then((session) => {
          if (!session) {
            res.status(401).json({ error: "Unauthorized" });
            resolve();
          } else if (!session.user.isAdmin) {
            res
              .status(403)
              .json({ error: "You have not enough permissions for that" });
            resolve();
          } else {
            const product = req.body;
            product.viewCounter = product.viewCounter ?? 0;
            product.hide = product.hide ?? false;

            clientPromise.then((client) => {
              const collection = client.db().collection("products");
              collection.insertOne(product, (err, ok) => {
                if (err) res.status(500).json({ error: err.toString() });
                else res.status(200).json({ ok: true });
                resolve();
              });
            });
          }
        });
        break;
    }
  });
}
