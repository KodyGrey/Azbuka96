import clientPromise from "../../../lib/mongodbClient";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import formidable from "formidable";
import { createReadStream, createWriteStream } from "fs";
import { join } from "path";

import { Collection, ObjectId } from "mongodb";
import csv from "csv-parser";
import iconv from "iconv-lite";

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
            form.uploadDir = "./remnants";
            form.parse(req, async (err, fields, file) => {
              if (err) {
                console.error(err);
                res.status(500).send("Failed to parse form data");
              } else {
                const productId = fields.id;
                const remnantsPath = file.remnants.filepath;

                const encoding = "windows-1251";
                const targetEncoding = "utf-8";

                const results = [];
                createReadStream(remnantsPath)
                  .pipe(iconv.decodeStream("windows-1251"))
                  .pipe(csv({ separator: ";", headers: false }))
                  .on("data", (data) => results.push(data))
                  .on("end", () => {
                    //   {
                    //     '0': 'Академкнига/Учебник',
                    //     '1': '',
                    //     '2': '',
                    //     '3': '',
                    //     '4': '',
                    //     '5': ''
                    //   },
                    //   {
                    //     '0': '00158',
                    //     '1': 'Азбука 1 класс Тетрадь по письму Агаркова (цена за комплект из трех частей) /Академкнига/Учебник',
                    //     '2': '',
                    //     '3': '584,00',
                    //     '4': '50',
                    //     '5': ''
                    //   },
                    const products = [];
                    let publisher = "";
                    for (let el of results) {
                      if (
                        el["0"] &&
                        !el["1"] &&
                        !el["2"] &&
                        !el["3"] &&
                        !el["4"] &&
                        !el["5"]
                      ) {
                        publisher = el["0"];
                      } else {
                        products.push({
                          bookID: el["0"],
                          title: el["1"],
                          price: Number(el["3"].replace(",", ".")),
                          inStock: Number(el["4"]) > 0,
                          author: el["6"],
                          categories: {
                            publisher,
                            grade: el["7"],
                            subject: el["8"],
                          },
                        });
                      }
                    }
                    clientPromise.then((client) => {
                      const collection = client.db().collection("products");
                      for (let product of products) {
                        collection
                          .updateOne(
                            { bookID: product.bookID },
                            { $set: product },
                            { upsert: true }
                          )
                          .catch((error) => {
                            res
                              .status(500)
                              .send("Не получилось добавить товар");

                            resolve();
                          });
                      }
                    });
                  })
                  .on("error", (error) => {
                    res.status(500).send("Не получилось добавить товар");

                    resolve();
                  });
                res.status(200).send("Товар успешно добавлен");
                resolve();
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
