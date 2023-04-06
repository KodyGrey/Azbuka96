import clientPromise from "../../../lib/mongodbClient";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import formidable from "formidable";
import { createReadStream, createWriteStream } from "fs";
import { join } from "path";

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
                product.discountedPrice = Number(fields.discountedPrice);
                product.bookID = fields.bookID;
                product.boughtScore = 0;
                product.description = fields.description;

                clientPromise.then((client) => {
                  const collection = client.db().collection("products");
                  collection.insertOne(product, (err, ok) => {
                    if (err) {
                      res.status(500).json({ error: err.toString() });
                      resolve();
                    } else {
                      const productId = ok.insertedId;
                      const image = file.image;
                      const filename = image.originalFilename;
                      const fileType = filename.match(
                        /\.(jpg|jpeg|png|gif)$/i
                      )[1];
                      // ПОМЕНЯТЬ ЗДЕСЬ
                      const imagePath = join(
                        process.cwd(),
                        "product-images",
                        `${productId}.${fileType}`
                      );

                      const writeStream = createWriteStream(imagePath);

                      const readStream = createReadStream(image.filepath);
                      readStream.pipe(writeStream);
                      writeStream.on("close", () => {
                        collection.updateOne(
                          { _id: productId },
                          {
                            $set: {
                              image: `product-images/${productId}.${fileType}`,
                            },
                          },
                          (err, ok) => {
                            if (err) {
                              console.log(err);
                              res
                                .status(500)
                                .send("Не получилось сохранить изображение");
                            } else
                              res.status(200).json({
                                message: "Image uploaded successfully",
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
                    }
                  });
                });
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
