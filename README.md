## sailfish-template-analyzer

#### 简介
 
模板语法解析器，可以自定义你的模板字符串，并通过此依赖包来解析，最终生成结果

#### 使用示例

```
npm install sailfish-template-analyzer
```

```
import TemplateAnalyzer from 'sailfish-template-analyzer';

let templateAnalyzer = new TemplateAnalyzer('{{c.e}} + {{a}} + {{b}} === 5', '{{', '}}')
console.log(templateAnalyzer.result({
  a: 1,
  b: 2,
  c: {
    e: 2
  }
}));
```

#### 参数说明

##### 实例参数

let templateAnalyzer = new TemplateAnalyzer(sourceStr, start, end)

- sourceStr: 源字符串(带有模板字符的字符串)
- start: 用于定义你的模板的开始字符(默认'{{')
- end: 用于定义你的模板的结束字符(默认'}}')

##### 方法参数

templateAnalyzer.result(dataModel)

- dataModel: 数据模型(会从此数据模型中查找模板字符对应的数据)