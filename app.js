const apiUrl = `https://ergast.com/api/f1/2023.json?`;

const getLocalTime = (utcDateStr) => {
  const utcDate = new Date(utcDateStr);
  const localTime = new Date(utcDate.getTime());

  const options = {
    timeZone: "Europe/Madrid",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  };
  return localTime.toLocaleString("es-ES", options);
};

const isRaceWeekend = (startDate, endDate) => {
  const now = new Date();
  return now >= startDate && now <= endDate;
};

const sortRaces = (races) => {
  return races.sort((a, b) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    return aDate - bDate;
  });
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

fetch(apiUrl)
  .then((response) => response.json())
  .then(async (data) => {
    const races = sortRaces(data.MRData.RaceTable.Races);
    const calendar = document.getElementById("calendar");

    for (const race of races) {
      const card = document.createElement("div");
      card.classList.add("col");

      const startDate = new Date(race.date);
      const endDate = new Date(race.date);
      endDate.setDate(endDate.getDate() + 2);

      card.classList.add("col-lg-4", "col-md-6", "mb-4"); // Agregamos clase col-md-6 para pantallas medianas
      card.innerHTML = `
      <div class="card shadow-lg rounded-lg mx-auto">
        <div class="card-header header bg-danger text-white">
          <div class="d-flex align-items-center justify-content-between">
      <h3 class="m-0">${race.raceName.replace("Grand Prix", "GP")}</h3>
            </div>
            <div
            class="d-flex flex-column flex-md-row justify-content-between mt-2"
          >            <p class="m-0 text-start mb-2 mb-md-0">${
            race.Circuit.Location.locality
          }, ${race.Circuit.Location.country}</p>
      <h5
      class="m-0 bg-black text-white d-flex justify-content-center text-center d-block text-md-start fs-6 ms-md-3"
      >      <i class="fas fa-calendar-alt me-2"></i>
                ${startDate
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
        .toUpperCase()}
              </h5>
            </div>
          </div>
          <div class="card-body">
          <ul class="list-group list-group-flush">
            <li class="list-group-item bg-lighter-gray text-black">
                <i class="fas fa-stopwatch me-2"></i><strong>Free Practice 1 - </strong>
                ${
                  race.FirstPractice
                    ? await getLocalTime(
                        race.FirstPractice.date + "T" + race.FirstPractice.time
                      )
                    : "TBA"
                }
              </li>
              <li class="list-group-item bg-lighter-gray text-black">
                <i class="fas fa-stopwatch me-2"></i><strong>Free Practice 2 - </strong>
                ${
                  race.SecondPractice
                    ? await getLocalTime(
                        race.SecondPractice.date +
                          "T" +
                          race.SecondPractice.time
                      )
                    : "TBA"
                }
              </li>
              <li class="list-group-item bg-lighter-gray text-black">
                <i class="fas fa-stopwatch me-2"></i><strong>Free Practice 3 - </strong>
                ${
                  race.ThirdPractice
                    ? await getLocalTime(
                        race.ThirdPractice.date + "T" + race.ThirdPractice.time
                      )
                    : "TBA"
                }
          </li>
              <li class="list-group-item bg-lighter-gray text-black">
                <i class="fas fa-flag-checkered me-2"></i><strong>Qualifying - </strong>
                ${
                  race.Qualifying
                    ? await getLocalTime(
                        race.Qualifying.date + "T" + race.Qualifying.time
                      )
                    : "TBA"
                }
              </li>
              <li class="list-group-item bg-lighter-gray text-black">
                <i class="fas fa-flag-checkered me-2"></i><strong>Race - </strong>
                ${
                  race.date
                    ? await getLocalTime(race.date + "T" + race.time)
                    : "TBA"
                }              
                </li>
            </ul>
          </div>
        </div>
      `;

      calendar.appendChild(card);
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

/*TESTING */
