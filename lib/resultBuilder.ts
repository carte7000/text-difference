import { LCSDirectionConfig, LCSTable } from './lcsTableBuilder'

export interface BaseLCSResult {
    table: LCSTable;
    maskedString1: string;
    maskedString2: string;
    substrings: string[];
}

export interface LCSResult extends BaseLCSResult {}

export interface ResultCreationConfig {
    SameCharacterPlaceholder: string;
    IgnoredCharacters: string[];
}

export interface IResultEnhancer {
    enhance(result: BaseLCSResult, config: ResultCreationConfig): LCSResult;
}

export class ResultBuilder {

    private _results = [];
    private _replacedStr1 = '';
    private _replacedStr2 = '';

    constructor(
        private config: LCSDirectionConfig,
        private resultConfig: ResultCreationConfig,
        private resultEnhancers: Array<IResultEnhancer> = []) {

    }

    public createResult(table: LCSTable): LCSResult {
        this._backTrack(table.table, table.str1, table.str2);
        let result = {
            table: table,
            maskedString1: this._replacedStr1,
            maskedString2: this._replacedStr2,
            substrings: this._results,
        }
        this.resultEnhancers.forEach((enhancer) => {result = enhancer.enhance(result, this.resultConfig) });
        return result;
    }

    private _initBackTrack(str1: string, str2: string) {
        this._results = [];
        this._replacedStr1 = str1;
        this._replacedStr2 = str2;
    }

    private _backTrack(table, str1, str2) {
        this._initBackTrack(str1, str2);
        this._backTrackHelper('', table, table.length - 1, table[0].length - 1, str1, str2);
        this._results = this._uniq(this._results);
    }

    private _plaholderReplace(str, index): string {
        const actualChar = str[index];
        if (this.resultConfig.IgnoredCharacters.indexOf(actualChar) !== -1) {
            return actualChar;
        } else {
            return this.resultConfig.SameCharacterPlaceholder;
        }
    }

    private _assignPlaceholder(str1, str2, i, j) {
        this._replacedStr1 = this._replacedStr1.substring(0, i - 1) + this._plaholderReplace(str1, i - 1) + this._replacedStr1.substring(i);
        this._replacedStr2 = this._replacedStr2.substring(0, j - 1) + this._plaholderReplace(str2, j - 1) + this._replacedStr2.substring(j);
    }

    private _backTrackHelper(acc, table, i, j, str1, str2) {
        if (i == 0 || j == 0) {
            this._results.push(acc);
            return;
        }

        var currCell = table[i][j],
            top, left;

        if (currCell.direction == this.config.DIAGONAL) {
            this._assignPlaceholder(str1, str2, i, j);
            this._backTrackHelper(str1[i - 1] + acc, table, i - 1, j - 1, str1, str2);
        } else if (currCell.direction == this.config.UP) {
            this._backTrackHelper(acc, table, i, j - 1, str1, str2);
        } else if (currCell.direction == this.config.LEFT) {
            this._backTrackHelper(acc, table, i - 1, j, str1, str2);
        } else {
            // we can go either up or left
            top = table[i][j - 1];
            left = table[i - 1][j - 1];

            // left
            this._backTrackHelper(acc, table, i - 1, j, str1, str2),
                // top
                this._backTrackHelper(acc, table, i, j - 1, str1, str2)
        }
    }

    private _contains(arr, elem) {
        return arr.indexOf(elem) >= 0;
    }

    private _uniq(arr) {
        var result = [];

        arr.forEach((elem) => {
            if (!this._contains(result, elem)) {
                result.push(elem);
            }
        });

        return result;
    }
}