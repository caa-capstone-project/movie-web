<template>
	<UCard>
		<Swiper :modules="[SwiperFreeMode]" :slides-per-view="3" :loop="true" :free-mode="true">
			<SwiperSlide v-for="movie in movieList" :key="movie.id">
				<img :src="'https://image.tmdb.org/t/p/original/' + movie.poster_path" alt="Movie Poster"
					class="h-12 w-auto logo" />
				<NuxtRating :read-only="false" :rating-step="0.5" @rating-selected="(rate) => ratingHandler(rate, movie.id) " />
			</SwiperSlide>
		</Swiper>
	</UCard>
	<UCard class="button-card">
		<UButton @click="submitHandler">Submit</UButton>
	</UCard>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { jwtDecode } from 'jwt-decode';

export default defineComponent({
	data(): { 
		movieList: { id: number, title: string, poster_path: string }[] | null,
		ratings: { movieId: number, rating: number }[],
	} {
		return {
			movieList: null,
			ratings: [],
		}
	},
	methods: {
		async checkLoginStatus() {
			const idToken = localStorage.getItem('id_token');
			if (!idToken) {
				window.location.href = 'https://movie-advisor.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=iuq5fkq3oi8u1al39ocik7ro4&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000';
			}else{
				this.validateToken(idToken);
			}
		},
		async getToken(code: string) {
			try {
				// Exchange the code for tokens using Cognito's /oauth2/token endpoint
				const response = await fetch(`https://movie-advisor.auth.us-east-1.amazoncognito.com/oauth2/token`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: new URLSearchParams({
						grant_type: 'authorization_code',
						client_id: 'iuq5fkq3oi8u1al39ocik7ro4',
						code,
						redirect_uri: 'http://localhost:3000'
					})
				});

				const data = await response.json();
				if (data.id_token) {
					localStorage.setItem('id_token', data.id_token);
					this.$router.push('/');
				} else {
					console.error('Failed to exchange code for token:', data);
				}
			} catch (error) {
				console.error('Error fetching token:', error);
			}
		},
		validateToken(token: string) {
			try {
				const decodedToken: any = jwtDecode(token);
				const currentTime = Math.floor(Date.now() / 1000);
				if (decodedToken.exp < currentTime) {
					console.error('Token has expired');
					localStorage.removeItem('id_token');
					window.location.href = 'https://movie-advisor.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=iuq5fkq3oi8u1al39ocik7ro4&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000';
				} else {
					console.log('Token is valid');
				}
			} catch (error) {
				console.error('Invalid token', error);
				localStorage.removeItem('id_token');
				window.location.href = 'https://movie-advisor.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=iuq5fkq3oi8u1al39ocik7ro4&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000';
			}
		},
		getSubFromToken(token: string) {
			try {
				const decodedToken: any = jwtDecode(token);
				return decodedToken.sub;
			} catch (error) {
				console.error('Invalid token', error);
				return null;
			}
		},
		ratingHandler(rate: number, movieId: number) {
			const index = this.ratings.findIndex(item => item.movieId === movieId);
			if (index !== -1) {
				// Update existing rating
				this.ratings[index].rating = rate;
			} else {
				// Add new rating
				this.ratings.push({ movieId: movieId, rating: rate });
			}
		},
		async submitHandler() {
			await this.updateRatings(this.ratings);
			await this.refreshMovieList();
		},
		async updateRatings(ratings: { movieId: number, rating: number }[]) {
			try {

				const response = await fetch('http://127.0.0.1:4203/rating', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ userId: 8888, ratings }),
				});

				if (response.ok) {
					const data = await response.json();
					console.log(data);
				} else {
					throw new Error('Request failed');
				}
			} catch (error) {
				console.error(error);
			}
		},
		async refreshMovieList() {
			this.movieList = await fetch('http://127.0.0.1:4200/api/listmovie/8888', {
				method: 'GET'
			}).then(res => res.json()).catch(err => console.error(err));
		},
		async getPreference() {
			const preferenceResult = await fetch('http://127.0.0.1:4202/preference/8888', {
				method: 'GET'
			}).then(res => res.json()).catch(err => {
				 console.error(err);
				 return null;
			});
			return preferenceResult;
		},
	},
	// created() {
	// 	console.log('Component created')
	// },
	async mounted() {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');
		if (code) {
			await this.getToken(code);
		}
		await this.checkLoginStatus();

		// Navigate to questionnaire page if preference is not set
		const preference = await this.getPreference();
		if(!preference){
			navigateTo('/questionnaire');
			return;
		}

		await this.refreshMovieList();
		console.log('Component mounted')
	},
})
</script>
<style>
.button-card {
	display: flex;
	justify-content: center;
}
</style>

