import { InvalidDateFormatError } from "../../custom-error.js";

export class CalcDateDiff {
    constructor(startDateStr, endDateStr) {
        this._checkDate(startDateStr);
        this._checkDate(endDateStr);

        this._startDate = new Date(startDateStr);
        this._endDate = new Date(endDateStr);
        this._diff;
        this._diffDate = new Date();
        this._updateDiff();

        this._isDateChanged = false;

        this._diffResult = {
            'days': 0,
            'weeks': 0,
            'months': 0,
            'years': 0,
            'date': {
                'day': this._diffDate.getDate(),
                'month': this._diffDate.getMonth(),
                'year': this._diffDate.getFullYear(),
            },
        };
    }

    _checkDate(dateStr) {
        if (!dateStr || typeof dateStr != 'string') {
            throw new InvalidDateFormatError(`${dateStr}은 날짜 형태의 문자열이 아닙니다.`);
        }
    }

    set startDate(dateStr) {
        this._checkDate(dateStr);
        this._startDate = new Date(dateStr);
        this._isDateChanged = true;
    }

    set endDate(dateStr) {
        this._checkDate(dateStr);
        this._endDate = new Date(dateStr);
        this._isDateChanged = true;
    }

    _updateDiff() {
        this._diff = this._endDate.getTime() - this._startDate.getTime();
        this._diffDate.setFullYear(
            this._endDate.getFullYear() - this._startDate.getFullYear(),
            this._endDate.getMonth() - this._startDate.getMonth(),
            this._endDate.getDate() - this._startDate.getDate()
        );
    }

    _calcDiffDate() {
        if (this._isDateChanged) {
            this._updateDiff();
            this._isDateChanged = false;
        }

        this._diffResult.days = Math.floor(this._diff / (1000 * 60 * 60 * 24));
        this._diffResult.weeks = Math.floor(this._diffResult.days / 7);
        this._diffResult.months = parseFloat((this._diffResult.days / 30).toFixed(1));
        this._diffResult.years = parseFloat((this._diffResult.days / 365).toFixed(1));

        this._diffResult.date.day = this._diffDate.getDate();
        this._diffResult.date.month = this._diffDate.getMonth();
        this._diffResult.date.year = this._diffDate.getFullYear();
    }

    getResult() {
        this._calcDiffDate();
        return this._diffResult;
    }
}
