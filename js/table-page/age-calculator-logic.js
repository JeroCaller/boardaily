/**
 * [연, 월, 일] 형태의 문자열 배열을 Date() 객체로 변환.
 * @param {string[] | Date} dateData 
 * @returns Date 객체
 */
export function convertStrToDate(dateData) {
    if (dateData instanceof Date) {
        return dateData;
    }
    if (dateData instanceof Array) {
        return new Date(dateData.join('-'));
    }
}

export class CalculateAge {
    constructor(birthDate, currentDate) {
        this.birthDate = convertStrToDate(birthDate);
        this.currentDate = convertStrToDate(currentDate);
        this.dateDiff = new Date();
        this.dateDiffOnlyYear = new Date();
        this.calcDiff();
        this.calcDiffOnlyYear();
    }

    calcDiff() {
        this.dateDiff.setFullYear(
            this.currentDate.getFullYear() - this.birthDate.getFullYear(),
            this.currentDate.getMonth() - this.birthDate.getMonth(),
            this.currentDate.getDate() - this.birthDate.getDate()
        );
    }

    calcDiffOnlyYear() {
        this.dateDiffOnlyYear.setFullYear(this.currentDate.getFullYear() - this.birthDate.getFullYear());
    }

    getInternationalAge() {
        if (this.dateDiff.getMonth() == 11 && this.dateDiff.getDate() == 31) {
            return this.dateDiff.getFullYear() + 1;
        }
        return this.dateDiff.getFullYear();
    }

    getYearAge() {
        return this.dateDiffOnlyYear.getFullYear();
    }

    getKoreanAge() {
        return this.dateDiffOnlyYear.getFullYear() + 1;
    }
}
