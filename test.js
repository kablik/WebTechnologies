document.getElementById("galeria").style.display = "none";
document.getElementById("dotazy").style.display = "none";

function myFunctionSidebar() {
    document.getElementById("menu").style.display = "inline";
}

function myFunctionMain() {
    document.getElementById("hlavnaStranka").style.display = "inline";
    document.getElementById("galeria").style.display = "none";
    document.getElementById("dotazy").style.display = "none";
}

function myFunctionObr() {
    document.getElementById("hlavnaStranka").style.display = "none";
    document.getElementById("galeria").style.display = "inline";
    document.getElementById("dotazy").style.display = "none";
}

function myFunctionElse() {
    document.getElementById("hlavnaStranka").style.display = "none";
    document.getElementById("galeria").style.display = "none";
    document.getElementById("dotazy").style.display = "inline";
}

var tmplPoc = "<table><tr><td>Teplota:</td><td>{{main.temp}} °C</td></tr><tr><td>Tlak:</td><td>{{main.pressure}} hPa</td></tr><tr><td>Vlhkosť:</td><td>{{main.humidity}} %</td></tr><tr><td>Oblačnosť:</td><td>{{clouds.all}} %</td></tr></table>"

$.getJSON("http://api.openweathermap.org/data/2.5/weather",
    {id: "724443", units: 'metric', APPID: "8641355d0bdfa52a49f4e9a42560adf0"},
    spracuj);

function spracuj(udaje) {
    $("#pocasie").html(Mustache.render(tmplPoc, udaje));
}

var tmplPoc1 = "{{#list}}<table><td class='headOfTable'>Dátum:</td><td class='headOfTable'>{{dt_txt}}</td><tr><td>Teplota:</td><td>{{main.temp}} °C</td></tr><tr><td>Tlak:</td><td>{{main.pressure}} hPa</td></tr><tr><td>Vlhkosť:</td><td>{{main.humidity}} %</td></tr><tr><td>Oblačnosť:</td><td>{{clouds.all}} %</td></tr></table>{{/list}}"

$.getJSON("http://api.openweathermap.org/data/2.5/forecast",
    {id: "724443", units: 'metric', APPID: "8641355d0bdfa52a49f4e9a42560adf0", cnt: "5"},
    spracuj1);

function spracuj1(udajee) {
    $("#pocasieLong").html(Mustache.render(tmplPoc1, udajee));
}

var $form = $("#dotaz");
$form.submit(function (event) {
    event.preventDefault();
    checkAndSend();
});

function checkAndSend() {
    var udaje = {};
    $form.serializeArray().map(
        function (item) {
            var itemValueTrimmed = item.value.trim();
            if (itemValueTrimmed) {
                udaje[item.name] = itemValueTrimmed;
            }
        }
    );

    if (!udaje.title && !udaje.author && !udaje.content) {
        alert("Polia -Názov dotazu- a -Autor dotazu- nemôžu byť prázdne");
        return;
    }

    udaje.content = "<div> " + udaje.content + "</div>";
    switch (udaje.vek) {
        case "1":
            udaje.content += "<p>Vek je menej ako 20 rokov.</p>";
            break;
        case "2":
            udaje.content += "<p>Vek je medzi 21 rokov a 30 rokov.</p>";
            break;
        case "3":
            udaje.content += "<p>Vek je medzi 31 rokov a 40 rokov.</p>";
            break;
        case "4":
            udaje.content += "<p>Vek je medzi 41 rokov a 50 rokov.</p>";
            break;
        case "5":
            udaje.content += "<p>Vek je medzi 51 rokov a 60 rokov.</p>";
            break;
        case "6":
            udaje.content += "<p>Vek je viac ako 61 rokov.</p>";
            break;
    }
    delete udaje.vek;

    udaje.content = "<div> " + udaje.content + "</div>";
    switch (udaje.dizajn) {
        case "0":
            udaje.content += "<p>Dizajn stránky je zlý.</p>";
            break;
        case "1":
            udaje.content += "<p>Dizajn stránky je priemerný.</p>";
            break;
        case "2":
            udaje.content += "<p>Dizajn stránky je dobrý.</p>";
            break;
    }
    delete udaje.dizajn;

    udaje.content = "<div> " + udaje.content + "</div>";
    switch (udaje.obsah) {
        case "0":
            udaje.content += "<p>Obsah stránky je zlý.</p>";
            break;
        case "1":
            udaje.content += "<p>Obsah stránky je priemerný.</p>";
            break;
        case "2":
            udaje.content += "<p>Obsah stránky je dobrý.</p>";
            break;
    }
    delete udaje.obsah;

    udaje.content = "<div> " + udaje.content + "</div>";
    if (udaje.info) {
        udaje.content += "<p>Časť všeobecné informácie je nedostatočne popísaná.</p>"
    }
    if (udaje.turizmus) {
        udaje.content += "<p>Časť turizmus je nedostatočne popísaná.</p>"
    }
    if (udaje.vodstvo) {
        udaje.content += "<p>Časť vodstvo je nedostatočne popísaná.</p>"
    }
    if (udaje.flora) {
        udaje.content += "<p>Časť flóra je nedostatočne popísaná.</p>"
    }
    if (udaje.fauna) {
        udaje.content += "<p>Časť fauna je nedostatočne popísaná.</p>"
    }
    if (udaje.klimatologia) {
        udaje.content += "<p>Časť klimatológia je nedostatočne popísaná.</p>"
    }
    if (udaje.geologia) {
        udaje.content += "<p>Časť geológia je nedostatočne popísaná.</p>"
    }

    if (window.confirm("Želáte si dotaz odoslať?")) {
        $.ajax({
            type: "POST",
            url: "http://wt.kpi.fei.tuke.sk/api/article",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            data: JSON.stringify(udaje),
            success: function (response) {
                if (response.id) {
                    console.log(response.id);
                    window.open('http://hron.fei.tuke.sk/~korecko/WebTechAkademia/wtKpiBlogBrowser/article.html?id=' + response.id, '_blank');
                    $form.trigger('reset');
                }
            },
            error: function (jxhr) {
                window.alert("Spracovanie dotazu bolo neúspešné. Chyba bola vyvolaná:" + status + "\n" + jxhr.statusText + "\n" + jxhr.responseText);
            }
        });

    }
}
