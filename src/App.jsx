import "./globals.css";
import "./grid.css";
import "./app.css";
import countries from "../countries.json";
import voices from "../voices.json";
import { useRef, useState } from "react";
import { useEffect } from "react";
import axios from "axios";

function App() {
  const audioRef = useRef(null);
  const [country, setCountry] = useState("vi-vn_Vietnamese");
  const [code, setCode] = useState("vi-vn");
  const [voice, setVoice] = useState([]);
  const [voiceChoice, setVoiceChoice] = useState("");
  const [speechRate, setSpeechRate] = useState(0);
  const [voiceActive, setVoiceActive] = useState(false);
  const [text, setText] = useState("");
  const [urlAudio, setUrlAudio] = useState("");

  useEffect(() => {
    const voiceDefault = [];
    voices.forEach((voice) => {
      if (voice.language === country.split("_")[1]) {
        voiceDefault.push(voice);
        if (voice.default === true) {
          setVoiceChoice(voice.name);
        }
      }
    });
    setVoice(voiceDefault);

    if (urlAudio !== "") {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  }, [urlAudio]);

  const handleChangeCountry = (value) => {
    setCountry(value);
    const voiceDefault = [];
    const countrySelect = value.split("_")[1];

    voices.forEach((voice) => {
      if (voice.language === countrySelect) {
        voiceDefault.push(voice);

        if (voice.default === true) {
          setVoiceChoice(voice.name);
        }
      }
    });

    setVoice(voiceDefault);
  };

  const handleVoiceChoice = (v) => {
    setVoiceChoice(v);
  };

  const updateRateLabel = (value) => {
    console.log(`Current speech rate: ${value}`); // You can update the UI with this value as needed
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSpeechRate(value);
    updateRateLabel(value); // Update the label or perform other actions here
  };

  const handleClick = async () => {
    const code = country.split("_")[0];

    try {
      const res = await axios.get(
        `https://api.voicerss.org/?key=dc34e6febedf4aab9d6e7c194c272302&hl=${code}&src=${text}&r=${speechRate}`
      );
      setVoiceActive(true);

      setUrlAudio(res?.config.url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid wide">
      <div className="row">
        <div className="col c-7">
          <div className="main__container display__flex--center-column ">
            <textarea
              id="text"
              rows="20"
              cols="70"
              placeholder="Nhập văn bản tại đây..."
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="col c-5">
          <div className="main__container right__container">
            <div className="row no-gutters">
              <div className="c-5 display__flex--center">Quốc gia:</div>
              <div className="c-7 display__flex--center countries__select">
                <select
                  name="countries "
                  id="countries"
                  onChange={(e) => handleChangeCountry(e.target.value)}
                  defaultValue={"vi-vn_Vietnamese"}
                >
                  {countries?.map((country) => (
                    <option
                      key={country.code}
                      value={country.code + "_" + country.name}
                    >
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="right__bottom--container">
            <div className="row">
              {voice.map((v, index) => (
                <div className="col c-6" key={index}>
                  <div
                    onClick={() => handleVoiceChoice(v.name)}
                    className={
                      voiceChoice === v.name
                        ? "main__container voice__container row no-gutters active"
                        : "main__container voice__container row no-gutters"
                    }
                  >
                    <div className="c-8">
                      <p className="voice__name">{v.name}</p>
                      <p className="voice__gender">{v.gender}</p>
                    </div>

                    <div className="c-4 display__flex--center">
                      {v.gender === "Male" ? (
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe3oPvKsA05otgZYGFZmxk5WHLYTFKWOFaNA&s"
                          alt=""
                        />
                      ) : (
                        <img
                          src="https://www.shutterstock.com/image-vector/hand-drawn-modern-woman-avatar-600nw-1373621021.jpg"
                          alt=""
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="main__container right__speed">
            <div className="row ">
              <div className="c-4 display__flex--center">Tốc độ:</div>
              <div className="c-6 display__flex--center">
                <input
                  type="range"
                  id="speechRate"
                  name="speechRate"
                  min="-10"
                  max="10"
                  value={speechRate}
                  step="1"
                  onChange={handleInputChange}
                  color=""
                />
              </div>
              <div className="c-2 display__flex--center">{speechRate}</div>
            </div>
          </div>

          <button
            className="main__btn--animation"
            style={{
              marginTop: "20px",
            }}
            onClick={() => handleClick()}
          >
            Đọc văn bản
          </button>
        </div>
      </div>
      <div className="audio__wrapper">
        <div
          className={
            voiceActive ? "icon__wrapper icon__active" : "icon__wrapper"
          }
          onClick={() => setVoiceActive(!voiceActive)}
        >
          {voiceActive ? (
            <i className="fa-solid fa-chevron-down"></i>
          ) : (
            <i className="no__active fa-solid fa-chevron-up"></i>
          )}
        </div>
        <div
          className={voiceActive ? "audio active" : "audio"}
          // className={"audio active"}
          id="audioContainer"
        >
          {urlAudio ? (
            <audio
              className="audio__content"
              id="audioPlayer"
              ref={audioRef}
              src={urlAudio}
              controls
            ></audio>
          ) : (
            <div className="audio__content">Hãy nhập gì đó để nghe</div>
          )}
          {urlAudio && (
            <a href={urlAudio} target="_blank">
              <i
                id="download-button"
                className="audio__icon fa-solid fa-download"
              ></i>
            </a>
          )}
        </div>
      </div>{" "}
    </div>
  );
}

export default App;
