// GET /api/users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "avatar"],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
