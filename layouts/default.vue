<template>
	<div>
		<img src="~/assets/logo.png" alt="Nuxt Logo" class="h-12 w-auto logo" />
		<slot />
		<AppFooter />
	</div>
</template>
<script setup lang="ts">
</script>
<style>
	.logo {
		width: 250px;
		height: auto;
	}
</style>