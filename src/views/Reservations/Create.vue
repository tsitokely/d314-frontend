<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="mb-0">
            Réserver un appartement
          </h3>
          <button class="btn btn-success float-end" @click="generateReservations">Sauvegarder</button>
        </div>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="apartment"><strong>Appartement</strong></label>
          <select  v-model="this.model.reservationDetails.apartmentID" name="apartment"  class="form-control"> </select>
        </div>
        <div class="mb-3">
          <label for=""><strong>Nom de la réservation</strong></label>
          <input v-model="this.model.reservationDetails.reservationName" type="text"  class="form-control"> 
        </div>
        <div class="reservationPeriodContainer">
            <div class="reservationPeriod reservationStart mb-3 me-3">
              <div class="reservationPeriodYear mb-3">
                <label class="me-3" for="reservationStartYear"><strong>Année - Début</strong></label>
                <select name="reservationStartYear" class="reservationStartYear" >
                          <option value="2024" selected>2024</option>
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                </select>
              </div>
              <div class="reservationPeriodWeek">
                <label class="me-3" for="reservationStartWeek"><strong>Semaine - Début</strong></label>
                <select id="StartWeek" name="reservationStartWeek"></select>
              </div>
            </div>

        <div class="reservationPeriod reservationStart mb-3 me-3">
          <div class="reservationPeriodYear" mb-3>
            <label class="mb-3" for="reservationEndYear"><strong>Année - Fin</strong></label>
            <select name="reservationEndYear" class="reservationEndYear" >
                      <option value="2024" selected>2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
            </select>
          </div>
          <div class="reservationPeriodWeek">
            <label class="reservationEndWeek mb-3" for="reservationEndWeek"><strong>Semaine - Fin</strong></label>
            <select id="EndWeek" name="reservationEndWeek"></select>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { createReservations } from '@utils/apiUtils.js';
  import { populateWeeks } from '@utils/dateUtils.js';

  export default {
    name: 'apartmentDetails',
    data(){
      return{
        reservations: [{
            reservationName: '',
            reservationDateYear: '',
            reservationDateNoSem: '',
            apartmentID: '',
        }],
        model: {
          reservationDetails: {
            apartmentID: '',
            reservationName: '',
          },
        },
        CurrentApartmentName:'',
        CurrentReservationName: '',
        message: ''
      }
    },
    mounted(){
      this.populateWeeks();
    },
    methods: {
      populateWeeks() {
        const weekSelectStart = document.querySelector("#StartWeek");
        const weekSelectEnd = document.querySelector("#EndWeek");
        populateWeeks(weekSelectStart,weekSelectEnd);
      },
      addReservation() {
      this.reservations.push({
        reservationName: '',
        reservationDateYear: '',
        reservationDateNoSem: '',
        apartmentID: '',
        });
      },
      async createReservations() {
        try {
        const response = await reservationService.createReservations(this.reservations.length === 1 ? this.reservations[0] : this.reservations);
        if (response.status === 201) {
          this.message = 'Reservation(s) created successfully!';
        }
      } catch (error) {
          if (error.response && error.response.status === 409) {
            this.message = 'One or more similar reservations already exist.';
          } else {
            this.message = 'An error occurred while creating reservations.';
          }
        }
      },
      generateReservations() {
        const reservations = [];
        const startYear  = parseInt(document.querySelector(".reservationStartYear").value);
        const startWeek = parseInt(document.querySelector("#StartWeek").value);
        const endYear   = parseInt(document.querySelector(".reservationEndYear").value);
        const endWeek  = parseInt(document.querySelector("#EndWeek").value);
        //console.log(startYear);
        //console.log(yearSelectStart+'-W'+weekSelectStart+', '+yearSelectEnd+'-W'+weekSelectEnd);
             // Handle the case when start year is the same as end year
        if (startYear === endYear) {
          for (let week = startWeek; week <= endWeek; week++) {
            reservations.push({
              reservationName: this.reservationName,
              reservationDateYear: startYear.toString(),
              reservationDateNoSem: week.toString().padStart(2, '0'),
              apartmentID: this.apartment,
            });
          };
          //console.log(reservations);
        } else if (startYear > endYear){
          alert('Les périodes séléctionnés sont incorrectes - période de début: '+ startYear +' , plus grand que la période de fin: '+ endYear);  
        } else {
            // Handle the start year weeks
            for (let week = startWeek; week <= 52; week++) {
              console.log("tapany début");
              reservations.push({
                reservationName: this.reservationName,
                reservationDateYear: startYear.toString(),
                reservationDateNoSem: week.toString().padStart(2, '0'),
                apartmentID: this.apartment,
              });
            }
            console.log(reservations);
            // Handle the full years in between
            if (endYear - startYear > 1) {
              for (let year = startYear + 1; year < endYear; year++) {
              console.log(year);
              for (let week = 1; week <= 52; week++) {
                reservations.push({
                  reservationName: this.reservationName,
                  reservationDateYear: year.toString(),
                  reservationDateNoSem: week.toString().padStart(2, '0'),
                  apartmentID: this.apartment,
                });
              }
            }
          }
            // Handle the end year weeks
            for (let week = 1; week <= endWeek; week++) {
              reservations.push({
                reservationName: this.reservationName,
                reservationDateYear: endYear.toString(),
                reservationDateNoSem: week.toString().padStart(2, '0'),
                apartmentID: this.apartment,
              });
            }
          }
        console.log(reservations);
        return reservations;
      },
    }
  }
</script>