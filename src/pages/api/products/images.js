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
            form.parse(req, async (err, fields, files) => {
              if (err) {
                console.error(err);
                res.status(500).send("Failed to parse form data");
              } else {
                clientPromise.then((client) => {
                  const collection = client.db().collection("products");

                  for (let key in files) {
                    const image = files[key];
                    const filename = image.originalFilename;
                    const fileType = filename.match(
                      /\.(jpg|jpeg|png|gif)$/i
                    )[1];
                    const bookID = filename.match(/^\d+/)[0];
                    const imagePath = `../www/product-images/${bookID}.${fileType}`;
                    // const imagePath = `./${bookID}.${fileType}`;

                    const writeStream = createWriteStream(imagePath);
                    const readStream = createReadStream(image.filepath);
                    readStream.pipe(writeStream);
                    writeStream.on("close", () => {
                      collection.updateOne(
                        { bookID: bookID },
                        {
                          $set: {
                            image: `product-images/${bookID}.${fileType}`,
                          },
                        },
                        (err, ok) => {
                          if (err) {
                            console.log(err);
                            res
                              .status(500)
                              .send("Не получилось добавить изображение");
                          }
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
              }
            });
          }
          res.status(200).send("Изображение успешно отправлено");
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
