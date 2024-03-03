import axios from "axios";
import 'dotenv/config'

console.log("App is running");

function sendMessages() {
  console.log("SendMessages is running");
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://pasala.checkout.tuboleta.com/selection/resale/resaleItems.json?performanceId=10229522165986&lang=es",
  };

  axios
    .request(config)
    .then((response) => {
      const data = response.data;
      const items = data["resaleItems"];
      const tickets = items.map((item) => ({
        audienceSubCategory: item.audienceSubCategory,
        price: item.price,
        quantity: item.quantity,
      }));

      const messages = [];
      tickets.forEach((ticket) => {
        if (ticket.price <= 500000000) {
          console.log(ticket);
          messages.push(
            `category: ${ticket.audienceSubCategory}\nprice: ${ticket.price}\nqty: ${ticket.quantity}\n`
          );
        }
      });
      sendMessageWA(messages);
    })
    .catch((error) => {
      console.log(error);
    });
}

// Datos de autenticación para acceder a la API de Twilio
const accountSid = process.env.TWILIO_ACCOUNT_ID;
const authToken = process.env.TWILIO_TOKEN;

const apiUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

// Datos del mensaje a enviar
const from = "whatsapp:+14155238886";
const to = "whatsapp:+573123371764";

const data = new URLSearchParams();
data.append("To", to);
data.append("From", from);

// URL de la API de Twilio para enviar mensajes

// Configuración para la autenticación HTTP básica
const auth = {
  username: accountSid,
  password: authToken,
};

// Datos a enviar en la solicitud POST

export function sendMessageWA(messages) {
  data.append("Body", messages);
  axios
    .post(apiUrl, data, { auth })
    .then((response) => {
      console.log("Mensaje enviado:", response.data);
    })
    .catch((error) => {
      console.error("Error al enviar el mensaje:", error.response.data);
    });
}

setTimeout(sendMessages, 5 * 60 * 1000);