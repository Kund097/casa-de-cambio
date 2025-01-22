//Crear una interfaz que permita en base a la fecha y la base, mostrar todos los cambios disponibles
//testearlo con cypress

///<reference types = "jquery"/>
let currencies;
let currenciesFullNames;
$(window).on("load", async () => {
    currencies = await getCurrencies();
    await $.ajax({
        method: "GET",
        url: "https://api.frankfurter.dev/v1/currencies",
        success: (response) => {
            response.json;
            currenciesFullNames = response;
        },
        error: (error) => {
            console.error("error", error.status);
        },
    });
    console.log("cargué");
    console.log(currencies, currenciesFullNames);
    insertFormCurrencies(currencies, currenciesFullNames);
    insertTableCurrencies(currencies, currenciesFullNames);
});

function insertFormCurrencies(currencies, currenciesFullNames) {
    $(".base-currency")
        .text(currenciesFullNames[currencies.base])
        .val(currencies.base);
    $("#date").val(currencies.date);
    const $listCurrencies = $(".currencies");
    console.log(currencies);
    Object.keys(currencies.rates).forEach((currency) => {
        $listCurrencies.append(
            `<option id="${currency}" value="${currency}">${currenciesFullNames[currency]}</option>`
        );
    });
}

function insertTableCurrencies(currencies, currenciesFullNames) {
    Object.keys(currencies.rates).forEach((currencyId) => {
        $(".table-currencies").append(
            `<tr>
                    <th>${currencies.amount}</th>
                    <th>${currenciesFullNames[currencies.base]}</th>
                    <td>${currenciesFullNames[currencyId]}</td>
                    <td>${currencyId}</td>
                    <td>${currencies.rates[currencyId]}</td>
             </tr>`
        );
    });
}

async function getCurrencies(currency = "EUR", date = "latest") {
    console.log({ date });
    return await $.ajax({
        method: "GET",
        url: `https://api.frankfurter.dev/v1/${date}?base=${currency}`,
        success: (response) => {
            response.json;
            console.log(response.rates);
        },
        error: (error) => {
            console.error("error", error.status);
        },
    });
}

async function handleInputs(eventObject) {
    eventObject.preventDefault();
    const $baseCurrency = $(".currencies").val();
    const $date = $("#date").val();
    console.log("me hiciste click", $baseCurrency);
    console.log("date", $date);
    currencies = await getCurrencies($baseCurrency, $date);
    removeTableChildren();
    insertTableCurrencies(currencies, currenciesFullNames);
}

function removeTableChildren() {
    $(".table-currencies").children().remove();
}

const $inputBtn = $("#input-btn");
$inputBtn.on("click", handleInputs);
