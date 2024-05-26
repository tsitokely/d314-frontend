<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <img alt="d314 logo" class="logo" src="@/assets/d314-logo.svg" width="125" height="125" />

    <div class="wrapper">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <RouterLink class="navbar-brand" to="/">Navigation</RouterLink>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerd314" aria-controls="navbarTogglerd314" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarTogglerd314">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <RouterLink class="nav-link active" to="/">Accueil</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/cities">Villes</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/apartment">Appartements</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/reservations">Réservations</RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>

  </header>

  <RouterView />

</template>
<style scoped>

</style>
