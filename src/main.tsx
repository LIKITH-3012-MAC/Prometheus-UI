import { createApp } from "vue";
import App from "./App";
import "./styles/globals.css";

const app = createApp(App);

app.config.errorHandler = (err, instance, info) => {
  console.error("Prometheus Vue Error:", err, info);
  const el = document.getElementById("prometheus-boot-error");
  if (el) {
    el.style.display = "flex";
    el.innerHTML =
      "<strong>PROMETHEUS RUNTIME ERROR</strong><br/>" +
      (err instanceof Error ? err.message : String(err)) +
      "<br/><br/>Try clearing your browser cache and refreshing.";
  }
};

app.mount("#app");
