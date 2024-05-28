<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-between">
          <h3 v-if="this.concatYearWeekStart == this.concatYearWeekEnd" class="col-lg-auto mb-3 mb-lg-0 me-lg-3">
            Appartements dans la ville {{ this.$route.params.CityId }} pour la semaine du {{ this.concatYearWeekStart }} 
          </h3>
          <h3 v-else class="col-lg-auto mb-3 mb-lg-0 me-lg-3">
            Appartements dans la ville {{ this.$route.params.CityId }} pour la période entre {{ this.concatYearWeekStart }} et {{ this.concatYearWeekEnd }}
          </h3>
        </div>
      </div>
      <div class="card-body">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th class="fw-bold">Identifiant de la ville</th>
              <th class="fw-bold">Nom de l'appartement</th>
              <th class="fw-bold">Prix en euro (TTC)</th>
            </tr>
          </thead>
          <tbody v-if="apartmentsCountView > 0" class="table-group-divider">
            <tr v-for="(apartment, index) in this.apartmentsCityFiltered" :key="index">       
              <td> {{ apartment.cityID }} </td>
              <td class="fst-italic">
                <RouterLink :to="{ path: '/Apartments/' + apartment.apartmentID }"> 
                  {{ apartment.apartmentName }}
                </RouterLink> 
              </td>
              <td class="fst-italic">{{ apartment.apartmentPrice }}</td>
            </tr>
          </tbody>
          <tbody v-else>    
            <tr v-if="apartmentsCountView != -1"> <td colspan="3">Chargement...</td> </tr>
            <tr v-else> <td colspan="3">Pas de ville trouvée</td> </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import { RouterLink } from 'vue-router';
  import { getApartmentsInCity, getApartmentsInCityInPeriod } from '@utils/apiUtils.js';

  export default {
    name: 'apartmentInCity',
    data(){
      return{
        apartmentsCityFiltered: [],
        apartmentsCountView: 0,
        concatYearWeekStart: (this.$route.params.YearStart + '-W' + this.$route.params.WeekStart),
        concatYearWeekEnd: (this.$route.params.YearEnd + '-W' + this.$route.params.WeekEnd),
      }
    },
    mounted(){
        //this.getApartmentsInCityView(this.$route.params.CityId);
        this.getApartmentsInCityInPeriodView(this.$route.params.CityId, 
                                            this.$route.params.YearStart,
                                            this.$route.params.YearEnd, 
                                            this.$route.params.WeekStart, 
                                            this.$route.params.WeekEnd);
    },
    methods: {
      async getApartmentsInCityView(cityId){
        try {
          const { apartments, apartmentsCount } = await getApartmentsInCity(cityId);
          this.apartmentsCityFiltered = apartments;
          this.apartmentsCountView = apartmentsCount;
        } catch (error) {
          console.error("Error on getting data on the view:", error);
        }
      },
      async getApartmentsInCityInPeriodView(cityId, yearStart, yearEnd, weekStart, weekEnd){
        try {
          const { apartments, apartmentsCount } = await getApartmentsInCityInPeriod(cityId, yearStart, yearEnd, yearStart, weekEnd);
          if(apartmentsCount > 0){
            this.apartmentsCityFiltered = apartments;
            this.apartmentsCountView = apartmentsCount;
          } else {
            this.apartmentsCityFiltered = [];
            this.apartmentsCountView = -1;
          }
          
        } catch (error) {
          console.error("Error on getting data on the view:", error);
        }
      },
    },
  }
</script>