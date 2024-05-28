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
          <p>Température ressenti dans la ville <strong>x</strong> : <i>y</i> °C</p>
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
        <div class="mb-3">
          <label for=""><strong>Ville</strong></label>
          <input type="text"  class="form-control"  readonly> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  //import { RouterLink } from 'vue-router';
  import { getApartmentDetails } from '@utils/apiUtils.js';

  export default {
    name: 'apartmentDetails',
    data(){
      return{
        model: {
          apartmentDetail: {
            apartmentId: '',
            cityID: '',
            cityName: '',
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
          const { apartmentDetail } = await getApartmentDetails(this.$route.params.ApartmentId);
          this.model.apartmentDetail.apartmentName = apartmentDetail[0].apartmentName;
          this.model.apartmentDetail.apartmentDesc = apartmentDetail[0].apartmentDesc;
          this.model.apartmentDetail.apartmentAdress = apartmentDetail[0].apartmentAddress;
          this.model.apartmentDetail.apartmentPrice = apartmentDetail[0].apartmentPrice;
          console.log(apartmentDetail[0]);
        } catch (error) {
          console.error("Error on getting data on the view:", error);
        }
      },
      
    },
  }
</script>