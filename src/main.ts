import {createApp} from 'vue'
import App from './App.vue'
import "element-plus/theme-chalk/src/message-box.scss"
import {createPinia} from "pinia";

const app = createApp(App);
app.use(createPinia())

app.mount('#app')
