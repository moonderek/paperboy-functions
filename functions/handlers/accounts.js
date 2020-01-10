const { db } = require("../util/admin");

exports.getAllAccounts = (req, res) => {
  db.collection("accounts")
    .orderBy("name")
    .get()
    .then(data => {
      let accounts = [];
      data.forEach(doc => {
        accounts.push({
          accountId: doc.id,
          name: doc.data().name,
          location: doc.data().location
        });
      });
      return res.json(accounts);
    })
    .catch(err => console.error(err));
};

exports.postOneAccount = (req, res) => {
  if (req.body.name.trim() === "") {
    return res.status(400).json({ name: "Name must not be empty" });
  }

  const newLocation = {
    name: req.body.name,
    location: req.body.location,
    username: req.user.username
  };
  admin
    .firestore()
    .collection("accounts")
    .add(newLocation)
    .then(doc => {
      res.json({ message: `Document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
};
