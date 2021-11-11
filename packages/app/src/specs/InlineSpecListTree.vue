<template>
  <div
    ref="rootEl"
    tabindex="0"
  >
    <div
      v-for="row, idx in filteredTree"
      :key="idx"
      v-bind="rowProps"
      class="block pt-20px mt-20px"
      :class="{
        'border-2 border-red-500': selectedItem === idx
      }"
      :style="{ marginLeft: `${(row.depth -1) * 25}px` }"
      @click="onRowClick(row, idx)"
      @keypress.enter.space.prevent="onRowClick(row, idx)"
    >
      <SpecFileItem
        :file-name="row.data?.fileName || row.name"
        extension=""
        :selected="selectedItem === idx"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FoundSpec } from '@packages/types'
import { useCollapsibleTree } from '@packages/frontend-shared/src/composables/useCollapsibleTree'
import { useListNavigation } from '@packages/frontend-shared/src/composables/useListNavigation'
import SpecFileItem from './SpecFileItem.vue'
import { computed, ref, Ref } from 'vue'

const props = defineProps<{
  specs: FoundSpec[]
}>()

/**
 * base case rest is empty
 *
 */

type TreeNode<T> = {
  name: string
  children: TreeNode<T>[]
  isLeaf: boolean
  parent?: TreeNode<T>
  data?: T
}

const root: TreeNode<FoundSpec> = { name: '/', children: [], isLeaf: true }

function buildSpecTree <T> (path: string, tree: TreeNode<T>, data?: T) {
  const [firstFile, ...rest] = path.split('/')

  if (rest.length < 1) {
    tree.children.push({ name: firstFile, isLeaf: true, children: [], parent: tree, data })

    return tree
  }

  const foundChild = tree.children.find((child) => child.name === firstFile)

  if (foundChild) {
    buildSpecTree(rest.join('/'), foundChild)

    return tree
  }

  const newTree = buildSpecTree(rest.join('/'), { name: firstFile, isLeaf: false, children: [], parent: tree })

  tree.children.push(newTree)

  return tree
}

props.specs.forEach((spec) => buildSpecTree<FoundSpec>(spec.relative, root, spec))

function collapseEmptyChildren (node: TreeNode<any>) {
  for (const child of node.children) {
    collapseEmptyChildren(child)
  }
  if (node.isLeaf) {
    return
  }

  if (node.parent && (node.parent.children.length === 1)) {
    node.parent.name = [node.parent.name, node.name].join('/')
    node.parent.children = node.children
  }

  return
}

collapseEmptyChildren(root)

const { tree } = useCollapsibleTree(root)

tree.map((item) => item)
const filteredTree = computed(() => tree.slice(1).filter(((item) => !item.hidden.value)))

const onRowClick = (row, idx) => {
  row.toggle()
  selectedItem.value = idx
}
const rootEl: Ref<HTMLElement | undefined> = ref()

const { selectedItem, rowProps } = useListNavigation(rootEl)

</script>
