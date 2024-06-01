<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="mb-0">
            Éditer la réservation avec les informations suivante
          </h3>
          <button class="btn btn-success float-end" @click="EditReservationView">Sauvegarder</button>
        </div>
        <span>Nom de la réservation: {{ oldReservationName }} , Nom de l'appartement: {{ oldReservationApartmentName }}, Période: {{ oldReservationPeriod }} </span>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="apartment"><strong>Nouveau choix - appartement</strong></label>
          <select  v-model="this.model.newReservation.apartmentID" name="apartment"  class="form-control">
            <option v-for="(apartment, index) in apartments" :key="index" :value="apartment.apartmentID">
              {{ apartment.apartmentName + ', Adresse: '+ apartment.apartmentAddress + ', ' + cityNames[index] }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label for=""><strong>Nouveau choix - nom de la réservation</strong></label>
          <input v-model="this.model.newReservation.reservationName" type="text"  class="form-control"> 
        </div>
        <div class="reservationPeriodContainer">
            <div class="reservationPeriod reservationStart mb-3 me-3">
              <div class="reservationPeriodYear mb-3">
                <p class="text-center"><strong>Nouveau choix de période</strong></p>
                <label class="me-3" for="reservationStartYear"><strong>Année</strong></label>
                <select name="reservationYear" v-model="this.model.newReservation.year" class="reservationYear" >
                          <option value="2024" selected>2024</option>
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                </select>
              </div>
              <div class="reservationPeriodWeek">
                <label class="me-3" for="reservatioWeek"><strong>Semaine</strong></label>
                <select id="Week" v-model="this.model.newReservation.week" name="reservationWeek"></select>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { EditReservation,getApartments, getCityInformation } from '@utils/apiUtils.js';
  import { populateOneWeek } from '@utils/dateUtils.js';

  export default {
    name: 'ReservationCreate',
    data(){
      return{
        Reservation: [{
            reservationName: '',
            reservationDateYear: '',
            reservationDateNoSem: '',
            apartmentID: '',
        }],
        model: {
          newReservation: {
            apartmentID: '',
            reservationName: '',
            year:'2024',
            week:'01',
          },
        },
        apartments: [],
        cityNames: [],
        selectedApartment: 0,
        message: '',
        oldReservationId: (this.$route.params.ReservationId),
        oldReservationName: (this.$route.query.reservationName),
        oldReservationPeriod: (this.$route.query.reservationPeriod),
        oldReservationApartmentName: (this.$route.query.reservationApartmentName)
      }
    },
    watch: {
      selectedApartment(newValue) {
        this.model.reservationDetails.apartmentID = newValue;
      }
    },
    mounted(){
      this.populateWeeks();
      this.getApartmentsView();
    },
    methods: {
      populateWeeks() {
        const weekSelectStart = document.querySelector("#Week");
        populateOneWeek(weekSelectStart);
        },
      async EditReservationView() {
        let this_ = this;
        const reservation = [];
        const newYear  = parseInt(document.querySelector(".reservationYear").value);
        const newWeek = parseInt(document.querySelector("#Week").value);
        reservation.push({
                reservationName: this.model.newReservation.reservationName,
                reservationDateYear: newYear.toString(),
                reservationDateNoSem: newWeek.toString().padStart(2, '0'),
                apartmentID: this.model.newReservation.apartmentID,
              });

        try{
          console.log(this.oldReservationId, reservation);
          const response = await EditReservation(this.oldReservationId, reservation[0]);
          if (response.status === 200) {
            this_.message = 'La réservation a été modifié avec succès!';
            alert(this_.message);
            }  
        } catch (error) {
            this_.message = error.response.data;
            alert(this_.message);
          }
          
        },
      async getApartmentsView(){
        try {
          const { apartments, apartmentsCount } = await getApartments();
          this.apartments = apartments;
          const cityIDs = this.apartments.map(apartment => apartment.cityID);
          const cityInfoPromises = cityIDs.map(cityID => getCityInformation(cityID));
          const citiesInfo = await Promise.all(cityInfoPromises);
          this.cityNames = citiesInfo.flatMap(city => city.cityInfo.map(cityInfo => cityInfo.cityName));
        } catch (error) {
          console.error("Error on getting data on the view:", error);
        }
        },
      generateReservations() {
        const reservations = [];
        const startYear  = parseInt(document.querySelector(".reservationStartYear").value);
        const startWeek = parseInt(document.querySelector("#StartWeek").value);
        const startYearWeek = parseInt(`${startYear}${startWeek.toString().padStart(2, '0')}`);
        const endYear   = parseInt(document.querySelector(".reservationEndYear").value);
        const endWeek  = parseInt(document.querySelector("#EndWeek").value);
        const endYearWeek = parseInt(`${endYear}${endWeek.toString().padStart(2, '0')}`);
        console.log(startYearWeek,endYearWeek);

        if (startYear === endYear) {
            for (let week = startWeek; week <= endWeek; week++) {
              reservations.push({
                reservationName: this.model.reservationDetails.reservationName,
                reservationDateYear: startYear.toString(),
                reservationDateNoSem: week.toString().padStart(2, '0'),
                apartmentID: this.model.reservationDetails.apartmentID,
              });
            };
        } else {
          if (startYearWeek > endYearWeek){
            alert('Les périodes séléctionnés sont incorrectes : '+ startYear +'-W'+ startWeek + '>'+ endYear +'-W'+ endWeek); 
          } else{
            // Générer les réservations des semaines dans l'année de départ
            for (let week = startWeek; week <= 52; week++) {
              reservations.push({
                reservationName: this.model.reservationDetails.reservationName,
                reservationDateYear: startYear.toString(),
                reservationDateNoSem: week.toString().padStart(2, '0'),
                apartmentID: this.model.reservationDetails.apartmentID,
              });
            }
                        
            if (endYear - startYear > 1) {
              // Générer les réservations des semaines entre la première année et les autres années suivantes
              for (let year = startYear + 1; year < endYear; year++) {
                for (let week = 1; week <= 52; week++) {
                  reservations.push({
                    reservationName: this.model.reservationDetails.reservationName,
                    reservationDateYear: year.toString(),
                    reservationDateNoSem: week.toString().padStart(2, '0'),
                    apartmentID: this.model.reservationDetails.apartmentID,
                    });
                }
              }
            } else {
              // Générer les réservations des semaines entre la première année et l'année qui la suit
              for (let week = 1; week <= endWeek; week++) {
              reservations.push({
                  reservationName: this.model.reservationDetails.reservationName,
                  reservationDateYear: endYear.toString(),
                  reservationDateNoSem: week.toString().padStart(2, '0'),
                  apartmentID: this.model.reservationDetails.apartmentID,
                });
              }
            }
          }
        }
        if(reservations.length!=0){
          this.reservations = reservations;
          this.createReservations();
        }
        //console.log(this.reservations);
        },
      },
  }
</script>