/// <reference path="./all.d.ts" />
    export interface LCSDirectionConfig {
        DIAGONAL: number;
        UPORLEFT: number;
        UP: number;
        LEFT: number;
    }

    export interface LCSTable {
        table: any;
        str1: string;
        str2: string;
    }

    export class LCSTableBuilder {

        constructor(private config: LCSDirectionConfig) {

        }

        public buildTable(str1, str2): LCSTable {
            var matrix = [],
                i, j,
                indexStr1, indexStr2,
                top, left,
                value, direction;

            // i is column
            // j is row
            for (i = 0; i < str1.length + 1; i += 1) {
                matrix[i] = [{ value: 0, direction: null }];

                for (j = 0; j < str2.length + 1; j += 1) {
                    if (i == 0 || j == 0) {
                        matrix[i][j] = { value: 0, direction: null };
                    } else {

                        indexStr1 = i - 1;
                        indexStr2 = j - 1;

                        // MATCH
                        if (str1[indexStr1] == str2[indexStr2]) {
                            // assign to diagonal top left, incremented by 1
                            matrix[i][j] = {
                                value: matrix[i - 1][j - 1].value + 1,
                                direction: this.config.DIAGONAL
                            };

                            // NO MATCH
                        } else {
                            // assign to the longest of top or left
                            top = matrix[i][j - 1];
                            left = matrix[i - 1][j];

                            if (top.value == left.value) {
                                value = top.value;
                                direction = this.config.UPORLEFT;
                            } else if (top.value > left.value) {
                                value = top.value;
                                direction = this.config.UP;
                            } else {
                                value = left.value;
                                direction = this.config.LEFT;
                            }

                            matrix[i][j] = {
                                value: value,
                                direction: direction
                            };

                        }

                    }
                }
            }

            return {
                table: matrix,
                str1: str1,
                str2: str2,
            };
        }
    }