<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-between">
          <h3 class="col-lg-auto mb-3 mb-lg-0 me-lg-3">Appartements</h3>
          <form class="weekpicker row g-3 align-items-center justify-content-center" @submit.prevent="getVacantApartmentsInPeriodView">
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
        <div v-if="apartmentsCountView >= 0" class="mt-2 text-center">
          <strong>Nombre d'appartements trouvées: {{ apartmentsCountView }}</strong>
        </div>
      </div>
      <div class="card-body">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th class="fw-bold">Ville</th>
              <th class="fw-bold">Nom</th>
              <th class="fw-bold">Prix en euro (TTC)</th>
              <th class="fw-bold">Adresse</th>
            </tr>
          </thead>
          <tbody v-if="apartmentsCountView > 0" class="table-group-divider">
            <tr v-for="(apartment, index) in this.apartments" :key="index">
              <td> {{ cityNames[index] }} </td>   
              <td v-if="yearStart > 0" class="fst-italic"> 
                <RouterLink :to="{ path: '/Apartments/' + apartment.apartmentID  }"> 
                  {{ apartment.apartmentName }} 
                </RouterLink> 
              </td>
              <td v-else> {{ apartment.apartmentName }}  </td>
              <td> {{ apartment.apartmentPrice }} </td>   
              <td> {{ apartment.apartmentAddress }} </td>        
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-if="apartmentsCountView != -1"> <td colspan="2">Chargement...</td> </tr>
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
  import { getApartments, getApartmentsInPeriod, getCityInformation } from '@utils/apiUtils.js';

  export default {
    name: 'apartments',
    data(){
      return{
        apartments: [],
        cityNames: [],
        apartmentsCountView: 0,
        weekStart: 0,
        yearStart: 0,
        weekEnd: 0,
        yearEnd: 0
      }
    },
    mounted(){
      this.populateWeeks();
      this.getApartmentsView();    
    },
    methods: {
      async getApartmentsView(){
        try {
          const { apartments, apartmentsCount } = await getApartments();
          this.apartments = apartments;
          this.apartmentsCountView = apartmentsCount;
          const cityIDs = this.apartments.map(apartment => apartment.cityID);
          const cityInfoPromises = cityIDs.map(cityID => getCityInformation(cityID));
          const citiesInfo = await Promise.all(cityInfoPromises);
          this.cityNames = citiesInfo.flatMap(city => city.cityInfo.map(cityInfo => cityInfo.cityName));
        } catch (error) {
          console.error("Error on getting data on the view:", error);
        }
      },
      async getVacantApartmentsInPeriodView(){
        const selectedWeekStart = document.querySelector('#fallbackWeek1').value;
        const selectedYearStart = document.querySelector('#yearStart').value;
        const selectedWeekEnd = document.querySelector('#fallbackWeek2').value;
        const selectedYearEnd = document.querySelector('#yearEnd').value;
        try {
          const { apartments, apartmentsCount } = await getApartmentsInPeriod(selectedYearStart, selectedYearEnd, selectedWeekStart, selectedWeekEnd);
          if(apartmentsCount > 0) {
            this.weekStart = selectedWeekStart;
            this.yearStart = selectedYearStart;
            this.weekEnd = selectedWeekEnd;
            this.yearEnd = selectedYearEnd;
            this.apartments = apartments;
            this.apartmentsCountView = apartmentsCount;
          } else {
            this.weekStart = 0;
            this.yearStart = 0;
            this.weekEnd = 0;
            this.yearEnd = 0;
            this.apartmentsCountView = -1;
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