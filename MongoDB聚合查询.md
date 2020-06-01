# MongoDB聚合查询

## 基础概念

聚合查询(Aggregation Pipeline Stages) 是将多种查询组合在一起，每一个查询阶段称为管道(pipeline)，每一个管道由若干个步骤(stage)构成。  

聚合查询使用在 db.collection.aggregate() 或 db.aggregate() 这2个函数中。  

> 注意：  
> $out、$merge、$geoNear 这3个步骤只能出现1次，其他步骤函数可以出现使用多次。  

## 步骤详情

| 语法 | 解释 |  
| ---- | ---- |  
| $addFields | 想元素添加字段属性值，同$set |  
| $bucket | 根据表达式和bucket边界将文档分类为组 |  
| $bucketAuto | 根据表达式和自动确定的bucket边界将文档分类为组 |  
| $collStats | 返回集合或视图的统计信息 |  
| $count | 返回文档数量 |  
| $facet | 在某个管道阶段允许创建多个子聚合管道查询 |  
| $geoNear | 根据地理空间接近程度返回有序的文档流，文档中包含一个附加的距离字段 |  
| $graphLookup | 向集合执行递归搜索，并向返回文档中添加一个新的数字字段，包含递归遍历结果 |  
| $group | 将输出文档字段属性进行重新归类整理 |  
| $indexStats | 返回集合使用的每个索引的统计信息 |  
| $limit | 限定输出文档数量 |  
| $listSessions | 当前会话中的Sessions列表 |  
| $lookup | 对同一数据库中的另外一个集合执行左外联接 |  
| $match | 过滤文档流 |  
| $merge | 将聚合管道的结果文档写入集合，必须是聚合查询管道中的最后一个阶段 |  
| $out | 将聚合管道的结果文档写入结合，必须是聚合查询管道中的最后一个阶段 |  
| $planCacheStats | 返回集合的计划缓存信息 |  
| $project | 有选择性的重置输出文档中的各个字段属性，同$unset |  
| $redact | 通过文档本身的信息来限制输出文档的内容，包含$project和$match功能 |  
| $replaceRoot | 用指定的嵌入文档替换文档，同$replaceWith |  
| $replaceWith | 用指定的潜入文档替换文档，同$replaceRoot |  
| $sample | 从输入中随机选择指定数量的文档 |  
| $set | 修改或新增字段，同$addFields |  
| $skip | 跳过前n个文档 |  
| $sort | 按指定方式(升序或降序)进行重新排序 |  
| $sortByCount | 根据指定表达式的值进行文档分组，并计算不同文档组中的数量 |  
| $unset | 删除或排除某字段，同$project |  
| $unwind | 解构输入文档中的数组，将数组中每个元素解构为若干个字段 |  

