<script setup lang="ts">
const data = [{
    label: '一级 1',
    children: [{
        label: '二级 1-1',
        children: [{
            label: '三级 1-1-1',
            children: [{
                label: '四级 1-1-1-1'
            }]
        }]
    }]
}, {
    label: '一级 2',
    children: [{
        label: '二级 2-1',
        children: [{
            label: '三级 2-1-1',
            children: [{
                label: '四级 2-1-1-1'
            }]
        }]
    }, {
        label: '二级 2-2',
        children: [{
            label: '三级 2-2-1',
            children: [{
                label: '四级 2-2-1-1'
            }]
        }]
    }]
}, {
    label: '一级 3',
    children: [{
        label: '二级 3-1',
        children: [{
            label: '三级 3-1-1'
        }]
    }, {
        label: '二级 3-2',
        children: [{
            label: '三级 3-2-1'
        }]
    }]
}]
const defaultProps = {
    children: 'children',
    label: 'label'
}

const collapseAllChildren = (list: any) => {
    list.childNodes.forEach((item: any) => {
        item.expanded = false
        if (item.childNodes && item.childNodes.length) {
            collapseAllChildren(item)
        }
    })
}

const handleNodeCollapse = (_: any, list: any) => {
    collapseAllChildren(list)
}

</script>

<template>
    <el-tree :data="data" :props="defaultProps" @node-collapse="handleNodeCollapse"></el-tree>
</template>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>
