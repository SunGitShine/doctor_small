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
                return "";
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
                return "";
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
    },
    //审核状态[0：未处理，1：已通过，2：未通过]
    statusFilter: function (num) {
        switch (num) {
            case 0:
                return "审核未处理";
                break;
            case 1:
                return "审核已通过";
                break;
            case 2:
                return "审核未通过";
                break;
            default:
                return "审核未处理";
        }
    },
    //工作年限[1:1~3年，2:3~5年，3:5年以上]
    workTimeFilter: function (num) {
        switch (num) {
            case 1:
                return "1~3年";
                break;
            case 2:
                return "3~5年";
                break;
            case 3:
                return "5年以上";
                break;
            default:
                return "";
        }
    }

}

module.exports = {
    sliceStringFont: common.sliceStringFont,
    sliceStringEnd: common.sliceStringEnd,
    titleFilter: common.titleFilter,
    sexFilter: common.sexFilter,
    educationFilter: common.educationFilter,
    scaleFilter: common.scaleFilter,
    statusFilter: common.statusFilter,
    workTimeFilter: common.workTimeFilter
}
