/**
 * 초단기예보 api 응답 요청으로 얻은 데이터 처리. 여기서는 원하는 데어터만 추출하는 작업을 
 * 실행한다.
 */
export class WeatherData {
    /**
     * 
     * @param {object} apiData - api 요청으로 응답받은 json 문자열을 parse하고 나온 객체.
     */
    constructor(apiData) {
        this.apiData = apiData.response;
        this.headers = this.apiData.header;
        if (this.headers.resultCode != "00") {
            let apiError = new Error(`API 요청 에러. 에러 코드: ${this.headers.resultCode}`);
            apiError.name = this.headers.resultMsg;
            throw apiError;
        }

        this.weatherData = this.apiData.body.items.item;

        this.temperatures = [];
        this.precipitations = [];
        this.skies = [];
        this.humidities = [];
        this.ptys = [];  // 강수 형태

        this.allData = [
            this.temperatures,
            this.precipitations,
            this.skies,
            this.humidities,
            this.ptys
        ];

        this._extractWeatherData();
        this._sortInFcstTime();
    }

    getTemperatures() {return this.temperatures}
    getPrecipitations() {return this.precipitations}
    getSkies() {return this.skies}
    getHumidities() {return this.humidities}
    getPtys() {return this.ptys}

    /**
     * 
     * @returns {object}
     */
    getAllData() {
        let result = {};
        for (let cate of this.allData) {
            let categoryName = cate[0].category;
            if (!(categoryName in result)) {
                result[categoryName] = [];
            }
            for (let dataObj of cate) {
                result[categoryName].push(dataObj);
            }
        }
        return result;
    }

    _extractWeatherData() {
        for (let dataObj of this.weatherData) {
            switch (dataObj.category) {
                case "T1H":
                    this.temperatures.push(dataObj);
                    break;
                case "RN1":
                    this.precipitations.push(dataObj);
                    break;
                case "SKY":
                    this.skies.push(dataObj);
                    break;
                case "REH":
                    this.humidities.push(dataObj);
                    break;
                case "PTY":
                    this.ptys.push(dataObj);
                    break;
            }
        }
    }

    /**
     * 예보시각이 작은 순부터 오름차순으로 정렬.
     */
    _sortInFcstTime() {
        for (let arr of this.allData) {
            arr.sort((a, b) => {

                function getDateTimeInfo(obj) {
                    return {
                        date: parseInt(obj.fcstDate),
                        time: parseInt(obj.fcstTime)
                    };
                }

                let aDateTime = getDateTimeInfo(a);
                let bDateTime = getDateTimeInfo(b);
                let dateDiff = aDateTime.date - bDateTime.date;
                let timeDiff = aDateTime.time - bDateTime.time;

                if (dateDiff != 0) return dateDiff; 
                return timeDiff;
            });
        }
    }
}
