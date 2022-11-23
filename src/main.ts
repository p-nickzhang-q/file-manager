import {createApp} from 'vue'
import App from './App.vue'
import "element-plus/theme-chalk/src/message-box.scss"
import {ElNotification} from "element-plus";
import ElementPlus from "element-plus";

const app = createApp(App);
app.use(ElementPlus)
app.config.errorHandler = (err: any, instance, info) => {
    ElNotification.error({
        message: err.message,
        duration: 2000
    })
    console.error(err)
}

app.mount('#app')
