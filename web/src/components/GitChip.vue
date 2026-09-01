<template>
  <v-chip
    @click="goToGit()"
    rounded
    density="compact"
    color="#24292F"
    variant="elevated"
  >
    <v-icon
      size="small"
      class="mr-1"
    >
      mdi-github
    </v-icon>
    {{ github }}
  </v-chip>
</template>

<script setup lang="ts">

const props = defineProps<{
    github: string
}>()

function goToGit (): void {
  window.open(`https://github.com/${props.github}`, '_blank')
}

</script>
