<template>
  <div>
    <div
      v-for="row, idx in tree"
      :key="idx"
      class="block pt-20px mt-20px"
      :class="{
        'bg-gray-50': row.children,
      }"
      :style="{ marginLeft: `${row.depth * 25}px` }"
    >
      {{ row.name }}
      {{ row.isDir }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FoundSpec } from '@packages/types'
import { useCollapsibleTree } from '@packages/frontend-shared/src/composables/useCollapsibleTree'

const props = defineProps<{
  specs: FoundSpec[]
}>()

const mapping = props.specs.reduce((acc, spec) => {
  const directories = spec.relative.split('/')[0]
}, {})

const _specs = [
  { relative: 'src/components/component-one.tsx' },
  { relative: 'src/components/component-two.tsx' },
  { relative: 'src/stories/story-one.tsx' },
  { relative: 'src/util/url/util-one.js' },
]

/**
 * base case rest is empty
 *
 */

type TreeNode = {
  name: string
  children: TreeNode[]
  isDir: boolean
}

const root: TreeNode = { name: '/', children: [], isDir: true }

function buildTree (path: string, tree: TreeNode) {
  const [firstFile, ...rest] = path.split('/')

  if (rest.length < 1) {
    tree.children.push({ name: firstFile, isDir: false, children: [] })

    return tree
  }

  const foundChild = tree.children.find((child) => child.name === firstFile)

  if (foundChild) {
    buildTree(rest.join('/'), foundChild)

    return tree
  }

  const newTree = buildTree(rest.join('/'), { name: firstFile, isDir: true, children: [] })

  tree.children.push(newTree)

  return tree
}

props.specs.forEach((spec) => buildTree(spec.relative, root))
const { tree } = useCollapsibleTree(root)

</script>
