/// <reference path="./all.d.ts" />

import { LCSTableBuilder, LCSDirectionConfig } from './lcsTableBuilder';
import { ResultBuilder, ResultCreationConfig, LCSResult, IResultEnhancer} from './resultBuilder';

export class TextDifference {
    private config: LCSDirectionConfig = {
        DIAGONAL: 1,
        UP: 2,
        LEFT: 3,
        UPORLEFT: 4,
    }
    public compare(str1: string, str2: string, resultConfig: ResultCreationConfig, resultEnhancers: Array<IResultEnhancer> = []): LCSResult {
        const tableBuilder = new LCSTableBuilder(this.config);
        const resultBuilder = new ResultBuilder(this.config, resultConfig, resultEnhancers);

        const table = tableBuilder.buildTable(str1, str2);
        return resultBuilder.createResult(table);
    }        
}