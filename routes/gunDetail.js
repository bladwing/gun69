const { Router } = require("express");
const router = new Router();
const gunner = require("../db/product.json");

router.get("/", (req, res) => {
  res.send("FUCK YOU!!!get out!!!");
});

router.get("/:id(\\d+)", (req, res) => {
  const id = parseInt(req.params.id);
  if (id > gunner.length) {
    return res.redirect("/");
  }
  const bulled = gunner [id];
  res.render("detail", { bulled });
});


router.get("/:id(\\d+)", (req, res) => {
  const idIndex = parseInt(req.params.id);
  if (idIndex > booksList.length || idIndex <= -1) {
    return res.status(400).json({ error: "Invalid Id" });
  }
  res.render("admin/edit", { bulled: bulled[idIndex] });
});

// წიგნის განახლების მისამართი ინდექსის მიხედვით
router.post("/:id(\\d+)", (req, res) => {
  const idIndex = parseInt(req.params.id);
  if (idIndex > bulled.length || idIndex <= -1) {
    return res.status(400).json({ error: "Invalid Id" });
  }

  try {
    const currentBook = bulled[idIndex];
    bulled[idIndex] = { ...currentBook, ...req.body };
    fs.writeFileSync(
      path.join(__dirname, "../db/product.json"),
      JSON.stringify(bulled, null, 2)
    );
    return res.redirect("/admin/guns");
  } catch (err) {
    console.log(err);
    return res.redirect("/admin/books/" + idIndex);
  }
});


module.exports = router;
