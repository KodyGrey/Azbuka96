import clientPromise from "../../../lib/mongodbClient";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import formidable from "formidable";
import { createReadStream, createWriteStream } from "fs";
import { join } from "path";

import { ObjectId } from "mongodb";

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
        getServerSession(req, res, authOptions).then((session) => {
          if (!session) {
            res.status(401).json({ error: "Unauthorized" });
            resolve();
          } else if (!session.user.isAdmin) {
            res
              .status(403)
              .json({ error: "You have not enough permissions for that" });
            resolve();
          } else {
            const form = new formidable.IncomingForm();
            form.parse(req, async (err, fields, file) => {
              if (err) {
                console.error(err);
                res.status(500).send("Failed to parse form data");
              } else {
                const product = {};
                product.inStock = fields.inStock === "true";
                product.title = fields.title;
                product.author = fields.author;
                product.description = fields.description;
                product.categories = {};
                product.categories.grade = fields.grade;
                product.categories.subject = fields.subject;
                product.categories.publisher = fields.publisher;
                product.price = Number(fields.price);
                product.bookID = fields.bookID;
                product.boughtScore = Number(fields.boughtScore);
                product.description = fields.description;

                if (fields.discountedPrice)
                  product.discountedPrice = Number(fields.discountedPrice);

                if (!fields.id) {
                  clientPromise.then((client) => {
                    const collection = client.db().collection("products");
                    collection.insertOne(product, (err, ok) => {
                      if (err) {
                        res.status(500).json({ error: err.toString() });
                        resolve();
                      } else if (file.image) {
                        const productId = ok.insertedId;
                        const image = file.image;
                        const filename = image.originalFilename;
                        const fileType = filename.match(
                          /\.(jpg|jpeg|png|gif)$/i
                        )[1];
                        // ПОМЕНЯТЬ ЗДЕСЬ
                        const imagePath = `../www/product-images/${product.bookID}.${fileType}`;

                        const writeStream = createWriteStream(imagePath);
                        const readStream = createReadStream(image.filepath);
                        readStream.pipe(writeStream);
                        writeStream.on("close", () => {
                          collection.updateOne(
                            { _id: productId },
                            {
                              $set: {
                                image: `product-images/${product.bookID}.${fileType}`,
                              },
                            },
                            (err, ok) => {
                              if (err) {
                                console.log(err);
                                res
                                  .status(500)
                                  .send("Не получилось добавить товар");
                              } else
                                res.status(200).json({
                                  message: "Продукт успешно добавлен",
                                });
                              resolve();
                            }
                          );
                        });
                        readStream.on("error", (err) => {
                          console.error(err);
                          res
                            .status(500)
                            .send("Не получилось сохранить изображение");
                          resolve();
                        });
                      } else {
                        res.status(200).json({
                          message: "Продукт успешно добавлен",
                        });
                      }
                    });
                  });
                } else {
                  product.id = fields.id;
                  clientPromise.then((client) => {
                    const collection = client.db().collection("products");

                    if (file.image) {
                      const productId = fields.id;
                      const image = file.image;
                      const filename = image.originalFilename;
                      const fileType = filename.match(
                        /\.(jpg|jpeg|png|gif)$/i
                      )[1];

                      const updatedProduct = {
                        image: `product-images/${product.bookID}.${fileType}`,
                        inStock: product.inStock,
                        title: product.title,
                        author: product.author,
                        description: product.description,
                        categories: product.categories,
                        price: product.price,
                        bookID: product.bookID,
                        boughtScore: product.boughtScore,
                        description: product.description,
                      };
                      if (product.discountedPrice)
                        updatedProduct.discountedPrice =
                          product.discountedPrice;

                      // ПОМЕНЯТЬ ЗДЕСЬ
                      const imagePath = `../www/product-images/${product.bookID}.${fileType}`;

                      const writeStream = createWriteStream(imagePath);
                      const readStream = createReadStream(image.filepath);
                      readStream.pipe(writeStream);
                      writeStream.on("close", () => {
                        collection.updateOne(
                          { _id: ObjectId(productId) },
                          {
                            $set: updatedProduct,
                          },
                          (err, ok) => {
                            if (err) {
                              console.log(err);
                              res
                                .status(500)
                                .send("Не получилось добавить товар");
                            } else
                              res.status(200).json({
                                message: "Продукт успешно добавлен",
                              });
                            resolve();
                          }
                        );
                      });
                      readStream.on("error", (err) => {
                        console.error(err);
                        res
                          .status(500)
                          .send("Не получилось сохранить изображение");
                        resolve();
                      });
                    } else {
                      const updatedProduct = {
                        image: fields.prevImage,
                        inStock: product.inStock,
                        title: product.title,
                        author: product.author,
                        description: product.description,
                        categories: product.categories,
                        price: product.price,
                        bookID: product.bookID,
                        boughtScore: product.boughtScore,
                        description: product.description,
                      };
                      if (product.discountedPrice)
                        updatedProduct.discountedPrice =
                          product.discountedPrice;

                      collection.updateOne(
                        { _id: ObjectId(fields.id) },
                        {
                          $set: updatedProduct,
                        },
                        (err, ok) => {
                          if (err) {
                            console.log(err);
                            res
                              .status(500)
                              .send("Не получилось добавить товар");
                          } else
                            res.status(200).json({
                              message: "Продукт успешно добавлен",
                            });
                          resolve();
                        }
                      );
                    }
                  });
                }
              }
            });
          }
        });
        break;
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
