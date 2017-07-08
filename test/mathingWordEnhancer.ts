/// <reference path="../lib//all.d.ts" /> 

import * as chai from 'chai';
import * as sinon from 'sinon';

import { MatchingWordEnhancer, LCSResult } from '../lib/enhancers/matchingWordEnhancer';

export interface IWordPair {
  word1: IWord;
  word2: IWord;
}

export interface IWord {
  word: string,
  index: number;
}

export interface LCSResult {
  matchingWordPairs: Array<IWordPair>;
  partiallyMatchingWordPairs: Array<IWordPair>;
  deletedWords: Array<IWord>
  adedWords: Array<IWord>
}

let expect = chai.expect;

let enhancer: MatchingWordEnhancer;
let config = {
  IgnoredCharacters: [' '],
  SameCharacterPlaceholder: '*',
  WordDelimiter: ' '
};

describe('MatchingWordEnhancer', function () {
  beforeEach(() => {
    enhancer = new MatchingWordEnhancer();
  });

  it('Should replace all char by placeholder if compared strings are the same', () => {
    const result: any = enhancer.enhance({
      table: {
        str1: '',
        str2: ''
      },
      maskedString1: '',
      maskedString2: '',
      substrings: []
    } as any, {} as any)
    expect(result.matchingWordPairs, 'Matching words is incorrect').to.be.eql([]);
    expect(result.partiallyMatchingWordPairs, 'Partially matching word is incorrect').to.be.eql([]);
    expect(result.deletedWords, 'Deleted words are incorrect').to.be.eql([]);
    expect(result.addedWords, 'Added words are incorrect').to.be.eql([]);
  });

  it('Should replace all char by placeholder if compared strings are the same', () => {
    const result: any = enhancer.enhance({
      table: {
        str1: "un test",
        str2: 'une test',
      },
      maskedString1: '** ****',
      maskedString2: '**e ****',
      substrings: []
    } as any, {
      SameCharacterPlaceholder: '*'
    } as any)
    expect(result.matchingWordPairs, 'Matching words is incorrect').to.be.eql([{
      word1: {
        word: 'test',
        maskedWord: '****',
        index: 1
      },
      word2: {
        word: 'test',
        maskedWord: '****',
        index: 1
      }
    }]);
    expect(result.partiallyMatchingWordPairs, 'Partially matching word is incorrect').to.be.eql([{
      word1: {
        word: 'un',
        maskedWord: '**',
        index: 0
      },
      word2: {
        word: 'une',
        maskedWord: '**e',
        index: 0
      }
    }]);
    expect(result.deletedWords, 'Deleted words are incorrect').to.be.eql([]);
    expect(result.addedWords, 'Added words are incorrect').to.be.eql([]);
  });
});