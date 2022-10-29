var languageCount = 0;
var languages = {};
var engFirst = null;
var whereLearn = "";

/** Add a new language. */
window.addLanguage = function () {
  var list = document.getElementById("lang-list");
  var entry = document.createElement("li");
  entry.setAttribute("id", "lang" + languageCount);
  entry.style.margin = "12px";

  entry.innerHTML = `
    <select id="languages${languageCount}" name="languages${languageCount}" class="languages${languageCount}" style="width:250px;" onchange="otherLanguage(this)">
      <option disabled selected value>-- select a language --</option>
      <option value="af">Afrikaans</option>
      <option value="sq">Albanian - shqip</option>
      <option value="am">Amharic - አማርኛ</option>
      <option value="ar">Arabic - العربية</option>
      <option value="an">Aragonese - aragonés</option>
      <option value="hy">Armenian - հայերեն</option>
      <option value="ast">Asturian - asturianu</option>
      <option value="az">Azerbaijani - azərbaycan dili</option>
      <option value="eu">Basque - euskara</option>
      <option value="be">Belarusian - беларуская</option>
      <option value="bn">Bengali - বাংলা</option>
      <option value="bs">Bosnian - bosanski</option>
      <option value="br">Breton - brezhoneg</option>
      <option value="bg">Bulgarian - български</option>
      <option value="ca">Catalan - català</option>
      <option value="ckb">Central Kurdish - کوردی (دەستنوسی عەرەبی)</option>
      <option value="zh">Chinese - 中文</option>
      <option value="zh-HK">Chinese (Hong Kong) - 中文（香港）</option>
      <option value="zh-CN">Chinese (Simplified) - 中文（简体）</option>
      <option value="zh-TW">Chinese (Traditional) - 中文（繁體）</option>
      <option value="co">Corsican</option>
      <option value="hr">Croatian - hrvatski</option>
      <option value="cs">Czech - čeština</option>
      <option value="da">Danish - dansk</option>
      <option value="nl">Dutch - Nederlands</option>
      <option value="en">English</option>
      <option value="en-AU">English (Australia)</option>
      <option value="en-CA">English (Canada)</option>
      <option value="en-IN">English (India)</option>
      <option value="en-NZ">English (New Zealand)</option>
      <option value="en-ZA">English (South Africa)</option>
      <option value="en-GB">English (United Kingdom)</option>
      <option value="en-US">English (United States)</option>
      <option value="eo">Esperanto - esperanto</option>
      <option value="et">Estonian - eesti</option>
      <option value="fo">Faroese - føroyskt</option>
      <option value="fil">Filipino</option>
      <option value="fi">Finnish - suomi</option>
      <option value="fr">French - français</option>
      <option value="fr-CA">French (Canada) - français (Canada)</option>
      <option value="fr-FR">French (France) - français (France)</option>
      <option value="fr-CH">French (Switzerland) - français (Suisse)</option>
      <option value="gl">Galician - galego</option>
      <option value="ka">Georgian - ქართული</option>
      <option value="de">German - Deutsch</option>
      <option value="de-AT">German (Austria) - Deutsch (Österreich)</option>
      <option value="de-DE">German (Germany) - Deutsch (Deutschland)</option>
      <option value="de-LI">German (Liechtenstein) - Deutsch (Liechtenstein)</option>
      <option value="de-CH">German (Switzerland) - Deutsch (Schweiz)</option>
      <option value="el">Greek - Ελληνικά</option>
      <option value="gn">Guarani</option>
      <option value="gu">Gujarati - ગુજરાતી</option>
      <option value="ha">Hausa</option>
      <option value="haw">Hawaiian - ʻŌlelo Hawaiʻi</option>
      <option value="he">Hebrew - עברית</option>
      <option value="hi">Hindi - हिन्दी</option>
      <option value="hu">Hungarian - magyar</option>
      <option value="is">Icelandic - íslenska</option>
      <option value="id">Indonesian - Indonesia</option>
      <option value="ia">Interlingua</option>
      <option value="ga">Irish - Gaeilge</option>
      <option value="it">Italian - italiano</option>
      <option value="it-IT">Italian (Italy) - italiano (Italia)</option>
      <option value="it-CH">Italian (Switzerland) - italiano (Svizzera)</option>
      <option value="ja">Japanese - 日本語</option>
      <option value="kn">Kannada - ಕನ್ನಡ</option>
      <option value="kk">Kazakh - қазақ тілі</option>
      <option value="km">Khmer - ខ្មែរ</option>
      <option value="ko">Korean - 한국어</option>
      <option value="ku">Kurdish - Kurdî</option>
      <option value="ky">Kyrgyz - кыргызча</option>
      <option value="lo">Lao - ລາວ</option>
      <option value="la">Latin</option>
      <option value="lv">Latvian - latviešu</option>
      <option value="ln">Lingala - lingála</option>
      <option value="lt">Lithuanian - lietuvių</option>
      <option value="mk">Macedonian - македонски</option>
      <option value="ms">Malay - Bahasa Melayu</option>
      <option value="ml">Malayalam - മലയാളം</option>
      <option value="mt">Maltese - Malti</option>
      <option value="mr">Marathi - मराठी</option>
      <option value="mn">Mongolian - монгол</option>
      <option value="ne">Nepali - नेपाली</option>
      <option value="no">Norwegian - norsk</option>
      <option value="nb">Norwegian Bokmål - norsk bokmål</option>
      <option value="nn">Norwegian Nynorsk - nynorsk</option>
      <option value="oc">Occitan</option>
      <option value="or">Oriya - ଓଡ଼ିଆ</option>
      <option value="om">Oromo - Oromoo</option>
      <option value="ps">Pashto - پښتو</option>
      <option value="fa">Persian - فارسی</option>
      <option value="pl">Polish - polski</option>
      <option value="pt">Portuguese - português</option>
      <option value="pt-BR">Portuguese (Brazil) - português (Brasil)</option>
      <option value="pt-PT">Portuguese (Portugal) - português (Portugal)</option>
      <option value="pa">Punjabi - ਪੰਜਾਬੀ</option>
      <option value="qu">Quechua</option>
      <option value="ro">Romanian - română</option>
      <option value="mo">Romanian (Moldova) - română (Moldova)</option>
      <option value="rm">Romansh - rumantsch</option>
      <option value="ru">Russian - русский</option>
      <option value="gd">Scottish Gaelic</option>
      <option value="sr">Serbian - српски</option>
      <option value="sh">Serbo-Croatian - Srpskohrvatski</option>
      <option value="sn">Shona - chiShona</option>
      <option value="sd">Sindhi</option>
      <option value="si">Sinhala - සිංහල</option>
      <option value="sk">Slovak - slovenčina</option>
      <option value="sl">Slovenian - slovenščina</option>
      <option value="so">Somali - Soomaali</option>
      <option value="st">Southern Sotho</option>
      <option value="es">Spanish - español</option>
      <option value="es-AR">Spanish (Argentina) - español (Argentina)</option>
      <option value="es-419">Spanish (Latin America) - español (Latinoamérica)</option>
      <option value="es-MX">Spanish (Mexico) - español (México)</option>
      <option value="es-ES">Spanish (Spain) - español (España)</option>
      <option value="es-US">Spanish (United States) - español (Estados Unidos)</option>
      <option value="su">Sundanese</option>
      <option value="sw">Swahili - Kiswahili</option>
      <option value="sv">Swedish - svenska</option>
      <option value="tg">Tajik - тоҷикӣ</option>
      <option value="ta">Tamil - தமிழ்</option>
      <option value="tt">Tatar</option>
      <option value="te">Telugu - తెలుగు</option>
      <option value="th">Thai - ไทย</option>
      <option value="ti">Tigrinya - ትግርኛ</option>
      <option value="to">Tongan - lea fakatonga</option>
      <option value="tr">Turkish - Türkçe</option>
      <option value="tk">Turkmen</option>
      <option value="tw">Twi</option>
      <option value="uk">Ukrainian - українська</option>
      <option value="ur">Urdu - اردو</option>
      <option value="ug">Uyghur</option>
      <option value="uz">Uzbek - o‘zbek</option>
      <option value="vi">Vietnamese - Tiếng Việt</option>
      <option value="wa">Walloon - wa</option>
      <option value="cy">Welsh - Cymraeg</option>
      <option value="fy">Western Frisian</option>
      <option value="xh">Xhosa</option>
      <option value="yi">Yiddish</option>
      <option value="yo">Yoruba - Èdè Yorùbá</option>
      <option value="zu">Zulu - isiZulu</option>
      <option value="other">Other - please specify</option>
  </select>
  <input type="text" id="other-lang${languageCount}" class="other-input"></input>
  <label style="margin-left:5%;">Proficiency:</label>
  <input type="radio" id="q4" name=${languageCount} value="1" class="p1-${languageCount}"><label for="1">1</label>
  <input type="radio" id="q4" name=${languageCount} value="2" class="p2-${languageCount}"><label for="2">2</label>
  <input type="radio" id="q4" name=${languageCount} value="3" class="p3-${languageCount}"><label for="3">3</label>
  <input type="radio" id="q4" name=${languageCount} value="4" class="p4-${languageCount}"><label for="4">4</label>
  <input type="radio" id="q4" name=${languageCount} value="5" class="p5-${languageCount}"><label for="5">5</label>`;

  //remove language
  var removeButton = document.createElement("button");
  removeButton.setAttribute("class", "rm-lang" + languageCount);
  removeButton.innerHTML = '<i class="fa fa-trash"></i>';

  var rbStyle = `
  margin-left: 5%;
  background-color: #de2b2b;
  border: none;
  color: white;
  font-size: 15px;
  cursor: pointer;
  vertical-align: 5%;
  `;

  removeButton.setAttribute("style", rbStyle);
  entry.appendChild(removeButton);
  list.appendChild(entry);

  $(".rm-lang" + languageCount).on("click", function () {
    delete languages[$(this).parent().attr("id")]; // remove from languages
    $(this).parent().remove();
  });

  $(".languages" + languageCount).on("change", function () {
    const id = $(this).parent().attr("id");
    if (!(id in languages)) {
      languages[id] = {};
    }
    languages[id]["language"] = $(this).val(); // add language
  });

  // proficiency
  for (var i = 1; i < 6; i++) {
    $(".p" + i + "-" + languageCount).on("click", function () {
      const id = $(this).parent().attr("id");
      if (!(id in languages)) {
        languages[id] = {};
      }
      languages[id]["proficiency"] = $(this).val();
    });
  }

  languageCount += 1;
};

/** Display questions layout. */
function question() {
  document.getElementById("whole").style.display = "none";
  document.getElementById("question-layout").style.display = "block";
}

/** Submit questionnaire. */
window.submitQuestion = function () {
  if (checkFields()) {
    //q1
    languages["english"] = {
      language: document.getElementById("english").value,
      proficiency: document.querySelector('input[name="q1"]:checked').value,
    };
    if (document.getElementById("english").value == "en-OT") {
      languages["english"]["specify"] =
        document.getElementById("other-eng").value;
    }
    //other option specify
    for (const l in languages) {
      if (l != "english") {
        //l=lang#
        if (languages[l]["language"] == "other") {
          var id = l.replace("lang", "");
          languages[l]["specify"] = document.getElementById(
            "other-lang" + id
          ).value;
        }
      }
    }

    //q2
    engFirst =
      document.querySelector('input[name="q2"]:checked').value == "yes";

    //q3
    whereLearn = document.getElementById("country").value;

    //upload
    if (assignmentId && workerId && hitId) {
      db.collection("users")
        .doc(workerId)
        .set(
          {
            languages: languages,
            engFirst: engFirst,
            whereLearn: whereLearn,
            completedQuestionnaire: true,
          },
          { merge: true }
        )
        .then(() => {
          wholeTrial();
        });
    }
  }
};

/** Show other english input. */
window.otherEnglish = function (that) {
  if (that.value == "en-OT") {
    document.getElementById("other-eng").style.display = "inline";
  } else {
    document.getElementById("other-eng").style.display = "none";
  }
};

/** Show other language input. */
window.otherLanguage = function (that) {
  var id = that.id.replace("languages", "");

  if (that.value == "other") {
    document.getElementById("other-lang" + id).style.display = "inline";
  } else {
    document.getElementById("other-lang" + id).style.display = "none";
  }
};

/** Check valid response. */
function checkFields() {
  if (!document.getElementById("english").value) {
    alert("Please select type of English.");
    return false;
  }
  if (!document.querySelector('input[name="q1"]:checked')) {
    alert("Please select English proficiency.");
    return false;
  }
  for (const l in languages) {
    if (!("language" in languages[l]) || !("proficiency" in languages[l])) {
      alert("Missing language or proficiency.");
      return false;
    }
    var id = l.replace("lang", "");
    if (
      languages[l]["language"] == "other" &&
      !document.getElementById("other-lang" + id).value
    ) {
      alert("Please specify your language.");
      return false;
    }
  }
  if (!document.querySelector('input[name="q2"]:checked')) {
    alert("Please indicate if English is your first language.");
    return false;
  }
  if (!document.getElementById("country").value) {
    alert("Please select the country where you first learned English.");
    return false;
  }
  if (
    document.getElementById("english").value == "en-OT" &&
    !document.getElementById("other-eng").value
  ) {
    alert("Please specify your variant of English.");
    return false;
  }
  return true;
}
