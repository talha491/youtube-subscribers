const express = require("express");
const subscriberModel = require("./models/subscribers");
const app = express();


// Your code goes here

//Makes sure that content type is in json format
app.use(express.json());


//To get list of subscribers from database
app.get("/subscribers", async (req, res) => {
  try {
    const subscribers = await subscriberModel.find();
    res.send(subscribers);
  } catch (err) {
    res.send(err.message);
  }
});

//To get subscribers list including only of name and subscribedChannel
app.get("/subscribers/names", async (req, res) => {
  const subscribers = await subscriberModel.find(
    {},
    { name: 1, subscribedChannel: 1, _id: 0 }
  );
  res.send(subscribers);
});

//To get subcriber with respect to given id
app.get("/subscribers/:id", async (req, res) => {
  try {
    const matchedSubscriber = await subscriberModel.findOne({
      _id: req.params.id,
    });
    res.send(matchedSubscriber);
  } catch (err) {
    res.status(400);
    res.send(err.message);        //Displaying message if id doesnt match with database
                
  }
});

//Adding subsciber to database
app.post("/subscribers/add", async (req, res) => {
  try {
    const newSubscriber = new subscriberModel({
      name: req.body.name,
      subscribedChannel: req.body.subscribedChannel,
    });
    await newSubscriber.save();
    res.send({ message: "Subscriber addded successfully" });
  } catch (err) {
    res.send(err.message);
  }
});

//To update particular field in subscriber data with respect to given id
app.patch("/subscribers/update/:id", async (req, res) => {
  try {
    const updatedSubscriber = await subscriberModel.findOne({
      _id: req.params.id,
    });

    if (req.body.name) {
      updatedSubscriber.name = req.body.name;
    }

    if (req.body.subscribedChannel) {
      updatedSubscriber.subscribedChannel = req.body.subscribedChannel;
    }

    await updatedSubscriber.save();
    res.send(updatedSubscriber);
  } catch {
    res.status(404);
    res.send({ error: "Subscriber doesn't exist!" });
  }
});

//To delete subscriber from database by giving id of the same
app.delete("/subscribers/delete/:id", async (req, res) => {
  try {
    await subscriberModel.deleteOne({ _id: req.params.id });
    //Status 200 to show custom message
    res.status(200);
    res.send({ message: "Subscriber deleted succesfully" });
  } catch {
    res.status(404);
    res.send({ error: "Subscriber doesn't exist!" });
  }
});


//Showing unmatched response if tried with any other url mentioned in app
app.all("*", async (req, res) => {
  res.send({ message: "Unmatched Url" });
});

module.exports = app;