// Делаем куки
function setCookie(name, value, options) {
    options = options || {};
    var expires = options.expires;
    if (typeof expires === "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 864e5);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);
    var updatedCookie = name + "=" + value;
    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }
    document.cookie = updatedCookie;
}

// Получаем куки
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return decodeURIComponent(parts.pop().split(";").shift());
}

// Удаляем куки (функция не работает, удаление куки идет через setCookie() на строке 129)
function removeCookie(name) {
    setCookie(name, "", {
        expires: -1
    });
}

// Функция удаления подстановочного знака класса
function removeClassWild(element, mask) {
    var re = mask.replace(/\*/g, "\\S+");
    var cls = element.className.match(new RegExp("\\b" + re + "", "g"));
    if (cls) {
        cls.forEach(function(c) {
            element.classList.remove(c);
        });
    }
}

// Инициализация всего
var special = {
    Reset: function() {
        special.active = 1;
        special.color = 1;
        special.font_family = 1;
        special.font_size = 1;
        special.line_height = 1;
        special.letter_spacing = 1;
        special.images = 1;
        setCookie("special", JSON.stringify(special), {
            path: "/"
        });
    },
    Set: function() {
        var html = document.querySelector("html");
        html.classList.remove(...Array.from(html.classList).filter(cls => cls.startsWith("special-")));
        html.classList.add("special-color-" + special.color);
        html.classList.add("special-font-size-" + special.font_size);
        html.classList.add("special-font-family-" + special.font_family);
        html.classList.add("special-line-height-" + special.line_height);
        html.classList.add("special-letter-spacing-" + special.letter_spacing);
        html.classList.add("special-images-" + special.images);

        var buttons = document.querySelectorAll("#special button");
        buttons.forEach(button => button.classList.remove("active"));

        var colorButton = document.querySelector(".special-color button[value=\"" + special.color + "\"]");
        if (colorButton) colorButton.classList.add("active");

        var fontSizeButton = document.querySelector(".special-font-size button[value=\"" + special.font_size + "\"]");
        if (fontSizeButton) fontSizeButton.classList.add("active");

        var fontFamilyButton = document.querySelector(".special-font-family button[value=\"" + special.font_family + "\"]");
        if (fontFamilyButton) fontFamilyButton.classList.add("active");

        var lineHeightButton = document.querySelector(".special-line-height button[value=\"" + special.line_height + "\"]");
        if (lineHeightButton) lineHeightButton.classList.add("active");

        var letterSpacingButton = document.querySelector(".special-letter-spacing button[value=\"" + special.letter_spacing + "\"]");
        if (letterSpacingButton) letterSpacingButton.classList.add("active");

        var imagesButton = document.querySelector(".special-images button");
        if (imagesButton) imagesButton.value = special.images;

        special.ToggleImages();
        setCookie("special", JSON.stringify(special), {
            path: "/"
        });
    },
    ToggleImages: function() {
        var images = document.querySelectorAll("img");
        images.forEach(img => {
            if (special.images) {
                if (img.dataset.src) img.src = img.dataset.src;
                if (img.dataset.srcset) img.srcset = img.dataset.srcset;
            } else {
                img.dataset.src = img.src;
                if (img.srcset) img.dataset.srcset = img.srcset;
                img.removeAttribute("src");
                if (img.srcset) img.removeAttribute("srcset");
            }
        });
    },
    Off: function() {
        var html = document.querySelector("html");
        html.classList.remove("special");
        if (document.querySelector('link[href="/vefovi/special.min.css"]')) {
          document.querySelector('link[href="/vefovi/special.min.css"]').remove();
        }
        removeClassWild(html, "special-*");
        var audioElements = document.querySelectorAll("i.special-audio, audio");
        audioElements.forEach(element => element.remove());
        if (responsiveVoice && responsiveVoice.isPlaying()) responsiveVoice.cancel();
        var specialButton = document.querySelector("#specialButton");
        if (specialButton) {
            specialButton.style.display = 'block';
            //removeCookie("special");
            setCookie("special", "", {
                path: "/"
            });
        } else {
            var userAgent = navigator.userAgent;
            if (userAgent.indexOf("MSIE ") >= 0) {
                var url = window.location.href;
                if (url.indexOf("template=") >= 0) {
                    window.location.href = url.replace(/template=\d+/g, "template=0");
                } else {
                    window.location.href = url + "?template=0";
                }
            } else {
                fetch(window.location.origin + window.location.pathname, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'template=0'
                }).then(() => {
                    window.location.href = window.location.origin + window.location.pathname;
                });
            }
        }
    },
    On: function() {
        var head = document.querySelector("head");
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/vefovi/special.min.css";
        head.appendChild(link);

        if (!special.active) special.Reset();

        var specialButton = document.querySelector("#specialButton");
        if (specialButton) {
            special.active = 1;
            setCookie("special", JSON.stringify(special), {
                path: "/"
            });
            specialButton.style.display = 'none';
        }

        var html = document.querySelector("html");
        html.classList.add("special");

        var specialPanel = document.createElement("div");
        specialPanel.innerHTML = `
            <div id="special">
                <div class="special-panel">
                    <div class="special-font-size"><span>Шрифт:</span>
                        <button title="Маленький шрифт" value="1"><i>A</i></button>
                        <button title="Средний шрифт" value="2"><i>A</i></button>
                        <button title="Большой шрифт" value="3"><i>A</i></button>
                    </div>
                    <div class="special-color"><span>Цвет:</span>
                        <button title="Цвет черным по белому" value="1"><i>Ц</i></button>
                        <button title="Цвет белым по черному" value="2"><i>Ц</i></button>
                        <button title="Цвет синим по голубому" value="3"><i>Ц</i></button>
                    </div>
                    <div class="special-images"><span>Изображения:</span>
                        <button title="Выключить/включить изображения"><i></i></button>
                    </div>
                    <div class="special-audio"><span>Звук:</span>
                        <button title="Включить/выключить воспроизведение текста" value="0"><i></i></button>
                    </div>
                    <div class="special-settings"><span>Настройки:</span>
                        <button title="Дополнительные настройки"><i></i></button>
                    </div>
                    <div class="special-quit"><span>Обычная версия:</span>
                        <button title="Обычная версия сайта"><i></i></button>
                    </div>
                </div>
                <div id="special-settings-body">
                    <hr/>
                    <h2>Настройки шрифта:</h2>
                    <div class="special-font-family"><span>Выберите шрифт:</span>
                        <button value="1"><i>Arial</i></button>
                        <button value="2"><i>Times</i></button>
                    </div>
                    <div class="special-letter-spacing"><span>Интервал между буквами (<em>Кернинг</em>):</span>
                        <button value="1"><i>Стандартный</i></button>
                        <button value="2"><i>Средний</i></button>
                        <button value="3"><i>Большой</i></button>
                    </div>
                    <div class="special-line-height"><span>Интервал между строками:</span>
                        <button value="1"><i>Стандартный<br/>интервал</i></button>
                        <button value="2"><i>Полуторный<br/>интервал</i></button>
                        <button value="3"><i>Двойной<br/>интервал</i></button>
                    </div>
                    <h2>Выбор цветовой схемы:</h2>
                    <div class="special-color">
                        <button value="1"><i>Черным<br/>по белому</i></button>
                        <button value="2"><i>Белым<br/>по черному</i></button>
                        <button value="3"><i>Темно-синим<br/>по голубому</i></button>
                        <button value="4"><i>Коричневым<br/>по бежевому</i></button>
                        <button value="5"><i>Зеленым<br/>по темно-коричневому</i></button>
                    </div>
                    <hr/>
                    <div class="special-reset"><button><i>Параметры по умолчанию</i></button></div>
                    <div class="special-settings-close"><button><i>Закрыть</i></button></div>
                    <div class="avtor"><a href="https://` + location.hostname + `" target="_blank">` + location.hostname + `</a></div>
                </div>
            </div>
        `;
        document.body.prepend(specialPanel);

        special.Set();

        // Обработка нажатий на функциональные кнопки
        var buttons = document.querySelectorAll("#special button");
        buttons.forEach(button => {
            button.addEventListener("click", function() {
                var parent = this.parentNode.className.replace("special-", "");
                if (parent) {
                    var buttons = document.querySelectorAll("#special .special-" + parent + " button");
                    buttons.forEach(button => button.classList.remove("active"));

                    switch (parent) {
                        case "color":
                            special.color = parseInt(this.value);
                            this.classList.add("active");
                            html.classList.remove(...Array.from(html.classList).filter(cls => cls.startsWith("special-color-")));
                            html.classList.add("special-color-" + this.value);
                            setCookie("special", JSON.stringify(special), {
                                path: "/"
                            });
                            break;
                        case "font-size":
                            special.font_size = parseInt(this.value);
                            this.classList.add("active");
                            html.classList.remove(...Array.from(html.classList).filter(cls => cls.startsWith("special-font-size-")));
                            html.classList.add("special-font-size-" + this.value);
                            setCookie("special", JSON.stringify(special), {
                                path: "/"
                            });
                            break;
                        case "font-family":
                            special.font_family = parseInt(this.value);
                            this.classList.add("active");
                            html.classList.remove(...Array.from(html.classList).filter(cls => cls.startsWith("special-font-family-")));
                            html.classList.add("special-font-family-" + this.value);
                            setCookie("special", JSON.stringify(special), {
                                path: "/"
                            });
                            break;
                        case "line-height":
                            special.line_height = parseInt(this.value);
                            this.classList.add("active");
                            html.classList.remove(...Array.from(html.classList).filter(cls => cls.startsWith("special-line-height-")));
                            html.classList.add("special-line-height-" + this.value);
                            setCookie("special", JSON.stringify(special), {
                                path: "/"
                            });
                            break;
                        case "letter-spacing":
                            special.letter_spacing = parseInt(this.value);
                            this.classList.add("active");
                            html.classList.remove(...Array.from(html.classList).filter(cls => cls.startsWith("special-letter-spacing-")));
                            html.classList.add("special-letter-spacing-" + this.value);
                            setCookie("special", JSON.stringify(special), {
                                path: "/"
                            });
                            break;
                        case "images":
                            special.images = special.images ? 0 : 1;
                            this.value = special.images;
                            special.ToggleImages();
                            setCookie("special", JSON.stringify(special), {
                                path: "/"
                            });
                            break;
                        case "audio":
                            if (this.value == 1) {
                                var audioIcons = document.querySelectorAll("i.special-audio");
                                audioIcons.forEach(icon => icon.remove());
                                if (responsiveVoice && responsiveVoice.isPlaying()) responsiveVoice.cancel();
                                var textElements = document.querySelectorAll("p,h1,h2,h3,h4,h5,h6,li,dt,dd,.audiotext");
                                textElements.forEach(element => element.removeEventListener("mouseover", special.audioHandler));
                                this.value = 0;
                            } else {
                                responsiveVoice.speak("Включено озвучивание текста.", "Russian Female");
                                this.classList.add("active");
                                this.value = 1;
                                var textElements = document.querySelectorAll("p,h1,h2,h3,h4,h5,h6,li,dt,dd,.audiotext,a,b");
                                textElements.forEach(element => element.addEventListener("mouseover", special.audioHandler));
                            }
                            break;
                        case "settings":
                            document.querySelector("#special-settings-body").style.display = 'block';
                            break;
                        case "settings-close":
                            document.querySelector("#special-settings-body").style.display = 'none';
                            break;
                        case "reset":
                            special.Reset();
                            special.Set();
                            document.querySelector("#special-settings-body").style.display = 'none';
                            break;
                        case "quit":
                            special.Off();
                            break;
                    }
                }
            });
        });

        // Обработчик кнопок дополнительных настроек
        document.querySelector(".special-settings button").addEventListener("click", function() {
            document.querySelector("#special-settings-body").style.display = 'block';
        });

        // Close settings button handler
        document.querySelector(".special-settings-close button").addEventListener("click", function() {
            document.querySelector("#special-settings-body").style.display = 'none';
        });

        // Обработчик кнопки «Закрыть настройки»
        document.querySelector(".special-reset button").addEventListener("click", function() {
            special.Reset();
            special.Set();
            document.querySelector("#special-settings-body").style.display = 'none';
        });

        // Обработчик кнопки выхода из специального режима
        document.querySelector(".special-quit button").addEventListener("click", function() {
            special.Off();
            document.getElementById("special").remove();
        });
    }
};

// Инициализировать специальный режим, если установлены куки
var specialCookie = getCookie("special");
if (specialCookie) {
    specialc = JSON.parse(specialCookie);
    if (specialc.active) special.On();
}

// Добавить прослушиватель событий для специальной кнопки
var specialButton = document.querySelector("#specialButton");
if (specialButton) {
    specialButton.addEventListener("click", special.On);
}

// Адаптивная голосовая интеграция (упрощенная версия)
if (typeof responsiveVoice !== "undefined") {
    console.log("ResponsiveVoice already loaded");
} else {
    var responsiveVoice = {
        speak: function(text, voice, params) {
            var utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = window.speechSynthesis.getVoices().find(v => v.name === voice);
            if (params) {
                utterance.rate = params.rate || 1;
                utterance.pitch = params.pitch || 1;
                utterance.volume = params.volume || 1;
            }
            window.speechSynthesis.speak(utterance);
        },
        isPlaying: function() {
            return window.speechSynthesis.speaking;
        },
        cancel: function() {
            window.speechSynthesis.cancel();
        }
    };
}

// Обработчик звука для текстовых элементов
special.audioHandler = function() {
    if (responsiveVoice && responsiveVoice.isPlaying()) responsiveVoice.cancel();
    responsiveVoice.speak(this.textContent.trim(), "Russian Female");
};