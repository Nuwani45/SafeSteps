import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { NavLink, Routes, Route, useLocation } from "react-router-dom";
import {
  ShieldCheck, Menu, X, ArrowRight, ArrowUpRight, LockKeyhole, MessageCircleWarning,
  BookOpen, ClipboardCheck, LifeBuoy, ChevronRight, Check, CheckCircle2, Circle,
  Search, ExternalLink, AlertTriangle, Info, Sparkles, KeyRound, Eye, Smartphone,
  Globe2, UserRound, BadgeCheck, Copy, RotateCcw, ShieldAlert, GraduationCap,
  Fingerprint, Lightbulb, ChevronDown, Home as HomeIcon
} from "lucide-react";

const scenarios = [
  { id:"suspicious", title:"I received a suspicious message", icon:MessageCircleWarning, summary:"A message asks you to click a link, share information, or act urgently.", steps:[
    ["Pause before responding","Urgent language, unexpected prizes, threats, or pressure to act can be warning signs."],
    ["Check the sender independently","Look carefully at the account or address. Do not rely on the display name alone."],
    ["Avoid opening unexpected links or files","If the message claims to be from a bank, university, or service, visit its official website or app yourself."],
    ["Protect your account","Never share passwords, one-time passcodes, or recovery codes in response to a message."],
    ["Report and block if appropriate","Use the platform's built-in reporting tools. If an account may be compromised, change its password through the official service."]
  ], note:"A message can be suspicious without being proof of a scam. SafeSteps cannot verify links or identify the sender." },
  { id:"impersonation", title:"Someone may be impersonating me", icon:UserRound, summary:"You found an account or profile using your name, photos, or identity.", steps:[
    ["Avoid engaging with the account","Do not share more personal information or get drawn into a confrontation."],
    ["Use the platform's impersonation report","Find the official help or reporting option inside the platform."],
    ["Review your own account security","Check login activity, recovery details, password strength, and two-factor authentication."],
    ["Tell trusted people if needed","A brief heads-up can help others avoid interacting with the fake account."],
    ["Keep a private record if safe","Note the account name and date for your own reference. Avoid circulating private material."]
  ], note:"Reporting procedures differ by platform. Use the platform's official help centre for current instructions." },
  { id:"harassment", title:"I am receiving unwanted messages", icon:ShieldAlert, summary:"Someone repeatedly contacts you or sends messages that make you uncomfortable.", steps:[
    ["You do not have to reply","You can stop engaging. You do not need to justify setting a boundary."],
    ["Use privacy controls","Restrict, mute, block, or limit who can contact you, depending on the platform."],
    ["Review who can see your information","Check profile visibility, story audiences, tags, mentions, and message requests."],
    ["Use the platform's reporting tools","Report content or accounts that violate platform rules."],
    ["Reach out to someone you trust","If the situation is affecting you or feels unsafe, seek support from a trusted person or appropriate local service."]
  ], note:"If you feel in immediate danger, contact local emergency services or a trusted person nearby." },
  { id:"account", title:"I think my account was accessed", icon:KeyRound, summary:"You notice unfamiliar activity or can no longer access an account.", steps:[
    ["Use the official recovery page","Type the service's official address yourself or use its official app."],
    ["Change your password","Choose a unique password that you do not use on other accounts."],
    ["Secure your recovery methods","Check recovery email addresses, phone numbers, and trusted devices."],
    ["Sign out of unfamiliar sessions","Use the service's security settings to review active sessions and sign out of ones you do not recognise."],
    ["Turn on two-factor authentication","Use an authenticator app or another option supported by the service."]
  ], note:"Never give a recovery code or one-time passcode to someone who contacts you." },
  { id:"privacy", title:"I want to improve my privacy", icon:Eye, summary:"You want to reduce what strangers can see about you online.", steps:[
    ["Review profile visibility","Choose who can see posts, stories, friends or followers, and personal details."],
    ["Limit discoverability","Review whether people can find you using your phone number or email address."],
    ["Review app permissions","Check which apps can access your location, camera, microphone, and contacts."],
    ["Check tagging and mentions","Choose who can tag or mention you and whether tags need approval."],
    ["Review old public content","Consider whether older posts still share information you want public."]
  ], note:"Settings differ between platforms and may change. Check the current official help pages for exact steps." }
];

const lessons = [
  {id:"phishing",category:"Recognise risks",title:"Spotting phishing attempts",time:"4 min",icon:MessageCircleWarning,summary:"Learn to recognise messages designed to trick you into sharing information or opening unsafe links.",points:["Unexpected messages asking you to act immediately deserve extra caution.","Check the full sender address or account, not just the display name.","Be cautious of links that imitate familiar websites or contain unusual spelling.","Never share passwords, one-time passcodes, or recovery codes through a message.","When unsure, contact the organisation using details from its official website."]},
  {id:"passwords",category:"Protect accounts",title:"Stronger account security",time:"3 min",icon:KeyRound,summary:"Make it harder for someone else to access your accounts.",points:["Use a different password for every important account.","Use a reputable password manager if available.","Enable two-factor authentication wherever possible.","Keep recovery email and phone details current.","Never share verification codes, even with someone claiming to be support."]},
  {id:"privacy",category:"Protect information",title:"Your digital privacy",time:"4 min",icon:Eye,summary:"Understand how small privacy choices affect what others can learn about you.",points:["Review who can see your profile, posts, stories, and contact details.","Avoid publicly sharing live location, travel plans, or sensitive routines.","Check app permissions regularly and remove access you do not need.","Review tagging, mentions, and searchability settings.","Think carefully before sharing identity documents or personal information."]},
  {id:"harassment",category:"Respond safely",title:"Responding to online harassment",time:"4 min",icon:ShieldAlert,summary:"Explore practical platform controls and ways to seek support.",points:["You do not have to reply to unwanted or upsetting messages.","Use mute, restrict, block, and report tools when appropriate.","Review who can message, tag, mention, or comment on your content.","Consider speaking with someone you trust if the situation continues.","Use official platform reporting channels and appropriate local support services."]},
  {id:"identity",category:"Protect identity",title:"Protecting your digital identity",time:"3 min",icon:Fingerprint,summary:"Reduce the risk of impersonation and misuse of your personal information.",points:["Avoid reusing the same profile photo and personal details everywhere if that creates risk.","Review what personal information is visible publicly.","Be thoughtful about quizzes and forms asking for personal details.","Secure your primary email account because it often controls password recovery.","Know how to report impersonation on the platforms you use."]}
];

const quiz = [
  {q:"A message says your account will be closed in 10 minutes unless you click a link. What is the safest first step?",a:["Click quickly to avoid losing access","Pause and check through the service's official app or website","Forward it to friends"],correct:1,why:"Urgency is a common pressure tactic. Check the claim independently using the official service."},
  {q:"Someone asks you to send them a one-time login code. What should you do?",a:["Share it if they know your name","Share only half","Never share it"],correct:2,why:"One-time codes can allow access to your account. Keep them private."},
  {q:"Which password practice is safer?",a:["Use one password everywhere","Use unique passwords for important accounts","Use your birthday"],correct:1,why:"Unique passwords reduce the chance that one compromised service affects other accounts."},
  {q:"You find an account pretending to be you. What is a useful action?",a:["Use the platform's impersonation reporting process","Send the account your personal details","Post your password publicly"],correct:0,why:"Use the platform's official reporting process and review your own account security."},
  {q:"What should you do with app permissions?",a:["Allow everything permanently","Review them and remove access you do not need","Ignore them"],correct:1,why:"Regularly reviewing permissions helps limit unnecessary access to personal information."},
  {q:"A stranger sends an unexpected file. What is a cautious response?",a:["Open it immediately","Avoid opening it and verify the sender independently","Download it on every device"],correct:1,why:"Unexpected files may be unsafe. Verify through a separate trusted channel."},
  {q:"Which detail is generally unsafe to share in response to an unsolicited message?",a:["A public organisation's website","A one-time passcode","A general question"],correct:1,why:"One-time passcodes are security credentials and should never be shared."},
  {q:"What can two-factor authentication do?",a:["Add another layer to account sign-in","Make every message trustworthy","Stop all online risks"],correct:0,why:"Two-factor authentication adds a second verification step, though it does not eliminate every risk."},
  {q:"You receive repeated unwanted messages. Which platform control may help?",a:["Mute, restrict, block, or report","Send your account recovery code","Make your password public"],correct:0,why:"Platform controls can help limit contact and report behaviour that violates platform rules."},
  {q:"Where should you look for current instructions on reporting an account?",a:["A random comment","The platform's official help centre","An unknown shortened link"],correct:1,why:"Official help centres provide the platform's current reporting process."}
];

const checklistGroups = [
  {title:"Account security",icon:KeyRound,items:["I use unique passwords for my important accounts.","I have enabled two-factor authentication where available.","My recovery email and phone number are up to date.","I know how to review active login sessions."]},
  {title:"Social media privacy",icon:Eye,items:["I have reviewed who can see my posts and stories.","I have checked who can tag or mention me.","I have reviewed who can send me messages.","I know how to restrict, block, and report accounts."]},
  {title:"Personal information",icon:Fingerprint,items:["I avoid publicly sharing sensitive personal details.","I review location sharing and live-location settings.","I check app permissions for camera, microphone, and location."]},
  {title:"Safe online habits",icon:ShieldCheck,items:["I verify unexpected requests through official channels.","I never share passwords or one-time verification codes.","I know where to find official platform support."]}
];

const resources = [
  {name:"Sri Lanka CERT",type:"National cyber security",desc:"Sri Lanka's national centre for cyber security information, alerts, and incident-related guidance.",url:"https://www.cert.gov.lk/",tag:"Sri Lanka"},
  {name:"Online Safety — Sri Lanka",type:"Online safety information",desc:"Public-facing online safety information and awareness resources.",url:"https://www.onlinesafety.lk/",tag:"Sri Lanka"},
  {name:"Meta Safety Center",type:"Platform safety",desc:"Safety information and tools for Meta platforms, including reporting and account protection.",url:"https://www.facebook.com/safety/",tag:"Official platform"},
  {name:"Google Safety Center",type:"Account and privacy",desc:"Guidance and tools for protecting Google accounts and managing privacy.",url:"https://safety.google/",tag:"Official platform"},
  {name:"Instagram Help Center",type:"Reporting and privacy",desc:"Official help for reporting, blocking, privacy settings, and account security.",url:"https://help.instagram.com/",tag:"Official platform"},
  {name:"Google Account Security",type:"Account security",desc:"Review account security, recent activity, and available protection settings.",url:"https://myaccount.google.com/security",tag:"Official platform"}
];

function readSaved(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
}

function Shell({children}) {
  const [menuOpen,setMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(()=>{setMenuOpen(false); window.scrollTo({top:0,behavior:"instant"});},[location.pathname]);
  const links = [
    {to:"/",label:"Overview",icon:HomeIcon},
    {to:"/assistant",label:"Safety assistant",icon:Sparkles},
    {to:"/learning",label:"Learning hub",icon:BookOpen},
    {to:"/privacy",label:"Privacy checkup",icon:ClipboardCheck},
    {to:"/resources",label:"Support resources",icon:LifeBuoy}
  ];
  return <div className="app-shell">
    <header className="topbar">
      <NavLink to="/" className="brand"><span className="brand-mark"><ShieldCheck size={21}/></span><span>SafeSteps<span className="brand-dot">.</span></span></NavLink>
      <nav className={`nav-links ${menuOpen?"open":""}`}>
        {links.map(({to,label})=><NavLink key={to} to={to} end={to==="/"} className={({isActive})=>isActive?"nav-link active":"nav-link"}>{label}</NavLink>)}
      </nav>
      <div className="top-actions"><span className="privacy-label"><LockKeyhole size={13}/> Privacy-first</span><button className="menu-toggle" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen?<X/>:<Menu/>}</button></div>
    </header>
    <main>{children}</main>
    <footer className="footer">
      <div className="footer-brand"><span className="brand-mark small"><ShieldCheck size={17}/></span><strong>SafeSteps</strong></div>
      <p>Clear guidance. Safer digital habits.</p>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} SafeSteps · Student innovation project</span><span>Built for Track 02 · Women's Safety & Digital Inclusion</span></div>
    </footer>
  </div>
}

function PageIntro({eyebrow,title,description,icon:Icon}) {
  return <div className="page-intro"><div className="intro-icon"><Icon size={23}/></div><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div></div>
}
function FeatureCard({to,icon:Icon,title,description,meta}) {
  return <NavLink to={to} className="feature-card"><div className="feature-top"><span className="feature-icon"><Icon size={21}/></span><ArrowUpRight size={18} className="card-arrow"/></div><div><h3>{title}</h3><p>{description}</p></div><div className="feature-meta">{meta}<ChevronRight size={15}/></div></NavLink>
}

function Home() {
  return <div className="page-wrap">
    <section className="hero">
      <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line"/> DIGITAL CONFIDENCE STARTS HERE</div><h1>Take control of<br/><span>your digital safety.</span></h1><p className="hero-lead">Practical guidance to help you recognise online risks, protect your privacy, and make informed decisions — one step at a time.</p><div className="hero-buttons"><NavLink to="/assistant" className="btn btn-primary">Explore safety assistant <ArrowRight size={17}/></NavLink><NavLink to="/learning" className="btn btn-secondary">Start learning</NavLink></div><div className="hero-trust"><span><CheckCircle2 size={15}/> Simple, practical guidance</span><span><LockKeyhole size={15}/> No account required</span></div></div>
      <div className="hero-visual"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-shield"><ShieldCheck size={82} strokeWidth={1.3}/></div><div className="float-card float-top"><span className="float-icon purple"><LockKeyhole size={17}/></span><span><strong>Privacy matters</strong><small>Your information, your choices</small></span></div><div className="float-card float-bottom"><span className="float-icon green"><Check size={17}/></span><span><strong>Small steps count</strong><small>Build safer habits every day</small></span></div><div className="visual-caption">YOUR DIGITAL SPACE, YOUR CONTROL</div></div>
    </section>
    <section className="stats-strip"><div><strong>5</strong><span>Guided safety situations</span></div><div><strong>5</strong><span>Short learning modules</span></div><div><strong>15</strong><span>Privacy checkup actions</span></div><div><strong>0</strong><span>Passwords collected</span></div></section>
    <section className="section-block"><div className="section-heading"><div><div className="eyebrow">YOUR SAFETY TOOLKIT</div><h2>What would you like help with?</h2><p>Choose a space to explore practical digital safety guidance.</p></div><span className="section-count">01 / 04</span></div><div className="feature-grid">
      <FeatureCard to="/assistant" icon={Sparkles} title="Safety assistant" description="Explore common online safety situations and find clear next steps." meta="Guided support"/>
      <FeatureCard to="/learning" icon={BookOpen} title="Learning hub" description="Build your knowledge with short lessons and an interactive quiz." meta="Learn at your pace"/>
      <FeatureCard to="/privacy" icon={ClipboardCheck} title="Privacy checkup" description="Review everyday account, privacy, and security habits." meta="15-point checklist"/>
      <FeatureCard to="/resources" icon={LifeBuoy} title="Support resources" description="Find official online safety guidance and platform help centres." meta="Trusted links"/>
    </div></section>
    <section className="callout"><div className="callout-icon"><Lightbulb size={23}/></div><div><h3>Remember: you are in control of your choices.</h3><p>You do not need to respond to every message, click every link, or share information just because someone asks.</p></div><NavLink to="/learning" className="text-link">Explore safety tips <ArrowRight size={16}/></NavLink></section>
    <div className="disclaimer"><Info size={16}/><p><strong>A note about SafeSteps:</strong> This is an educational guidance tool, not an emergency service, legal service, or automated threat detector. Guidance is general; platform settings and reporting processes may change.</p></div>
  </div>
}

function Assistant() {
  const [selected,setSelected] = useState(null);
  const [completed,setCompleted] = useState([]);
  const active = scenarios.find(s=>s.id===selected);
  return <div className="page-wrap">
    <PageIntro eyebrow="GUIDED SUPPORT" title="Safety assistant" description="Choose the situation closest to yours. SafeSteps will walk you through practical options and protective steps." icon={Sparkles}/>
    {!active ? <>
      <div className="notice notice-info"><Info size={18}/><p><strong>Start with what feels relevant.</strong> You don't need to share names, screenshots, passwords, or private conversations to use this guide.</p></div>
      <div className="scenario-grid">{scenarios.map(s=><button className="scenario-card" key={s.id} onClick={()=>{setSelected(s.id);setCompleted([])}}><span className="scenario-icon"><s.icon size={22}/></span><span className="scenario-text"><strong>{s.title}</strong><small>{s.summary}</small></span><ChevronRight size={19}/></button>)}</div>
    </> : <div className="guide-layout"><section className="guide-main"><button className="back-link" onClick={()=>{setSelected(null);setCompleted([])}}>← All situations</button><div className="guide-title"><span className="feature-icon large"><active.icon size={25}/></span><div><div className="eyebrow">YOUR GUIDED PLAN</div><h2>{active.title}</h2></div></div><p className="guide-summary">{active.summary}</p><div className="step-list">{active.steps.map(([title,desc],i)=><div className={`step-item ${completed.includes(i)?"step-done":""}`} key={title}><button className="step-check" onClick={()=>setCompleted(old=>old.includes(i)?old.filter(x=>x!==i):[...old,i])} aria-label="Mark step complete">{completed.includes(i)?<Check size={17}/>:i+1}</button><div><h3>{title}</h3><p>{desc}</p></div></div>)}</div><div className="notice notice-warn"><AlertTriangle size={18}/><p>{active.note}</p></div><button className="btn btn-secondary" onClick={()=>setCompleted([])}><RotateCcw size={16}/> Reset step progress</button></section><aside className="guide-side"><div className="side-card"><div className="eyebrow">YOUR PROGRESS</div><div className="progress-number">{completed.length}<span> / {active.steps.length}</span></div><div className="progress-track"><span style={{width:`${completed.length/active.steps.length*100}%`}}/></div><p>Mark each step as you review it. Your progress is saved only for this visit.</p></div><div className="side-card purple-card"><ShieldCheck size={23}/><h3>Keep your information private</h3><p>SafeSteps does not need your personal messages, login details, or identity documents.</p></div><NavLink to="/resources" className="side-resource">Find official support resources <ArrowUpRight size={16}/></NavLink></aside></div>}
  </div>
}

function LearningHub() {
  const [active,setActive] = useState(lessons[0].id);
  const [completed,setCompleted] = useState(()=>readSaved("ss-lessons",[]));
  const [quizMode,setQuizMode] = useState(false);
  const [answers,setAnswers] = useState({});
  const [submitted,setSubmitted] = useState(false);
  useEffect(()=>localStorage.setItem("ss-lessons",JSON.stringify(completed)),[completed]);
  const lesson=lessons.find(l=>l.id===active);
  const score=quiz.filter((q,i)=>answers[i]===String(q.correct)).length;
  return <div className="page-wrap">
    <PageIntro eyebrow="BUILD YOUR KNOWLEDGE" title="Learning hub" description="Short, practical lessons to help you make more informed decisions online." icon={BookOpen}/>
    <div className="learning-layout"><aside className="lesson-sidebar"><div className="sidebar-heading"><span>YOUR LEARNING PATH</span><span>{completed.length}/{lessons.length}</span></div><div className="mini-progress"><span style={{width:`${completed.length/lessons.length*100}%`}}/></div>{lessons.map(l=><button key={l.id} onClick={()=>{setActive(l.id);setQuizMode(false)}} className={`lesson-nav ${active===l.id&&!quizMode?"selected":""}`}><span className="lesson-nav-icon"><l.icon size={18}/></span><span><strong>{l.title}</strong><small>{l.time}</small></span>{completed.includes(l.id)&&<CheckCircle2 size={16} className="completed-icon"/>}</button>)}<button className={`lesson-nav quiz-nav ${quizMode?"selected":""}`} onClick={()=>setQuizMode(true)}><span className="lesson-nav-icon"><GraduationCap size={18}/></span><span><strong>Knowledge check</strong><small>10 questions</small></span><ChevronRight size={16}/></button></aside>
    <section className="lesson-content">{!quizMode?<><div className="lesson-topline"><span className="tag">{lesson.category}</span><span className="reading-time">{lesson.time} read</span></div><h2>{lesson.title}</h2><p className="lesson-summary">{lesson.summary}</p><div className="lesson-art"><div className="lesson-art-icon"><lesson.icon size={44}/></div><div><span>SAFESTEPS LEARNING</span><strong>Knowledge is a layer of protection.</strong></div></div><h3 className="content-subtitle">What you should know</h3><div className="learning-points">{lesson.points.map((p,i)=><div className="learning-point" key={i}><span>{String(i+1).padStart(2,"0")}</span><p>{p}</p></div>)}</div><div className="lesson-actions"><button className="btn btn-primary" onClick={()=>setCompleted(old=>old.includes(lesson.id)?old: [...old,lesson.id])}>{completed.includes(lesson.id)?<><CheckCircle2 size={17}/> Completed</>:<>Mark as completed <ArrowRight size={16}/></>}</button><button className="btn btn-secondary" onClick={()=>setActive(lessons[(lessons.findIndex(l=>l.id===active)+1)%lessons.length].id)}>Next lesson <ChevronRight size={16}/></button></div></>:<div className="quiz-wrap"><div className="quiz-header"><div className="eyebrow">CHECK YOUR UNDERSTANDING</div><h2>Digital safety knowledge check</h2><p>Choose the best answer for each question. You can review your result at the end.</p></div>{quiz.map((q,i)=><div className="quiz-question" key={i}><div className="question-number">QUESTION {String(i+1).padStart(2,"0")} / 10</div><h3>{q.q}</h3><div className="answer-list">{q.a.map((a,j)=><label key={j} className={`answer-option ${answers[i]===String(j)?"chosen":""} ${submitted&&j===q.correct?"right":""} ${submitted&&answers[i]===String(j)&&j!==q.correct?"wrong":""}`}><input type="radio" name={`q${i}`} value={j} checked={answers[i]===String(j)} onChange={e=>{setAnswers(old=>({...old,[i]:e.target.value}));setSubmitted(false)}}/><span className="radio-dot"/>{a}{submitted&&j===q.correct&&<CheckCircle2 size={17}/>}</label>)}</div>{submitted&&<p className="answer-explanation"><Info size={15}/>{q.why}</p>}</div>)}<div className="quiz-actions">{!submitted?<button className="btn btn-primary" disabled={Object.keys(answers).length!==quiz.length} onClick={()=>setSubmitted(true)}>Submit answers <ArrowRight size={16}/></button>:<><div className="quiz-score"><strong>{score}/10</strong><span>Your score</span></div><button className="btn btn-secondary" onClick={()=>{setAnswers({});setSubmitted(false)}}><RotateCcw size={16}/> Try again</button></>}</div></div>}</section></div>
  </div>
}

function PrivacyCheckup() {
  const [checked,setChecked] = useState(()=>readSaved("ss-checklist",[]));
  const [expanded,setExpanded] = useState(0);
  useEffect(()=>localStorage.setItem("ss-checklist",JSON.stringify(checked)),[checked]);
  const total=checklistGroups.reduce((n,g)=>n+g.items.length,0);
  const percent=Math.round(checked.length/total*100);
  return <div className="page-wrap">
    <PageIntro eyebrow="REVIEW YOUR DIGITAL HABITS" title="Privacy checkup" description="A practical checklist to help you review everyday account security and privacy settings." icon={ClipboardCheck}/>
    <div className="checkup-summary"><div><div className="eyebrow">YOUR CHECKUP PROGRESS</div><div className="checkup-score">{percent}<span>%</span></div><p>{checked.length} of {total} actions reviewed</p></div><div className="large-progress"><div className="large-progress-track"><span style={{width:`${percent}%`}}/></div><small>Progress is saved on this device only.</small></div><div className="checkup-badge"><ShieldCheck size={25}/><span>Personal<br/>privacy review</span></div></div>
    <div className="notice notice-info"><Info size={18}/><p>This checklist is a self-review, not a security scan. SafeSteps cannot inspect your accounts or confirm whether a setting is enabled.</p></div>
    <div className="checklist-groups">{checklistGroups.map((g,i)=>{const count=g.items.filter(item=>checked.includes(item)).length;return <section className="check-group" key={g.title}><button className="check-group-head" onClick={()=>setExpanded(expanded===i?-1:i)}><span className="check-group-icon"><g.icon size={20}/></span><span className="check-group-name"><strong>{g.title}</strong><small>{count} of {g.items.length} reviewed</small></span><span className="group-progress">{count}/{g.items.length}</span><ChevronDown className={expanded===i?"rotate":""} size={19}/></button>{expanded===i&&<div className="check-items">{g.items.map(item=><label className="check-row" key={item}><input type="checkbox" checked={checked.includes(item)} onChange={e=>setChecked(old=>e.target.checked?[...old,item]:old.filter(x=>x!==item))}/><span className="custom-check">{checked.includes(item)&&<Check size={14}/>}</span><span>{item}</span></label>)}</div>}</section>})}</div>
    <div className="checkup-bottom"><button className="btn btn-secondary" onClick={()=>{setChecked([]);setExpanded(0)}}><RotateCcw size={16}/> Reset checklist</button><p><LockKeyhole size={14}/> Your checklist stays in this browser on this device.</p></div>
  </div>
}

function Resources() {
  const [search,setSearch] = useState("");
  const [copied,setCopied] = useState(false);
  const filtered=useMemo(()=>resources.filter(r=>(r.name+" "+r.type+" "+r.desc).toLowerCase().includes(search.toLowerCase())),[search]);
  return <div className="page-wrap">
    <PageIntro eyebrow="FIND TRUSTWORTHY INFORMATION" title="Support resources" description="A starting point for official online safety guidance, account protection, and platform reporting." icon={LifeBuoy}/>
    <div className="resource-intro"><div className="resource-intro-icon"><Globe2 size={24}/></div><div><h3>Use official channels</h3><p>For current reporting instructions, visit the organisation's official website directly. Be cautious of contact details shared by unknown accounts.</p></div></div>
    <div className="resource-toolbar"><div><h2>Helpful websites</h2><p>Official and public-facing safety resources.</p></div><label className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search resources"/></label></div>
    <div className="resource-grid">{filtered.map(r=><article className="resource-card" key={r.name}><div className="resource-card-top"><span className="resource-icon"><ShieldCheck size={20}/></span><span className="tag">{r.tag}</span></div><div><span className="resource-type">{r.type}</span><h3>{r.name}</h3><p>{r.desc}</p></div><a href={r.url} target="_blank" rel="noreferrer" className="resource-link">Visit official website <ExternalLink size={15}/></a></article>)}</div>
    {filtered.length===0&&<div className="empty-state"><Search size={25}/><strong>No matching resources</strong><span>Try another search term.</span></div>}
    <div className="notice notice-warn"><AlertTriangle size={18}/><p><strong>Important:</strong> SafeSteps is not an emergency response service and does not provide legal advice. If you are in immediate danger, contact local emergency services or a trusted person nearby. Check each organisation's official website for its current services and contact details.</p></div>
    <div className="resource-footnote"><Info size={15}/> Links are provided for convenience. SafeSteps does not operate or endorse third-party websites and cannot guarantee their availability.</div>
  </div>
}

export default function App() {
  return <Shell><Routes><Route path="/" element={<Home/>}/><Route path="/assistant" element={<Assistant/>}/><Route path="/learning" element={<LearningHub/>}/><Route path="/privacy" element={<PrivacyCheckup/>}/><Route path="/resources" element={<Resources/>}/><Route path="*" element={<Home/>}/></Routes></Shell>;
}