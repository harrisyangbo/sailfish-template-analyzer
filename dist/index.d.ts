interface MatchTemplate {
    [key: string]: any;
}
interface DataModel {
    [key: string]: any;
}
declare class TemplateAnalyzer {
    sourceStr: string;
    tempStart: string;
    tempEnd: string;
    regexp: RegExp | null;
    replaceReg: RegExp | null;
    constructor(sourceStr: string, tempStart: string, tempEnd: string);
    createRegexp(): RegExp | null;
    matchTemplate(): Array<string>;
    createTemplateMap(): MatchTemplate;
    getDataModel(tempStr: string, dataModel: DataModel): any;
    getDataModelByArray(tempStr: string | number, dataModel: DataModel): any;
    result(dataModel: DataModel): boolean | string | number;
}
export default TemplateAnalyzer;
