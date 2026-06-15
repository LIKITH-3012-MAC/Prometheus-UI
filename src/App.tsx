import { defineComponent } from "vue";
import PrometheusShell from "./components/PrometheusShell";

export default defineComponent({
  name: "App",
  setup() {
    return () => <PrometheusShell />;
  },
});
