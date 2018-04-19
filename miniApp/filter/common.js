var common = {
    //切去前半段时间
    sliceStringFont: function (time) {
        if (!time) return "";
        var initData = time + " ";//如果没有空格则不能使用split函数
        var yearMonthDay = (initData.split(" "))[0];
        return yearMonthDay;
    },
    //切去后半段时间
    sliceStringEnd: function (time) {
        if (!time) return "";
        var initData = time + " ";//如果没有空格则不能使用split函数
        var hourMinites = (initData.split(" "))[1];
        var output = (hourMinites.split(":")).join(":fff");
        return hourMinites;
    },
    //职称过滤[1：医师，2：主治医师，3：副主任医师，4：主任医师]
    titleFilter: function (num) {
        switch (num) {
            case 1:
                return "医师";
                break;
            case 2:
                return "主治医师";
                break;
            case 3:
                return "副主任医师";
                break;
            case 4:
                return "主任医师";
                break;
            default:
                return "医师";
        }
    },
    //性别过滤
    sexFilter: function (num) {
        if (num == 0) {
            return "男";
        } else {
            return "女"
        }
    },
    //学历过滤[1：大专，2：本科，3：硕士，4：博士，5：其他]
    educationFilter: function (num) {
        switch (num) {
            case 1:
                return "大专";
                break;
            case 2:
                return "本科";
                break;
            case 3:
                return "硕士";
                break;
            case 4:
                return "博士";
                break;
            case 5:
                return "其他";
                break;
            default:
                return "其他";
        }
    },
    //公司规模过滤[规模，1：10人以下，2：10~50人，3：50~100人，4：100~500人，5：500人以上]
    scaleFilter: function (num) {
      switch (num) {
        case 1:
          return "10人以下";
          break;
        case 2:
          return "10~50人";
          break;
        case 3:
          return "50~100人";
          break;
        case 4:
          return "100~500人";
          break;
        default:
          return "500人以上";
      }
    }

}

module.exports = {
    sliceStringFont: common.sliceStringFont,
    sliceStringEnd: common.sliceStringEnd,
    titleFilter: common.titleFilter,
    sexFilter: common.sexFilter,
    educationFilter: common.educationFilter,
    scaleFilter: common.scaleFilter
}
