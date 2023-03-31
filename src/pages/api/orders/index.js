import clientPromise from "../../../lib/mongodbClient";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  return new Promise((resolve) => {
    switch (req.method) {
      case "GET":
        getServerSession(req, res, authOptions).then((session) => {
          if (!session) {
            res.status(401).json({ error: "Unauthorized" });
          } else if (session.user.admin) {
            clientPromise
              .then((client) => {
                const collection = client.db().collection("orders");
                collection.find({}).toArray((error, array) => {
                  if (error) res.status(500).json({ error: error.toString() });
                  else res.status(200).json(array);
                  resolve();
                });
              })
              .catch((err) => {
                res.status(500).json({ error: err.toString() });
                resolve();
              });
          } else {
            clientPromise.then((client) => {
              const collection = client.db().collection("orders");
              collection
                .find({ userId: session.user.id })
                .toArray((error, array) => {
                  if (error) res.status(500).json({ error: error.toString() });
                  else res.status(200).json(array);
                });
            });
          }
        });
        break;
      case "POST":
        getServerSession(req, res, authOptions).then((session) => {
          const order = {};
          const body = JSON.parse(req.body);

          order.userId = body.userId;
          order.status = "В обработке";
          order.date = new Date();
          order.deliveryType = body.deliveryType;
          order.deliveryAddress = body.deliveryAddress;
          order.comment = body.comment;
          order.products = body.products;

          if (!session) {
            res.status(401).json({ error: "Unauthorized" });
            resolve();
          } else if (
            !session.user.isAdmin &&
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

              ordersCollection.countDocuments({}, (err, count) => {
                if (err) res.status(500).json({ error: err.toString() });
                order.number = count + 1;
                ordersCollection.insertOne(order, (err, ok) => {
                  if (err) res.status(500).json({ error: err.toString() });
                  else res.status(200).json({ ok: true });
                  resolve();
                });
              });
            });
          }
        });
        break;
    }
  });
}
