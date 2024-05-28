import axios from 'axios'

const baseUrl = import.meta.env.VITE_APP_API_BASE_URL
const weatherUrl = import.meta.env.VITE_APP_API_WEATHER_URL

// API sur les villes
async function getCities() {
    try {
        const res = await axios.get(`${baseUrl}/City`);
        const cities = res.data;
        const cityCount = res.data.length;
        return { cities, cityCount };
    } catch (error) {
        console.error("There was an error in getting the cities from the api:", error);
        throw error;
    }
};

async function getCityInformation(cityID) {
    try {
        const res = await axios.get(`${baseUrl}/City/` + cityID);
        const cityInfo = res.data;
        return { cityInfo };
    } catch (error) {
        console.error("There was an error in getting the cities details from the api:", error);
        throw error;
    }
};

async function getCitiesWithVacantAppartment(yearStart,weekStart,yearEnd,weekEnd){
    const yearWeekStart = `${yearStart}${weekStart}`;
    const yearWeekEnd = `${yearEnd}${weekEnd}`;
    let apiUrl =``;
    let cities = [];
    let cityCount = [];
    if (yearWeekStart == yearWeekEnd) {
      apiUrl = `${baseUrl}/City/${yearStart}/${weekStart}`;
    }
    else if (yearWeekStart > yearWeekEnd){
      alert('Les périodes séléctionnés sont incorrectes - période de début: '+ yearWeekStart +' , plus grand que la période de fin: '+ yearWeekEnd);
      cities = [];
      cityCount = 0;
      return { cities, cityCount };
    }
    else {
      apiUrl = `${baseUrl}/City/${yearStart}/${weekStart}?yearEnd=${yearEnd}&weekEnd=${weekEnd}`;
    }
    console.log(apiUrl);
    try {
        const res = await axios.get(apiUrl);
        cities = res.data;
        cityCount = res.data.length;
        return { cities, cityCount };
    } catch (error) {
        console.error("There was an error in getting the cities from the api:", error);
        throw error;
    }
};

// API sur les appartements
async function getApartments() {
    try {
        const res = await axios.get(`${baseUrl}/Apartment`);
        const apartments = res.data;
        const apartmentsCount = res.data.length;
        return { apartments, apartmentsCount };
    } catch (error) {
        console.error("There was an error in getting the apartments from the api:", error);
        throw error;
    }
};

async function getApartmentDetails(ApartmentId) {
    try {
        const res = await axios.get(`${baseUrl}/Apartment/` + ApartmentId);
        const apartmentDetail = res.data;
        return { apartmentDetail };
    } catch (error) {
        console.error("There was an error in getting the apartment details from the api:", error);
        throw error;
    }
};

async function getApartmentsInCity(cityId) {
    try {
        const res = await axios.get(`${baseUrl}/Apartment/`+ cityId);
        const apartments = res.data;
        const apartmentsCount = res.data.length;
        return { apartments, apartmentsCount };
    } catch (error) {
        console.error("There was an error in getting the apartments from the api:", error);
        throw error;
    }
};

async function getApartmentsInCityInPeriod(cityId, yearStart, yearEnd, weekStart, weekEnd) {
    try {
        const apiUrl = `${baseUrl}/Apartment/`+ cityId + `/` + yearStart + `-` + weekStart + `/` + yearEnd + `-` + weekEnd;
        console.log(apiUrl);
        const res = await axios.get(apiUrl);
        const apartments = res.data;
        const apartmentsCount = res.data.length;
        
        return { apartments, apartmentsCount };
    } catch (error) {
        console.error("There was an error in getting the apartments from the api:", error);
        throw error;
    }
};

// API sur la météo - api externe nécessitant internet sur la machine cliente
async function getCurrentWeather(latitude, longitude) {
    try {
        const res = await axios.get(`${weatherUrl}/?latitude=` + latitude + `&longitude=` + longitude + `&current=temperature_2m&timezone=auto`);
        const weatherData = res.data;
        return { weatherData };
    } catch (error) {
        console.error("There was an error in getting the weather data from the weather api:", error);
        throw error;
    }
};

export { 
    getCities, getCitiesWithVacantAppartment, getCityInformation, 
    getApartments, getApartmentsInCity, getApartmentsInCityInPeriod,  getApartmentDetails, 
    getCurrentWeather
};