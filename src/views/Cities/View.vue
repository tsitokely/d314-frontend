<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <h4>Villes</h4>
      </div>
      <div class="card-body">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Identifiant</th>
              <th>Nom de la ville</th>
            </tr>
          </thead>
          <tbody v-if="this.cities.length >0">
            <tr v-for="(city, index) in this.cities" :key="index">       
              <td>{{ city.cityID }}</td>
              <td>{{ city.cityName }}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(city, index) in this.cities" :key="index">       
              <td colspan="2">Loading...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'cities',
    data(){
      return{
        cities: []
      }
    },
    mounted(){
        this.getCities();
    },
    methods: {
      getCities(){
        axios.get('http://localhost:8080/WsLocaPart/api/City')
        .then(res => {
          this.cities = res.data
          console.log(this.cities)
        })
        .catch(error =>{})
        .finally(() => this.loading = false);
      }
    },
  }
</script>