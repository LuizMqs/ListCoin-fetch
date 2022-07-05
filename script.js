let dateIn = "vazio";
let dateOut = "vazio";

try {
  fetch("https://economia.awesomeapi.com.br/json/all")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const selectElement = document.querySelector("#moedas");
      Object.entries(data).forEach((moeda, index) => {
        selectElement.innerHTML += `<option id="${index}">${moeda[0]}</option>`;
        document.querySelector(".currentQuota").style.display = "none";
      });
    })
    .catch((err) => {
      throw new Error("Couldnt get a answer from API");
    });
} catch (error) {
  console.log(error);
}

document.getElementById("moedas").addEventListener("change", (e) => {
  const moeda = e.target.value;

  if (moeda != "None") {
    document.querySelector(".currentQuota").style.display = "block";

    fetch(`https://economia.awesomeapi.com.br/json/${moeda}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const moedas = data[0];
        document.querySelector(
          ".currentQuota tbody"
        ).innerHTML = `<tr><td>${moedas.ask}</td> <td>${moedas.create_date}</td> <td>${moedas.low}</td> <td>${moedas.high}</td> <td>${moedas.bid}</td></tr>`;
      });
  } else {
    document.querySelector(".currentQuota").style.display = "none";
  }
});

function convertedDate(data) {
  var ConvDate = new Date(data);
  let dateTime = ConvDate.getTime() + 60000 * 1440;
  let day = new Date(dateTime).getDate();
  if (day < 10) {
    day = "0" + day;
  }
  let month = new Date(dateTime).getMonth();
  month++;
  if (month < 10) {
    month = "0" + month;
  }

  let year = new Date(dateTime).getFullYear();

  return year + "-" + month + "-" + day;
}

document.querySelector("#date-in").addEventListener("change", (e) => {
  dateIn = e.target.value;
  dateIn = convertedDate(dateIn);
});

document.querySelector("#date-out").addEventListener("change", (e) => {
  dateOut = e.target.value;
  dateOut = convertedDate(dateOut);
});

document.querySelector("#show").addEventListener("click", async () => {
    document.querySelector("body").style.cursor = 'wait'
  document.querySelector(".period tbody").innerHTML = "";
  const moeda = document.querySelector("#moedas").value;
  let moedas = [];
  if (dateIn != "vazio" && dateOut != "vazio" && moeda != "None") {
    let dateInMilliseconds = new Date(dateIn).getTime();
    let dateOutMilliseconds = new Date(dateOut).getTime();
    let currentDate;

    while (dateInMilliseconds <= dateOutMilliseconds) {
      currentDate = convertedDate(dateInMilliseconds).replaceAll("-", "");

      if (
        new Date(dateInMilliseconds).getDay() != 5 &&
        new Date(dateInMilliseconds).getDay() != 6
      )
        await doAjax();

      dateInMilliseconds = dateInMilliseconds + 60000 * 1440;
    }

    document.querySelector("body").style.cursor = 'default'

    async function doAjax() {
      const result = await fetch(
        `https://economia.awesomeapi.com.br/${moeda}?start_date=${currentDate}&end_date=${currentDate}`,
        { type: "GET" }
      )
        .then((response) => {
          return response.json();
        })
        .then(function (data) {
          moedas = data[0];
          if (moedas) {
            if (
              new Date(dateIn).getTime() <
              new Date(moedas.create_date).getTime()
            ) {
              document.querySelector(
                ".period tbody"
              ).innerHTML += `<tr><td>${moedas.ask}</td> <td>${moedas.create_date}</td> <td>${moedas.low}</td> <td>${moedas.high}</td> <td>${moedas.bid}</td> </tr>`;
            }
          }
        });
      return result;
    }

    document.querySelector(".period").style.display = "block";
  } else {
    alert("Entrada de dados insuficiente.");
  }
});
