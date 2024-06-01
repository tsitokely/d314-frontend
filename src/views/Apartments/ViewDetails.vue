<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="mb-0">
            Appartement avec la référence #{{ apartmentId }}
            
          </h3>
          <RouterLink :to="{ path: '/reservations/create/' + apartmentId }" class="btn btn-success float-end">Réserver</RouterLink>
        </div>
        <div class="weather-info d-flex align-items-center">
          <p class="mb-0">
            Température mesurée actuellement à <strong>{{ this.model.apartmentDetail.cityName }}</strong> : <i>{{ this.model.apartmentDetail.cityTemperature }}</i> °C
          </p>
          <div class="ms-3 me-3 mb-0">
            <span :class="weatherIconClass" style="font-size: 2rem;"></span>
          </div>
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
            weatherConditionCode: '',
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
    computed: {
      weatherIconClass() {
        const code = this.model.apartmentDetail.weatherConditionCode;

        // mapping entre les codes WMO 4677 et les icones bootstrap
        const iconMapping = {
        0: 'bi bi-sun-fill', // Clear sky
        1: 'bi bi-sun', // Mainly clear
        2: 'bi bi-cloud-sun', // Partly cloudy
        3: 'bi bi-cloud', // Overcast
        45: 'bi bi-cloud-fog2', // Fog
        48: 'bi bi-cloud-fog2', // Depositing rime fog
        51: 'bi bi-cloud-drizzle', // Light drizzle
        53: 'bi bi-cloud-drizzle', // Moderate drizzle
        55: 'bi bi-cloud-drizzle-fill', // Dense drizzle
        56: 'bi bi-cloud-hail', // Freezing, light drizzle
        57: 'bi bi-cloud-hail-fill', // Freezing, dense drizzle
        61: 'bi bi-cloud-rain', // Slight rain
        63: 'bi bi-cloud-rain-fill', // Moderate rain
        65: 'bi bi-cloud-rain-heavy', // Heavy rain
        66: 'bi bi-cloud-sleet', // Freezing, light rain
        67: 'bi bi-cloud-sleet-fill', // Freezing, heavy rain
        71: 'bi bi-cloud-snow', // Slight snow
        73: 'bi bi-cloud-snow', // Moderate snow
        75: 'bi bi-cloud-snow-fill', // Heavy snow
        77: 'bi bi-cloud-snow', // Snow grains
        80: 'bi bi-cloud-rain', // Rain showers, slight
        81: 'bi bi-cloud-rain-fill', // Rain showers, moderate
        82: 'bi bi-cloud-rain-heavy', // Rain showers, violent
        85: 'bi bi-cloud-snow', // Snow showers, slight
        86: 'bi bi-cloud-snow-fill', // Snow showers, heavy
        95: 'bi bi-cloud-lightning', // Thunderstorm, slight or moderate
        96: 'bi bi-cloud-lightning-rain', // Thunderstorm with hail, slight
        99: 'bi bi-cloud-lightning-rain-fill', // Thunderstorm with hail, heavy
        };

        // retourner la valeur de l'icone correspondant - sinon un icone par défaut
        return iconMapping[code] || 'bi bi-sun';
      }
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
          this.model.apartmentDetail.weatherConditionCode = weatherData.current.weather_code;
        } catch (error) {
          console.error("Error on getting data on the view:", error);
        };
      },
    },
  }
</script>