<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-between">
          <h3 class="col-lg-auto mb-3 mb-lg-0 me-lg-3">Villes</h3>
          <form class="weekpicker row g-3 align-items-center justify-content-center" @submit.prevent="getCitiesWithVacantAppartment">
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
        <div v-if="cityCount >= 0" class="mt-2 text-center">
          <strong>Nombre de villes trouvées: {{ cityCount }}</strong>
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
          <tbody v-if="this.cities.length >0" class="table-group-divider">
            <tr v-for="(city, index) in this.cities" :key="index">       
              <td> 
                <RouterLink :to="{ path: '/Apartments/' + city.cityID }"> 
                  {{ city.cityID }} 
                </RouterLink> 
              </td>
              <td class="fst-italic">
                {{ city.cityName }}
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(city, index) in this.cities" :key="index">       
              <td colspan="2">Chargement...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import { RouterLink } from 'vue-router';

  export default {
    name: 'cities',
    data(){
      return{
        cities: [],
        cityCount: 0,
        weekStart: 0,
        yearStart: 0,
        weekEnd: 0,
        yearEnd: 0,
        baseUrl: import.meta.env.VITE_APP_API_BASE_URL
      }
    },
    mounted(){
        this.getCities();
        this.populateWeeks();
    },
    methods: {
      getCities(){
        axios.get(`${this.baseUrl}/City`)
        .then(res => {
          this.cities = res.data;
          this.cityCount = res.data.length;
        })
        .catch(error => {
          console.error("There was an error fetching the cities:", error);
        });
      },
      populateWeeks() {
        // Rajouter les 53 semaines - source: MDN web docs
        const weekSelect1 = document.querySelector("#fallbackWeek1");
        const weekSelect2 = document.querySelector("#fallbackWeek2");
        for (let i = 1; i <= 53; i++) {
          const option1 = document.createElement("option");
          option1.textContent = i < 10 ? `0${i}` : i;
          weekSelect2.appendChild(option1);
          const option2 = document.createElement("option");
          option2.textContent = i < 10 ? `0${i}` : i;
          weekSelect1.appendChild(option2);
          }
        },
      getCitiesWithVacantAppartment(){
        this.weekStart = document.querySelector('#fallbackWeek1').value;
        this.yearStart = document.querySelector('#yearStart').value;
        let yearWeekStart = `${this.yearStart}${this.weekStart}`;
        this.weekEnd = document.querySelector('#fallbackWeek2').value;
        this.yearEnd = document.querySelector('#yearEnd').value;
        let yearWeekEnd = `${this.yearEnd}${this.weekEnd}`;
        let apiUrl;
        if (yearWeekStart == yearWeekEnd) {
          apiUrl = `${this.baseUrl}/City/${this.yearStart}/${this.weekStart}`;
        }
        else if (yearWeekStart > yearWeekEnd){
          alert('Les périodes séléctionnés sont incorrectes - période de début: '+ yearWeekStart +' , plus grand que la période de fin: '+ yearWeekEnd);
          return;
        }
        else {
          apiUrl = `${this.baseUrl}/City/${this.yearStart}/${this.weekStart}?yearEnd=${this.yearEnd}&weekEnd=${this.weekEnd}`;
        };
        console.log(apiUrl)
        axios.get(apiUrl)
        .then(res => {
          this.cities = res.data;
          this.cityCount = res.data.length;
        })
        .catch(error => {
          console.error("Error:", error);
          alert('Erreur de chargement des données');
        });

      }
    },
  }
</script>