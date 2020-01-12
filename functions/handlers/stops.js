const { admin, db } = require("../util/admin");

exports.postOneStop = (req, res) => {
  userId = req.user.uid;
  const newStop = {
    account: req.body.account,
    items: req.body.items,
    userId: userId,
    date: new Date("January 15, 2020")
  };
  admin
    .firestore()
    .collection("stops")
    .add(newStop)
    .then(doc => {
      res.json({ message: `Document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
};
