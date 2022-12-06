<script setup lang="tsx">
defineProps({
  id: String,
})
</script>

<template>
  <div>
    <p>blog/[id].vue: {{ id }}</p>
    <p>
      {{ $route }}
    </p>
  </div>
</template>

<route>
{
  "name": "blog-id",
  "meta":{
    "requiresAuth": false
  }
}
</route>
