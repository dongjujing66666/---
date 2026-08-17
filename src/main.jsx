import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  assets,
  education,
  interactiveProjects,
  personalAdvantagesRefined,
  profile,
  projects,
  workExperience,
} from './siteData'
import './styles.css'
import './final-overrides.css'

const getRoute = () => {
  const hash = window.location.hash || '#/intro'

  if (hash.startsWith('#/project/')) {
    return { name: 'project', id: hash.replace('#/project/', '') }
  }

  if (hash.startsWith('#/resume')) {
    return { name: 'resume' }
  }

  if (hash.startsWith('#/portfolio')) {
    return { name: 'portfolio' }
  }

  return { name: 'intro' }
}

const getProjectHref = (id) =>
  `${window.location.origin}${window.location.pathname}#/project/${id}`

const scrollToSection = (id) => {
  const section = document.getElementById(id)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }

  window.location.hash = '#/portfolio'
  window.setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 140)
}

function ArrowMark() {
  return <span className="arrow-mark" aria-hidden="true">↗</span>
}

function Eyebrow({ children }) {
  return <p className="eyebrow">{children}</p>
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`}>
      {children}
    </div>
  )
}

function SiteNav() {
  return (
    <header className="site-nav">
      <div className="site-nav__inner page-container">
        <a className="brand-lockup" href="#/portfolio" aria-label="进入董聚婧作品集">
          <span className="brand-lockup__mark">DJJ</span>
          <span className="brand-lockup__text">
            董聚婧
            <small>AI VISUAL DESIGNER</small>
          </span>
        </a>

        <nav className="site-nav__links" aria-label="页面导航">
          <button type="button" onClick={() => scrollToSection('core')}>核心价值</button>
          <button type="button" onClick={() => scrollToSection('works')}>作品精选</button>
          <button type="button" onClick={() => scrollToSection('contact')}>联系我</button>
        </nav>

        <a className="nav-resume" href="#/resume">
          董聚婧简历 <ArrowMark />
        </a>
      </div>
    </header>
  )
}

function IntroPage() {
  const mainProject = landingProjects[0]
  const collageProjects = landingProjects.slice(1, 3)

  return (
    <div className="intro-page">
      <SiteNav />
      <main className="intro-main">
        <div className="intro-grid-overlay" aria-hidden="true" />
        <div className="page-container intro-layout">
          <section className="intro-copy">
            <Eyebrow>01 / VISUAL ENTRY / 2026</Eyebrow>
            <h1>
              董聚婧
              <span>设计总监 / 品牌经理</span>
            </h1>
            <p className="intro-lead">
              品牌策略、视觉创意与 AI 生产力的交汇处。
              <br />
              为正在增长的品牌，创造可被记住的视觉资产。
            </p>
            <a className="button button--primary" href="#/portfolio">
              进入个人作品集 <ArrowMark />
            </a>
            <div className="intro-meta">
              <span>BRAND / PACKAGING / AI</span>
              <span>BEIJING / OPEN FOR COLLABORATION</span>
            </div>
          </section>

          <section className="intro-showcase" aria-label="作品视觉预览">
            <div className="intro-showcase__main">
              {mainProject && (
                <img src={mainProject.cover.url} alt={mainProject.title} fetchPriority="high" />
              )}
              <div className="intro-showcase__caption">
                <span>{mainProject?.id || '01'}</span>
                <strong>{mainProject?.title || '精选品牌视觉项目'}</strong>
                <small>{mainProject?.tag || '视觉设计'}</small>
              </div>
            </div>

            <div className="intro-showcase__stack">
              {collageProjects.map((project) => (
                <a key={project.id} href={getProjectHref(project.id)} className="intro-tile" target="_blank" rel="noreferrer">
                  <img src={project.cover.url} alt={project.title} loading="lazy" />
                  <span>{project.id}</span>
                </a>
              ))}
            </div>

            <div className="intro-showcase__stamp">
              <span>DESIGN</span>
              <span>×</span>
              <span>AI</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

function PortfolioHero() {
  return (
    <section className="portfolio-hero">
      <img className="portfolio-hero__backdrop portfolio-hero__backdrop--fill" src={assets.heroBackground} alt="" aria-hidden="true" />
      <img className="portfolio-hero__backdrop" src={assets.heroBackground} alt="" aria-hidden="true" />
      <div className="page-container portfolio-hero__layout">
        <Reveal className="portfolio-hero__copy">
          <Eyebrow>AI VISUAL DESIGNER / BRAND GROWTH</Eyebrow>
          <div className="hero-title__accent portfolio-hero__role">
            设计总监 / 品牌经理
          </div>
          <h1>
            <span className="hero-title__name">I'm 董聚婧</span>
          </h1>
          <p>
            12 年品牌设计与增长经验，
            <br />
            以品牌策略、视觉创意与 AI 生产力加速增长。
          </p>
          <div className="portfolio-hero__meta-line" aria-label="出生日期与年龄">
            <span>1993.05.11</span>
            <div className="portfolio-hero__meta-cluster">
              <span>33岁</span>
              <span className="portfolio-hero__location">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                地区：北京
              </span>
            </div>
          </div>
          <div className="button-row">
            <button type="button" className="button button--primary" onClick={() => scrollToSection('works')}>
              查看作品精选 <ArrowMark />
            </button>
            <button type="button" className="button button--ghost" onClick={() => scrollToSection('contact')}>
              联系我 <ArrowMark />
            </button>
          </div>
        </Reveal>

        <Reveal className="portfolio-hero__visual">
          <div className="portfolio-hero__icon-grid" aria-hidden="true">
            {assets.heroIcons.map((icon, index) => (
              <img
                className={`portfolio-hero__icon portfolio-hero__icon--${index + 1}`}
                src={icon}
                alt=""
                key={icon}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function AdvantageIcon({ type }) {
  const gradientId = `advantage-icon-gradient-${type}`
  const stroke = `url(#${gradientId})`

  return (
    <svg className="advantage-card__icon" viewBox="0 0 48 48" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffd09a" />
          <stop offset="0.48" stopColor="#ff9a4f" />
          <stop offset="1" stopColor="#ff5b21" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
        {type === 'growth' && (
          <>
            <path d="M8 37h32" />
            <polyline points="10 31 18 23 25 27 39 12" />
            <polyline points="31 12 39 12 39 20" />
            <circle cx="18" cy="23" r="2" />
            <circle cx="25" cy="27" r="2" />
          </>
        )}
        {type === 'leadership' && (
          <>
            <circle cx="17" cy="15" r="5" />
            <circle cx="33" cy="15" r="5" />
            <path d="M7 37c0-6 4-10 10-10s10 4 10 10" />
            <path d="M22 37c0-6 4-10 10-10s10 4 10 10" />
            <path d="M24 11v10M19 16h10" />
          </>
        )}
        {type === 'clients' && (
          <>
            <rect x="7" y="11" width="34" height="27" rx="4" />
            <path d="M7 20h34M18 11v-2h12v2M17 28h14M17 33h8" />
            <circle cx="13" cy="28" r="1.5" />
          </>
        )}
        {type === 'strategy' && (
          <>
            <circle cx="24" cy="24" r="16" />
            <circle cx="24" cy="24" r="5" />
            <path d="m33 15-5 12-12 5 5-12 12-5Z" />
            <path d="M24 8v4M24 36v4M8 24h4M36 24h4" />
          </>
        )}
        {type === 'aigc' && (
          <>
            <path d="m24 7 2.6 9.4L36 19l-9.4 2.6L24 31l-2.6-9.4L12 19l9.4-2.6L24 7Z" />
            <path d="M32 30v7M28.5 33.5h7M11 11v7M7.5 14.5h7" />
            <circle cx="38" cy="10" r="2" />
            <circle cx="10" cy="38" r="2" />
          </>
        )}
      </g>
    </svg>
  )
}

const advantageIconTypes = {
  '01': 'growth',
  '02': 'leadership',
  '03': 'clients',
  '04': 'strategy',
  '05': 'aigc',
}

function MarqueeSection() {
  const sectionRef = useRef(null)
  const [shift, setShift] = useState(0)

  useEffect(() => {
    const updateShift = () => {
      const section = sectionRef.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const nextShift = Math.max(window.innerHeight - rect.top, 0) * 0.18
      setShift(nextShift)
    }

    updateShift()
    window.addEventListener('scroll', updateShift, { passive: true })
    window.addEventListener('resize', updateShift)
    return () => {
      window.removeEventListener('scroll', updateShift)
      window.removeEventListener('resize', updateShift)
    }
  }, [])

  // Keep the earliest projects in the center of the initial gallery view.
  const rowOneProjects = [
    interactiveProjects[8],
    ...interactiveProjects.slice(0, 8),
  ].filter(Boolean)
  const sunflowerProject = projects.find((project) => project.id === '04')
  const rowTwoProjects = [
    interactiveProjects[7],
    sunflowerProject,
    ...interactiveProjects.slice(4, 7),
    ...interactiveProjects.slice(0, 3),
    interactiveProjects[8],
  ].filter(Boolean)
  const row = [...rowOneProjects, ...rowOneProjects, ...rowOneProjects]
  const rowTwo = [...rowTwoProjects, ...rowTwoProjects, ...rowTwoProjects]

  return (
    <section ref={sectionRef} className="marquee-section" aria-label="头图作品展示">
      <div className="page-container marquee-section__label">
        <Eyebrow>SELECTED VISUAL ARCHIVE / HEAD IMAGE SERIES</Eyebrow>
        <span>Scroll driven / 16:9 project covers</span>
      </div>
      <div className="marquee-row marquee-row--left" style={{ transform: `translate3d(${shift * -1}px, 0, 0)` }}>
        {row.map((project, index) => (
          <a className="marquee-card" href={getProjectHref(project.id)} key={`left-${project.id}-${index}`} target="_blank" rel="noreferrer">
            <img src={project.cover.url} alt={project.title} loading="lazy" />
            <span>{project.id}</span>
          </a>
        ))}
      </div>
      <div className="marquee-row marquee-row--right" style={{ transform: `translate3d(${shift}px, 0, 0)` }}>
        {rowTwo.map((project, index) => (
          <a className="marquee-card" href={getProjectHref(project.id)} key={`right-${project.id}-${index}`} target="_blank" rel="noreferrer">
            <img src={project.cover.url} alt={project.title} loading="lazy" />
            <span>{project.id}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

function ProfileSection() {
  return (
    <section className="section section--paper profile-section">
      <div className="page-container">
        <div className="section-heading section-heading--split">
          <div>
            <Eyebrow>CORE VALUE / PROFILE</Eyebrow>
            <h2>
              让经历变成判断，
              <br />
              <em>让判断变成价值。</em>
            </h2>
          </div>
          <p>
            12 年品牌设计与增长经验，长期服务医药、快消、金融、汽车和互联网品牌，关注视觉表达，也关注它如何进入真实业务。
          </p>
        </div>

        <div className="profile-grid profile-grid--reference">
          <div className="profile-portrait">
            <img src={assets.portrait} alt="董聚婧个人形象照" loading="lazy" />
            <div className="profile-portrait__tag">
              <span>{profile.gender} / {profile.age}</span>
              <strong>{profile.name}</strong>
            </div>
          </div>

          <div className="profile-copy">
            <p className="profile-copy__lead">{profile.summary}</p>
          <div className="profile-facts">
            <div>
              <span>CONTACT</span>
              <a href={`tel:${profile.phone}`}>{profile.phone}</a>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </div>
            <div>
              <span>JOB INTENTION</span>
              <p>{profile.jobIntent}</p>
              <p>{profile.experience}</p>
              <p>期望薪资：{profile.salary}</p>
              <p>期望城市：{profile.city}</p>
            </div>
          </div>
        </div>
        </div>

        <div className="stats-grid">
          {profile.stats.map((stat) => (
            <div className="stat-item" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PersonalAdvantagesSection() {
  return (
    <section className="section section--dark resume-section" id="resume">
      <div className="page-container">
        <div className="resume-title-row">
          <div>
            <Eyebrow>CORE VALUE / PERSONAL ADVANTAGES</Eyebrow>
            <h2>
              个人优势
              <span className="module-tagline">回报率最好的投资</span>
            </h2>
          </div>
          <span>从品牌增长到 AI 视觉生产力</span>
        </div>

        <div className="advantage-grid">
          {personalAdvantagesRefined.map((item) => (
            <Reveal className={`advantage-card advantage-card--${item.index}`} key={item.index}>
              <div className="advantage-card__top">
                <span>{item.index}</span>
                <small>{item.english}</small>
              </div>
              <AdvantageIcon type={advantageIconTypes[item.index]} />
              <div className="advantage-card__body">
                <h3>{item.title}</h3>
                <p className="advantage-card__subtitle">{item.subtitle}</p>
                <div className="advantage-card__details">
                  {item.details.map((detail) => (
                    <p key={detail}>{detail}</p>
                  ))}
                </div>
                <div className="advantage-card__foot">
                  <span>VALUE / {item.index}</span>
                  <i aria-hidden="true" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function EducationSection() {
  const schoolLogos = [
    { src: assets.beijingNormalUniversityLogo, alt: '北京师范大学校徽' },
    { src: assets.huaibeiNormalUniversityLogo, alt: '淮北师范大学校徽' },
  ]

  return (
    <section className="section section--dark education-section">
      <div className="page-container">
        <div className="education-section__heading">
          <div>
            <Eyebrow>CORE VALUE / EDUCATION</Eyebrow>
            <h2>
              教育经历
              <span className="module-tagline">科班功底+MBA级商业思维</span>
            </h2>
          </div>
          <p>以商业管理与视觉绘画的双重训练，支撑品牌判断、创意表达与落地执行。</p>
        </div>
        <div className="education-grid">
          {education.map((item, index) => (
            <article className="education-card" key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <img className="education-card__logo" src={schoolLogos[index].src} alt={schoolLogos[index].alt} />
              <p>{item}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ResumeSection() {
  return (
    <section className="section section--dark detailed-resume">
      <div className="page-container">
        <div className="section-heading section-heading--split">
          <div>
            <Eyebrow>CORE VALUE / RESUME</Eyebrow>
            <h2>
              工作经历
              <span className="module-tagline">从搭团队到出作品，全流程负责</span>
            </h2>
          </div>
          <p>20个以上百强企业的项目经历</p>
        </div>

        <div className="resume-block">
          <div className="resume-block__label">
            <Eyebrow>WORK EXPERIENCE</Eyebrow>
          </div>
          <div className="resume-block__content">
            {workExperience.map((job) => (
              <article className="resume-job" key={job.index}>
                <div className="resume-job__header">
                  <span>{job.index}</span>
                  <div>
                    <h3>{job.company}</h3>
                    <strong>{job.role}</strong>
                  </div>
                  <time>{job.period}</time>
                </div>
                <div className="resume-job__body">
                  <div>
                    <b>内容</b>
                    <ol>
                      {job.content.map((item) => <li key={item}>{item}</li>)}
                    </ol>
                  </div>
                  <div>
                    <b>业绩</b>
                    <ol>
                      {job.results.map((item) => <li key={item}>{item}</li>)}
                    </ol>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

function ProjectsSection() {
  return (
    <section className="section section--archive" id="works">
      <div className="page-container">
        <div className="section-heading section-heading--archive">
          <div>
            <Eyebrow>03 / SELECTED WORKS</Eyebrow>
            <h2>
              作品精选
              <span className="module-tagline">每个作品背后都有一组增长数据</span>
            </h2>
          </div>
          <p>将品牌营销和创意结合，并赋能团队，实现组织效益最大化</p>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <a className="project-card" href={getProjectHref(project.id)} key={project.folderName} target="_blank" rel="noreferrer">
              <div className="project-card__media">
                <img src={project.cover.url} alt={project.title} loading="lazy" />
                <span>{project.id}</span>
              </div>
              <div className="project-card__meta">
                <span>{project.tag}</span>
                <span>{project.detailFiles.length ? `${project.detailFiles.length} FILES` : 'VISUAL ARCHIVE'}</span>
              </div>
              <h3>
                <span>{project.title}</span>
                <span className="project-card__jump" aria-hidden="true">
                  <svg className="project-card__jump-icon" viewBox="0 0 48 48" focusable="false">
                    <defs>
                      <linearGradient id={`project-arrow-gradient-${project.id}`} x1="8" y1="40" x2="40" y2="8" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#ff7328" />
                        <stop offset="0.48" stopColor="#ffb35c" />
                        <stop offset="1" stopColor="#ff5b1f" />
                      </linearGradient>
                    </defs>
                    <path d="M8 42 L38 12 M22 12 H38 V28" stroke={`url(#project-arrow-gradient-${project.id})`} />
                  </svg>
                </span>
              </h3>
              <p>{project.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <div className="page-container">
        <div className="contact-section__main">
          <div>
            <Eyebrow>04 / CONTACT</Eyebrow>
            <h2>
              联系我
              <span className="module-tagline">从一段对话开始</span>
            </h2>
            <p>如果你正在寻找一位能把策略、视觉、AI 工具和团队推进放在同一张桌面上的设计伙伴，欢迎联系我。</p>
          </div>

        </div>

        <div className="contact-section__bottom">
          <div className="contact-section__links">
            <a href={`tel:${profile.phone}`}>
              <span className="contact-section__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <span>PHONE / MOBILE</span>
              <strong>{profile.phone}</strong>
              <ArrowMark />
            </a>
            <a href={`mailto:${profile.email}`}>
              <span className="contact-section__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </span>
              <span>EMAIL</span>
              <strong>{profile.email}</strong>
              <ArrowMark />
            </a>
          </div>
          <div className="contact-section__qr-column">
            <a className="button button--ghost" href="#/resume">
              查看完整简历 <ArrowMark />
            </a>
            <div className="qr-block">
              <img src={assets.qrCode} alt="联系我二维码" loading="lazy" />
              <div>
                <Eyebrow>WECHAT QR CODE</Eyebrow>
                <p>微信扫码联系我</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="site-footer">
          <span>© 2026 DONG JUJING / AI VISUAL DESIGNER</span>
          <button type="button" onClick={() => scrollToSection('core')}>回到核心价值 ↗</button>
        </footer>
      </div>
    </section>
  )
}

function PortfolioPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="site-shell">
      <SiteNav />
      <main>
        <div id="core">
          <PortfolioHero />
          <MarqueeSection />
          <PersonalAdvantagesSection />
          <EducationSection />
          <ResumeSection />
        </div>
        <ProjectsSection />
        <ContactSection />
      </main>
    </div>
  )
}

function ProjectDetailPage({ project }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [project.id])

  return (
    <div className="site-shell">
      <SiteNav />
      <main className="project-detail">
        <div className="page-container">
          <div className="project-detail__topline">
            <a className="back-link" href="#/portfolio">← 返回作品集</a>
            <span>PROJECT {project.id} / {project.tag}</span>
          </div>

          <div className="project-detail__heading">
            <div>
              <Eyebrow>{project.tag} / PROJECT {project.id}</Eyebrow>
              <h1>{project.title}</h1>
              <p>{project.description}</p>
            </div>
            <div className="project-detail__count">
              <strong>{project.detailFiles.length}</strong>
              <span>PDF / JPG LONG IMAGES</span>
            </div>
          </div>

          <div className="project-detail__intro">
            <Eyebrow>PROJECT CONTENT</Eyebrow>
            <p>仅展示项目中的部分作品内容</p>
          </div>

          {project.detailFiles.length > 0 && (
            <div className="detail-image-list">
              {project.detailFiles.map((file) => (
                <figure className="detail-image" key={file.path}>
                  <img src={file.url} alt={file.fileName} loading="lazy" />
                </figure>
              ))}
            </div>
          )}

          {project.detailFiles.length === 0 && (
            <div className="detail-empty">
              <Eyebrow>ARCHIVE NOTE</Eyebrow>
              <p>当前文件包暂未包含可展示的 JPG 长图或已转换的 PDF 页面。</p>
            </div>
          )}
        </div>
      </main>
      <ContactSection />
    </div>
  )
}

function ResumePreviewPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="site-shell">
      <SiteNav />
      <main className="project-detail resume-preview">
        <div className="page-container">
          <div className="project-detail__topline">
            <a className="back-link" href="#/portfolio">返回作品集</a>
            <a
              className="button button--primary button--small"
              href={assets.resumeImage}
              download="董聚婧-视觉设计总监_经理-12年品牌设计与增长经验.jpg"
            >
              下载简历 JPG <ArrowMark />
            </a>
          </div>

          <div className="project-detail__heading resume-preview__heading">
            <div>
              <Eyebrow>RESUME / DESIGN DIRECTOR</Eyebrow>
              <h1>董聚婧简历</h1>
              <p>设计总监 / 品牌经理</p>
            </div>
          </div>

          <figure className="resume-preview__image">
            <img src={assets.resumeImage} alt="董聚婧简历" />
          </figure>
        </div>
      </main>
    </div>
  )
}

function App() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (route.name === 'project') {
    const project = projects.find((item) => item.id === route.id)
    if (project) return <ProjectDetailPage project={project} />
  }

  if (route.name === 'resume') return <ResumePreviewPage />
  if (route.name === 'portfolio') return <PortfolioPage />
  return <IntroPage />
}

createRoot(document.getElementById('root')).render(<App />)
