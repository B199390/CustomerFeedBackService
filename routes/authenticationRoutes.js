
const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
  if (!req.user) {
    return res.redirect("http://localhost:3000/?error=authentication_failed");
  }

  req.session.user = req.user;
  req.login(req.user, (err) => {
    if (err) {
      return res.redirect("http://localhost:3000/?error=login_failed");
    }
    res.redirect("http://localhost:3000/dashboard");
  });
});

router.get("/user", (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Session destruction failed" });
      }

      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

module.exports = router;


