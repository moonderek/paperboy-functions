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
    website: req.body.website,
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

exports.deleteAccout = (req, res) => {
  const document = db.doc(`/accounts/${req.params.accountId}`);
  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Scream not found" });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Scream deleted successfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
