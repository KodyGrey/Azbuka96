import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { createReadStream, createWriteStream } from "fs";

export default async function handler(req, res) {
  return new Promise((resolve) => {
    const { id } = req.query;
    getServerSession(req, res, authOptions)
      .then((session) => {
        if (false && !session) {
          //ПОМЕНЯТЬ
          res.status(401).json({ error: "Unauthenticated" });
          resolve();
          // } else if (!session.user.isAdmin) {
          //   res
          //     .status(403)
          //     .json({ error: "You don't have enough permissions for that" });
        } else {
          switch (req.method) {
            case "GET":
              const ans = {
                individualPaymentDetails: {},
                legalEntityPaymentDetails: {},
              };
              createReadStream("src/templates/IndividualPaymentDetails.txt").on(
                "data",
                (chunk) => {
                  let text = "";
                  text += chunk;
                  const lines = text.split("\n");
                  let index = 0;
                  for (let line of lines) {
                    switch (index) {
                      case 0:
                        ans.individualPaymentDetails.type = line.trim();
                      case 1:
                        ans.individualPaymentDetails.reciever = line.trim();
                      case 2:
                        ans.individualPaymentDetails.number = line.trim();
                      case 3:
                        ans.individualPaymentDetails.comment = line.trim();
                    }
                    index++;
                  }
                  createReadStream(
                    "src/templates/LegalEntityPaymentDetails.txt"
                  ).on("data", (chunk) => {
                    let text = "";
                    text += chunk;
                    const lines = text.split("\n");
                    let index = 0;
                    for (let line of lines) {
                      switch (index) {
                        case 0:
                          ans.legalEntityPaymentDetails.type = line.trim();
                        case 1:
                          ans.legalEntityPaymentDetails.reciever = line.trim();
                        case 2:
                          ans.legalEntityPaymentDetails.number = line.trim();
                        case 3:
                          ans.legalEntityPaymentDetails.comment = line.trim();
                      }
                      index++;
                    }
                    res.status(200).json(ans);
                    resolve();
                  });
                }
              );
          }
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.toString() });
        resolve();
      });
  });
}
