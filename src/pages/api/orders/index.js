import clientPromise from "../../../lib/mongodbClient";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  return new Promise((resolve) => {
    switch (req.method) {
      case "GET":
        clientPromise
          .then((client) => {
            const collection = client.db().collection("orders");
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
        getServerSession(req, res, authOptions).then((session) => {
          const order = req.body;
          if (!session) {
            res.status(401).json({ error: "Unauthorized" });
            resolve();
          } else if (
            !session.user.admin &&
            !(session.user.id === order.userId)
          ) {
            res
              .status(403)
              .json({ error: "You have not enough permissions for that" });
          } else {
            order.status = order.status ?? "В обработке";

            clientPromise.then((client) => {
              const ordersCollection = client.db().collection("orders");
              const productsCollection = client.db().collection("products");
              order.totalPrice = 0;
              for (let productId in order.products) {
                productsCollection.findOne(
                  { _id: ObjectId(productId) },
                  (error, product) => {
                    order.totalPrice +=
                      order.products[productId] *
                      (product.discountedPrice ?? product.price);
                  }
                );
              }

              ordersCollection.insertOne(order, (err, ok) => {
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
