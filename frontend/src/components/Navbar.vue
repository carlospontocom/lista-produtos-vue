<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="logo">
        <span class="material-symbols-outlined logo-icon">blur_on</span>
        <span class="logo-text">VueJS</span>
      </router-link>

      <input type="checkbox" id="menu-toggle" class="menu-toggle" />
      
      <label for="menu-toggle" class="hamburger">
        <span class="material-symbols-outlined menu-open">menu</span>
        <span class="material-symbols-outlined menu-close">close</span>
      </label>

      <ul class="nav-links">
        <li>
          <router-link to="/" active-class="active-link">Home</router-link>
        </li>
        
        <li>
          <router-link to="/login" active-class="active-link">Login</router-link>
        </li>
        <li>
          <router-link to="/cadastro" active-class="active-link">Cadastro</router-link>
        </li>
        <li>
          <router-link to="/listaUsuarios" active-class="active-link">Contatos</router-link>
        </li>
      </ul>
    </div>
  </nav>
  <div class="navbar-spacer"></div>
</template>

<style scoped>
/* --- Configurações Gerais do Menu --- */
.navbar {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-spacer {
  height: 70px;
}

/* --- Logomarca --- */
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #1a1a1a;
}

.logo-icon {
  font-size: 2rem;
  color: #3182ce; /* Cor azul para destacar o ícone da logo */
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 600;
}

/* --- Links de Navegação (Desktop) --- */
.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-links a {
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: #3182ce;
}

.active-link {
  color: #3182ce !important;
  font-weight: 700 !important;
}

/* --- Controle de Exibição --- */
.menu-toggle {
  display: none;
}

.hamburger {
  display: none;
  cursor: pointer;
  user-select: none;
}

.hamburger .material-symbols-outlined {
  font-size: 1.85rem;
  color: #333333;
}

/* Por padrão, o ícone de fechar fica oculto */
.menu-close {
  display: none;
}

/* --- Responsividade (Mobile) --- */
@media (max-width: 768px) {
  .hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #ffffff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    padding: 1rem 0;
    border-top: 1px solid #e2e8f0;
  }

  .nav-links li {
    text-align: center;
  }

  .nav-links a {
    display: block;
    padding: 0.75rem 0;
  }

  /* Exibe a lista de links quando o menu for ativado */
  .menu-toggle:checked ~ .nav-links {
    display: flex;
  }

  /* Altera a visibilidade dos ícones (Esconde o 'menu' e mostra o 'close') */
  .menu-toggle:checked ~ .hamburger .menu-open {
    display: none;
  }

  .menu-toggle:checked ~ .hamburger .menu-close {
    display: block;
  }
}
</style>