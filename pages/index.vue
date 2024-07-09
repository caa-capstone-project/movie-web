<template>
	<UCard>
		<Swiper :modules="[SwiperFreeMode]" :slides-per-view="3" :loop="true" :free-mode="true">
			<SwiperSlide v-for="movie in movieList" :key="movie.id">
				<img :src="'https://image.tmdb.org/t/p/original/' + movie.poster_path" alt="Movie Poster"
					class="h-12 w-auto logo" />
			</SwiperSlide>
		</Swiper>
	</UCard>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	data(): { movieList: { id: number, title: string, poster_path: string }[] | null } {
		return {
			movieList: null,
		}
	},
	// created() {
	// 	console.log('Component created')
	// },
	async mounted() {
		console.log('Component mounted')
		this.movieList = await fetch('http://a69226bf1b88f482097c14f2dfe69f92-403154274.us-east-1.elb.amazonaws.com:4200/api/listmovie', {
			method: 'GET'
		}).then(res => res.json()).catch(err => console.error(err));
		console.log('Movie list:', this.movieList);
		
	},
})
</script>

