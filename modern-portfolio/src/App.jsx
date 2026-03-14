import React, { useState, useEffect } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  ChevronDown,
  Terminal,
  Database,
  Cloud,
  Code2,
  Cpu,
  Server,
  X,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA ---
const PORTFOLIO_DATA = {
  name: "Goddeti Shankar Narayana Reddy",
  role: "Cloud Computing Enthusiast | Systems & AI Project Builder",
  socials: {
    github: "https://github.com/Shankar6300",
    linkedin: "https://www.linkedin.com/in/shankar04/",
    email: "shankarnarayanareddy196@gmail.com"
  },
  hero: {
    intro: "Computer Science student passionate about cloud technologies, system design, and AI-driven applications. I enjoy building scalable systems, automation tools, and intelligent web applications."
  },
  about: "I am a Computer Science and Engineering student at Lovely Professional University with a strong interest in cloud computing, system architecture, and artificial intelligence. I enjoy building automation tools, serverless applications, and data-structure-driven systems. My projects focus on solving practical problems using efficient algorithms and scalable cloud solutions.",
  skills: [
    { 
      category: "Programming Languages", 
      icon: <Terminal className="w-5 h-5" />,
      items: ["C", "C++", "Python", "Java", "JavaScript"] 
    },
    { 
      category: "Cloud", 
      icon: <Cloud className="w-5 h-5" />,
      items: ["AWS", "AWS Lambda", "Amazon S3", "IAM"] 
    },
    { 
      category: "DevOps & Tools", 
      icon: <Server className="w-5 h-5" />,
      items: ["Linux", "Ubuntu", "Docker", "Git", "GitHub", "VS Code"] 
    },
    { 
      category: "Web Technologies", 
      icon: <Code2 className="w-5 h-5" />,
      items: ["HTML", "CSS", "JavaScript"] 
    },
    { 
      category: "Soft Skills", 
      icon: <Cpu className="w-5 h-5" />,
      items: ["Problem Solving", "Analytical Thinking", "Teamwork", "Quick Learning"] 
    }
  ],
  projects: [
    {
      id: "p1",
      title: "AWS S3 File Conversion System",
      description: "A serverless workflow that converts CSV files to JSON automatically using AWS event triggers.",
      tech: ["AWS Lambda", "Amazon S3", "IAM", "Python"],
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
      github: "https://github.com/Shankar6300/aws-s3-file-conversion-system",
      demo: "#", // placeholder
      details: "This project architecture leverages AWS Lambda triggered by S3 bucket events to automatically process and convert CSV data structures into accessible JSON formats, managed securely via fine-grained IAM policies."
    },
    {
      id: "p2",
      title: "AI Language Survival Guide",
      description: "A web application that helps travellers with translation and cultural guidance using AI-based responses.",
      tech: ["Python", "HTML", "CSS", "JavaScript"],
      image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=1000&auto=format&fit=crop",
      github: "https://github.com/Shankar6300/",
      demo: "#", // placeholder
      details: "Integrated a Natural Language Processing backend into a seamless, responsive frontend. It detects context and provides real-time nuanced translations and cultural context for global travelers."
    },
    {
      id: "p3",
      title: "Digital Library Management System",
      description: "A console-based application that manages books and users using data structures like vectors, stacks, and sorting algorithms.",
      tech: ["C++", "Data Structures"],
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop",
      github: "https://github.com/Shankar6300/Library-Management-System",
      demo: "",
      details: "A classic application demonstrating deep understanding of foundational Computer Science principles. Vectors handle dynamic listings, stacks track recent actions, and custom sort logic ensures $O(n log n)$ performance scaling."
    }
  ],
  certifications: [
    {
      title: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
      org: "Oracle",
      link: "https://drive.google.com/file/d/1iMkpvL2gnDfElYKTY-_8Z5BDn3ClQyfD/view?usp=sharing"
    },
    {
      title: "Java Programming",
      org: "IAM Neo Platform",
      link: "https://drive.google.com/file/d/1nGr2r4Bd8u6WWjMFJcJC-SX4QuExhKRs/view?usp=sharing"
    },
    {
      title: "Privacy and Security in Online Social Media",
      org: "NPTEL",
      link: "https://drive.google.com/file/d/197eCEOrjpNe1sB7OrYnH5dBaVODFm8lW/view?usp=sharing"
    },
    {
      title: "Object Oriented Programming",
      org: "IAM Neo Platform",
      link: "https://drive.google.com/file/d/1nzlX2bCH_T89yyQz6LezMW-zfwAZwLWt/view?usp=sharing"
    },
    {
      title: "Responsive Web Design",
      org: "FreeCodeCamp",
      link: "https://drive.google.com/file/d/1IoOeyPx3Pwwdr8TbJnFAq0cgo-Vcs0eM/view?usp=sharing"
    }
  ],
  achievements: [
    { title: "HackerRank 5 Star in C++ Programming", link: "https://www.hackerrank.com/profile/shankarreddy07" },
    { title: "HackerRank 5 Star in Problem Solving", link: "https://www.hackerrank.com/profile/shankarreddy07" },
    { title: "Adobe India Hackathon Participant" },
    { title: "Code Of Duty Web Hackathon Participant" }
  ],
  education: {
    university: "Lovely Professional University",
    degree: "Bachelor of Technology – Computer Science and Engineering",
    cgpa: "8.27",
    year: "Aug 2023 – Present" // estimated from previous CV
  }
};

// --- COMPONENTS ---

// Section Wrapper for Animation
const Section = ({ id, className, children, delay = 0 }) => {
  return (
    <motion.section 
      id={id} 
      className={`py-20 md:py-32 ${className}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
};

// --- MAIN APP ---
export default function App() {
  const [activeProject, setActiveProject] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Certifications", href: "#certifications" },
    { name: "Education", href: "#education" },
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 font-sans selection:bg-cyan-500/30">
      
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <a href="#" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            GSNR
          </a>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-sm font-medium hover:text-cyan-400 transition-colors">
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex gap-4">
            <a href={PORTFOLIO_DATA.socials.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href={PORTFOLIO_DATA.socials.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

          {/* Mobile Nav Toggle */}
          <button className="md:hidden text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-slate-900 border-b border-slate-800 overflow-hidden"
            >
              <div className="flex flex-col px-6 py-4 gap-4">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    className="text-base font-medium py-2 border-b border-slate-800/50 hover:text-cyan-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="flex gap-4 pt-2">
                  <a href={PORTFOLIO_DATA.socials.github} className="p-2 bg-slate-800 rounded-full text-slate-300"><Github className="w-5 h-5" /></a>
                  <a href={PORTFOLIO_DATA.socials.linkedin} className="p-2 bg-slate-800 rounded-full text-slate-300"><Linkedin className="w-5 h-5" /></a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center z-10 w-full relative">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-cyan-400 font-mono mb-4 text-sm md:text-base">Hi, my name is</p>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-100 mb-4 tracking-tight leading-tight">
              {PORTFOLIO_DATA.name}.
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold text-slate-400 mb-6">
              {PORTFOLIO_DATA.role}
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-lg">
              {PORTFOLIO_DATA.hero.intro}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#projects" className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                View Projects
              </a>
              <a href="#contact" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium rounded-lg border border-slate-700 transition-all hover:border-slate-500">
                Contact Me
              </a>
              <a href="#" className="px-6 py-3 text-slate-300 hover:text-cyan-400 font-medium transition-colors flex items-center gap-2">
                Download Resume <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:flex justify-center"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Dummy Image Placeholder for Avatar */}
              <div className="absolute inset-0 border-2 border-cyan-500/50 rounded-full translate-x-4 translate-y-4" />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 to-slate-900 rounded-full overflow-hidden border-2 border-slate-700 hover:border-cyan-400 transition-colors duration-500 shadow-2xl z-10">
                <img 
                  src="https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=1000&auto=format&fit=crop" 
                  alt="Avatar Placeholder" 
                  className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
        >
          <a href="#about"><ChevronDown className="text-slate-400" /></a>
        </motion.div>
      </section>

      {/* About Section */}
      <Section id="about" className="bg-slate-900/50 relative">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-100 mb-8 flex items-center gap-4">
            <span className="text-cyan-400 font-mono text-xl">01.</span> About Me
            <div className="h-[1px] bg-slate-800 flex-1 ml-4" />
          </h2>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <p className="text-lg text-slate-300 leading-relaxed font-light">
              {PORTFOLIO_DATA.about}
            </p>
          </div>
        </div>
      </Section>

      {/* Skills Section */}
      <Section id="skills" className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-slate-100 mb-12 flex items-center gap-4">
          <span className="text-cyan-400 font-mono text-xl">02.</span> Technical Arsenal
          <div className="h-[1px] bg-slate-800 flex-1 ml-4" />
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PORTFOLIO_DATA.skills.map((skillGroup, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:border-cyan-500/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6 text-cyan-400">
                {skillGroup.icon}
                <h3 className="text-xl font-semibold text-slate-100">{skillGroup.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillGroup.items.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-slate-800 rounded-full text-sm font-medium text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Projects Section */}
      <Section id="projects" className="bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-100 mb-12 flex items-center gap-4">
            <span className="text-cyan-400 font-mono text-xl">03.</span> Featured Projects
            <div className="h-[1px] bg-slate-800 flex-1 ml-4" />
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PORTFOLIO_DATA.projects.map((project, idx) => (
              <motion.div 
                key={project.id}
                whileHover={{ y: -8 }}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col cursor-pointer cursor-zoom-in"
                onClick={() => setActiveProject(project)}
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                  <p className="text-sm text-slate-400 mb-6 flex-1">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map(t => (
                      <span key={t} className="text-xs font-mono text-cyan-400/80 bg-cyan-950/30 px-2 py-1 rounded">{t}</span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-auto border-t border-slate-800 pt-4">
                    <div className="flex gap-4">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} className="text-slate-400 hover:text-cyan-400 transition-colors" title="GitHub">
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {project.demo && (
                        <a href={project.demo} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} className="text-slate-400 hover:text-cyan-400 transition-colors" title="Live Demo">
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-wider">Details &rarr;</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Certifications and Achievements Section */}
      <Section id="certifications" className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Certifications */}
          <div>
             <h2 className="text-3xl font-bold text-slate-100 mb-8 flex items-center gap-4">
              <span className="text-cyan-400 font-mono text-xl">04.</span> Certifications
            </h2>
            <div className="flex flex-col gap-4">
              {PORTFOLIO_DATA.certifications.map((cert, idx) => (
                <a 
                  key={idx} 
                  href={cert.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-800 transition-all duration-300 group flex items-start gap-4"
                >
                  <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <ExternalLink className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-slate-200 font-semibold group-hover:text-cyan-400 transition-colors leading-snug">{cert.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{cert.org}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Education & Achievements */}
          <div id="education">
             <h2 className="text-3xl font-bold text-slate-100 mb-8 flex items-center gap-4">
              <span className="text-cyan-400 font-mono text-xl">05.</span> Education & Honors
            </h2>
            
            <div className="mb-10 p-6 rounded-xl border border-slate-700 bg-slate-800/40 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
              <h3 className="text-xl font-bold text-slate-100">{PORTFOLIO_DATA.education.university}</h3>
              <p className="text-cyan-400 font-medium text-sm mt-1">{PORTFOLIO_DATA.education.degree}</p>
              <div className="flex justify-between items-center mt-4 text-sm text-slate-400 border-t border-slate-700/50 pt-4">
                <span>CGPA: <strong className="text-slate-200">{PORTFOLIO_DATA.education.cgpa}</strong></span>
                <span>{PORTFOLIO_DATA.education.year}</span>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-slate-300 mb-6">Achievements</h3>
            <div className="relative border-l border-slate-800 ml-3 space-y-8">
              {PORTFOLIO_DATA.achievements.map((achieve, idx) => (
                <div key={idx} className="relative pl-8">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-cyan-500 ring-4 ring-slate-950" />
                  {achieve.link ? (
                    <a href={achieve.link} target="_blank" rel="noreferrer" className="text-slate-200 hover:text-cyan-400 font-medium leading-snug inline-flex items-center gap-2 group">
                      {achieve.title} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <span className="text-slate-200 font-medium leading-snug">{achieve.title}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </Section>

      {/* Footer / Contact */}
      <footer id="contact" className="border-t border-slate-800 bg-slate-900 py-12 mt-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-100 mb-6">Get In Touch</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Although I'm focused on my studies and current projects, my inbox is always open. Whether you have a question, a project idea, or just want to say hi, I'll try my best to get back to you!
          </p>
          <a 
            href={`mailto:${PORTFOLIO_DATA.socials.email}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 rounded-lg font-mono transition-all mb-16"
          >
            Say Hello <Mail className="w-4 h-4" />
          </a>

          <div className="flex justify-center gap-6 mb-8">
            <a href={PORTFOLIO_DATA.socials.github} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors p-2 hover:bg-slate-800 rounded-full">
              <Github className="w-6 h-6" />
            </a>
            <a href={PORTFOLIO_DATA.socials.linkedin} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors p-2 hover:bg-slate-800 rounded-full">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
          
          <p className="text-slate-500 text-sm font-mono">
            Designed & Built for {PORTFOLIO_DATA.name} &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      {/* Project Modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setActiveProject(null)} />
            
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative bg-slate-900 border border-slate-700 w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
            >
              <button 
                onClick={() => setActiveProject(null)}
                className="absolute top-4 right-4 p-2 bg-slate-950/50 hover:bg-slate-800 text-slate-300 rounded-full backdrop-blur-md z-20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full h-48 sm:h-64 relative">
                <img src={activeProject.image} alt={activeProject.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-4">{activeProject.title}</h2>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {activeProject.tech.map(t => (
                    <span key={t} className="text-xs sm:text-sm font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-900/50 px-3 py-1 rounded-full">{t}</span>
                  ))}
                </div>

                <div className="space-y-6 text-slate-300 leading-relaxed">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">Overview</h3>
                    <p>{activeProject.description}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">Architecture & Details</h3>
                    <p className="text-slate-400">{activeProject.details}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-slate-800">
                  {activeProject.github && (
                    <a href={activeProject.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg transition-colors">
                      <Github className="w-5 h-5" /> View Code
                    </a>
                  )}
                  {activeProject.demo && (
                    <a href={activeProject.demo} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-cyan-500/20">
                      <ExternalLink className="w-5 h-5" /> Live Demo
                    </a>
                  )}
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
