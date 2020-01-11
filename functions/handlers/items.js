const { admin, db } = require("../util/admin");

exports.postOneItem = (req, res) => {
  if (req.body.name.trim() === "") {
    return res.status(400).json({ name: "Name must not be empty" });
  }
  userId = req.user.uid;
  const newItem = {
    name: req.body.name,
    cost: req.body.cost,
    userId: userId
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

//get all items created by a user
exports.getAllItems = (req, res) => {
  userId = req.user.uid;
  db.collection("items")
    .where("userId", "==", userId)
    .get()
    .then(data => {
      let items = [];
      data.forEach(doc => {
        items.push({
          itemId: doc.id,
          name: doc.data().name
        });
      });
      return res.json(items);
    })
    .catch(err => console.error(err));
};
