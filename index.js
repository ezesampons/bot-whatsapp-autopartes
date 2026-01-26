const db = require("./db");
const express = require("express");
const app = express();

// Necesario para que Twilio lea los mensajes
app.use(express.urlencoded({ extended: false }));

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Bot activo 🚀");
});

// Estado simple en memoria (por ahora)
const sessions = {};

// Webhook de WhatsApp
app.post("/whatsapp", async (req, res) => {

  const from = req.body.From;
  const msg = req.body.Body?.trim().toLowerCase();

  if (!sessions[from]) {
    sessions[from] = { step: "MENU" };
  }

  const session = sessions[from];
  let reply = "";

  switch (session.step) {
    case "MENU":
      if (msg === "hola") {
        reply = `👋 Bienvenido a AutoPartes Express

¿Qué querés hacer?
1️⃣ Buscar pieza
2️⃣ Vender una pieza`;
      } else if (msg === "1") {
        session.step = "MARCA";
        reply = "🚗 ¿Cuál es la *marca* del vehículo?";
      } else {
        reply = "Escribí *hola* para comenzar.";
      }
      break;

    case "MARCA":
      session.marca = msg;
      session.step = "MODELO";
      reply = "🚘 ¿Cuál es el *modelo*?";
      break;

    case "MODELO":
      session.modelo = msg;
      session.step = "ANIO";
      reply = "📅 ¿Año del vehículo?";
      break;

    case "ANIO":
      session.anio = msg;
      session.step = "PIEZA";
      reply = "🔧 ¿Qué pieza necesitás?";
      break;

    case "PIEZA":
      session.pieza = msg;
      session.step = "MENU";
      reply = `✅ Pedido recibido:

🚗 ${session.marca} ${session.modelo} (${session.anio})
🔧 Pieza: ${session.pieza}

En breve te enviamos opciones 🙌

Escribí *hola* para empezar otro pedido.`;
      break;

    default:
      session.step = "MENU";
      reply = "Escribí *hola* para comenzar.";
  }

  res.send(`
    <Response>
      <Message>${reply}</Message>
    </Response>
  `);
});

// Puerto correcto para Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Bot corriendo en puerto", PORT);
});

