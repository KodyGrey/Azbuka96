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
          } else if (session.user.isAdmin) {
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
          order.isLegalEntity = body.isLegalEntity;

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
                      order.products[productId]["amount"] *
                      (product.discountedPrice || product.price);
                    order.products[productId].discountedPrice =
                      product.discountedPrice || product.price;
                    if (error) {
                      res.status(500).json({ error: err.toString() });
                      resolve();
                    }
                  }
                );
              }

              ordersCollection.countDocuments({}, (err, count) => {
                if (err) res.status(500).json({ error: err.toString() });
                order.number = count + 1;

                let shopDiscount = 0;
                if (order.totalPrice < 5000) shopDiscount = 0;
                else if (5000 <= order.totalPrice && order.totalPrice < 20000)
                  shopDiscount = 2;
                else if (20000 <= order.totalPrice && order.totalPrice < 50000)
                  shopDiscount = 4;
                else if (50000 <= order.totalPrice && order.totalPrice < 100000)
                  shopDiscount = 6;
                else if (100000 <= order.totalPrice) shopDiscount = 8;

                let discountedTotal = 0;

                for (let productId in order.products) {
                  order.products[productId].discountedPrice = Math.ceil(
                    ((order.products[productId].discountedPrice ||
                      order.products[productId].price) *
                      (100 - shopDiscount)) /
                      100
                  );
                  discountedTotal +=
                    order.products[productId].discountedPrice *
                    order.products[productId].amount;
                }

                order.totalPrice = discountedTotal;
                order.shopDiscount = shopDiscount;

                ordersCollection.insertOne(order, (err, ok) => {
                  if (err) res.status(500).json({ error: err.toString() });
                  else {
                    for (let productId in order.products) {
                      productsCollection.updateOne(
                        { _id: ObjectId(productId) },
                        {
                          $inc: {
                            boughtScore: order.products[productId]["amount"],
                          },
                        },
                        (error, result) => {
                          if (error) console.log(error);
                        }
                      );
                    }
                    res.status(200).json({ ok: true });
                  }
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
