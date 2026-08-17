const projectFiles = import.meta.glob('../[0-9]*/*.{png,jpg,jpeg,JPG,JPEG,PNG}', {
  eager: true,
  as: 'url',
})

const renderedPdfPageFiles = import.meta.glob('../[0-9]*/web-pdf-pages/*.{jpg,jpeg,JPG,JPEG}', {
  eager: true,
  as: 'url',
})

const imageExtensions = new Set(['png', 'jpg', 'jpeg'])
const detailExtensions = new Set(['jpg', 'jpeg'])

export const assets = {
  portrait: new URL('../个人形象照.png', import.meta.url).href,
  portraitRound: new URL('../个人形象照圆形.png', import.meta.url).href,
  heroBackground: new URL('../网站首页背景图.jpg', import.meta.url).href,
  heroIcons: [
    new URL('../首页图标/首页图标1.png', import.meta.url).href,
    new URL('../首页图标/首页图标2.png', import.meta.url).href,
    new URL('../首页图标/首页图标3.png', import.meta.url).href,
    new URL('../首页图标/首页图标4.png', import.meta.url).href,
  ],
  qrCode: new URL('../联系我二维码.png', import.meta.url).href,
  beijingNormalUniversityLogo: new URL('../北京师范大学.png', import.meta.url).href,
  huaibeiNormalUniversityLogo: new URL('../淮北师范大学.png', import.meta.url).href,
  resumeImage: new URL(
    '../董聚婧-视觉设计总监_经理-12年品牌设计与增长经验.jpg',
    import.meta.url,
  ).href,
}

const tagRules = [
  { match: /包装|软糖|果冻|牛奶铺/, tag: '包装设计' },
  { match: /IP|小诺|小助福|老助福/, tag: 'IP 形象' },
  { match: /海报|插画|节气|双11|产品/, tag: '海报插画' },
  { match: /长图|小游戏|淘宝|征文|上市|SUV|羊毛惠/, tag: '整合营销' },
  { match: /卡券|礼券|红包|台历|礼品/, tag: '礼赠视觉' },
  { match: /宣传册|网站/, tag: '品牌系统' },
]

const descriptionRules = [
  {
    match: /包装|软糖|果冻|牛奶铺/,
    description: '围绕产品定位、消费场景与渠道陈列，建立可延展的产品视觉。',
  },
  {
    match: /IP|小诺|小助福|老助福/,
    description: '用角色、表情和应用场景构建可持续使用的品牌识别资产。',
  },
  {
    match: /海报|插画|节气|双11|产品/,
    description: '把品牌信息转译成有识别度、有传播力的视觉内容。',
  },
  {
    match: /长图|小游戏|淘宝|征文|上市|SUV|羊毛惠/,
    description: '连接策略、创意与传播触点，让视觉真正参与业务增长。',
  },
  {
    match: /卡券|礼券|红包|台历|礼品/,
    description: '从材质、结构到平面表现，完成可落地的礼赠体验设计。',
  },
]

const coverFileOverrides = {
  '11云南白药插画节气海报': '云南白药插画节气海报头图.jpg',
}

const toAssetRecord = ([path, url]) => {
  const match = path.match(/^\.\.\/([^/]+)\/(.+)$/)
  if (!match) return null

  const [, folderName, fileName] = match
  const extension = fileName.split('.').pop().toLowerCase()
  const order = Number(folderName.match(/^\d+/)?.[0] || 0)
  const title = folderName.replace(/^\d+/, '').trim()
  const isHeader = /头图|封面/.test(fileName)

  return {
    path,
    url,
    folderName,
    fileName,
    extension,
    order,
    title,
    isHeader,
    isImage: imageExtensions.has(extension),
  }
}

const records = Object.entries(projectFiles)
  .map(toAssetRecord)
  .filter(Boolean)

const pdfPagesByFolder = new Map()

Object.entries(renderedPdfPageFiles).forEach(([path, url]) => {
  const match = path.match(/^\.\.\/([^/]+)\/web-pdf-pages\/(.+)$/)
  if (!match) return

  const [, folderName, fileName] = match
  const page = Number(fileName.match(/(\d+)(?=\.[^.]+$)/)?.[1] || 0)
  const pages = pdfPagesByFolder.get(folderName) || []

  pages.push({
    path,
    url,
    fileName,
    extension: 'jpg',
    isImage: true,
    page,
    source: 'pdf',
  })
  pdfPagesByFolder.set(folderName, pages)
})

pdfPagesByFolder.forEach((pages) => {
  pages.sort((a, b) => a.page - b.page)
})

const groupedProjects = new Map()

records.forEach((record) => {
  if (!groupedProjects.has(record.folderName)) {
    groupedProjects.set(record.folderName, {
      id: String(record.order).padStart(2, '0'),
      order: record.order,
      title: record.title,
      folderName: record.folderName,
      files: [],
    })
  }

  groupedProjects.get(record.folderName).files.push(record)
})

const getTag = (title) =>
  tagRules.find((rule) => rule.match.test(title))?.tag || '视觉设计'

const getDescription = (title) =>
  descriptionRules.find((rule) => rule.match.test(title))?.description ||
  '从品牌问题出发，串联策略、视觉与落地，形成完整的表达系统。'

export const projects = [...groupedProjects.values()]
  .map((project) => {
    const images = project.files
      .filter((file) => file.isImage)
      .sort((a, b) => Number(b.isHeader) - Number(a.isHeader))
    const cover =
      images.find((file) => file.fileName === coverFileOverrides[project.folderName]) ||
      images.find((file) => file.isHeader) ||
      images[0]
    const imageDetailFiles = project.files
      .filter((file) => !file.isHeader && file.isImage && detailExtensions.has(file.extension))
      .sort((a, b) => a.fileName.localeCompare(b.fileName, 'zh-CN'))
    const renderedPdfPages = pdfPagesByFolder.get(project.folderName) || []
    const detailFiles = [...renderedPdfPages, ...imageDetailFiles]

    return {
      ...project,
      cover,
      detailFiles,
      hasHeader: Boolean(cover?.isHeader),
      tag: getTag(project.title),
      description: getDescription(project.title),
    }
  })
  .filter((project) => project.cover)
  .sort((a, b) => a.order - b.order)

export const landingProjects = projects.filter((project) => project.hasHeader)

// A compact, high-impact selection for the scroll-driven gallery below the hero.
const interactiveProjectIds = ['01', '02', '03', '31', '05', '06', '07', '35', '32']

export const interactiveProjects = interactiveProjectIds
  .map((id) => landingProjects.find((project) => project.id === id))
  .filter(Boolean)

export const profile = {
  name: '董聚婧',
  gender: '女',
  age: '33 岁',
  role: '设计总监 / 品牌经理',
  title: '设计总监 / 品牌经理',
  location: '北京',
  phone: '15810580701',
  email: 'dongjujing@foxmail.com',
  experience: '12 年工作经验',
  jobIntent: '视觉设计总监 / 经理',
  salary: '30-35K',
  city: '北京',
  summary:
    '12 年品牌设计与增长经验，5 年+ 4A 广告经验，6 年+ Team Leader 团队经验。擅长把品牌策略、视觉创意、AI 生产力和团队协作串成一套可落地的工作系统。',
  stats: [
    { value: '12+', label: '品牌设计与增长经验' },
    { value: '20+', label: '百强企业服务经历' },
    { value: '6+', label: 'Team Leader 团队经验' },
    { value: '0→1', label: '品牌体系搭建能力' },
  ],
}

export const personalAdvantages = [
  {
    index: '01',
    text: '12年品牌设计与增长经验；5年+4A广告经验；',
  },
  {
    index: '02',
    text: '6年+ Team Leader 团队经验；优秀的管理能力和出色的沟通能力，协调各部门完成组织战略目标；',
  },
  {
    index: '03',
    text: '服务20+百强企业，主导3次品牌升级，品牌认知度提升25%；',
    children: [
      '其中包涵极小智+品诺福利，完成品牌从0-1的体系搭建；',
      '以及蒙牛+三元+伊利+同仁堂+云南白药+可口可乐+中国联通+京东等，完成品牌从1-10的品牌升级；',
    ],
  },
  {
    index: '04',
    text: '擅长战略分析与创意思维，将品牌营销和创意结合，并赋能团队，实现组织效益最大化；',
  },
  {
    index: '05',
    text: '熟练运用 AIGC 为品牌赋能，包含 Codex、Lovart、Midjourney等Agent软件；',
  },
]

export const personalAdvantagesRefined = [
  {
    index: '01',
    title: '品牌增长',
    english: 'PERSONAL STRENGTHS',
    subtitle: '12+品牌设计与增长经验',
    details: [
      '5年+4A广告经验；深耕快消、消费、大健康赛道；擅长品牌策略+视觉落地一体化输出。',
    ],
  },
  {
    index: '02',
    title: '团队领导',
    english: 'LEADERSHIP',
    subtitle: '6年以上 Team Leader 团队经验',
    details: [
      '曾带领8-15人设计团队；建立标准化流程，人均产能提升20%。',
    ],
  },
  {
    index: '03',
    title: '项目经验',
    english: 'CLIENTS',
    subtitle: '20个以上百强企业的项目经历',
    details: [
      '服务20+百强企业，主导3次品牌升级，品牌认知度提升25%；',
      '其中包含极小智+品诺福利，完成品牌从0-1的体系搭建；',
      '以及蒙牛+三元+伊利+同仁堂+云南白药+可口可乐+中国联通+京东等，完成品牌从1-10的品牌升级；',
    ],
  },
  {
    index: '04',
    title: '战略思维',
    english: 'STRATEGY',
    subtitle: '战略咨询与创意落地',
    details: [
      '擅长战略分析与创意思维，将品牌营销和创意结合，并赋能团队，实现组织效益最大化；',
    ],
  },
  {
    index: '05',
    title: '技术应用',
    english: 'AIGC',
    subtitle: '10项以上不同的AI工具赋能品牌设计',
    details: [
      '熟练运用 AIGC 为品牌赋能，包含 Codex、Lovart、Midjourney等Agent软件；',
    ],
  },
]

export const workExperience = [
  {
    index: '01',
    company: '增长动力（北京）营销咨询有限公司',
    role: '品牌经理',
    period: '2024.03-至今',
    content: [
      '同仁堂御药传奇品牌全案的规划及落地；从品牌标识、视觉定位、终端陈列、传播物料、数字体验五方面进行全面升级；包含品牌视觉形象规范管理项目。推动集团品牌架构从单一“双龙标”母品牌，向“单一品牌+母品牌背书+子品牌独立发展”的多品牌架构过渡。',
      '小葵花儿童果汁项目的包装设计及传播；',
      '万通药业活动项目；',
      '西鼎会-经销商增长大会的视觉规划、宣发及相关物料；',
    ],
    results: [
      '提升同仁堂御药传奇品牌资产，建立“御药传奇”超级视觉符号系统。以“御赐金牌为笔，圣旨山河为卷”为创意核心，将御药历史资产转译为现代高端视觉语言。建立覆盖品牌视觉VI、终端陈列标准、会员服务模式、终端助销物料、媒体营销传播的完整品牌体验系统。',
      '溢价能力：御药传奇系列作为“控销产品”，终端价格较普通大品种高出30%-50%，成功开辟了高毛利增长曲线。在并未全面铺货的情况下，核心单品手工安宫牛黄丸在试点区域销售额同比增长22%。',
      '圆满完成西鼎会-经销商增长大会的举办；',
    ],
  },
  {
    index: '02',
    company: '原生动力（北京）数字传媒科技有限公司',
    role: '设计总监',
    period: '2022.06-2024.03',
    content: [
      '带领团队成员，完成toC快消品行业极小智儿童牛奶品牌从0-1的搭建，包含品牌定位、品牌风格调性确立、IP形象设计、产品包装设计、动画分镜绘制、电商详情页面设计、POSM线下终端陈列设计等。',
      '提出多种创意方案，在与其他部门以及客户的协调沟通中，不断完善、调整、改进方案，以满足客户的需求，满足消费者的喜好，最终做的极小智品牌有机儿童牛奶新品取得良好的市场反应和业务成果；',
    ],
    results: [
      '参与云南白药品牌《为健康，守护热爱》大型公益活动主视觉及新媒体营销视觉推广，荣获 IAI 传鉴国际金奖，累计线上1850万人参与互动，电商销售额同比去年增长56.8%。',
    ],
  },
  {
    index: '03',
    company: '北京品诺优创科技有限公司',
    role: '视觉设计总监',
    period: '2021.02-2022.05',
    content: [
      '负责品诺福利品牌从0-1的搭建，以及IP形象小诺的落地，提升品牌认知度；',
      '处理各部门设立需求，合理分配设计工作，把控设计周期、设计质量、输出高质量的作品，达成组织目标；',
      '负责团队人才组建-团队目标制定与绩效考核，实现组织效益最大化；',
      '组织完善内部人员学习与提升；',
      '公司设计流程规范与效率提升；',
      '包涵VIS、KV、IP形象、海报、画册、包装、礼品、线上传播设计等；',
      '公司线下印刷品质量的把控以及价格协商。',
    ],
    results: [
      '完成了品诺福利IP形象的落地，提升客户认知度与可信度，为销售增加筹码，同比业绩相比去年增加36%。',
      '完成了定制设计的标准化流程制定，团队效率提升20%；',
    ],
  },
  {
    index: '04',
    company: '北京美通互动广告传媒股份有限公司',
    role: '美术指导',
    period: '2017.10-2021.02',
    content: [
      '负责联通、中国银行、京东、建设银行等大型企业的项目创意设计，包括项目洞察、前期策略、创意产出、美术指导，保证项目按时高效的完成；',
      '完成品牌创意高品质产出，涵盖品牌主视觉/创意海报/手绘插画/H5营销/电商页面/双微运营等诸多领域；',
    ],
    results: [
      '以优异的视觉创意方案，中标多个竞标项目，包括联通5G品牌焕新，中行H5竞标、海报竞标、银行卡面竞标及微信公众号推广等；',
      '以优秀的工作业绩完成京东618及双十二的项目，并获得高额奖金；',
    ],
  },
  {
    index: '05',
    company: '华腾启创广告有限公司',
    role: '视觉设计师',
    period: '2015.07-2017.10',
    content: [
      '完成伊利品牌与可口可乐品牌的线下路演活动的竞标与执行项目，与策略执行完美配合，对设计画面产出效果图与完稿图，确保项目高效的完成；',
      '完成设计产出包含路演3D效果图/背景板/礼盒/门头/堆头/货架/宣传手册/三折页/展板/店招/易拉宝/吊牌/胸贴等；',
    ],
    results: [
      '拿下伊利甄稀品牌及畅轻等品牌的多个竞标项目，并高效地执行出完稿，完美的线下落地，获得用户的深度喜爱；',
    ],
  },
]

export const projectExperience = {
  title: '中国银行海外留学生征文大赛项目',
  role: '美术指导',
  period: '2020.11-2021.02',
  content: [
    '由教育部发起的中国海外留学生征文大赛，来展现丰富的海外留学生活故事以及精神文化融合；',
    '面向对象：中国籍海外留学生及家长；',
  ],
  results: [
    '项目贡献：根据海外留学生的生活场景以及留学故事，洞察出海外留学生独在异乡的爱国情怀与孤独的心境；提出了中国风的创意思路，一条以书铺成的路，路上有留学生孤独的朝着梦想去追逐的故事；完成了主视觉的定稿与倒计时的海报，以及中国银行公众号与教育部公众号的信息内容长图的投放；',
    '创意效果：与海外留学生产生了共鸣，项目投稿留学生作品数4000+，更收获10万+爆款好文，如<今年的留学生，谁不是一边说着我很好，一边红了眼眶>打动了大量的读者；',
  ],
}

export const education = [
  '北京师范大学｜硕士｜经济与工商管理｜2024-2027',
  '安徽淮北师范大学｜本科｜美术绘画｜2011-2015',
]

export const qualifications = [
  '计算机二级',
  '教师资格证（高中）',
  '普通话一级乙等',
  '教师资格证',
  '英语四级',
]
