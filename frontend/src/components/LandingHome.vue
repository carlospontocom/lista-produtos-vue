<template>
  <div class="portfolio">

    <!-- HERO -->
    <section class="hero">
      <div class="hero-left">
        <span class="badge-topo">{{ perfil.statusAtual }}</span>
        <h1 class="titulo">
          {{ perfil.titulo.linha1 }}
          <span class="destaque">{{ perfil.titulo.linha2 }}</span>
          <span class="destaque2">{{ perfil.titulo.linha3 }}</span>
        </h1>
        <p class="subtitulo">{{ perfil.descricao }}</p>
        <div class="tags">
          <span class="tag" v-for="tag in perfil.tags" :key="tag.nome" :style="{ background: tag.cor + '18', color: tag.cor, border: '1px solid ' + tag.cor + '44' }">
            {{ tag.nome }}
          </span>
        </div>
        <div class="container-possibilidades">
        <h3>::Possibilidades::</h3>
        <ul>
    <li v-for="item in menuItems" :key="item.label" class="items-emoticons">
      <span>{{ item.emoji }} {{ item.label }}</span>
    </li>
  </ul>
       
      </div>

      <div class="hero-right">
        <!-- Formação -->
        <div class="card-info">
          <div class="card-titulo"><span>🎓</span> Formação Acadêmica</div>
          <ul class="formacao-lista">
            <li v-for="f in perfil.formacao" :key="f.curso" :class="{ destaque: f.atual }">
              <span class="bolinha" :class="{ ativa: f.atual }"></span>
              <div>
                <strong>{{ f.curso }}</strong>
                <small>{{ f.instituicao }}</small>
              </div>
            </li>
          </ul>
        </div>

        <!-- Stack -->
        <div class="card-info">
          <div class="card-titulo"><span>💻</span> Stack Completa</div>
          <div class="stack-grid">
            <div class="stack-item" v-for="s in perfil.stack" :key="s.area">
              <span class="stack-area">{{ s.area }}</span>
              <span class="stack-techs">{{ s.techs }}</span>
            </div>
          </div>
        </div>

        <!-- Experiência -->
        <div class="card-info">
          <div class="card-titulo"><span>💼</span> Experiência Profissional</div>
          <div class="exp-lista">
            <div class="exp-item" v-for="e in perfil.experiencia" :key="e.area">
              <span>{{ e.area }}</span>
              <span class="exp-tempo">{{ e.tempo }}</span>
            </div>
          </div>
        </div>

        <!-- Deploy -->
        <div class="card-info card-deploy">
          <div class="card-titulo"><span>☁️</span> Deploy & Versionamento</div>
          <div class="deploy-tags">
            <span class="deploy-tag" v-for="d in perfil.deploy" :key="d">{{ d }}</span>
          </div>
          <p class="deploy-desc">{{ perfil.deployDesc }}</p>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="stats">
      <div class="stat" v-for="s in perfil.stats" :key="s.label">
        <span class="stat-icon">{{ s.icon }}</span>
        <strong>{{ s.valor }}</strong>
        <small>{{ s.label }}</small>
      </div>
    </section>

    <!-- TECNOLOGIAS -->
    <section class="tecnologias">
      <p class="tec-label">Tecnologias que utilizo no dia a dia</p>
      <div class="tec-lista">
        <div class="tec-item" v-for="t in perfil.tecnologias" :key="t.nome">
          <span class="tec-icon">{{ t.icon }}</span>
          <small>{{ t.nome }}</small>
        </div>
      </div>
    </section>

    <!-- PROJETOS -->
    <section class="projetos">
      <h2>Meus Projetos</h2>
      <div class="projetos-grid">
        <div class="projeto-card" v-for="p in projetos" :key="p.nome" :style="{ '--cor': p.cor }">
          <div class="projeto-header">
            <span class="projeto-icon">{{ p.icon }}</span>
            <span class="projeto-nome">{{ p.nome }}</span>
          </div>
          <p class="projeto-desc">{{ p.descricao }}</p>
          <div class="projeto-section">
            <strong>Tecnologias:</strong>
            <div class="projeto-tags">
              <span class="projeto-tag" v-for="t in p.tecnologias" :key="t" :style="{ background: p.cor + '22', color: p.cor }">{{ t }}</span>
            </div>
          </div>
          <div class="projeto-section">
            <strong>Funcionalidades:</strong>
            <ul class="projeto-func">
              <li v-for="f in p.funcionalidades" :key="f">{{ f }}</li>
            </ul>
          </div>
          <a :href="p.link" class="projeto-link" :style="{ color: p.cor }">Saiba mais →</a>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
const perfil = {
  statusAtual: '🎓 Pós-graduado em Frontend com React',
  titulo: {
    linha1: 'Desenvolvedor',
    linha2: 'Frontend +',
    linha3: 'Backend Básico'
  },
  descricao: 'Pós-graduado em desenvolvimento FRONT END, focado em criar interfaces com Vuejs, React e com conhecimento em Node.js (Básico) e Banco de dados.',
  tags: [
    { nome: 'Tailwind', cor: '#38bdf8' },
    { nome: 'React.js', cor: '#61dafb' },
    { nome: 'Node.js (Básico)', cor: '#4fc08d' },
    { nome: 'MongoDB', cor: '#47a248' },
    { nome: 'Firebase', cor: '#f5820d' },
    { nome: 'MySQL (TiDB)', cor: '#00758f' }
  ],
  formacao: [
    { curso: 'Pós-graduado em FRONT END', instituicao: 'Web com Vue.js e React.js', atual: true },
    { curso: 'Graduação em Administração', instituicao: '', atual: false }
  ],
  stack: [
    { area: 'Frontend', techs: 'VueJS · ReactJS · Tailwind' },
    { area: 'Backend', techs: 'Node.js (Básico) · API REST · Firebase' },
    { area: 'Banco de Dados', techs: 'MongoDB · MySQL (TiDB) · Firebase' },
    { area: 'DevOps', techs: 'Github · Render · Vercel · Netlify' }
  ],
  experiencia: [
    { area: 'Help Desk & Suporte', tempo: '5+ anos' },
    { area: 'Atendimento ao cliente' }
  ],
  deploy: ['Git', 'GitHub', 'Render', 'Vercel', 'Netlify', 'CI/CD'],
  deployDesc: 'Experiência com deploy contínuo e hospedagem de aplicações completas',
  stats: [
    { icon: '🎓', valor: 'Graduado + Lato Sensu', label: '' },
    { icon: '💼', valor: 'Anos', label: 'experiência' },
    { icon: '⚡', valor: 'Tecnologias', label: 'Baas' },
    { icon: '🗄️', valor: 'Conhecimentos', label: 'básico database' }
  ],
  tecnologias: [
    { nome: 'Vue.js', icon: '⚛️' },
    { nome: 'React.js', icon: '⚛️' },
    { nome: 'Node.js (Básico)', icon: '🟢' },
    { nome: 'MongoDB', icon: '🍃' },
    { nome: 'Firebase', icon: '🔥' },
    { nome: 'MySQL (TiDB)', icon: '🐬' },
    { nome: 'Css, Sass, TailwindCss, Bootstrap', icon: '🌊' },
    { nome: 'Git/GitHub', icon: '🐙' },
    { nome: 'Render', icon: '🚀' },
    { nome: 'Vercel', icon: '▲' },
    { nome: 'Netlify', icon: '☁️' }
  ]
}

const menuItems = [
  { emoji: '🚀', label: 'Projetos' },
  { emoji: '🌐', label: 'Sites' },
  { emoji: '🖥️', label: 'Sistemas' },
  { emoji: '🛒', label: 'E-commerce' },
]

const projetos = [
  {
    nome: 'Agendamento Online',
    icon: '📅',
    cor: '#7c3aed',
    descricao: 'Sistema de agendamento para prestadores de serviços com notificações e calendário.',
    tecnologias: ['React JS', 'Node.js (Básico)', 'Firebase'],
    funcionalidades: ['Calendário interativo', 'Notificações por email', 'Cancelamento/remarcação'],
    link: '#'
  },
  {
    nome: 'Blog Platform',
    icon: '📝',
    cor: '#16a34a',
    descricao: 'Plataforma de blog com sistema de comentários e dashboard administrativo.',
    tecnologias: ['JavaScript', 'Node.js (Básico)', 'REST API', 'Firebase'],
    funcionalidades: ['Sistema de comentários', 'Categorias e tags', 'Dashboard'],
    link: '#'
  },
  {
    nome: 'Checklist App',
    icon: '✅',
    cor: '#2563eb',
    descricao: 'Aplicativo de checklist para tarefas diárias com autenticação e sincronização em tempo real.',
    tecnologias: ['React JS', 'Firebase', 'Auth API'],
    funcionalidades: ['Login com Google/Facebook', 'Listas personalizadas', 'Sincronização em tempo real'],
    link: '#'
  }
]
</script>

<style scoped lang="scss">
@use '../styles/landingHome.scss';
</style>
