
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));

app.post("/whatsapp", (req, res) => {
  const msg = req.body.Body?.trim().toLowerCase();

  let reply = "";

  if (msg === "hola") {
    reply = `👋 Bienvenido a AutoPartes Express

¿Qué querés hacer?
1️⃣ Buscar pieza
2️⃣ Vender una pieza`;
  } else if (msg === "1") {
    reply = "🔧 Buscar pieza\n\n(Próximo paso)";
  } else if (msg === "2") {
    reply = "🧰 Vender pieza\n\n(Próximo paso)";
  } else {
    reply = "❓ No entendí. Escribí *hola* para ver el menú.";
  }

  res.send(`
    <Response>
      <Message>${reply}</Message>
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

