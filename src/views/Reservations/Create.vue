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
          <select  v-model="selectedApartment" name="apartment"  class="form-control">
            <option v-for="(apartment, index) in apartments" :key="index" :value="apartment.apartmentID">
              {{ apartment.apartmentName + ', Adresse: '+ apartment.apartmentAddress + ', ' + cityNames[index] }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label for=""><strong>Nom de la réservation</strong></label>
          <input v-model="this.model.reservationDetails.reservationName" type="text"  class="form-control"> 
        </div>
        <div class="reservationPeriodContainer">
            <div class="reservationPeriod reservationStart mb-3 me-3">
              <div class="reservationPeriodYear mb-3">
                <label class="me-3" for="reservationStartYear"><strong>Année - Début</strong></label>
                <select name="reservationStartYear" v-model="this.model.reservationDetails.yearStart" class="reservationStartYear" >
                          <option value="2024" selected>2024</option>
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                </select>
              </div>
              <div class="reservationPeriodWeek">
                <label class="me-3" for="reservationStartWeek"><strong>Semaine - Début</strong></label>
                <select id="StartWeek" v-model="this.model.reservationDetails.weekStart" name="reservationStartWeek"></select>
              </div>
            </div>

        <div class="reservationPeriod reservationStart mb-3 me-3">
          <div class="reservationPeriodYear" mb-3>
            <label class="mb-3" for="reservationEndYear"><strong>Année - Fin</strong></label>
            <select name="reservationEndYear" v-model="this.model.reservationDetails.yearEnd" class="reservationEndYear" >
                      <option value="2024" selected>2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
            </select>
          </div>
          <div class="reservationPeriodWeek">
            <label class="reservationEndWeek mb-3" for="reservationEndWeek"><strong>Semaine - Fin</strong></label>
            <select id="EndWeek" v-model="this.model.reservationDetails.weekEnd" name="reservationEndWeek"></select>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { createReservations,getApartments, getCityInformation } from '@utils/apiUtils.js';
  import { populateWeeks } from '@utils/dateUtils.js';

  export default {
    name: 'ReservationCreate',
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
            yearStart:'2024',
            weekStart:'01',
            yearEnd:'2024',
            weekEnd:'01',
          },
        },
        apartments: [],
        cityNames: [],
        selectedApartment: 0,
        message: ''
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
        let this_ = this;
        try {
          const response = await createReservations(this.reservations.length === 1 ? this.reservations[0] : this.reservations);
          if (response.status === 201) {
            this_.message = 'Le ou les réservations ont été crées avec succès!';
            alert(this_.message);
            }
        } catch (error) {
              this_.message = 'Soit l\'appartement n\'est pas disponible sur la période, soit la réservation existe déjà';
              alert(this_.message);
            }
          }
        ,
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
        //console.log(startYearWeek,endYearWeek);

        if (startYear === endYear) {
          if (startWeek > endWeek) {
            alert('Les périodes séléctionnés sont incorrectes : '+ startYear +'-W'+ startWeek + '>'+ endYear +'-W'+ endWeek); 
          }
          else{
            for (let week = startWeek; week <= endWeek; week++) {
              reservations.push({
                reservationName: this.model.reservationDetails.reservationName,
                reservationDateYear: startYear.toString(),
                reservationDateNoSem: week.toString().padStart(2, '0'),
                apartmentID: this.model.reservationDetails.apartmentID,
              });
            };
          }
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
        if(reservations.length>0){
          this.reservations = reservations;
          this.createReservations();
        }
        //console.log(this.reservations);
      },
    }
  }
</script>