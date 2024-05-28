<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <div class="mb-3">
          <h3 class="col-lg-auto mb-3 mb-lg-0 me-lg-3">
            Appartement avec la référence #{{ apartmentId }}
            <button class="btn btn-primary float-end">Réserver</button>
          </h3>
        </div>
        <div >
          <p>Température mesurée actuellement à <strong>{{ this.model.apartmentDetail.cityName }}</strong> : <i>{{ this.model.apartmentDetail.cityTemperature }}</i> °C</p>
        </div>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for=""><strong>Nom</strong></label>
          <input type="text" v-model="model.apartmentDetail.apartmentName" class="form-control"  readonly>
        </div>
        <div class="mb-3">
          <label for=""><strong>Prix de location hebdomadaire</strong></label>
          <input type="text" v-model="model.apartmentDetail.apartmentPrice" class="form-control"  readonly> 
        </div>
        <div class="mb-3">
          <label for=""><strong>Description</strong></label>
          <textarea type="text" v-model="model.apartmentDetail.apartmentDesc" class="form-control"  readonly></textarea> 
        </div>
        <div class="mb-3">
          <label for=""><strong>Adresse</strong></label>
          <textarea type="text" v-model="model.apartmentDetail.apartmentAdress" class="form-control"  readonly></textarea> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  //import { RouterLink } from 'vue-router';
  import { getApartmentDetails, getCityInformation, getCurrentWeather } from '@utils/apiUtils.js';

  export default {
    name: 'apartmentDetails',
    data(){
      return{
        model: {
          apartmentDetail: {
            apartmentId: '',
            cityID: '',
            cityName: '',
            cityLatitude: '',
            cityLongitude: '',
            cityTemperature: '',
            apartmentName: '',
            apartmentDesc: '',
            apartmentAdress: '',
            apartmentPrice: '',
          }
        },
        apartmentId: (this.$route.params.ApartmentId),
      }
    },
    mounted(){
      this.getApartmentDetailsView(this.$route.params.ApartmentId)
    },
    methods: {
      async getApartmentDetailsView(Id){
        try {
          const { apartmentDetail } = await getApartmentDetails(Id);
          this.model.apartmentDetail.apartmentName = apartmentDetail[0].apartmentName;
          this.model.apartmentDetail.apartmentDesc = apartmentDetail[0].apartmentDesc;
          this.model.apartmentDetail.apartmentAdress = apartmentDetail[0].apartmentAddress;
          this.model.apartmentDetail.apartmentPrice = apartmentDetail[0].apartmentPrice;
          this.model.apartmentDetail.cityID = apartmentDetail[0].cityID;

          const { cityInfo } = await getCityInformation(this.model.apartmentDetail.cityID);
          this.model.apartmentDetail.cityName = cityInfo[0].cityName;
          this.model.apartmentDetail.cityLatitude = cityInfo[0].cityLatitude;
          this.model.apartmentDetail.cityLongitude = cityInfo[0].cityLongitude;
          
          const { weatherData } = await getCurrentWeather(this.model.apartmentDetail.cityLatitude, this.model.apartmentDetail.cityLongitude);
          this.model.apartmentDetail.cityTemperature = weatherData.current.temperature_2m;
        } catch (error) {
          console.error("Error on getting data on the view:", error);
        };
      },
    },
  }
</script>