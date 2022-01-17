import {createApp} from 'vue'
import App from './App.vue'
import {MouseMenuDirective} from '@howdyjs/mouse-menu'
import "element-plus/theme-chalk/src/message-box.scss"

const app = createApp(App);

app.directive("mouseMenu", MouseMenuDirective);

app.mount('#app')
