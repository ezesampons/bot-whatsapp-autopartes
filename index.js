const express = require("express");
const db = require("./db");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));

// Health check (IMPORTANTE para Railway)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Bot activo 🚀");
});

// Sesiones en memoria
const sessions = {};

// Webhook WhatsApp
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
        reply = "🚗 ¿Cuál es la marca del vehículo?";
      } else {
        reply = "Escribí hola para comenzar.";
      }
      break;

    case "MARCA":
      session.marca = msg;
      session.step = "MODELO";
      reply = "🚘 ¿Cuál es el modelo?";
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

      try {
        const result = await db.query(
          `INSERT INTO "PEDIDOS" (telefono, marca, modelo, anio, pieza)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id`,
          [
            from,
            session.marca,
            session.modelo,
            session.anio,
            session.pieza
          ]
        );

        reply = `✅ Pedido guardado (ID ${result.rows[0].id})

🚗 ${session.marca} ${session.modelo} (${session.anio})
🔧 Pieza: ${session.pieza}

Gracias 🙌`;

      } catch (error) {
        console.error("ERROR DB:", error);
        reply = "❌ Error guardando pedido.";
      }

      session.step = "MENU";
      break;

    default:
      session.step = "MENU";
      reply = "Escribí hola para comenzar.";
  }

  res.send(`
    <Response>
      <Message>${reply}</Message>
    </Response>
  `);
});

// 👇 MUY IMPORTANTE
const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor escuchando en puerto", PORT);
});
