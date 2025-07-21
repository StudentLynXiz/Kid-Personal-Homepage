// Vue应用
new Vue({
    el: '#app',
    data: {
        activePanel: null
    },
    methods: {
        showPanel(panel) {
            this.activePanel = panel;
        },
        closePanel() {
            this.activePanel = null;
        }
    },
    mounted() {
        // 初始化完成后添加动画类
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 500);
        
        // 添加键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePanel();
            }
        });
    }
});