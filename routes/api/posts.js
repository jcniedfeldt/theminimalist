const router = require("express").Router();
const postsController = require("../../controllers/postsController");

// Matches with "/api/posts"
router.route("/")
    .get(postsController.findAll)
    .post(postsController.create);

// Matches with "/api/posts/:id"
router.route("/:id")
    .get(postsController.findById)
    .put(postsController.update)
    .delete(postsController.remove);

// Matches with "api/posts/category"
router.route("/category")
    .get(postsController.findByCategory);

// Matches with "api/posts/popularity"
router.route("/popularity")
    .get(postsController.findByPopularity);

module.exports = router;