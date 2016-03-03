
我爱看电影的管理网站

> 第二个版本 参考建站攻略 第二期

	结合@scott 老师的视频教程，结合自己的想法，模拟出第二个版本的电影信息网站

1、添加了豆瓣的 API 数据同步
2、后台的电影，用户，API，分类等信息管理
3、优化了代码结构，调整了路由规则


> 慕课网 node + mongodb 建站攻略 第一期

短短两小时的课程，代码量对于初学者确实受益颇丰，可惜没有找到老师(@Scott)的源代码，防止更多人遇到和我同样的坑，特此共享自己成功完成第一期项目的源代码。

1 、 前端 资源管理 bower + node 包管理器 npm  + 自动化 grunt 
2 、 jade 模板 + bootstrap 的效果展示
3 、 mongodb 模型设计与数据交互 
4、  文件上传控件，dropzone 的研究学习
5、  数据模型采用当下刚上映的电影《叶问3 or IP MAN 3》等

## 调整数据字段

{
    "_id" : ObjectId("56d6efa761b15a7021715dcc"),
    "name" : "叶问3",
    "alias" : "叶问3,Yip Man 3,Ip Man 3",
    "writers" : "",
    "directors" : "叶伟信",
    "actors" : "甄子丹/迈克·泰森/张晋/熊黛林",
    "duration" : "",
    "summary" : "",
    "story" : "",
    "introduction" : "1959年，叶问（甄子丹饰）与张永成（熊黛林饰）将大儿子叶准送回广东，小儿子叶正继续在香港读书。在与马鲸笙（谭耀文饰）与其老板（泰森饰）所带领的帮派抗争的过程中，叶问带领着自己的弟子保卫了小学，并结识了依靠拉车和在地下赌场斗武为生的张天志（张晋饰），二 人惺惺相惜。然而 此时，自称 “咏春正宗” 的张天志却向叶问公开宣战，要为自己新开的武馆争取名誉。可是张永成突然病危，让叶问不得不肩负起照顾妻儿的责任。面对家庭和武术，叶问究竟会作何选择？他是否会应战张天志，夺回属于他 “咏春正宗” 的头衔？",
    "prevueVideo" : "",
    "video" : "",
    "showDate" : "2015",
    "score" : "6.8",
    "schedule_url" : "http://movie.douban.com/subject/11598977/cinema/",
    "stars" : "35",
    "source_id" : "11598977",
    "pvcount" : 4475,
    "iorder" : 1,
    "image" : [],
    "language" : [],
    "category" : [ 
        ObjectId("56d6efa761b15a7021715dcf"), 
        ObjectId("56d6efa761b15a7021715dce"), 
        ObjectId("56d6efa761b15a7021715dcd")
    ],
    "formats" : [],
    "country" : [ 
        ObjectId("56d6ef8a61b15a7021715dc6"), 
        ObjectId("56d6ef8a61b15a7021715dc5")
    ],
    "__someElse" : 5,
    "stills" : ObjectId("56d6efa761b15a7021715dd4")
}
	