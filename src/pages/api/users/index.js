import clientPromise from "../../../lib/mongodbClient";

// Returns promise, so server understand when
// function ends gathering and sending information
export default async function handler(req, res) {
  return new Promise((resolve) => {
    clientPromise
      .then((client) => {
        const collection = client.db().collection("users");
        collection.find({}).toArray((err, array) => {
          if (err) res.status(500).json({ error: err.toString() });
          else {
            res.status(200).json(array);
          }
          return resolve();
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err.toString() });
        return resolve();
      });
  });
}
