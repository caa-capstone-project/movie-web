<template>
	<div>
			<!-- <nav>
					<ul>
							<li>
									<NuxtLink to="/">Home</NuxtLink>
							</li>
							<li>
									<NuxtLink to="/about">About</NuxtLink>
							</li>
					</ul>
			</nav> -->
			<UHorizontalNavigation :links="links" class="border-b border-gray-200 dark:border-gray-800" />
			<slot />
			<AppFooter />
	</div>
</template>
<script setup lang="ts">
const links = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/'
}, {
  label: 'About',
  icon: 'information-circle',
  to: `/about`
}]
</script>