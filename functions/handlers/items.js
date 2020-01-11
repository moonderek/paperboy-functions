const { admin, db } = require("../util/admin");

exports.postOneItem = (req, res) => {
  if (req.body.name.trim() === "") {
    return res.status(400).json({ name: "Name must not be empty" });
  }

  const newItem = {
    name: req.body.name,
    cost: req.body.cost,
    username: req.user.username
  };
  admin
    .firestore()
    .collection("items")
    .add(newItem)
    .then(doc => {
      res.json({ message: `Document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
};
