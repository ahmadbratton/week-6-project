const express = require('express');
const router = express.Router();
const models = require('../models');

let messages_err;
let userId;
let newMessage;
let user;
let the_user;
let Messages;
let user_message;
let user_like;
let liker =[];
let name;

const getMessageId = function(req, res, next) {
  models.messages.findById(req.params.messageId).then(function(action) {
    if (action) {
      req.action = action;
      next();
    } else {
      res.status(404).send("not found");
    }
  });
}

const the_likes = function (req,res,next) {
  //  liker = [];
  models.likes.findAll({
    where: {
      messageId: req.params.messageId
    }
  }).then(function (likes) {
    // console.log(likes);
    likes.forEach(function (like) {
      models.users.findById(like.userId).then(function(user) {
        console.log('LIKER LENGTH: ',liker.length);
        liker.push(user.dataValues.username);
      })
      // user_like = {
      //   id: like.id,
      //   messageId: like.messageId,
      //   userId: like.userId
      //
      // }
      // liker.push(user_like);
    })

    // liker.forEach(function (like) {
    //
    // })
    next();
  });
}

router.get("/",  function(req, res) {

  Messages = [];
  if (req.session.username) {
    models.messages.findAll({
      include: [{
        model: models.users,
        as: "users"
      }, {
        model: models.likes,
        as: "likes"
      }],
      order: [
        ["createdAt", "DESC"]
      ]
    }).then(function(messages) {
      messages.forEach(function(message) {
        // console.log(message.users);
        user_message = {
          id: message.id,
          body: message.body,
          userId: message.userId,
          the_user: message.users.dataValues.username,
          likes: message.likes.length,
          was_liked: false,
          can_delete: false
        }
        Messages.push(user_message);
      });
    }).then(function(message_array) {
      Messages.forEach(function(message) {
        if (message.userId === userId) {
          message.can_delete = true;
        }
      })
      // console.log();
      // console.log();
      res.render("profile", {username: req.session.username,post: Messages , liker});
    });
  } else {
    res.redirect("/login");
  }
});
router.get("/signup", function(req, res) {

  res.render("signup", {
    error: messages_err,
    username: req.session.username
  });
});

// router.get("/:messageId/wholiked", getMessageId, the_likes, function (req, res) {
//   res.render("wholiked", {username: req.session.username,  likers: liker })
// });

router.get("/login", function(req, res) {
  if (req.session.username) {
    res.redirect("/");
  } else {
    res.render("login", {
      error: messages_err,
    });
  }
});

router.get("/createMessage", function(req, res) {
  res.render("createMessage", {
    username: req.session.username
  });
});

// const getMessageId = function(req, res, next) {
//   models.messages.findById(req.params.messageId).then(function(action) {
//     if (action) {
//       req.action = action;
//       next();
//     } else {
//       res.status(404).send("not found");
//     }
//   });
// }


router.post("/signup", function(req, res) {
  let newusers = {
    username: req.body.newusername,
    password: req.body.newpassword,
  }
  models.users.create(newusers).then(function(model) {
    // console.log(model);
  });
  res.redirect("/login");

});

router.post("/login", function(req, res) {
  messages = [];

  req.checkBody("username", "please enter a valid username").notEmpty();
  req.checkBody("password", "please enter a valid password").notEmpty();
  let errors = req.validationErrors();

  if (errors) {
    errors.forEach(function(error) {
      messages.push(error.msg);
      res.redirect()
    });
    res.render("login", {
      errors: messages
    })
  } else {
    models.users.findOne({
      where: {
        username: req.body.username,
        password: req.body.password
      }
    }).then(function(user) {
      if (user) {
        userId = user.id;
        req.session.username = user.username;
        name = user.username;
        res.redirect("/");
      } else {
        messages.push("invalid username or password");
        // console.log(messages);
        res.redirect("/login");
      }

    });

  }
});


router.post("/createMessage", function(req, res) {
  newMessage = {
    body: req.body.message_box,
    userId: userId,
    user: models.users.findOne({
      where: {
        id: userId
      }
    }).then(function(info) {
      if (info) {
        user = info.username;
        // console.log("the user name is:" + user);
      }
    })
  }
  models.messages.create(newMessage).then(function(message) {
    res.redirect("/");
  });


});

router.post("/logout", function(req, res) {
  req.session.destroy();
  res.redirect("/login");
});


router.post("/:messageId/delete", getMessageId, function(req, res) {
  req.action.destroy().then(function() {
    res.redirect("/");
  });

});

router.post("/:messageId/like", getMessageId , the_likes , function(req, res) {
  user_message.was_liked = true;
  newLike = {
    messageId: req.params.messageId,
    userId: userId
  }
  models.likes.findOrCreate({where:newLike, defaults: newLike}).then(function(like) {

      user_message.likes++;

    // user_message.likes++;
    // console.log("was_liked", user_message.was_liked);

    res.redirect("/");
  });
});

router.post("/:messageId/wholiked", getMessageId , the_likes, function (req,res) {

 res.render("wholiked", {username: req.session.username,  likers: liker });
  liker = [];
} );







module.exports = router;
