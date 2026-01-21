
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));

app.post("/whatsapp", (req, res) => {
  res.send(`
    <Response>
      <Message>👋 Hola, tu bot ya está funcionando</Message>
    </Response>
  `);
});

app.get("/", (req, res) => {
  res.send("Bot activo 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Bot corriendo en puerto", PORT);
});

