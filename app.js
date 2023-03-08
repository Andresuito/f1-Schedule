const apiUrl = `https://ergast.com/api/f1/2023.json?`;

const getLocalTime = (utcDateStr) => {
  const utcDate = new Date(utcDateStr);
  const localTime = new Date(utcDate.getTime());

  const options = {
    timeZone: "Europe/Madrid", // Cambia a la zona horaria adecuada
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  };
  return localTime.toLocaleString("es-ES", options);
};

const getRaceTime = (raceId) => {
  const raceUrl = `https://ergast.com/api/f1/2023/${raceId}.json`;

  return fetch(raceUrl)
    .then((response) => response.json())
    .then((data) => {
      const raceTimeStr =
        data.MRData.RaceTable.Races[0].date +
        "T" +
        data.MRData.RaceTable.Races[0].time;
      return getLocalTime(raceTimeStr);
    })
    .catch((error) => {
      console.error("Error al obtener la hora de la carrera:", error);
    });
};

const isRaceWeekend = (startDate, endDate) => {
  const now = new Date();
  return now >= startDate && now <= endDate;
};

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    const races = data.MRData.RaceTable.Races;
    const calendar = document.getElementById("calendar");

    races.forEach(async (race) => {
      const card = document.createElement("div");
      card.classList.add("col");

      const raceTime = await getRaceTime(race.round);
      const startDate = new Date(race.date);
      const endDate = new Date(race.date);
      endDate.setDate(endDate.getDate() + 2); // cada GP dura 3 días, así que agregamos 2 días al inicio

      card.classList.add("col-md-4", "mb-4");
      card.innerHTML = `
      <div class="card f1-card shadow-lg rounded-lg">
      <div class="card-header f1-card-header bg-danger text-white">
        <div class="d-flex align-items-center justify-content-between">
          <h3 class="m-0">${race.raceName}</h3>
        </div>
        <div class="d-flex align-items-center justify-content-between mt-2">
          <p class="m-0">${race.Circuit.Location.locality}, ${
        race.Circuit.Location.country
      }</p>
          <h5 class="m-0 bg-dark text-white d-flex align-items-center justify-content-center f1-date-header"><i class="fas fa-calendar-alt me-2"></i>${startDate
            .toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              localeMatcher: "best fit",
            })
            .toUpperCase()} - ${endDate
        .toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          localeMatcher: "best fit",
        })
        .toUpperCase()}</h5>
        </div>
      </div>
      <div class="card-body f1-card-body">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <i class="fas fa-stopwatch me-2"></i><strong>Free Practice 1:</strong> ${
              race.FirstPractice
                ? getLocalTime(
                    race.FirstPractice.date + "T" + race.FirstPractice.time
                  )
                : "TBA"
            }
          </li>
          <li class="list-group-item">
            <i class="fas fa-stopwatch me-2"></i><strong>Free Practice 2:</strong> ${
              race.SecondPractice
                ? getLocalTime(
                    race.SecondPractice.date + "T" + race.SecondPractice.time
                  )
                : "TBA"
            }
          </li>
          <li class="list-group-item">
            <i class="fas fa-stopwatch me-2"></i><strong>Free Practice 3:</strong> ${
              race.ThirdPractice
                ? getLocalTime(
                    race.ThirdPractice.date + "T" + race.ThirdPractice.time
                  )
                : "TBA"
            }
          </li>
          <li class="list-group-item">
            <i class="fas fa-stopwatch me-2"></i><strong>Qualifying:</strong> ${
              race.ThirdPractice
                ? getLocalTime(
                    race.Qualifying.date + "T" + race.Qualifying.time
                  )
                : "TBA"
            }
          </li>
              <li class="list-group-item">
              <i class="fa-solid fa-flag-checkered me-2"></i><strong>Race:</strong> ${
                  race.date ? getLocalTime(race.date + "T" + race.time) : "TBA"
                }
              </li>
            </ul>
          </div>
        </div>
      `;

      calendar.appendChild(card);
    });
  })
  .catch((error) => {
    console.error("Error al obtener el calendario:", error);
  });
