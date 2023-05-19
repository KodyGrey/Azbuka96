import clientPromise from "../../../../lib/mongodbClient";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import { createReadStream, read } from "fs";
import ExcelJS from "exceljs";
const rubles = require("rubles").rubles;

export default async function handler(req, res) {
  return new Promise((resolve) => {
    const { id } = req.query;
    getServerSession(req, res, authOptions)
      .then((session) => {
        if (!session) {
          res.status(401).json({ error: "Unauthenticated" });
          resolve();
        } else {
          switch (req.method) {
            case "GET":
              clientPromise
                .then((client) => {
                  const orders_collection = client.db().collection("orders");
                  const users_collection = client.db().collection("users");
                  orders_collection.findOne(
                    { _id: ObjectId(id) },
                    (error, order) => {
                      if (error) {
                        res.status(500).json({ error: error.toString() });
                        resolve();
                      } else if (!order) {
                        res.status(404).json({ error: "Not found order" });
                        resolve();
                      } else
                        users_collection.findOne(
                          { _id: ObjectId(order.userId) },
                          (error, user) => {
                            if (error)
                              res.status(500).json({ error: error.toString() });
                            else if (!user)
                              res.status(404).json({ error: "Not found user" });
                            else if (!session.user.isAdmin)
                              res.status(403).json({
                                error:
                                  "You have not enough permissions for that",
                              });
                            else {
                              const workbook = new ExcelJS.Workbook();

                              workbook.xlsx
                                .readFile("src/templates/template.xlsx")
                                .then(async () => {
                                  const worksheet =
                                    workbook.getWorksheet("Sheet1");

                                  let paymentDetailsPath =
                                    "src/templates/IndividualPaymentDetails.txt";

                                  if (order.isLegalEntity) {
                                    paymentDetailsPath =
                                      "src/templates/LegalEntityPaymentDetails.txt";
                                  }

                                  const readStream =
                                    createReadStream(paymentDetailsPath);

                                  let text = "";
                                  for await (const chunk of readStream) {
                                    text += chunk;
                                  }
                                  const lines = text.split("\n");

                                  const paymentDetails = {};

                                  let index = 0;
                                  for (let line of lines) {
                                    switch (index) {
                                      case 0:
                                        paymentDetails.type = line.trim();
                                      case 1:
                                        paymentDetails.reciever = line.trim();
                                      case 2:
                                        paymentDetails.number = line.trim();
                                      case 3:
                                        paymentDetails.comment = line.trim();
                                    }
                                    index++;
                                  }

                                  // Payment Details changing
                                  worksheet.getCell("D4").value =
                                    paymentDetails.type;
                                  worksheet.getCell("F5").value =
                                    paymentDetails.reciever;
                                  worksheet.getCell("W4").value =
                                    paymentDetails.number;
                                  worksheet.getCell("F6").value =
                                    paymentDetails.comment;

                                  // Customer info changing
                                  worksheet.getCell(
                                    "F14"
                                  ).value = `${user.name}, Email: ${user.email}, Номер телефона: ${user.phoneNumber}`;

                                  // Header with order nubmer and today date changing
                                  const today = new Date();
                                  const day = today
                                    .getDate()
                                    .toString()
                                    .padStart(2, "0");
                                  const month = (today.getMonth() + 1)
                                    .toString()
                                    .padStart(2, "0");
                                  const year = today.getFullYear().toString();
                                  worksheet.getCell(
                                    "B8"
                                  ).value = `Счет № ${order.number} от ${day}.${month}.${year}`;

                                  // Changing products rows
                                  let row_index = 18;
                                  worksheet.duplicateRow(
                                    row_index,
                                    Object.keys(order.products).length - 1,
                                    true
                                  );
                                  for (let product in order.products) {
                                    const product_row =
                                      worksheet.getRow(row_index);
                                    if (row_index !== 18) {
                                      worksheet.mergeCells(
                                        `B${row_index}:C${row_index}`
                                      );
                                      worksheet.mergeCells(
                                        `D${row_index}:T${row_index}`
                                      );
                                      worksheet.mergeCells(
                                        `U${row_index}:W${row_index}`
                                      );
                                      worksheet.mergeCells(
                                        `X${row_index}:Y${row_index}`
                                      );
                                      worksheet.mergeCells(
                                        `Z${row_index}:AC${row_index}`
                                      );
                                      worksheet.unMergeCells(
                                        `AD${row_index}:AG${row_index}`
                                      );
                                      worksheet.mergeCells(
                                        `AD${row_index}:AG${row_index}`
                                      );
                                    }
                                    product_row.getCell("B").value =
                                      row_index - 17;
                                    product_row.getCell("D").value =
                                      order.products[product].title;
                                    product_row.getCell("U").value =
                                      order.products[product].amount;
                                    product_row.getCell("Z").value =
                                      order.products[product].discountedPrice ||
                                      order.products[product].price;
                                    product_row.getCell("AD").value =
                                      (order.products[product]
                                        .discountedPrice ||
                                        order.products[product].price) *
                                      order.products[product].amount;
                                    product_row.commit();
                                    row_index++;
                                  }

                                  // Putting total price of an order
                                  worksheet.getCell(
                                    `AD${row_index + 1}`
                                  ).value = order.totalPrice;

                                  // Putting downside info
                                  worksheet.getCell(
                                    `B${row_index + 4}`
                                  ).value = `Всего наименований ${
                                    Object.keys(order.products).length
                                  }, на сумму ${order.totalPrice} рублей`;

                                  let wordsPrice = rubles(order.totalPrice);
                                  wordsPrice =
                                    wordsPrice.charAt(0).toUpperCase() +
                                    wordsPrice.slice(1);
                                  worksheet.getCell(`B${row_index + 5}`).value =
                                    wordsPrice;
                                })
                                .then(() => {
                                  return workbook.xlsx.writeFile(
                                    `../excel_reciepts/${order._id}.xlsx`
                                  );
                                })
                                .then(() => {
                                  const readStream = createReadStream(
                                    `../excel_reciepts/${order._id}.xlsx`
                                  );

                                  const today = new Date();
                                  const day = today
                                    .getDate()
                                    .toString()
                                    .padStart(2, "0");
                                  const month = (today.getMonth() + 1)
                                    .toString()
                                    .padStart(2, "0");
                                  const year = today.getFullYear().toString();

                                  res.setHeader(
                                    "Content-Type",
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                  );
                                  res.setHeader(
                                    "Content-Disposition",
                                    `attachment; filename="${order._id}.xlsx"`
                                  );

                                  readStream.pipe(res);
                                  resolve();
                                })
                                .catch((error) => {
                                  res
                                    .status(500)
                                    .json({ error: error.toString() });
                                });
                            }
                            resolve();
                          }
                        );
                    }
                  );
                })
                .catch((error) => {
                  res.status(500).json({ error: error.toString() });
                  resolve();
                });
              break;

              break;
          }
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.toString() });
        resolve();
      });
  });
}
