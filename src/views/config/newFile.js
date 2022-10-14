import { listWx, updateWx } from "@/api/config";

export default (await import('vue')).default.extend({
    name: "ConfigWx",
    data() {
        return {
            list: null
        };
    },
    created() {
        this.init();
    },
    methods: {
        init: function () {
            listWx().then((response) => {
                console.log(123, response);
                this.list = response.data.data;
                // this.dataForm.litemall_wx_share =
                //   this.dataForm.litemall_wx_share === "true";
            });
        },
        cancel() {
            this.init();
        },
        // update() {
        //   this.$refs["dataForm"].validate((valid) => {
        //     if (!valid) {
        //       return false;
        //     }
        //     this.doUpdate();
        //   });
        // },
        doUpdate() {
            updateWx(this.dataForm)
                .then((response) => {
                    this.$notify.success({
                        title: "成功",
                        message: "小程序配置成功"
                    });
                })
                .catch((response) => {
                    this.$notify.error({
                        title: "失败",
                        message: response.data.errmsg
                    });
                });
        }
    }
});
