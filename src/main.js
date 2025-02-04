//Crear una interfaz que permita en base a la fecha y la base, mostrar todos los cambios disponibles
//testearlo con cypress

///<reference types = "jquery"/>

$(window).on("load", () => {
    const currencies = {};
    Promise.all([getCurrencies(), getCurrencyFullNames()])
        .then(([apiCurrencies, fullNames]) => {
            currencies.apiCurrencies = apiCurrencies;
            currencies.fullNames = fullNames;
            insertFormCurrencies(currencies);
            insertTableCurrencies(currencies);
        })
        .catch((error) => console.error("error", error));
});

function insertFormCurrencies({ apiCurrencies, fullNames }) {
    $(".base-currency")
        .text(fullNames[apiCurrencies.base])
        .val(apiCurrencies.base);
    $("#date").val(apiCurrencies.date);
    const $listCurrencies = $(".currencies");
    Object.keys(apiCurrencies.rates).forEach((currency) => {
        $listCurrencies.append(
            `<option id="${currency}" value="${currency}">${fullNames[currency]}</option>`
        );
    });
}

function insertTableCurrencies({ apiCurrencies, fullNames }, amount = 1) {
    Object.keys(apiCurrencies.rates).forEach((currencyId) => {
        $(".table-currencies").append(
            `<tr>
                    <th class='base-table'>${fullNames[apiCurrencies.base]}</th>
                    <th data-cy='amount-currency' class='amount-table'>${amount}</th>
                    <td data-cy='rates' class='rates-table'>${Number(
                        apiCurrencies.rates[currencyId] * amount
                    ).toFixed(2)}</td>
                    <td class='full-name-table'>${fullNames[currencyId]}</td>
                    <td class='currency-id-table'>${currencyId}</td>
             </tr>`
        );
    });
}

function updateTableCurrencies({ apiCurrencies, fullNames }, amount) {
    const CURRENCIES_KEYS = Object.keys(apiCurrencies.rates);
    $(".table-currencies tr").each(function (index) {
        const CURRENCY_ID = CURRENCIES_KEYS[index];
        const $ROW = $(this);
        const CONVERTED_RATE = Number(
            apiCurrencies.rates[CURRENCY_ID] * amount
        );
        $ROW.find(".base-table").text(fullNames[apiCurrencies.base]);
        $ROW.find(".amount-table").text(amount);
        $ROW.find(".rates-table").text(CONVERTED_RATE.toFixed(2));
        $ROW.find(".full-name-table").text(fullNames[CURRENCY_ID]);
        $ROW.find(".currency-id-table").text(CURRENCY_ID);
    });
}

function handleInputs(eventObject) {
    eventObject.preventDefault();
    const { $baseCurrency, $date, $amount } = getInputValues();
    const newCurrencies = {};
    Promise.all([getCurrencies($baseCurrency, $date), getCurrencyFullNames()])
        .then(([apiCurrencies, fullNames]) => {
            newCurrencies.apiCurrencies = apiCurrencies;
            newCurrencies.fullNames = fullNames;
            updateTableCurrencies(newCurrencies, $amount);
        })
        .catch((error) => {
            console.error("error", error);
        });
}

function getCurrencies(currency = "EUR", date = "latest") {
    return $.ajax({
        method: "GET",
        url: `https://api.frankfurter.dev/v1/${date}?base=${currency}`,
        success: (response) => {
            response.json;
        },
        error: (error) => {
            console.error("error", error.status);
        },
    });
}

function getCurrencyFullNames() {
    return $.ajax({
        method: "GET",
        url: "https://api.frankfurter.dev/v1/currencies",
        success: (response) => {
            response.json;
        },
        error: (error) => {
            console.error("error", error.status);
        },
    });
}

function getInputValues() {
    const $baseCurrency = $(".currencies").val();
    const $date = $("#date").val();
    const $amount = Number($("#amount").val());
    return { $baseCurrency, $date, $amount };
}

// function removeTableChildren() {
//     $(".table-currencies").children().remove();
// }

const $inputBtn = $("#input-btn");
$inputBtn.on("click", handleInputs);
