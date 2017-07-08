import { IResultEnhancer, BaseLCSResult, LCSResult, ResultCreationConfig } from './../resultBuilder';
export interface IWordPair {
    word1: IWord;
    word2: IWord;
}

export interface IWord {
    maskedWord: string,
    word: string,
    index: number;
}

export interface LCSResult {
    matchingWordPairs: Array<IWordPair>;
    partiallyMatchingWordPairs: Array<IWordPair>;
    deletedWords: Array<IWord>
    addedWords: Array<IWord>
}

export class MatchingWordEnhancer implements IResultEnhancer {
    constructor(private wordDelimiter = ' ') {

    }

    enhance(result: BaseLCSResult, config: ResultCreationConfig): LCSResult {
        const splitted1 = result.maskedString1.split(this.wordDelimiter).filter((subs) => subs);
        const splitted2 = result.maskedString2.split(this.wordDelimiter).filter((subs) => subs);
        const original1 = result.table.str1.split(this.wordDelimiter);
        const original2 = result.table.str2.split(this.wordDelimiter);
        console.log(splitted1)
        console.log(splitted2)

        let i: number = 0, j: number = 0;

        const matchingPairs: Array<IWordPair> = [];
        const partiallyMatchingPairs: Array<IWordPair> = [];
        const deletedWords: Array<IWord> = [];
        const addedWords: Array<IWord> = [];

        while (i < splitted1.length && j < splitted2.length) {
            const word1: IWord = { maskedWord: splitted1[i], word: original1[i], index: i };
            const word2: IWord = { maskedWord: splitted2[j], word: original2[j], index: j };
            const pair: IWordPair = { word1: word1, word2: word2 };
            if (this._isHoleWord(splitted1[i], config)) {
                deletedWords.push(word1);
                i++;
            } else if (this._isHoleWord(splitted2[j], config)) {
                addedWords.push(word2);
                j++;
            } else {
                if (this._isMatching(splitted1[i], splitted2[j], config)) {
                    matchingPairs.push(pair);
                } else {
                    partiallyMatchingPairs.push(pair);
                }
                i++; j++;
            };
        }
        let newResult: LCSResult = Object.assign({}, result, {
            matchingWordPairs: matchingPairs,
            partiallyMatchingWordPairs: partiallyMatchingPairs,
            deletedWords: deletedWords,
            addedWords: addedWords,
        });
        return newResult;
    }

    private _isMatching(word1: string, word2: string, config: ResultCreationConfig) {
        const numDelimiter1 = this._countDelimiter(word1, config);
        const numDelimiter2 = this._countDelimiter(word2, config);

        console.log('Number delimiter1:', numDelimiter1);
        console.log('Number delimiter2:', numDelimiter2);

        return numDelimiter1 === numDelimiter2 && numDelimiter1 === word1.length && numDelimiter2 === word2.length;
    }

    private _isHoleWord(word: string, config: ResultCreationConfig): boolean {
        return this._countDelimiter(word, config) === 0;
    }

    private _countDelimiter(word: string, config: ResultCreationConfig): number {
        return word.length - word.replace(new RegExp(`\\${config.SameCharacterPlaceholder}`, 'g'), '').length;
    }
}