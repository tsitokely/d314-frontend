<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-between">
          <h3 class="col-lg-auto mb-3 mb-lg-0 me-lg-3">Villes</h3>
          <form class="weekpicker row g-3 align-items-center justify-content-center" @submit.prevent="getCitiesWithVacantAppartmentView">
            <div class="fallbackWeekPicker col-auto">
              <div>
                <span class="uniform-size">
                  <label for="weekStart">Semaine-début: </label>
                  <select id="fallbackWeek1" name="weekStart"></select>
                </span>
                <span class="uniform-size">
                  <label for="yearStart">Année-début: </label>
                  <select id="yearStart" name="yearStart">
                    <option value="2024" selected>2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                </span>
              </div>
              <div>
                <span class="uniform-size">
                  <label for="weekEnd">Semaine-fin: </label>
                  <select id="fallbackWeek2" name="weekEnd"></select>
                </span>
                <span class="uniform-size">
                  <label for="yearEnd">Année-fin: </label>
                  <select id="yearEnd" name="yearEnd">
                    <option value="2024" selected>2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                </span>
              </div>
            </div>
            <div class="col-auto">
              <button type="submit" class="btn btn-primary">Rechercher</button>
            </div>
          </form>
        </div>
        <div v-if="cityCountView >= 0" class="mt-2 text-center">
          <strong>Nombre de villes trouvées: {{ cityCountView }}</strong>
        </div>
      </div>
      <div class="card-body">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th class="fw-bold">Identifiant </th>
              <th class="fw-bold">Nom de la ville</th>
            </tr>
          </thead>
          <tbody v-if="cityCountView > 0" class="table-group-divider">
            <tr v-for="(city, index) in this.cities" :key="index">       
              <td v-if="yearStart > 0"> 
                <RouterLink :to="{ path: '/Apartments/' + city.cityID + '/' + this.yearStart + '-' + this.weekStart  + '/' + this.yearEnd + '-' + this.weekEnd  }"> 
                  {{ city.cityID }} 
                </RouterLink> 
              </td>
              <td v-else> {{ city.cityID }} </td>
              <td class="fst-italic"> {{ city.cityName }} </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-if="cityCountView != -1"> <td colspan="2">Chargement...</td> </tr>
            <tr v-else> <td colspan="2">Pas de ville trouvée</td> </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import { RouterLink } from 'vue-router';
  import { populateWeeks } from '@utils/dateUtils.js';
  import { getCities, getCitiesWithVacantAppartment } from '@utils/apiUtils.js';

  export default {
    name: 'cities',
    data(){
      return{
        cities: [],
        cityCountView: 0,
        weekStart: 0,
        yearStart: 0,
        weekEnd: 0,
        yearEnd: 0
      }
    },
    mounted(){
      this.populateWeeks();
      this.getCitiesView();    
    },
    methods: {
      async getCitiesView(){
        try {
          const { cities, cityCount } = await getCities();
          this.cities = cities;
          this.cityCountView = cityCount;
        } catch (error) {
          console.error("Error on getting data on the view:", error);
        }
      },
      async getCitiesWithVacantAppartmentView(){
        const selectedWeekStart = document.querySelector('#fallbackWeek1').value;
        const selectedYearStart = document.querySelector('#yearStart').value;
        const selectedWeekEnd = document.querySelector('#fallbackWeek2').value;
        const selectedYearEnd = document.querySelector('#yearEnd').value;
        try {
          const { cities, cityCount } = await getCitiesWithVacantAppartment(selectedYearStart,selectedWeekStart,selectedYearEnd,selectedWeekEnd);
          if(cityCount > 0) {
            this.weekStart = selectedWeekStart;
            this.yearStart = selectedYearStart;
            this.weekEnd = selectedWeekEnd;
            this.yearEnd = selectedYearEnd;
            this.cities = cities;
            this.cityCountView = cityCount;
          } else {
            this.weekStart = 0;
            this.yearStart = 0;
            this.weekEnd = 0;
            this.yearEnd = 0;
            this.cityCountView = -1;
          }
        } catch (error) {
          console.error("Error on getting data on the view:", error);
        }
      },
      populateWeeks() {
        const weekSelectStart = document.querySelector("#fallbackWeek1");
        const weekSelectEnd = document.querySelector("#fallbackWeek2");
        populateWeeks(weekSelectStart,weekSelectEnd);
      },
    },
  }
</script>