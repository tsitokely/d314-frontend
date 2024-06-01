<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-between">
          <h3 class="col-lg-auto mb-3 mb-lg-0 me-lg-3">Réservations</h3>
          <div class="col-auto">
              <RouterLink to="/reservations/create" class="btn btn-success">Créer</RouterLink>
            </div>
        </div>
        <div v-if="reservationsCountView >= 0" class="mt-2 text-center">
          <strong>Nombre de réservations trouvées: {{ reservationsCountView }}</strong>
        </div>
      </div>
      <div class="card-body">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th class="fw-bold">Nom d'appartement</th>
              <th class="fw-bold">Nom de la réservation</th>
              <th class="fw-bold">Semaine de réservation</th>
              <th class="fw-bold">Action</th>
            </tr>
          </thead>
          <tbody v-if="reservationsCountView > 0" class="table-group-divider">
            <tr v-for="(reservation, index) in this.reservations" :key="index">
              <td class="fst-italic">
                <RouterLink :to="{ path: '/Apartments/' + reservation.apartmentID  }"> 
                  {{ apartmentNames[index] }}
                </RouterLink> 
              </td>   
              <td class="fst-italic"> {{ reservation.reservationName }} </td>
              <td> {{ reservation.reservationDateYear + '-W' + reservation.reservationDateNoSem }} </td>
              <td>
                <RouterLink to="/" class="btn btn-info me-1"> Modifier </RouterLink>
                <button type="button" @click="DeleteReservationView(reservation.reservationID)" class="btn btn-danger me-1"> Supprimer </button> 
              </td>        
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-if="reservationsCountView != -1"> <td colspan="2">Chargement...</td> </tr>
            <tr v-else> <td colspan="2">Pas de réservations</td> </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import { RouterLink } from 'vue-router';
  import { getReservations, getApartmentDetails, DeleteReservation } from '@utils/apiUtils.js';

  export default {
    name: 'reservations',
    data(){
      return{
        reservations: [],
        apartmentNames: [],
        reservationsCountView: 0
      }
    },
    mounted(){
      this.getReservationsView();    
    },
    methods: {
      async getReservationsView(){
        try {
          const { reservations, reservationsCount } = await getReservations();
          this.reservations = reservations;
          this.reservationsCountView = reservationsCount;
          const apartmentIDs = this.reservations.map(reservation => reservation.apartmentID);
          const apartmentInfoPromises = apartmentIDs.map(apartmentID => getApartmentDetails(apartmentID));
          const apartmentInfo = await Promise.all(apartmentInfoPromises);
          this.apartmentNames = apartmentInfo.flatMap(apartment => apartment.apartmentDetail.map(apartmentInfo => apartmentInfo.apartmentName));
        } catch (error) {
          console.error("Error on getting data on the view:", error);
        }
      },
      async DeleteReservationView(reservationId){
        if(confirm("Est-ce que vous êtes certain de vouloir supprimer cette réservation ?")){
          const res = await DeleteReservation(reservationId);
          alert("Réservation #"+reservationId+" supprimée");
          this.getReservationsView(); 
        }
      },
    },
  }
</script>