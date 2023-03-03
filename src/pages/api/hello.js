// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import client from "../../lib/mongodbClient";
import { MongoClient } from "mongodb";

export default function handler(req, res) {
  console.log(typeof client);
  MongoClient.connect(process.env.MONGODB_URI, (err, db) => {
    if (err) throw err;
    console.log("success");
    db.close();
  });

  res.status(200).json({
    age: 21,
    name: "bob",
  });
}
