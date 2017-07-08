/// <reference path="../lib//all.d.ts" /> 

import * as chai from 'chai';
import * as sinon from 'sinon';

import { TextDifference } from '../lib/text-difference';
import { MatchingWordEnhancer, LCSResult } from '../lib/enhancers/matchingWordEnhancer';

let expect = chai.expect;

let textDiff: TextDifference;
let config = {
  IgnoredCharacters: [' '],
  SameCharacterPlaceholder: '*',
  WordDelimiter: ' '
};

describe('TextDifference', function () {
  beforeEach(() => {
    textDiff = new TextDifference();
  });

  it('Should replace all char by placeholder if compared strings are the same', () => {
    const result = textDiff.compare('test', 'test', config);
    expect(result.maskedString1).to.be.equal('****');
    expect(result.maskedString2).to.be.equal('****');
    expect(result.substrings[0]).to.be.equal('test');
  });

  it('Should replace leave one char intact if different', () => {
    const result = textDiff.compare('test', 'text', config);
    expect(result.maskedString1).to.be.equal('**s*');
    expect(result.maskedString2).to.be.equal('**x*');
    expect(result.substrings[0]).to.be.equal('tet');
  });

  it('Should replace leave one char intact if different', () => {
    const result: any = textDiff.compare('test', 'text', config, [new MatchingWordEnhancer()]);
    expect(result.partiallyMatchingWordPairs).to.be.eql([{
      "word1": {
        "index": 0,
        "maskedWord": "**s*",
        "word": "test",
      },
      "word2": {
        "index": 0,
        "maskedWord": "**x*",
        "word": "text",
      }
    }]);
  });

  it('Should replace leave one char intact if different', () => {
    const result: any = textDiff.compare('test', 'test', config, [new MatchingWordEnhancer()]);
    expect(result.matchingWordPairs).to.be.eql([{
      "word1": {
        "index": 0,
        "maskedWord": "****",
        "word": "test",
      },
      "word2": {
        "index": 0,
        "maskedWord": "****",
        "word": "test",
      }
    }]);
  });

  it('Should replace leave one char intact if different', () => {
    const result: any = textDiff.compare('Un chien se promene dans le bois.', 'un chiens se promene dans bois', config, [new MatchingWordEnhancer()]);
    expect(result.partiallyMatchingWordPairs).to.be.eql([
      {
        "word1": {
          "index": 0,
          "maskedWord": "U*",
          "word": "Un",
        },
        "word2": {
          "index": 0,
          "maskedWord": "u*",
          "word": "un",
        }
      },
      {
        "word1": {
          "index": 1,
          "maskedWord": "*****",
          "word": "chien",
        },
        "word2": {
          "index": 1,
          "maskedWord": "*****s",
          "word": "chiens",
        }
      },
      {
        "word1": {
          "index": 6,
          "maskedWord": "****.",
          "word": "bois.",
        },
        "word2": {
          "index": 5,
          "maskedWord": "****",
          "word": "bois",
        }
      }
    ]);
    expect(result.matchingWordPairs).to.be.eql([
      {
        "word1": {
          "index": 2,
          "maskedWord": "**",
          "word": "se",
        },
        "word2": {
          "index": 2,
          "maskedWord": "**",
          "word": "se",
        }
      },
      {
        "word1": {
          "index": 3,
          "maskedWord": "*******",
          "word": "promene",
        },
        "word2": {
          "index": 3,
          "maskedWord": "*******",
          "word": "promene",
        }
      },
      {
        "word1": {
          "index": 4,
          "maskedWord": "****",
          "word": "dans",
        },
        "word2": {
          "index": 4,
          "maskedWord": "****",
          "word": "dans",
        }
      }
    ]);
    expect(result.deletedWords).to.be.eql([{
      "index": 5,
      "maskedWord": "le",
      "word": "le",
    }]);
    expect(result.addedWords).to.be.eql([]);
  });

  it('Should replace leave one char intact if different', () => {
    const result: any = textDiff.compare('test', 'test test', config, [new MatchingWordEnhancer()]);
    expect(result.addedWords).to.be.eql([{
      "index": 0,
      "maskedWord": "test",
      "word": "test",
    }]);
  });

  it('Should replace leave one char intact if different', () => {
    const result: any = textDiff.compare('test test', 'test', config, [new MatchingWordEnhancer()]);
    expect(result.deletedWords).to.be.eql([{
      "index": 0,
      "maskedWord": "test",
      "word": "test",
    }]);
  });
});